const request = require('supertest');
const { app } = require('../server');

describe('GET /health', () => {
  test('returns the healthy status', async () => {
    await request(app)
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });
});
