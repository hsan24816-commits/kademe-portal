'use strict';
// Creates a deputy GM account. Usage:
//   npm run create-admin -- <username> "<Full Name>" [email]
// The password is read from ADMIN_PASSWORD, or a temporary one is generated and printed.
const { createPool, migrate } = require('../src/db');
const auth = require('../src/auth');

(async () => {
  const [username, name, email = ''] = process.argv.slice(2);
  if (!username || !name) {
    console.error('Usage: npm run create-admin -- <username> "<Full Name>" [email]');
    process.exit(1);
  }
  const pool = createPool();
  await migrate(pool);
  const password = process.env.ADMIN_PASSWORD || auth.tempPassword();
  auth.checkPasswordPolicy(password);
  await pool.query(
    `INSERT INTO users (username, email, name, title, role, dept, password_hash, must_change_password)
     VALUES ($1,$2,$3,'Genel Müdür Yardımcısı','gmy','Genel Müdürlük',$4,true)`,
    [username.toLowerCase(), email, name, auth.hashPassword(password)]
  );
  console.log(`Created ${username}. Temporary password: ${password}`);
  console.log('The password must be changed at first sign-in.');
  await pool.end();
})().catch((e) => { console.error(e.message); process.exit(1); });
