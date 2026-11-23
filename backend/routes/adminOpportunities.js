const express = require('express');
const { create, findAll, update, remove } = require('../db/opportunityStore');
const { requireCoordinator } = require('../middleware/auth');
const { startOfToday } = require('../utils/dates');
const { recheckOpportunity } = require('../db/recheckStore');

const router = express.Router();
const validStatuses = ['active', 'archived'];
const opportunityFields = new Set([
  'title',
  'organizer',
  'officialUrl',
  'type',
  'mode',
  'eligibilityNotes',
  'deadline',
  'lastChecked',
  'status',
]);

function hasObjectBody(body) {
  return body !== null && typeof body === 'object' && !Array.isArray(body);
}

function hasOnlyOpportunityFields(body) {
  return Object.keys(body).every((key) => opportunityFields.has(key));
}

router.use(requireCoordinator);

router.get('/', async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  if (queryKeys.some((key) => key !== 'status')
    || (req.query.status !== undefined && !validStatuses.includes(req.query.status))) {
    return res.status(400).json({ error: { message: 'status must be active or archived' } });
  }

  try {
    const opportunities = await findAll({ status: req.query.status });
    return res.json(opportunities);
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  if (!hasObjectBody(req.body)) {
    return res.status(400).json({ error: { message: 'Opportunity data must be an object' } });
  }
  if (!hasOnlyOpportunityFields(req.body)) {
    return res.status(400).json({ error: { message: 'Opportunity data contains unsupported fields' } });
  }

  try {
    const opportunity = await create(req.body);
    return res.status(201).json(opportunity);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: { message: 'Invalid opportunity data' } });
    }
    return next(error);
  }
});

router.put('/:id/recheck', async (req, res, next) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
    return res.status(400).json({ error: { message: 'Invalid opportunity id' } });
  }

  try {
    const opportunity = await recheckOpportunity(
      req.params.id,
      startOfToday().toISOString().slice(0, 10)
    );
    if (!opportunity) {
      return res.status(404).json({ error: { message: 'Opportunity not found' } });
    }
    return res.json(opportunity);
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
    return res.status(400).json({ error: { message: 'Invalid opportunity id' } });
  }
  if (!hasObjectBody(req.body)) {
    return res.status(400).json({ error: { message: 'Opportunity data must be an object' } });
  }
  if (!hasOnlyOpportunityFields(req.body)) {
    return res.status(400).json({ error: { message: 'Opportunity data contains unsupported fields' } });
  }

  try {
    const opportunity = await update(req.params.id, req.body);
    if (!opportunity) {
      return res.status(404).json({ error: { message: 'Opportunity not found' } });
    }
    return res.json(opportunity);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: { message: error.message } });
    }
    return next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
    return res.status(400).json({ error: { message: 'Invalid opportunity id' } });
  }

  try {
    const deleted = await remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: { message: 'Opportunity not found' } });
    }
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
