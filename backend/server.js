require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');

async function start() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI or MONGO_URI must be set');
  }

  await mongoose.connect(mongoUri);
  const port = process.env.PORT || 5000;
  return app.listen(port, () => {
    console.log(`HackHunt API listening on port ${port}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error('Failed to start HackHunt backend:', error);
    process.exitCode = 1;
  });
}

module.exports = { app, start };
