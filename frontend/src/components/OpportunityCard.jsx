import { formatDate } from '../utils/opportunityDates.js';

function OpportunityCard({ opportunity }) {
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
        <div className="category-tags">
          <span className="tag">{type}</span>
          <span className="tag">{mode}</span>
        </div>
        <div className="status-badges" aria-label="Opportunity status">
          {isClosingSoon && <span className="badge badge-closing">Closing soon</span>}
          {isStale && <span className="badge badge-stale">Details may be stale</span>}
        </div>
      </div>

      <div className="card-heading">
        <h2>{title}</h2>
        <p className="organizer">by {organizer}</p>
      </div>

      <p className="eligibility">{eligibilityNotes}</p>

      <dl className="card-details">
        <div>
          <dt>Deadline</dt>
          <dd>{formatDate(deadline)}</dd>
        </div>
        <div>
          <dt>Days left</dt>
          <dd>{daysLeft === 0 ? 'Today' : `${daysLeft} days`}</dd>
        </div>
        <div>
          <dt>Last checked</dt>
          <dd>{formatDate(lastChecked)}</dd>
        </div>
      </dl>

      <a
        className="official-link"
        href={officialUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Official link <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}

export default OpportunityCard;
