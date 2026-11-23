const { Pool } = require('pg');

let pool;

// DATE columns are returned as plain YYYY-MM-DD strings.
require('pg').types.setTypeParser(1082, (value) => value);

function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL must be set');
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  return pool;
}

// Tests replace the real pool with an in-memory PostgreSQL pool.
function setPool(replacement) {
  pool = replacement;
}

async function closePool() {
  if (pool) {
    const activePool = pool;
    pool = undefined;
    await activePool.end();
  }
}

module.exports = { getPool, setPool, closePool };
