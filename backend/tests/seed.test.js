jest.mock('mongoose', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock('../models/Opportunity', () => ({
  deleteMany: jest.fn(),
  insertMany: jest.fn(),
}));

const mongoose = require('mongoose');
const Opportunity = require('../models/Opportunity');
const { buildSeedOpportunities, seed } = require('../seed');

describe('opportunity seed script', () => {
  const now = new Date('2026-11-12T14:00:00.000Z');

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.MONGODB_URI = 'mongodb://localhost/hackhunt-test';
  });

  test('builds eight valid sample opportunities with an expired and a stale listing', () => {
    const opportunities = buildSeedOpportunities(now);

    expect(opportunities).toHaveLength(8);
    expect(opportunities.every((item) => item.officialUrl.startsWith('https://example.com/'))).toBe(true);
    expect(opportunities.every((item) => item.title && item.organizer && item.eligibilityNotes)).toBe(true);
    expect(opportunities.every((item) => item.status === 'active')).toBe(true);
    expect(opportunities.filter((item) => item.deadline < new Date('2026-11-12T00:00:00.000Z')))
      .toHaveLength(1);
    expect(opportunities.filter((item) => item.lastChecked < new Date('2026-11-05T00:00:00.000Z')))
      .toHaveLength(1);
    expect(opportunities.every((item) => item.lastChecked <= new Date('2026-11-12T00:00:00.000Z')))
      .toBe(true);
  });

  test('clears the collection before inserting the samples and closes the connection', async () => {
    const inserted = buildSeedOpportunities(now);
    Opportunity.insertMany.mockResolvedValue(inserted);

    const result = await seed(now);

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI);
    expect(Opportunity.deleteMany).toHaveBeenCalledWith({});
    expect(Opportunity.insertMany).toHaveBeenCalledWith(buildSeedOpportunities(now));
    expect(result).toHaveLength(8);
    expect(mongoose.disconnect).toHaveBeenCalledTimes(1);
  });
});
