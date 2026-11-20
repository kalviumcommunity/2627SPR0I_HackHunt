const request = require('supertest');
const Opportunity = require('../models/Opportunity');
const app = require('../app');
const { startOfToday } = require('../utils/dates');
const { connectToDatabase, clearDatabase, disconnectFromDatabase } = require('./database');

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function opportunityData(overrides = {}) {
  return {
    title: 'Student Hackathon',
    organizer: 'Example University',
    officialUrl: 'https://example.edu/hackathon',
    type: 'hackathon',
    mode: 'online',
    eligibilityNotes: 'Open to all students',
    deadline: new Date(startOfToday().getTime() + 3 * DAY_IN_MS),
    lastChecked: startOfToday(),
    ...overrides,
  };
}

describe('public opportunities API', () => {
  beforeAll(connectToDatabase, 180000);
  afterAll(disconnectFromDatabase, 30000);
  beforeEach(clearDatabase);

  test('excludes expired listings and sorts current listings by nearest deadline', async () => {
    await Opportunity.create([
      opportunityData({ title: 'Later', deadline: new Date(startOfToday().getTime() + 5 * DAY_IN_MS) }),
      opportunityData({ title: 'Expired', deadline: new Date(startOfToday().getTime() - DAY_IN_MS) }),
      opportunityData({ title: 'Soon', deadline: new Date(startOfToday().getTime() + DAY_IN_MS) }),
    ]);

    const response = await request(app).get('/api/opportunities');

    expect(response.status).toBe(200);
    expect(response.body.map((item) => item.title)).toEqual(['Soon', 'Later']);
    expect(response.body.map((item) => item.daysLeft)).toEqual([1, 5]);
  });

  test('filters listings by mode', async () => {
    await Opportunity.create([
      opportunityData({ title: 'Online', mode: 'online' }),
      opportunityData({ title: 'Offline', mode: 'offline' }),
      opportunityData({ title: 'Hybrid', mode: 'hybrid' }),
    ]);

    const response = await request(app)
      .get('/api/opportunities')
      .query({ mode: 'online' });

    expect(response.status).toBe(200);
    expect(response.body.map((item) => item.title)).toEqual(['Online']);
  });

  test('applies validated filters and searches safely across public text fields', async () => {
    await Opportunity.create(opportunityData({
      title: 'A+B Workshop',
      deadline: new Date(startOfToday().getTime() + 4 * DAY_IN_MS),
    }));

    const response = await request(app)
      .get('/api/opportunities')
      .query({ mode: 'online', type: 'hackathon', window: '7', q: 'a+b' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      title: 'A+B Workshop',
      isClosingSoon: true,
      isStale: false,
      daysLeft: 4,
    });
  });

  test.each([
    ['mode', 'onsite'],
    ['type', 'conference'],
    ['window', '14'],
    ['extra', 'value'],
  ])('rejects invalid %s query values', async (key, value) => {
    const response = await request(app).get('/api/opportunities').query({ [key]: value });
    expect(response.status).toBe(400);
    expect(response.body.error.message).toBeTruthy();
  });

  test('rejects oversized search terms', async () => {
    const response = await request(app)
      .get('/api/opportunities')
      .query({ q: 'x'.repeat(101) });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toMatch(/100 characters/);
  });

  test('rejects malformed ids and returns a current listing by id', async () => {
    const invalid = await request(app).get('/api/opportunities/not-an-id');
    expect(invalid.status).toBe(400);

    const record = await Opportunity.create(opportunityData({
      deadline: new Date(startOfToday().getTime() + DAY_IN_MS),
    }));
    const response = await request(app).get(`/api/opportunities/${record._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      isClosingSoon: true,
      isStale: false,
      daysLeft: 1,
    });
  });

  test('returns 404 when an opportunity is not current or does not exist', async () => {
    const response = await request(app).get('/api/opportunities/0123456789abcdef01234567');

    expect(response.status).toBe(404);
    expect(response.body.error.message).toBe('Opportunity not found');
  });
});
