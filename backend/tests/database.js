const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

async function connectToDatabase() {
  const testMongoUri = process.env.TEST_MONGODB_URI;
  if (testMongoUri) {
    const databaseName = new URL(testMongoUri).pathname.replace(/^\/+/, '');
    if (!databaseName.endsWith('_test')) {
      throw new Error('TEST_MONGODB_URI database name must end in _test');
    }
    await mongoose.connect(testMongoUri);
    return;
  }

  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
}

async function clearDatabase() {
  const collections = Object.values(mongoose.connection.collections);
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
}

async function disconnectFromDatabase() {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
}

module.exports = { connectToDatabase, clearDatabase, disconnectFromDatabase };
