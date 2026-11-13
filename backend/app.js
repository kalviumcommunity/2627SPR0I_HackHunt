const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const adminOpportunityRoutes = require('./routes/adminOpportunities');
const opportunityRoutes = require('./routes/opportunities');

const app = express();

app.use(helmet());
app.use(express.json());
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
  console.error(err);
  return res.status(500).json({ error: { message: 'Internal server error' } });
});

module.exports = app;
