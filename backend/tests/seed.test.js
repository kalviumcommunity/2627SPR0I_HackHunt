jest.mock('../db/opportunityStore', () => ({
  replaceAll: jest.fn(),
}));

jest.mock('../db/pool', () => ({
  closePool: jest.fn(),
}));

const { replaceAll } = require('../db/opportunityStore');
const { closePool } = require('../db/pool');
const { buildSeedOpportunities, seed } = require('../seed');

describe('opportunity seed script', () => {
  const now = new Date('2026-11-12T14:00:00.000Z');

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.DATABASE_URL = 'postgresql://localhost/hackhunt_test';
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

  test('replaces the stored listings and closes the PostgreSQL pool', async () => {
    const inserted = buildSeedOpportunities(now);
    replaceAll.mockResolvedValue(inserted);

    const result = await seed(now);

    expect(replaceAll).toHaveBeenCalledWith(buildSeedOpportunities(now));
    expect(result).toHaveLength(8);
    expect(closePool).toHaveBeenCalledTimes(1);
  });
});
