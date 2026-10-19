'use strict';
const crypto = require('crypto');
const { HttpError } = require('./http');

const COOKIE = 'kademe_session';
const SESSION_DAYS = Number(process.env.SESSION_DAYS || 14);
const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p });
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString('base64')}$${key.toString('base64')}`;
}

function verifyPassword(password, stored) {
  const parts = String(stored || '').split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, N, r, p, saltB64, keyB64] = parts;
  const expected = Buffer.from(keyB64, 'base64');
  const key = crypto.scryptSync(password, Buffer.from(saltB64, 'base64'), expected.length, { N: +N, r: +r, p: +p });
  return crypto.timingSafeEqual(key, expected);
}

// A valid hash nobody knows the password to, so unknown usernames cost the same time as wrong passwords.
const DUMMY_HASH = hashPassword(crypto.randomBytes(16).toString('hex'));

function checkPasswordPolicy(pw) {
  if (typeof pw !== 'string' || pw.length < 8) throw new HttpError(400, 'Şifre en az 8 karakter olmalı.');
  if (pw.length > 200) throw new HttpError(400, 'Şifre çok uzun.');
}

function tempPassword() {
  // 10 characters from an alphabet without look-alikes (0/O, 1/l/I)
  const alphabet = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(10);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

async function createSession(pool, userId) {
  const token = crypto.randomBytes(32).toString('base64url');
  await pool.query(
    `INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, now() + make_interval(days => $3))`,
    [sha256(token), userId, SESSION_DAYS]
  );
  return token;
}

// True when the site is served over https. PLAIN_HTTP=1 (or the older INSECURE_COOKIES=1) is for a
// portal on a private network reached over plain http, where https-only cookies and upgrades would break sign-in.
function httpsOnly() {
  return process.env.NODE_ENV === 'production' && process.env.PLAIN_HTTP !== '1' && process.env.INSECURE_COOKIES !== '1';
}

function setSessionCookie(res, token) {
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: httpsOnly(),
    maxAge: SESSION_DAYS * 86400e3,
    path: '/',
  });
}

function readCookie(req, name) {
  const header = req.headers.cookie || '';
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    if (part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}

async function destroySession(pool, req, res) {
  const token = readCookie(req, COOKIE);
  if (token) await pool.query('DELETE FROM sessions WHERE token_hash = $1', [sha256(token)]);
  res.clearCookie(COOKIE, { path: '/' });
}

// Loads req.user from the session cookie (or leaves it null).
function sessionMiddleware(pool) {
  return async (req, res, next) => {
    req.user = null;
    const token = readCookie(req, COOKIE);
    if (!token) return next();
    try {
      const { rows } = await pool.query(
        `UPDATE sessions s SET last_seen = now()
           FROM users u
          WHERE s.token_hash = $1 AND s.expires_at > now() AND u.id = s.user_id AND u.active
        RETURNING u.*`,
        [sha256(token)]
      );
      req.user = rows[0] || null;
      next();
    } catch (e) {
      next(e);
    }
  };
}

function requireUser(req, res, next) {
  if (!req.user) return next(new HttpError(401, 'Oturum açmanız gerekiyor.'));
  if (req.user.must_change_password && !req.allowPasswordChangeOnly) {
    return next(new HttpError(403, 'Devam etmeden önce şifrenizi değiştirin.', 'password_change_required'));
  }
  next();
}

// Blocks cross-site form posts: every state-changing request must carry a custom header,
// which a browser only sends cross-origin after a CORS preflight this server never approves.
function csrfGuard(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.get('X-Kademe') !== '1') return next(new HttpError(403, 'Geçersiz istek.'));
  next();
}

// Simple in-memory limiter for failed logins, keyed by username and, with a higher ceiling
// (an office shares one IP), by IP address.
function loginLimiter({ max = 10, ipMax = max * 5, windowMs = 15 * 60e3 } = {}) {
  const hits = new Map();
  const prune = () => {
    const now = Date.now();
    for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  };
  setInterval(prune, windowMs).unref();
  const keyFor = (req) => [`ip:${req.ip}`, `u:${String((req.body && req.body.username) || '').toLowerCase()}`];
  return {
    check(req) {
      const now = Date.now();
      for (const k of keyFor(req)) {
        const v = hits.get(k);
        if (v && v.reset > now && v.count >= (k.startsWith('ip:') ? ipMax : max)) {
          throw new HttpError(429, 'Çok fazla hatalı deneme. Lütfen 15 dakika sonra tekrar deneyin.');
        }
      }
    },
    fail(req) {
      const now = Date.now();
      for (const k of keyFor(req)) {
        const v = hits.get(k);
        if (!v || v.reset < now) hits.set(k, { count: 1, reset: now + windowMs });
        else v.count++;
      }
    },
    succeed(req) {
      hits.delete(keyFor(req)[1]);
    },
  };
}

module.exports = {
  COOKIE, httpsOnly, hashPassword, verifyPassword, DUMMY_HASH, checkPasswordPolicy, tempPassword,
  createSession, setSessionCookie, destroySession, sessionMiddleware, requireUser, csrfGuard, loginLimiter,
};
