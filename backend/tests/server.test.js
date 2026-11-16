const request = require('supertest');
const { app } = require('../server');

describe('GET /health', () => {
  test('returns the healthy status', async () => {
    await request(app)
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  test('returns generic client errors for malformed and oversized JSON without stack traces', async () => {
    const malformed = await request(app)
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send('{"username":');

    expect(malformed.status).toBe(400);
    expect(malformed.body.error.message).toBe('Invalid JSON body');
    expect(JSON.stringify(malformed.body)).not.toMatch(/SyntaxError|stack/i);

    const oversized = await request(app)
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ value: 'x'.repeat(101 * 1024) }));

    expect(oversized.status).toBe(413);
    expect(oversized.body.error.message).toBe('Request body too large');
    expect(JSON.stringify(oversized.body)).not.toMatch(/stack|PayloadTooLargeError/i);
  });

  test('does not grant cross-origin access to untrusted origins', async () => {
    const response = await request(app)
      .get('/health')
      .set('Origin', 'https://untrusted.example');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });
});
