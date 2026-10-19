'use strict';
const express = require('express');
const { wrap, v, HttpError } = require('../http');
const { tx } = require('../db');
const { Org } = require('../org');
const { notify, trDate } = require('../notify');

module.exports = function meetingRoutes(pool) {
  const r = express.Router();

  async function load(req) {
    const id = v.uuid(req.params.id, 'Toplantı');
    const org = await Org.load(pool);
    const { rows } = await pool.query('SELECT * FROM meetings WHERE id = $1', [id]);
    const m = rows[0];
    if (!m) throw new HttpError(404, 'Toplantı bulunamadı.');
    const att = await pool.query('SELECT * FROM meeting_attendees WHERE meeting_id = $1', [id]);
    const ids = att.rows.map((a) => a.user_id);
    const scope = org.scope(req.user);
    if (req.user.role !== 'gmy' && ![m.organizer_id, ...ids].some((x) => scope.has(x))) throw new HttpError(404, 'Toplantı bulunamadı.');
    return { org, m, attendees: att.rows, ids };
  }

  r.post('/meetings', wrap(async (req, res) => {
    const me = req.user;
    const b = req.body || {};
    const title = v.str(b.title, 'Başlık', { min: 2, max: 120 });
    const at = v.instant(b.at, 'Tarih ve saat');
    const dur = v.int(b.dur, 'Süre', { min: 5, max: 600 });
    const mode = v.oneOf(b.mode, 'Biçim', ['yuz', 'online']);
    const location = v.str(b.location, 'Yer', { max: 200 });
    const agenda = v.str(b.agenda, 'Gündem', { max: 2000 });
    if (!Array.isArray(b.attendeeIds) || !b.attendeeIds.length) throw new HttpError(400, 'En az bir katılımcı seçin.');
    const attendeeIds = [...new Set(b.attendeeIds.map((x) => v.uuid(x, 'Katılımcı')))];
    if (attendeeIds.length > 200) throw new HttpError(400, 'Çok fazla katılımcı.');
    const org = await Org.load(pool);
    const allowed = org.meetingCandidates(me);
    const bad = attendeeIds.filter((x) => !allowed.has(x));
    if (bad.length) throw new HttpError(400, 'Seçilen kişilerden bazılarını davet edemezsiniz.');

    // People already booked at that time (a warning, not a refusal).
    const end = new Date(Date.parse(at) + dur * 60e3).toISOString();
    const clash = await pool.query(
      `SELECT DISTINCT p.uid FROM meetings m
         JOIN LATERAL (SELECT m.organizer_id AS uid UNION SELECT user_id FROM meeting_attendees WHERE meeting_id = m.id) p ON true
        WHERE m.starts_at < $2 AND m.starts_at + make_interval(mins => m.duration_min) > $1 AND p.uid = ANY($3::uuid[])`,
      [at, end, attendeeIds]
    );
    const id = await tx(pool, async (c) => {
      const { rows } = await c.query(
        `INSERT INTO meetings (title, starts_at, duration_min, mode, location, agenda, organizer_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
        [title, at, dur, mode, location, agenda, me.id]
      );
      await c.query('INSERT INTO meeting_attendees (meeting_id, user_id) SELECT $1, unnest($2::uuid[])', [rows[0].id, attendeeIds]);
      await notify(c, org, me, attendeeIds, 'meeting', `${me.name} sizi “${title}” toplantısına davet etti · ${trDate(at)}`, { view: 'meeting', id: rows[0].id });
      return rows[0].id;
    });
    res.status(201).json({ id, conflicts: clash.rows.map((x) => x.uid) });
  }));

  r.delete('/meetings/:id', wrap(async (req, res) => {
    const me = req.user;
    const { org, m, ids } = await load(req);
    if (m.organizer_id !== me.id && me.role !== 'gmy') throw new HttpError(403, 'Bu toplantıyı yalnızca düzenleyen iptal edebilir.');
    await tx(pool, async (c) => {
      await c.query('DELETE FROM meetings WHERE id = $1', [m.id]);
      await notify(c, org, me, [m.organizer_id, ...ids], 'meeting', `${me.name} “${m.title}” toplantısını iptal etti (${trDate(m.starts_at)})`, { view: 'meetings' });
    });
    res.json({ ok: true });
  }));

  r.post('/meetings/:id/rsvp', wrap(async (req, res) => {
    const me = req.user;
    const { org, m, ids } = await load(req);
    if (!ids.includes(me.id)) throw new HttpError(403, 'Bu toplantıya davetli değilsiniz.');
    const status = v.oneOf((req.body || {}).status, 'Yanıt', ['yes', 'no']);
    await tx(pool, async (c) => {
      await c.query('UPDATE meeting_attendees SET rsvp = $1 WHERE meeting_id = $2 AND user_id = $3', [status, m.id, me.id]);
      await notify(c, org, me, [m.organizer_id], 'meeting', `${me.name} “${m.title}” toplantısına ${status === 'yes' ? 'katılacak' : 'katılamayacak'}`, { view: 'meeting', id: m.id });
    });
    res.json({ ok: true });
  }));

  return r;
};
