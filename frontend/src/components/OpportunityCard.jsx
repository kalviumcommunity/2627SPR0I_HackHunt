function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function formatLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function OpportunityCard({ opportunity }) {
  const {
    title,
    organizer,
    officialUrl,
    type,
    mode,
    eligibilityNotes,
    deadline,
    lastChecked,
    isClosingSoon,
    isStale,
    daysLeft,
  } = opportunity;

  return (
    <article className="opportunity-card">
      <div className="card-topline">
        <span className="type-label">{formatLabel(type)}</span>
        <span className="mode-label">{formatLabel(mode)}</span>
      </div>
      <h3>{title}</h3>
      <p className="organizer">by {organizer}</p>
      <p className="eligibility">{eligibilityNotes}</p>

      <div className="deadline-row">
        <div>
          <span className="detail-label">Deadline</span>
          <strong>{formatDate(deadline)}</strong>
        </div>
        <span className="days-left">
          {daysLeft === 0 ? 'Today' : `${daysLeft} days left`}
        </span>
      </div>

      {(isClosingSoon || isStale) && (
        <div className="badges" aria-label="Opportunity status">
          {isClosingSoon && <span className="badge badge-closing">Closing soon</span>}
          {isStale && <span className="badge badge-stale">Details may be stale</span>}
        </div>
      )}

      <div className="card-bottom">
        <span className="checked-date">Checked {formatDate(lastChecked)}</span>
        <a href={officialUrl} target="_blank" rel="noreferrer">
          View opportunity <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}
