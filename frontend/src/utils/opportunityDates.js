const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000

function utcDayStart(date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

export function daysUntil(deadline, now = new Date()) {
  return Math.round((utcDayStart(new Date(deadline)) - utcDayStart(now)) / DAY_IN_MILLISECONDS)
}

export function isStale(lastChecked, now = new Date()) {
  return now.getTime() - new Date(lastChecked).getTime() > 7 * DAY_IN_MILLISECONDS
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}
