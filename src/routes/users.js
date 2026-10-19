'use strict';
const express = require('express');
const { wrap, v, HttpError } = require('../http');
const { tx } = require('../db');
const { Org } = require('../org');
const auth = require('../auth');

const COLORS = ['#1d4f86', '#0f7a8a', '#7c3aed', '#b45309', '#be185d', '#047857', '#4338ca', '#9a6700', '#0e7490', '#b91c1c', '#5b21b6', '#166534'];

// Team management: the deputy GM manages everyone, a director manages their own managers.
module.exports = function userRoutes(pool) {
  const r = express.Router();

  function readCommon(b) {
    return {
      name: v.str(b.name, 'Ad soyad', { min: 2, max: 80 }),
      title: v.str(b.title, 'Ünvan', { min: 2, max: 100 }),
      dept: v.str(b.dept, 'Birim', { max: 100 }),
      email: v.str(b.email, 'E-posta', { max: 120 }),
    };
  }

  // Works out the role and manager a new or edited person ends up with, and checks the actor may set them.
  function placement(org, me, b) {
    if (me.role === 'director') return { role: 'manager', managerId: me.id };
    const role = v.oneOf(b.role, 'Rol', ['director', 'manager']);
    if (role === 'director') return { role, managerId: me.id };
    const boss = org.get(v.uuid(b.managerId, 'Bağlı olduğu direktör'));
    if (!boss || !boss.active || boss.role !== 'director') throw new HttpError(400, 'Bağlı olduğu direktör geçersiz.');
    return { role, managerId: boss.id };
  }

  async function emailFree(email, exceptId) {
    if (!email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'E-posta geçersiz.');
    const d = await pool.query('SELECT 1 FROM users WHERE lower(email) = lower($1) AND id IS DISTINCT FROM $2', [email, exceptId || null]);
    if (d.rowCount) throw new HttpError(400, 'Bu e-posta başka bir hesapta kullanılıyor.');
  }

  r.post('/users', wrap(async (req, res) => {
    const me = req.user;
    if (me.role === 'manager') throw new HttpError(403, 'Kişi ekleme yetkiniz yok.');
    const b = req.body || {};
    const c = readCommon(b);
    const username = v.str(b.username, 'Kullanıcı adı', { min: 3, max: 40 }).toLowerCase();
    if (!/^[a-z0-9._-]+$/.test(username)) throw new HttpError(400, 'Kullanıcı adı yalnızca küçük harf, rakam, nokta, alt çizgi ve tire içerebilir.');
    const org = await Org.load(pool);
    const pl = placement(org, me, b);
    if (org.users.some((u) => u.username.toLowerCase() === username)) throw new HttpError(400, 'Bu kullanıcı adı kullanılıyor.');
    await emailFree(c.email);
    const temp = auth.tempPassword();
    const dept = c.dept || org.get(pl.managerId).dept;
    const { rows } = await pool.query(
      `INSERT INTO users (username, email, name, title, role, manager_id, dept, color, password_hash, must_change_password)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,true) RETURNING id`,
      [username, c.email, c.name, c.title, pl.role, pl.managerId, dept, COLORS[org.users.length % COLORS.length], auth.hashPassword(temp)]
    );
    res.status(201).json({ id: rows[0].id, username, tempPassword: temp });
  }));

  r.patch('/users/:id', wrap(async (req, res) => {
    const me = req.user;
    const org = await Org.load(pool);
    const x = org.get(v.uuid(req.params.id, 'Kişi'));
    if (!x || !x.active || !org.canManageUser(me, x)) throw new HttpError(404, 'Kişi bulunamadı.');
    const b = req.body || {};
    const c = readCommon(b);
    let pl = { role: x.role, managerId: x.manager_id };
    if (me.role === 'gmy' && x.role !== 'gmy') {
      pl = placement(org, me, b);
      if (pl.managerId === x.id) throw new HttpError(400, 'Kişi kendisine bağlanamaz.');
      if (x.role === 'director' && pl.role === 'manager' && org.subs(x).length) {
        throw new HttpError(400, 'Bu direktöre bağlı müdürler var. Önce onları başka bir direktöre taşıyın.');
      }
    }
    await emailFree(c.email, x.id);
    await pool.query('UPDATE users SET name=$1, title=$2, dept=$3, email=$4, role=$5, manager_id=$6 WHERE id=$7',
      [c.name, c.title, c.dept || x.dept, c.email, pl.role, pl.managerId, x.id]);
    res.json({ ok: true });
  }));

  r.post('/users/:id/reset-password', wrap(async (req, res) => {
    const org = await Org.load(pool);
    const x = org.get(v.uuid(req.params.id, 'Kişi'));
    if (!x || !x.active || !org.canManageUser(req.user, x)) throw new HttpError(404, 'Kişi bulunamadı.');
    const temp = auth.tempPassword();
    await tx(pool, async (c) => {
      await c.query('UPDATE users SET password_hash=$1, must_change_password=true WHERE id=$2', [auth.hashPassword(temp), x.id]);
      await c.query('DELETE FROM sessions WHERE user_id = $1', [x.id]);
    });
    res.json({ username: x.username, tempPassword: temp });
  }));

  // Deactivation keeps history (reports, comments) but blocks login and hands projects to the person's manager.
  r.post('/users/:id/deactivate', wrap(async (req, res) => {
    const org = await Org.load(pool);
    const x = org.get(v.uuid(req.params.id, 'Kişi'));
    if (!x || !x.active || !org.canManageUser(req.user, x)) throw new HttpError(404, 'Kişi bulunamadı.');
    if (org.subs(x).length) throw new HttpError(400, 'Önce bu kişiye bağlı müdürleri başka bir direktöre taşıyın.');
    const heir = x.manager_id || req.user.id;
    await tx(pool, async (c) => {
      await c.query('UPDATE users SET active=false WHERE id=$1', [x.id]);
      await c.query('DELETE FROM sessions WHERE user_id = $1', [x.id]);
      await c.query('UPDATE projects SET owner_id=$1 WHERE owner_id=$2', [heir, x.id]);
      await c.query(`DELETE FROM meeting_attendees a USING meetings m WHERE a.meeting_id = m.id AND a.user_id = $1 AND m.starts_at > now()`, [x.id]);
    });
    res.json({ ok: true });
  }));

  return r;
};
