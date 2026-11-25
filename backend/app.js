const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const adminOpportunityRoutes = require('./routes/adminOpportunities');
const opportunityRoutes = require('./routes/opportunities');
const { PersistenceError } = require('./db/recheckStore');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.use('/api', authRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/admin/opportunities', adminOpportunityRoutes);

app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found' } });
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { message: 'Invalid JSON body' } });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: { message: 'Request body too large' } });
  }

  if (err instanceof PersistenceError) {
    console.error(err);
    return res.status(503).json({ error: { message: 'Could not save opportunity re-check' } });
  }

  console.error(err);
  if (
    ['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'EHOSTUNREACH'].includes(err.code)
    || (typeof err.code === 'string' && (err.code.startsWith('08') || err.code.startsWith('53')))
    || err.code === '57P01'
  ) {
    return res.status(503).json({ error: { message: 'Database is temporarily unavailable' } });
  }
  return res.status(500).json({ error: { message: 'Internal server error' } });
});

module.exports = app;
