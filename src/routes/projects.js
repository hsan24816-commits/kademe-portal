'use strict';
const express = require('express');
const { wrap, v, HttpError } = require('../http');
const { tx } = require('../db');
const { Org } = require('../org');
const { notify } = require('../notify');

const pct = (n) => '%' + Math.round(n);

module.exports = function projectRoutes(pool) {
  const r = express.Router();

  // Loads a project the current user can see, plus the org, or 404s.
  async function load(req, db = pool) {
    const id = v.uuid(req.params.id, 'Proje');
    const org = await Org.load(db);
    const { rows } = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
    const p = rows[0];
    if (!p || !org.scope(req.user).has(p.owner_id)) throw new HttpError(404, 'Proje bulunamadı.');
    return { org, p, owner: org.get(p.owner_id) };
  }
  const canManage = (org, me, p) => me.role === 'gmy' || p.created_by === me.id || org.isAbove(me, org.get(p.owner_id));
  const canReport = (org, me, p) => p.status === 'active' && (p.owner_id === me.id || org.isAbove(me, org.get(p.owner_id)));
  const watchers = (org, p) => [p.owner_id, ...org.chainUp(org.get(p.owner_id)).map((x) => x.id)];

  function readBody(b) {
    const out = {
      name: v.str(b.name, 'Proje adı', { min: 2, max: 120 }),
      desc: v.str(b.desc, 'Açıklama', { max: 1000 }),
      ownerId: v.uuid(b.ownerId, 'Proje sahibi'),
      start: v.date(b.start, 'Başlangıç tarihi'),
      due: v.date(b.due, 'Son tarih'),
    };
    if (out.due < out.start) throw new HttpError(400, 'Son tarih başlangıçtan önce olamaz.');
    return out;
  }

  r.post('/projects', wrap(async (req, res) => {
    const me = req.user;
    if (me.role === 'employee') throw new HttpError(403, 'Proje atama yetkiniz yok.');
    const b = readBody(req.body || {});
    const org = await Org.load(pool);
    const owner = org.get(b.ownerId);
    if (!owner || !owner.active || !org.scope(me).has(owner.id)) throw new HttpError(400, 'Bu kişiye proje atayamazsınız.');
    const p = await tx(pool, async (c) => {
      const { rows } = await c.query(
        `INSERT INTO projects (name, description, owner_id, created_by, start_date, due_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [b.name, b.desc, owner.id, me.id, b.start, b.due]
      );
      const p = rows[0];
      await notify(c, org, me, watchers(org, p), 'project',
        `${me.name} “${p.name}” projesini ${owner.id === me.id ? 'oluşturdu' : owner.name + ' kişisine atadı'}`, { view: 'project', id: p.id });
      return p;
    });
    res.status(201).json({ id: p.id });
  }));

  r.patch('/projects/:id', wrap(async (req, res) => {
    const me = req.user;
    const { org, p } = await load(req);
    if (!canManage(org, me, p)) throw new HttpError(403, 'Bu projeyi düzenleme yetkiniz yok.');
    const b = readBody(req.body || {});
    const owner = org.get(b.ownerId);
    if (!owner || !owner.active || !org.scope(me).has(owner.id)) throw new HttpError(400, 'Bu kişiye proje atayamazsınız.');
    await tx(pool, async (c) => {
      await c.query('UPDATE projects SET name=$1, description=$2, owner_id=$3, start_date=$4, due_date=$5 WHERE id=$6',
        [b.name, b.desc, owner.id, b.start, b.due, p.id]);
      if (owner.id !== p.owner_id) await notify(c, org, me, [owner.id], 'project', `${me.name} “${b.name}” projesini size devretti`, { view: 'project', id: p.id });
    });
    res.json({ ok: true });
  }));

  r.delete('/projects/:id', wrap(async (req, res) => {
    const { org, p } = await load(req);
    if (!canManage(org, req.user, p)) throw new HttpError(403, 'Bu projeyi silme yetkiniz yok.');
    await pool.query('DELETE FROM projects WHERE id = $1', [p.id]);
    res.json({ ok: true });
  }));

  async function complete(c, org, me, p, note) {
    await c.query(`UPDATE projects SET status='done', progress=100, health='iyi' WHERE id=$1`, [p.id]);
    await c.query(`INSERT INTO project_reports (project_id, author_id, progress, health, note) VALUES ($1,$2,100,'iyi',$3)`, [p.id, me.id, note]);
    await notify(c, org, me, watchers(org, p), 'project', `${me.name} “${p.name}” projesini tamamlandı olarak işaretledi`, { view: 'project', id: p.id });
  }

  r.post('/projects/:id/complete', wrap(async (req, res) => {
    const { org, p } = await load(req);
    if (!canManage(org, req.user, p)) throw new HttpError(403, 'Bu işlem için yetkiniz yok.');
    if (p.status === 'done') throw new HttpError(400, 'Proje zaten tamamlanmış.');
    await tx(pool, (c) => complete(c, org, req.user, p, 'Proje tamamlandı olarak işaretlendi.'));
    res.json({ ok: true });
  }));

  r.post('/projects/:id/reopen', wrap(async (req, res) => {
    const { org, p } = await load(req);
    if (!canManage(org, req.user, p)) throw new HttpError(403, 'Bu işlem için yetkiniz yok.');
    await pool.query(`UPDATE projects SET status='active' WHERE id=$1`, [p.id]);
    res.json({ ok: true });
  }));

  r.post('/projects/:id/reports', wrap(async (req, res) => {
    const me = req.user;
    const { org, p } = await load(req);
    if (!canReport(org, me, p)) throw new HttpError(403, 'Bu projeye rapor giremezsiniz.');
    const b = req.body || {};
    const note = v.str(b.note, 'Rapor notu', { min: 2, max: 2000 });
    if (b.done === true) {
      await tx(pool, (c) => complete(c, org, me, p, note));
      return res.status(201).json({ ok: true });
    }
    const progress = v.int(b.progress, 'İlerleme', { min: 0, max: 100 });
    const health = v.oneOf(b.health, 'Durum', ['iyi', 'risk', 'gecikme']);
    await tx(pool, async (c) => {
      await c.query('INSERT INTO project_reports (project_id, author_id, progress, health, note) VALUES ($1,$2,$3,$4,$5)', [p.id, me.id, progress, health, note]);
      await c.query('UPDATE projects SET progress=$1, health=$2 WHERE id=$3', [progress, health, p.id]);
      await notify(c, org, me, watchers(org, p), 'report', `${me.name} “${p.name}” için ilerleme raporu girdi: ${pct(progress)}`, { view: 'project', id: p.id });
    });
    res.status(201).json({ ok: true });
  }));

  r.post('/projects/:id/comments', wrap(async (req, res) => {
    const me = req.user;
    const { org, p } = await load(req);
    const text = v.str((req.body || {}).text, 'Yorum', { min: 1, max: 1000 });
    await tx(pool, async (c) => {
      await c.query('INSERT INTO project_comments (project_id, author_id, body) VALUES ($1,$2,$3)', [p.id, me.id, text]);
      const prev = await c.query('SELECT DISTINCT author_id FROM project_comments WHERE project_id = $1', [p.id]);
      // Previous commenters are notified only if they can still see the project.
      const scopeOk = prev.rows.map((x) => x.author_id).filter((id) => { const u = org.get(id); return u && org.scope(u).has(p.owner_id); });
      await notify(c, org, me, [...watchers(org, p), ...scopeOk], 'comment', `${me.name} “${p.name}” projesine yorum yaptı`, { view: 'project', id: p.id });
    });
    res.status(201).json({ ok: true });
  }));

  return r;
};
