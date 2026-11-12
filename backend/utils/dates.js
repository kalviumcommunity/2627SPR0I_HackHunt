const DAY_IN_MS = 24 * 60 * 60 * 1000;

function startOfToday(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
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
  const daysSinceChecked = Math.floor(
    (startOfToday(now).getTime() - startOfToday(new Date(lastChecked)).getTime()) / DAY_IN_MS
  );
  return daysSinceChecked > 7;
}

module.exports = { startOfToday, getDaysLeft, isClosingSoon, isStale };
