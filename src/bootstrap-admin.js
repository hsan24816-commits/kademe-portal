'use strict';
const auth = require('./auth');

// On an empty database, creates the first deputy GM account from environment variables
// so the portal is usable right after deployment.
async function ensureAdmin(pool, env = process.env) {
  const { rows } = await pool.query('SELECT count(*)::int AS n FROM users');
  if (rows[0].n > 0) return null;
  const username = (env.ADMIN_USERNAME || '').trim().toLowerCase();
  const password = env.ADMIN_PASSWORD || '';
  if (!username || !password) {
    console.warn('No users yet. Set ADMIN_USERNAME and ADMIN_PASSWORD (or run `npm run create-admin`) to create the first account.');
    return null;
  }
  auth.checkPasswordPolicy(password);
  const r = await pool.query(
    `INSERT INTO users (username, email, name, title, role, dept, password_hash, must_change_password)
     VALUES ($1, $2, $3, $4, 'gmy', $5, $6, true) RETURNING id`,
    [username, (env.ADMIN_EMAIL || '').trim(), (env.ADMIN_NAME || 'Genel Müdür Yardımcısı').trim(),
      (env.ADMIN_TITLE || 'Genel Müdür Yardımcısı').trim(), (env.ADMIN_DEPT || 'Genel Müdürlük').trim(), auth.hashPassword(password)]
  );
  console.log(`Created first account "${username}". It must change its password at first sign-in.`);
  return r.rows[0].id;
}

module.exports = { ensureAdmin };
