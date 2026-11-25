const fs = require('fs');
const path = require('path');
const { getPool, closePool } = require('./pool');

const migrationsDirectory = path.join(__dirname, 'migrations');

async function migrate() {
  const migrationFiles = fs
    .readdirSync(migrationsDirectory)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of migrationFiles) {
    const migration = fs.readFileSync(path.join(migrationsDirectory, file), 'utf8');
    await getPool().query(migration);
  }
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
