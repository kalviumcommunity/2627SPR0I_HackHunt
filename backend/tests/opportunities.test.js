const request = require('supertest');
const Opportunity = require('../models/Opportunity');
const app = require('../app');

jest.mock('../models/Opportunity', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
}));

describe('public opportunities API', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-11-12T12:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns current listings sorted by deadline with computed fields', async () => {
    const records = [
      { title: 'Soon', deadline: new Date('2026-11-15'), lastChecked: new Date('2026-11-04') },
      { title: 'Later', deadline: new Date('2026-11-30'), lastChecked: new Date('2026-11-11') },
    ];
    const lean = jest.fn().mockResolvedValue(records);
    const sort = jest.fn().mockReturnValue({ lean });
    Opportunity.find.mockReturnValue({ sort });

    const response = await request(app).get('/api/opportunities');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        ...records[0],
        deadline: records[0].deadline.toISOString(),
        lastChecked: records[0].lastChecked.toISOString(),
        isClosingSoon: true,
        isStale: true,
        daysLeft: 3,
      },
      {
        ...records[1],
        deadline: records[1].deadline.toISOString(),
        lastChecked: records[1].lastChecked.toISOString(),
        isClosingSoon: false,
        isStale: false,
        daysLeft: 18,
      },
    ]);
    expect(sort).toHaveBeenCalledWith({ deadline: 1 });
    expect(Opportunity.find).toHaveBeenCalledWith({
      status: 'active',
      deadline: { $gte: new Date('2026-11-12T00:00:00.000Z') },
    });
  });

  test('applies validated filters and searches safely across public text fields', async () => {
    const lean = jest.fn().mockResolvedValue([]);
    Opportunity.find.mockReturnValue({ sort: jest.fn().mockReturnValue({ lean }) });

    const response = await request(app)
      .get('/api/opportunities')
      .query({ mode: 'online', type: 'hackathon', window: '7', q: 'a+b' });

    expect(response.status).toBe(200);
    expect(Opportunity.find).toHaveBeenCalledWith({
      status: 'active',
      mode: 'online',
      type: 'hackathon',
      deadline: {
        $gte: new Date('2026-11-12T00:00:00.000Z'),
        $lte: new Date('2026-11-19T00:00:00.000Z'),
      },
      $or: [
        { title: /a\+b/i },
        { organizer: /a\+b/i },
        { eligibilityNotes: /a\+b/i },
      ],
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
    expect(Opportunity.find).not.toHaveBeenCalled();
  });

  test('rejects malformed ids and returns a current listing by id', async () => {
    const invalid = await request(app).get('/api/opportunities/not-an-id');
    expect(invalid.status).toBe(400);
    expect(Opportunity.findOne).not.toHaveBeenCalled();

    const record = {
      _id: '0123456789abcdef01234567',
      deadline: new Date('2026-11-13'),
      lastChecked: new Date('2026-11-12'),
    };
    Opportunity.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(record) });
    const response = await request(app).get(`/api/opportunities/${record._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      isClosingSoon: true,
      isStale: false,
      daysLeft: 1,
    });
  });

  test('returns 404 when an opportunity is not current or does not exist', async () => {
    Opportunity.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    const response = await request(app).get('/api/opportunities/0123456789abcdef01234567');

    expect(response.status).toBe(404);
    expect(response.body.error.message).toBe('Opportunity not found');
  });
});
