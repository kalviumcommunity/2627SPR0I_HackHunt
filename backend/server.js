require('dotenv').config();

const app = require('./app');
const { migrate } = require('./db/migrate');
const { closePool } = require('./db/pool');

async function start() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set');
  }

  try {
    await migrate();
  } catch (error) {
    await closePool();
    throw error;
  }

  const port = process.env.PORT || 5000;
  return app.listen(port, () => {
    console.log(`HackHunt API listening on port ${port}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    if (
      error.code === 'ECONNREFUSED' ||
      (Array.isArray(error.errors) &&
        error.errors.some((connectionError) => connectionError.code === 'ECONNREFUSED'))
    ) {
      console.error(
        'PostgreSQL is not accepting connections. Start Docker Desktop, then run "docker compose up -d postgres" from the repository root. For Node running on Windows, backend/.env must use localhost:5432 in DATABASE_URL.'
      );
    }
    console.error('Failed to start HackHunt backend:', error);
    process.exitCode = 1;
  });
}

module.exports = { app, start };
