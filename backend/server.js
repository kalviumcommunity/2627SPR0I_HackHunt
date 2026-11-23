const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

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
    console.error('Failed to start HackHunt backend:', error);
    process.exitCode = 1;
  });
}

module.exports = { app, start };
