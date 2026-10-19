'use strict';
const express = require('express');
const { wrap, v, HttpError } = require('../http');
const { tx } = require('../db');
const { Org } = require('../org');
const { notify } = require('../notify');

const KIND = { duyuru: 'duyuru', kural: 'kural', hatirlatma: 'hatırlatma' };

module.exports = function lobbyRoutes(pool) {
  const r = express.Router();

  async function load(req) {
    const id = v.uuid(req.params.id, 'Duyuru');
    const org = await Org.load(pool);
    const { rows } = await pool.query('SELECT * FROM announcements WHERE id = $1', [id]);
    const a = rows[0];
    if (!a || (a.author_id !== req.user.id && !org.audience(a).has(req.user.id))) throw new HttpError(404, 'Duyuru bulunamadı.');
    return { org, a };
  }

  r.post('/announcements', wrap(async (req, res) => {
    const me = req.user;
    if (me.role === 'employee') throw new HttpError(403, 'Lobi\'de yayın yapma yetkiniz yok.');
    const b = req.body || {};
    const kind = v.oneOf(b.kind, 'Tür', Object.keys(KIND));
    const title = v.str(b.title, 'Başlık', { min: 2, max: 140 });
    const body = v.str(b.body, 'Metin', { min: 2, max: 3000 });
    let lead = null;
    if (me.role === 'gmy') {
      if (b.audience && b.audience !== 'all') lead = v.uuid(b.audience, 'Hedef kitle');
    } else {
      lead = me.id; // directors and managers post to their own team
    }
    const org = await Org.load(pool);
    if (lead) {
      const l = org.get(lead);
      if (!l || !l.active || l.role === 'employee') throw new HttpError(400, 'Hedef kitle geçersiz.');
    }
    const id = await tx(pool, async (c) => {
      const { rows } = await c.query(
        `INSERT INTO announcements (author_id, audience_lead_id, kind, title, body, pinned) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [me.id, lead, kind, title, body, v.bool(b.pinned)]
      );
      await notify(c, org, me, [...org.audience(rows[0])], 'lobby', `${me.name} Lobi'de yeni bir ${KIND[kind]} yayınladı: “${title}”`, { view: 'lobby' });
      return rows[0].id;
    });
    res.status(201).json({ id });
  }));

  r.delete('/announcements/:id', wrap(async (req, res) => {
    const { a } = await load(req);
    if (a.author_id !== req.user.id && req.user.role !== 'gmy') throw new HttpError(403, 'Bu yayını kaldırma yetkiniz yok.');
    await pool.query('DELETE FROM announcements WHERE id = $1', [a.id]);
    res.json({ ok: true });
  }));

  r.post('/announcements/:id/ack', wrap(async (req, res) => {
    const { a } = await load(req);
    await pool.query('INSERT INTO announcement_acks (announcement_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [a.id, req.user.id]);
    res.json({ ok: true });
  }));

  r.post('/announcements/:id/remind', wrap(async (req, res) => {
    const me = req.user;
    const { org, a } = await load(req);
    if (a.author_id !== me.id && me.role !== 'gmy') throw new HttpError(403, 'Bu işlem için yetkiniz yok.');
    const acks = await pool.query('SELECT user_id FROM announcement_acks WHERE announcement_id = $1', [a.id]);
    const read = new Set(acks.rows.map((x) => x.user_id));
    const pending = [...org.audience(a)].filter((id) => id !== a.author_id && !read.has(id));
    const n = await notify(pool, org, me, pending, 'lobby', `Hatırlatma: Lobi'deki “${a.title}” başlıklı ${KIND[a.kind]} henüz okunmadı`, { view: 'lobby' });
    res.json({ ok: true, sent: n });
  }));

  return r;
};
