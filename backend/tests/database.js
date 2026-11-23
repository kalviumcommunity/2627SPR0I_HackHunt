const { getPool, setPool, closePool } = require('../db/pool');
const { migrate } = require('../db/migrate');

let memoryPool;

async function connectToDatabase() {
  const connectionString = process.env.TEST_DATABASE_URL;

  if (connectionString) {
    const databaseName = new URL(connectionString).pathname.replace(/^\/+/, '');
    if (!databaseName.endsWith('_test')) {
      throw new Error('TEST_DATABASE_URL database name must end in _test');
    }
    process.env.DATABASE_URL = connectionString;
  } else {
    // Tests run against an in-memory PostgreSQL instance when no server is configured.
    const { newDb } = require('pg-mem');
    const adapter = newDb().adapters.createPg();
    memoryPool = new adapter.Pool();
    setPool(memoryPool);
  }

  await migrate();
}

async function clearDatabase() {
  await getPool().query('DELETE FROM opportunity_rechecks');
  await getPool().query('DELETE FROM opportunities');
}

async function disconnectFromDatabase() {
  await closePool();
  memoryPool = undefined;
}

module.exports = { connectToDatabase, clearDatabase, disconnectFromDatabase };
