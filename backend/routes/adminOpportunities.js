const express = require('express');
const Opportunity = require('../models/Opportunity');
const { requireCoordinator } = require('../middleware/auth');

const router = express.Router();
const validStatuses = ['active', 'archived'];

function hasObjectBody(body) {
  return body !== null && typeof body === 'object' && !Array.isArray(body);
}

router.use(requireCoordinator);

router.get('/', async (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  if (queryKeys.some((key) => key !== 'status')
    || (req.query.status !== undefined && !validStatuses.includes(req.query.status))) {
    return res.status(400).json({ error: { message: 'status must be active or archived' } });
  }

  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const opportunities = await Opportunity.find(filter).sort({ deadline: 1 }).lean();
    return res.json(opportunities);
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  if (!hasObjectBody(req.body)) {
    return res.status(400).json({ error: { message: 'Opportunity data must be an object' } });
  }

  try {
    const opportunity = new Opportunity(req.body);
    await opportunity.validate();
    await opportunity.save();
    return res.status(201).json(opportunity);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ error: { message: error.message } });
    }
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

  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ error: { message: 'Opportunity not found' } });
    }
    const replacement = { ...req.body };
    if (replacement.status === undefined) replacement.status = 'active';
    opportunity.overwrite(replacement);
    await opportunity.validate();
    await opportunity.save();
    return res.json(opportunity);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
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
    const opportunity = await Opportunity.findByIdAndDelete(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ error: { message: 'Opportunity not found' } });
    }
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
