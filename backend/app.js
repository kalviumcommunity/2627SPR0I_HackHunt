const express = require('express');
const opportunityRoutes = require('./routes/opportunities');

const app = express();

app.use(express.json());
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.use('/api/opportunities', opportunityRoutes);

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
