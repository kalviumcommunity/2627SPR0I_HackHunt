const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

function utcDayStart(date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function isCurrent(opportunity, now = new Date()) {
  return opportunity.status === 'active'
    && utcDayStart(new Date(opportunity.deadline)) >= utcDayStart(now);
}

function isClosingSoon(deadline, now = new Date()) {
  const daysRemaining = (utcDayStart(new Date(deadline)) - utcDayStart(now)) / DAY_IN_MILLISECONDS;
  return daysRemaining >= 0 && daysRemaining <= 7;
}

function isStale(lastChecked, now = new Date()) {
  return now.getTime() - new Date(lastChecked).getTime() > 7 * DAY_IN_MILLISECONDS;
}

module.exports = { isCurrent, isClosingSoon, isStale };
