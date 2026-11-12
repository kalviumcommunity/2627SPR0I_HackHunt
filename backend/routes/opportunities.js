const express = require('express');
const Opportunity = require('../models/Opportunity');
const { startOfToday, getDaysLeft, isClosingSoon, isStale } = require('../utils/dates');

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
  if (query.q !== undefined && typeof query.q !== 'string') {
    return 'q must be a single string';
  }
  return null;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function serializeOpportunity(opportunity, now) {
  const item = typeof opportunity.toObject === 'function'
    ? opportunity.toObject()
    : opportunity;
  return {
    ...item,
    isClosingSoon: isClosingSoon(item.deadline, now),
    isStale: isStale(item.lastChecked, now),
    daysLeft: getDaysLeft(item.deadline, now),
  };
}

router.get('/', async (req, res, next) => {
  const validationError = validateQuery(req.query);
  if (validationError) {
    return res.status(400).json({ error: { message: validationError } });
  }

  const now = new Date();
  const today = startOfToday(now);
  const filter = { status: 'active', deadline: { $gte: today } };
  if (req.query.mode) filter.mode = req.query.mode;
  if (req.query.type) filter.type = req.query.type;
  if (req.query.window) {
    filter.deadline.$lte = new Date(today.getTime() + Number(req.query.window) * 24 * 60 * 60 * 1000);
  }
  if (req.query.q) {
    const search = new RegExp(escapeRegex(req.query.q.trim()), 'i');
    filter.$or = [
      { title: search },
      { organizer: search },
      { eligibilityNotes: search },
    ];
  }

  try {
    const opportunities = await Opportunity.find(filter).sort({ deadline: 1 }).lean();
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
    const opportunity = await Opportunity.findOne({
      _id: req.params.id,
      status: 'active',
      deadline: { $gte: startOfToday(now) },
    }).lean();
    if (!opportunity) {
      return res.status(404).json({ error: { message: 'Opportunity not found' } });
    }
    return res.json(serializeOpportunity(opportunity, now));
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
