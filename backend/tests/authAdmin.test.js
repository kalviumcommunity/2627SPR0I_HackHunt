const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Opportunity = require('../models/Opportunity');
const app = require('../app');
const { startOfToday } = require('../utils/dates');
const { connectToDatabase, clearDatabase, disconnectFromDatabase } = require('./database');

describe('coordinator authentication and admin opportunities API', () => {
  let agent;
  let passwordHash;

  beforeAll(async () => {
    passwordHash = await bcrypt.hash('test-password', 4);
  });

  beforeEach(() => {
    return clearDatabase().then(() => {
      process.env.COORDINATOR_USERNAME = 'coordinator';
      process.env.COORDINATOR_PASSWORD_HASH = passwordHash;
      process.env.JWT_SECRET = 'test-jwt-secret';
      agent = request.agent(app);
    });
  });

  beforeAll(connectToDatabase, 180000);
  afterAll(disconnectFromDatabase, 30000);

  test('login sets an httpOnly, sameSite cookie and logout clears it', async () => {
    const login = await agent
      .post('/api/login')
      .send({ username: 'coordinator', password: 'test-password' });

    expect(login.status).toBe(200);
    expect(login.headers['set-cookie'][0]).toMatch(/HttpOnly/i);
    expect(login.headers['set-cookie'][0]).toMatch(/SameSite=Strict/i);

    const logout = await agent.post('/api/logout');
    expect(logout.status).toBe(200);
    expect(logout.headers['set-cookie'][0]).toMatch(/coordinatorToken=;/);
  });

  test('marks the authentication cookie secure in production', async () => {
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    try {
      const login = await request(app)
        .post('/api/login')
        .send({ username: 'coordinator', password: 'test-password' });

      expect(login.status).toBe(200);
      expect(login.headers['set-cookie'][0]).toMatch(/; Secure/i);
    } finally {
      if (previousNodeEnv === undefined) {
        delete process.env.NODE_ENV;
      } else {
        process.env.NODE_ENV = previousNodeEnv;
      }
    }
  });

  test('rejects invalid credentials and protects admin routes from missing or invalid cookies', async () => {
    const invalidShape = await request(app)
      .post('/api/login')
      .send([{ username: 'coordinator', password: 'test-password' }]);
    expect(invalidShape.status).toBe(400);

    const unknownField = await request(app)
      .post('/api/login')
      .send({ username: 'coordinator', password: 'test-password', role: 'admin' });
    expect(unknownField.status).toBe(400);

    const oversizedPassword = await request(app)
      .post('/api/login')
      .send({ username: 'coordinator', password: 'x'.repeat(1025) });
    expect(oversizedPassword.status).toBe(400);

    const badLogin = await request(app)
      .post('/api/login')
      .send({ username: 'coordinator', password: 'wrong-password' });
    expect(badLogin.status).toBe(401);

    const missingCookie = await request(app).get('/api/admin/opportunities');
    expect(missingCookie.status).toBe(401);

    const unauthorizedCreate = await request(app)
      .post('/api/admin/opportunities')
      .send({});
    expect(unauthorizedCreate.status).toBe(401);

    const unauthorizedUpdate = await request(app)
      .put('/api/admin/opportunities/0123456789abcdef01234567')
      .send({});
    expect(unauthorizedUpdate.status).toBe(401);

    const unauthorizedDelete = await request(app)
      .delete('/api/admin/opportunities/0123456789abcdef01234567');
    expect(unauthorizedDelete.status).toBe(401);

    const unauthorizedRecheck = await request(app)
      .put('/api/admin/opportunities/0123456789abcdef01234567/recheck');
    expect(unauthorizedRecheck.status).toBe(401);

    const invalidCookie = await request(app)
      .get('/api/admin/opportunities')
      .set('Cookie', 'coordinatorToken=invalid');
    expect(invalidCookie.status).toBe(401);

    const wrongAlgorithm = jwt.sign(
      { username: 'coordinator' },
      process.env.JWT_SECRET,
      { algorithm: 'HS384' }
    );
    const rejectedAlgorithm = await request(app)
      .get('/api/admin/opportunities')
      .set('Cookie', `coordinatorToken=${wrongAlgorithm}`);
    expect(rejectedAlgorithm.status).toBe(401);
  });

  test('admin listing includes non-current records and applies the optional status filter', async () => {
    const records = await Opportunity.create([{
      title: 'Archived opportunity',
      organizer: 'Example University',
      officialUrl: 'https://example.edu/archived',
      type: 'hackathon',
      mode: 'online',
      eligibilityNotes: 'Open to students',
      deadline: new Date('2020-01-01'),
      lastChecked: startOfToday(),
      status: 'archived',
    }]);
    await agent.post('/api/login')
      .send({ username: 'coordinator', password: 'test-password' });

    const all = await agent.get('/api/admin/opportunities');
    expect(all.status).toBe(200);
    expect(all.body).toHaveLength(1);
    expect(all.body[0]._id).toBe(records[0]._id.toString());

    const archived = await agent.get('/api/admin/opportunities?status=archived');
    expect(archived.body).toHaveLength(1);
    expect(archived.body[0].status).toBe('archived');
  });

  test('creates and updates only model-valid opportunities and supports deletion', async () => {
    const valid = {
      title: 'Student Hackathon',
      organizer: 'Example University',
      officialUrl: 'https://example.edu/hackathon',
      type: 'hackathon',
      mode: 'online',
      eligibilityNotes: 'Open to students',
      deadline: '2027-01-01',
      lastChecked: startOfToday().toISOString(),
    };
    await agent.post('/api/login')
      .send({ username: 'coordinator', password: 'test-password' });

    const created = await agent.post('/api/admin/opportunities').send(valid);
    expect(created.status).toBe(201);
    expect(created.body.title).toBe(valid.title);

    const invalid = await agent.post('/api/admin/opportunities')
      .send({ ...valid, officialUrl: 'javascript:alert(1)' });
    expect(invalid.status).toBe(400);
    expect(invalid.body.error.message).toBe('Invalid opportunity data');
    expect(JSON.stringify(invalid.body)).not.toMatch(/ValidationError|stack/i);

    const unexpectedField = await agent.post('/api/admin/opportunities')
      .send({ ...valid, createdAt: '2020-01-01' });
    expect(unexpectedField.status).toBe(400);
    expect(unexpectedField.body.error.message).toMatch(/unsupported fields/);

    const missingField = await agent.post('/api/admin/opportunities')
      .send({
        title: valid.title,
        organizer: valid.organizer,
        officialUrl: valid.officialUrl,
        type: valid.type,
        mode: valid.mode,
        deadline: valid.deadline,
        lastChecked: valid.lastChecked,
      });
    expect(missingField.status).toBe(400);

    const futureLastChecked = await agent.post('/api/admin/opportunities')
      .send({ ...valid, lastChecked: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() });
    expect(futureLastChecked.status).toBe(400);

    const incomplete = await agent.put(`/api/admin/opportunities/${created.body._id}`)
      .send({ title: 'Incomplete replacement' });
    expect(incomplete.status).toBe(400);

    const updated = await agent.put(`/api/admin/opportunities/${created.body._id}`)
      .send({ ...valid, title: 'Updated Hackathon', status: 'archived' });
    expect(updated.status).toBe(200);
    expect(updated.body.title).toBe('Updated Hackathon');
    expect(updated.body.status).toBe('archived');

    const restored = await agent.put(`/api/admin/opportunities/${created.body._id}`)
      .send({ ...valid, title: 'Updated Hackathon', status: 'active' });
    expect(restored.status).toBe(200);
    expect(restored.body.status).toBe('active');

    const deleted = await agent.delete(`/api/admin/opportunities/${created.body._id}`);
    expect(deleted.status).toBe(204);
  });

  test('rechecks an opportunity by setting lastChecked to the start of today', async () => {
    const record = await Opportunity.create({
      title: 'Student Hackathon',
      organizer: 'Example University',
      officialUrl: 'https://example.edu/hackathon',
      type: 'hackathon',
      mode: 'online',
      eligibilityNotes: 'Open to students',
      deadline: '2027-01-01',
      lastChecked: '2026-11-01',
    });
    await agent.post('/api/login')
      .send({ username: 'coordinator', password: 'test-password' });

    const response = await agent.put(`/api/admin/opportunities/${record._id}/recheck`);

    expect(response.status).toBe(200);
    expect(response.body.lastChecked).toBe(startOfToday().toISOString());
    const updated = await Opportunity.findById(record._id);
    expect(updated.lastChecked.toISOString()).toBe(startOfToday().toISOString());
  });
});
