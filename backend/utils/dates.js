const DAY_IN_MS = 24 * 60 * 60 * 1000;

function startOfToday(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function isCurrent(opportunity, now = new Date()) {
  return opportunity.status === 'active'
    && startOfToday(new Date(opportunity.deadline)) >= startOfToday(now);
}

function getDaysLeft(deadline, now = new Date()) {
  const deadlineDay = startOfToday(new Date(deadline));
  const today = startOfToday(now);
  return Math.floor((deadlineDay.getTime() - today.getTime()) / DAY_IN_MS);
}

function isClosingSoon(deadline, now = new Date()) {
  const daysLeft = getDaysLeft(deadline, now);
  return daysLeft >= 0 && daysLeft <= 7;
}

function isStale(lastChecked, now = new Date()) {
  return now.getTime() - new Date(lastChecked).getTime() > 7 * DAY_IN_MS;
}

module.exports = { startOfToday, isCurrent, getDaysLeft, isClosingSoon, isStale };
