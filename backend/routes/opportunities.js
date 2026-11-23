const express = require('express');
const { findPublic, findCurrentById } = require('../db/opportunityStore');
const { getDaysLeft, isClosingSoon, isStale } = require('../utils/dates');

const router = express.Router();
const validModes = ['online', 'offline', 'hybrid'];
const validTypes = ['hackathon', 'contest', 'fellowship', 'other'];
const supportedQueryParams = new Set(['mode', 'type', 'window', 'q']);

function validateQuery(query) {
  const unknownParams = Object.keys(query).filter((key) => !supportedQueryParams.has(key));
  if (unknownParams.length) {
    return `Unsupported query parameter: ${unknownParams[0]}`;
  }

  if (query.mode !== undefined
    && (typeof query.mode !== 'string' || !validModes.includes(query.mode))) {
    return 'mode must be one of: online, offline, hybrid';
  }
  if (query.type !== undefined
    && (typeof query.type !== 'string' || !validTypes.includes(query.type))) {
    return 'type must be one of: hackathon, contest, fellowship, other';
  }
  if (query.window !== undefined
    && (typeof query.window !== 'string' || !['7', '30'].includes(query.window))) {
    return 'window must be 7 or 30';
  }
  if (query.q !== undefined
    && (typeof query.q !== 'string' || query.q.length > 100)) {
    return 'q must be a string of 100 characters or fewer';
  }
  return null;
}

function serializeOpportunity(opportunity, now) {
  return {
    ...opportunity,
    isClosingSoon: isClosingSoon(opportunity.deadline, now),
    isStale: isStale(opportunity.lastChecked, now),
    daysLeft: getDaysLeft(opportunity.deadline, now),
  };
}

router.get('/', async (req, res, next) => {
  const validationError = validateQuery(req.query);
  if (validationError) {
    return res.status(400).json({ error: { message: validationError } });
  }

  const now = new Date();
  const searchTerm = req.query.q && req.query.q.trim();

  try {
    const opportunities = await findPublic({
      mode: req.query.mode,
      type: req.query.type,
      window: req.query.window,
      q: searchTerm || undefined,
    }, now);
    return res.json(opportunities.map((item) => serializeOpportunity(item, now)));
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
    return res.status(400).json({ error: { message: 'Invalid opportunity id' } });
  }

  try {
    const now = new Date();
    const opportunity = await findCurrentById(req.params.id, now);
    if (!opportunity) {
      return res.status(404).json({ error: { message: 'Opportunity not found' } });
    }
    return res.json(serializeOpportunity(opportunity, now));
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
