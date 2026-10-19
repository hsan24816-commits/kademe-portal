'use strict';
const fs = require('fs');
const path = require('path');
const { Pool, types } = require('pg');

// Return DATE columns as 'YYYY-MM-DD' strings instead of local-midnight Date objects.
types.setTypeParser(1082, (v) => v);

function createPool(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) throw new Error('DATABASE_URL is not set');
  const ssl = process.env.DATABASE_SSL === '1' ? { rejectUnauthorized: false } : undefined;
  return new Pool({ connectionString, ssl, max: Number(process.env.DATABASE_POOL_MAX || 10) });
}

async function migrate(pool) {
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`);
  const dir = path.join(__dirname, '..', 'migrations');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  const { rows } = await pool.query('SELECT version FROM schema_migrations');
  const done = new Set(rows.map((r) => r.version));
  const applied = [];
  for (const file of files) {
    if (done.has(file)) continue;
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    await tx(pool, async (c) => {
      await c.query(sql);
      await c.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file]);
    });
    applied.push(file);
  }
  return applied;
}

async function tx(pool, fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const out = await fn(client);
    await client.query('COMMIT');
    return out;
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

module.exports = { createPool, migrate, tx };
