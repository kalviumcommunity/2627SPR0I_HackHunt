const fs = require('fs');
const path = require('path');
const { getPool, closePool } = require('./pool');

async function migrate() {
  const migrationPath = path.join(__dirname, 'migrations', '001_create_opportunity_rechecks.sql');
  const migration = fs.readFileSync(migrationPath, 'utf8');
  await getPool().query(migration);
}

if (require.main === module) {
  migrate()
    .then(() => console.log('Database migrations completed'))
    .catch((error) => {
      console.error('Database migration failed:', error);
      process.exitCode = 1;
    })
    .finally(closePool);
}

module.exports = { migrate };
