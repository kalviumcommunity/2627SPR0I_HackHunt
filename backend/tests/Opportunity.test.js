const { normalizeOpportunity } = require('../db/opportunityStore');

describe('opportunity validation', () => {
  const validOpportunity = {
    title: 'Campus Hackathon',
    organizer: 'Example University',
    officialUrl: 'https://example.edu/hackathon',
    type: 'hackathon',
    mode: 'online',
    eligibilityNotes: 'Open to all students',
    deadline: new Date('2026-12-01T00:00:00.000Z'),
    lastChecked: new Date(),
  };

  test('accepts a valid opportunity and defaults the status to active', () => {
    const opportunity = normalizeOpportunity(validOpportunity);

    expect(opportunity).toMatchObject({
      title: 'Campus Hackathon',
      organizer: 'Example University',
      officialUrl: 'https://example.edu/hackathon',
      type: 'hackathon',
      mode: 'online',
      deadline: '2026-12-01',
      status: 'active',
    });
  });

  test('requires mandatory fields and validates URL, enums, and lastChecked', () => {
    const { title, organizer, officialUrl, type, mode, eligibilityNotes, deadline, lastChecked } = validOpportunity;
    expect(() => normalizeOpportunity({})).toThrow(expect.objectContaining({ name: 'ValidationError' }));

    for (const invalid of [
      { title: '', organizer, officialUrl, type, mode, eligibilityNotes, deadline, lastChecked },
      { title, organizer: '', officialUrl, type, mode, eligibilityNotes, deadline, lastChecked },
      { ...validOpportunity, officialUrl: 'javascript:alert(1)' },
      { ...validOpportunity, type: 'unlisted' },
      { ...validOpportunity, mode: 'remote' },
      { ...validOpportunity, deadline: 'not-a-date' },
      { ...validOpportunity, lastChecked: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    ]) {
      expect(() => normalizeOpportunity(invalid)).toThrow(expect.objectContaining({ name: 'ValidationError' }));
    }
  });
});
