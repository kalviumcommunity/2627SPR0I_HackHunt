const { getPool } = require('./pool');
const { toApi, COLUMNS } = require('./opportunityStore');

class PersistenceError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'PersistenceError';
    this.cause = cause;
  }
}

// Updates the listing and records the re-check in one PostgreSQL transaction.
async function recheckOpportunity(opportunityId, lastChecked) {
  let client;

  try {
    client = await getPool().connect();
  } catch (error) {
    throw new PersistenceError('Could not connect to PostgreSQL', error);
  }

  try {
    await client.query('BEGIN');
    const result = await client.query(
      `UPDATE opportunities
       SET last_checked = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING ${COLUMNS}`,
      [opportunityId, lastChecked]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    await client.query(
      `INSERT INTO opportunity_rechecks (opportunity_id, last_checked)
       VALUES ($1, $2)`,
      [opportunityId, lastChecked]
    );

    await client.query('COMMIT');
    return toApi(result.rows[0]);
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Failed to roll back opportunity re-check:', rollbackError);
    }
    throw new PersistenceError('Could not persist opportunity re-check', error);
  } finally {
    client.release();
  }
}

module.exports = { PersistenceError, recheckOpportunity };
