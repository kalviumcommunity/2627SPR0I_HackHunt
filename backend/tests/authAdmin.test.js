const request = require('supertest');
const bcrypt = require('bcryptjs');
const Opportunity = require('../models/Opportunity');
const app = require('../app');

describe('coordinator authentication and admin opportunities API', () => {
  let agent;
  let passwordHash;

  beforeAll(async () => {
    passwordHash = await bcrypt.hash('test-password', 4);
  });

  beforeEach(() => {
    process.env.COORDINATOR_USERNAME = 'coordinator';
    process.env.COORDINATOR_PASSWORD_HASH = passwordHash;
    process.env.COORDINATOR_JWT_SECRET = 'test-jwt-secret';
    agent = request.agent(app);
    jest.restoreAllMocks();
  });

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

  test('rejects invalid credentials and protects admin routes from missing or invalid cookies', async () => {
    const badLogin = await request(app)
      .post('/api/login')
      .send({ username: 'coordinator', password: 'wrong-password' });
    expect(badLogin.status).toBe(401);

    const missingCookie = await request(app).get('/api/admin/opportunities');
    expect(missingCookie.status).toBe(401);

    const invalidCookie = await request(app)
      .get('/api/admin/opportunities')
      .set('Cookie', 'coordinatorToken=invalid');
    expect(invalidCookie.status).toBe(401);
  });

  test('admin listing includes non-current records and applies the optional status filter', async () => {
    const records = [{ title: 'Archived opportunity', status: 'archived' }];
    const lean = jest.fn().mockResolvedValue(records);
    const sort = jest.fn().mockReturnValue({ lean });
    jest.spyOn(Opportunity, 'find').mockReturnValue({ sort });
    await agent.post('/api/login')
      .send({ username: 'coordinator', password: 'test-password' });

    const all = await agent.get('/api/admin/opportunities');
    expect(all.status).toBe(200);
    expect(all.body).toEqual(records);
    expect(Opportunity.find).toHaveBeenLastCalledWith({});

    await agent.get('/api/admin/opportunities?status=archived');
    expect(Opportunity.find).toHaveBeenLastCalledWith({ status: 'archived' });
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
      lastChecked: new Date().toISOString(),
    };
    const save = jest.spyOn(Opportunity.prototype, 'save').mockImplementation(function saveDoc() {
      return Promise.resolve(this);
    });
    const record = new Opportunity({ ...valid, _id: '0123456789abcdef01234567' });
    jest.spyOn(Opportunity, 'findById').mockResolvedValue(record);
    jest.spyOn(Opportunity, 'findByIdAndDelete').mockResolvedValue(record);
    await agent.post('/api/login')
      .send({ username: 'coordinator', password: 'test-password' });

    const created = await agent.post('/api/admin/opportunities').send(valid);
    expect(created.status).toBe(201);
    expect(created.body.title).toBe(valid.title);

    const invalid = await agent.post('/api/admin/opportunities')
      .send({ ...valid, officialUrl: 'javascript:alert(1)' });
    expect(invalid.status).toBe(400);

    const incomplete = await agent.put(`/api/admin/opportunities/${record._id}`)
      .send({ title: 'Incomplete replacement' });
    expect(incomplete.status).toBe(400);

    const updated = await agent.put(`/api/admin/opportunities/${record._id}`)
      .send({ ...valid, title: 'Updated Hackathon' });
    expect(updated.status).toBe(200);
    expect(updated.body.title).toBe('Updated Hackathon');
    expect(save).toHaveBeenCalledTimes(2);

    const deleted = await agent.delete(`/api/admin/opportunities/${record._id}`);
    expect(deleted.status).toBe(204);
  });
});
