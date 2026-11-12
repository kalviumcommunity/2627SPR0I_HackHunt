const { isClosingSoon, isCurrent, isStale } = require('../utils/dates');

describe('opportunity date utilities', () => {
  const now = new Date('2026-11-12T12:00:00.000Z');

  test('isCurrent includes deadlines today and requires active status', () => {
    expect(isCurrent({ deadline: '2026-11-12', status: 'active' }, now)).toBe(true);
    expect(isCurrent({ deadline: '2026-11-11', status: 'active' }, now)).toBe(false);
    expect(isCurrent({ deadline: '2026-11-13', status: 'archived' }, now)).toBe(false);
  });

  test('isClosingSoon includes deadlines from today through seven days away', () => {
    expect(isClosingSoon('2026-11-12', now)).toBe(true);
    expect(isClosingSoon('2026-11-19', now)).toBe(true);
    expect(isClosingSoon('2026-11-20', now)).toBe(false);
    expect(isClosingSoon('2026-11-11', now)).toBe(false);
  });

  test('isStale requires more than seven elapsed days', () => {
    expect(isStale('2026-11-05T12:00:00.000Z', now)).toBe(false);
    expect(isStale('2026-11-05T11:59:59.999Z', now)).toBe(true);
  });
});
