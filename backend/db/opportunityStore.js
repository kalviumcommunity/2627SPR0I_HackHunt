const crypto = require('crypto');
const { getPool } = require('./pool');
const { startOfToday } = require('../utils/dates');

const validTypes = ['hackathon', 'contest', 'fellowship', 'other'];
const validModes = ['online', 'offline', 'hybrid'];
const validStatuses = ['active', 'archived'];
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const COLUMNS = `id, title, organizer, official_url, type, mode, eligibility_notes,
  deadline, last_checked, status, created_at, updated_at`;

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function requireText(value, field) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new ValidationError(`${field} is required`);
  }
  return value.trim();
}

function parseDateOnly(value, field) {
  if (typeof value !== 'string' && !(value instanceof Date)) {
    throw new ValidationError(`${field} must be a valid date`);
  }

  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new ValidationError(`${field} must be a valid date`);
  }

  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function toDateString(date) {
  return date.toISOString().slice(0, 10);
}

function normalizeOpportunity(input) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new ValidationError('Opportunity data must be an object');
  }

  const title = requireText(input.title, 'title');
  const organizer = requireText(input.organizer, 'organizer');
  const officialUrl = requireText(input.officialUrl, 'officialUrl');
  if (!/^https?:\/\/\S+$/i.test(officialUrl)) {
    throw new ValidationError('officialUrl must use HTTP or HTTPS');
  }

  if (!validTypes.includes(input.type)) {
    throw new ValidationError('type must be one of: hackathon, contest, fellowship, other');
  }
  if (!validModes.includes(input.mode)) {
    throw new ValidationError('mode must be one of: online, offline, hybrid');
  }

  const eligibilityNotes = requireText(input.eligibilityNotes, 'eligibilityNotes');
  const deadline = parseDateOnly(input.deadline, 'deadline');
  const lastChecked = parseDateOnly(input.lastChecked, 'lastChecked');
  if (lastChecked.getTime() > startOfToday().getTime()) {
    throw new ValidationError('lastChecked cannot be in the future');
  }

  const status = input.status === undefined ? 'active' : input.status;
  if (!validStatuses.includes(status)) {
    throw new ValidationError('status must be one of: active, archived');
  }

  return {
    title,
    organizer,
    officialUrl,
    type: input.type,
    mode: input.mode,
    eligibilityNotes,
    deadline: toDateString(deadline),
    lastChecked: toDateString(lastChecked),
    status,
  };
}

function toIsoDate(value) {
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return `${value}T00:00:00.000Z`;
    }
    return new Date(value).toISOString();
  }

  const date = new Date(value);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).toISOString();
}

function toApi(row) {
  return {
    _id: row.id,
    title: row.title,
    organizer: row.organizer,
    officialUrl: row.official_url,
    type: row.type,
    mode: row.mode,
    eligibilityNotes: row.eligibility_notes,
    deadline: toIsoDate(row.deadline),
    lastChecked: toIsoDate(row.last_checked),
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

async function insert(client, data) {
  const id = crypto.randomBytes(12).toString('hex');
  const { rows } = await client.query(
    `INSERT INTO opportunities
      (id, title, organizer, official_url, type, mode, eligibility_notes, deadline, last_checked, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING ${COLUMNS}`,
    [
      id,
      data.title,
      data.organizer,
      data.officialUrl,
      data.type,
      data.mode,
      data.eligibilityNotes,
      data.deadline,
      data.lastChecked,
      data.status,
    ]
  );
  return toApi(rows[0]);
}

async function create(input) {
  return insert(getPool(), normalizeOpportunity(input));
}

// Replaces every listing with the given records in one transaction.
async function replaceAll(inputs) {
  const normalized = inputs.map(normalizeOpportunity);
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM opportunities');
    const created = [];
    for (const data of normalized) {
      created.push(await insert(client, data));
    }
    await client.query('COMMIT');
    return created;
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Failed to roll back opportunity seed:', rollbackError);
    }
    throw error;
  } finally {
    client.release();
  }
}

function escapeLike(value) {
  return value.replace(/[\\%_]/g, '\\$&');
}

async function findPublic({ mode, type, window, q } = {}, now = new Date()) {
  const today = startOfToday(now);
  const values = [toDateString(today)];
  const conditions = ["status = 'active'", 'deadline >= $1'];

  if (mode) {
    values.push(mode);
    conditions.push(`mode = $${values.length}`);
  }
  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }
  if (window) {
    values.push(toDateString(new Date(today.getTime() + Number(window) * DAY_IN_MS)));
    conditions.push(`deadline <= $${values.length}`);
  }
  if (q) {
    values.push(`%${escapeLike(q)}%`);
    const placeholder = `$${values.length}`;
    conditions.push(
      `(title ILIKE ${placeholder} OR organizer ILIKE ${placeholder} OR eligibility_notes ILIKE ${placeholder})`
    );
  }

  const { rows } = await getPool().query(
    `SELECT ${COLUMNS} FROM opportunities
     WHERE ${conditions.join(' AND ')}
     ORDER BY deadline ASC, id ASC`,
    values
  );
  return rows.map(toApi);
}

async function findCurrentById(id, now = new Date()) {
  const { rows } = await getPool().query(
    `SELECT ${COLUMNS} FROM opportunities
     WHERE id = $1 AND status = 'active' AND deadline >= $2`,
    [id, toDateString(startOfToday(now))]
  );
  return rows.length ? toApi(rows[0]) : null;
}

async function findById(id) {
  const { rows } = await getPool().query(
    `SELECT ${COLUMNS} FROM opportunities WHERE id = $1`,
    [id]
  );
  return rows.length ? toApi(rows[0]) : null;
}

async function findAll({ status } = {}) {
  const values = [];
  let where = '';
  if (status) {
    values.push(status);
    where = 'WHERE status = $1';
  }

  const { rows } = await getPool().query(
    `SELECT ${COLUMNS} FROM opportunities ${where}
     ORDER BY deadline ASC, id ASC`,
    values
  );
  return rows.map(toApi);
}

async function update(id, input) {
  const data = normalizeOpportunity(input);
  const { rows } = await getPool().query(
    `UPDATE opportunities SET
       title = $2, organizer = $3, official_url = $4, type = $5, mode = $6,
       eligibility_notes = $7, deadline = $8, last_checked = $9, status = $10,
       updated_at = NOW()
     WHERE id = $1
     RETURNING ${COLUMNS}`,
    [
      id,
      data.title,
      data.organizer,
      data.officialUrl,
      data.type,
      data.mode,
      data.eligibilityNotes,
      data.deadline,
      data.lastChecked,
      data.status,
    ]
  );
  return rows.length ? toApi(rows[0]) : null;
}

async function remove(id) {
  const { rows } = await getPool().query(
    'DELETE FROM opportunities WHERE id = $1 RETURNING id',
    [id]
  );
  return rows.length > 0;
}

module.exports = {
  ValidationError,
  normalizeOpportunity,
  toApi,
  COLUMNS,
  create,
  replaceAll,
  findPublic,
  findCurrentById,
  findById,
  findAll,
  update,
  remove,
};
