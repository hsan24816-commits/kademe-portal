'use strict';
const { createPool, migrate } = require('./db');
const { createApp } = require('./app');
const { ensureAdmin } = require('./bootstrap-admin');

async function main() {
  const pool = createPool();
  const applied = await migrate(pool);
  if (applied.length) console.log('Applied migrations:', applied.join(', '));
  await ensureAdmin(pool);
  const port = Number(process.env.PORT || 3000);
  const server = createApp(pool).listen(port, () => console.log(`Kademe portal listening on :${port}`));
  const stop = () => server.close(() => pool.end().then(() => process.exit(0)));
  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
  // Expired sessions are removed hourly.
  setInterval(() => pool.query('DELETE FROM sessions WHERE expires_at < now()').catch(() => {}), 3600e3).unref();
}

main().catch((e) => { console.error(e); process.exit(1); });
