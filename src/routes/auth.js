'use strict';
const express = require('express');
const { wrap, v, HttpError } = require('../http');
const auth = require('../auth');
const S = require('../serialize');

module.exports = function authRoutes(pool) {
  const r = express.Router();
  const limiter = auth.loginLimiter({ max: Number(process.env.LOGIN_MAX_FAILS || 10) });

  r.post('/auth/login', wrap(async (req, res) => {
    limiter.check(req);
    const username = v.str(req.body.username, 'Kullanıcı adı', { min: 1, max: 120 }).toLowerCase();
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE (lower(username) = $1 OR (email <> \'\' AND lower(email) = $1)) AND active',
      [username]
    );
    const user = rows.length === 1 ? rows[0] : null;
    const ok = auth.verifyPassword(password, user ? user.password_hash : auth.DUMMY_HASH);
    if (!user || !ok) {
      limiter.fail(req);
      throw new HttpError(401, 'Kullanıcı adı veya şifre hatalı.');
    }
    limiter.succeed(req);
    const token = await auth.createSession(pool, user.id);
    auth.setSessionCookie(res, token);
    res.json({ user: S.meUser(user) });
  }));

  r.post('/auth/logout', wrap(async (req, res) => {
    await auth.destroySession(pool, req, res);
    res.json({ ok: true });
  }));

  r.get('/me', (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Oturum açmanız gerekiyor.' });
    res.json({ user: S.meUser(req.user) });
  });

  // Allowed even while a password change is pending.
  r.post('/me/password', wrap(async (req, res) => {
    if (!req.user) throw new HttpError(401, 'Oturum açmanız gerekiyor.');
    const current = typeof req.body.current === 'string' ? req.body.current : '';
    const next = req.body.next;
    if (!auth.verifyPassword(current, req.user.password_hash)) throw new HttpError(400, 'Mevcut şifre hatalı.');
    auth.checkPasswordPolicy(next);
    if (next === current) throw new HttpError(400, 'Yeni şifre mevcut şifreden farklı olmalı.');
    await pool.query('UPDATE users SET password_hash = $1, must_change_password = false WHERE id = $2', [auth.hashPassword(next), req.user.id]);
    // End every other session of this user.
    await pool.query('DELETE FROM sessions WHERE user_id = $1', [req.user.id]);
    const token = await auth.createSession(pool, req.user.id);
    auth.setSessionCookie(res, token);
    res.json({ ok: true });
  }));

  r.patch('/me', auth.requireUser, wrap(async (req, res) => {
    const u = req.user;
    const b = req.body || {};
    const name = b.name !== undefined ? v.str(b.name, 'Ad soyad', { min: 2, max: 80 }) : u.name;
    const email = b.email !== undefined ? v.str(b.email, 'E-posta', { max: 120 }) : u.email;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'E-posta geçersiz.');
    const phone = b.phone !== undefined ? v.str(b.phone, 'Telefon', { max: 30 }) : u.phone;
    const theme = b.theme !== undefined ? v.oneOf(b.theme, 'Tema', ['system', 'light', 'dark']) : u.theme;
    let prefs = u.prefs || {};
    if (b.prefs && typeof b.prefs === 'object') {
      prefs = { ...prefs };
      for (const k of ['meeting', 'report', 'lobby', 'comment', 'project']) if (typeof b.prefs[k] === 'boolean') prefs[k] = b.prefs[k];
    }
    if (email) {
      const dupe = await pool.query('SELECT 1 FROM users WHERE lower(email) = lower($1) AND id <> $2', [email, u.id]);
      if (dupe.rowCount) throw new HttpError(400, 'Bu e-posta başka bir hesapta kullanılıyor.');
    }
    const { rows } = await pool.query(
      'UPDATE users SET name=$1, email=$2, phone=$3, theme=$4, prefs=$5 WHERE id=$6 RETURNING *',
      [name, email, phone, theme, JSON.stringify(prefs), u.id]
    );
    res.json({ user: S.meUser(rows[0]) });
  }));

  return r;
};
