const Opportunity = require('../models/Opportunity');

describe('Opportunity model', () => {
  const validOpportunity = {
    title: 'Campus Hackathon',
    organizer: 'Example University',
    officialUrl: 'https://example.edu/hackathon',
    type: 'hackathon',
    mode: 'online',
    eligibilityNotes: 'Open to all students',
    deadline: new Date('2026-12-01T00:00:00.000Z'),
    lastChecked: new Date()
  };

  test('accepts a valid opportunity and configures timestamps', async () => {
    const opportunity = new Opportunity(validOpportunity);
    await expect(opportunity.validate()).resolves.toBeUndefined();
    expect(opportunity.status).toBe('active');
    expect(Opportunity.schema.options.timestamps).toBe(true);
  });

  test('requires mandatory fields and validates URL, enums, and lastChecked', async () => {
    const missingFields = new Opportunity();
    await expect(missingFields.validate()).rejects.toMatchObject({
      name: 'ValidationError'
    });

    for (const invalid of [
      { officialUrl: 'javascript:alert(1)' },
      { type: 'unlisted' },
      { mode: 'remote' },
      { lastChecked: new Date(Date.now() + 60_000) }
    ]) {
      const opportunity = new Opportunity({ ...validOpportunity, ...invalid });
      await expect(opportunity.validate()).rejects.toMatchObject({
        name: 'ValidationError'
      });
    }
  });
});
