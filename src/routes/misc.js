'use strict';
const express = require('express');
const { wrap, v } = require('../http');

module.exports = function miscRoutes(pool) {
  const r = express.Router();

  r.post('/notifications/read-all', wrap(async (req, res) => {
    await pool.query('UPDATE notifications SET read = true WHERE user_id = $1 AND NOT read', [req.user.id]);
    res.json({ ok: true });
  }));

  r.post('/notifications/:id/read', wrap(async (req, res) => {
    const id = v.uuid(req.params.id, 'Bildirim');
    await pool.query('UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    res.json({ ok: true });
  }));

  // Game results. Limited per person so the leaderboard cannot be flooded.
  r.post('/scores', wrap(async (req, res) => {
    const b = req.body || {};
    const game = v.oneOf(b.game, 'Oyun', ['xox', 'hangman', 'memory']);
    const score = v.int(b.score, 'Puan', { min: 0, max: 100 });
    const recent = await pool.query(`SELECT count(*)::int AS n FROM scores WHERE user_id = $1 AND created_at > now() - interval '1 hour'`, [req.user.id]);
    if (recent.rows[0].n >= 60) return res.status(429).json({ error: 'Bir saatte en fazla 60 oyun kaydedilir. Biraz mola verin.' });
    await pool.query('INSERT INTO scores (user_id, game, score) VALUES ($1,$2,$3)', [req.user.id, game, score]);
    res.status(201).json({ ok: true });
  }));

  return r;
};
