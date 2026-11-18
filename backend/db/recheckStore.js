const { getPool } = require('./pool');

class PersistenceError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'PersistenceError';
    this.cause = cause;
  }
}

async function recordOpportunityRecheck(opportunityId, lastChecked, saveOpportunity) {
  let client;

  try {
    client = await getPool().connect();
  } catch (error) {
    throw new PersistenceError('Could not connect to PostgreSQL', error);
  }

  let operation = 'database';
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `INSERT INTO opportunity_rechecks (opportunity_id, last_checked)
       VALUES ($1, $2)
       RETURNING id, opportunity_id AS "opportunityId",
         last_checked::text AS "lastChecked", rechecked_at AS "recheckedAt"`,
      [opportunityId, lastChecked]
    );

    operation = 'opportunity';
    await saveOpportunity();
    operation = 'database';
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Failed to roll back opportunity re-check:', rollbackError);
    }

    if (operation === 'database') {
      throw new PersistenceError('Could not persist opportunity re-check', error);
    }
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { PersistenceError, recordOpportunityRecheck };
