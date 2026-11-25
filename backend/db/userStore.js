const { getPool } = require('./pool');

async function createUser({ fullName, email, passwordHash }) {
  const result = await getPool().query(
    `INSERT INTO users (full_name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, full_name, email, created_at`,
    [fullName, email, passwordHash]
  );
  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await getPool().query(
    `SELECT id, full_name, email, password_hash
     FROM users
     WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

module.exports = { createUser, findUserByEmail };
