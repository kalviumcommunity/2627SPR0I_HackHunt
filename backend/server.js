require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

async function start() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be set');
  }

  await mongoose.connect(process.env.MONGO_URI);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`HackHunt backend listening on port ${port}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error('Failed to start HackHunt backend:', error);
    process.exitCode = 1;
  });
}

module.exports = { app, start };
