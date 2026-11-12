import { daysUntil, formatDate, isStale } from '../utils/opportunityDates.js'

function OpportunityCard({ opportunity }) {
  const daysLeft = daysUntil(opportunity.deadline)
  const closingSoon = daysLeft >= 0 && daysLeft <= 7

  return (
    <article className="opportunity-card">
      <div className="card-topline">
        <div className="category-tags">
          <span className="tag">{opportunity.type}</span>
          <span className="tag">{opportunity.mode}</span>
        </div>
        <div className="status-badges" aria-label="Opportunity status">
          {closingSoon && <span className="badge badge-closing">Closing soon</span>}
          {isStale(opportunity.lastChecked) && <span className="badge badge-stale">Stale</span>}
        </div>
      </div>

      <div className="card-heading">
        <h2>{opportunity.title}</h2>
        <p className="organizer">{opportunity.organizer}</p>
      </div>

      <p className="eligibility">{opportunity.eligibilityNotes}</p>

      <dl className="card-details">
        <div>
          <dt>Deadline</dt>
          <dd>{formatDate(opportunity.deadline)}</dd>
        </div>
        <div>
          <dt>Days left</dt>
          <dd>{daysLeft === 0 ? 'Today' : `${daysLeft} days`}</dd>
        </div>
        <div>
          <dt>Last checked</dt>
          <dd>{formatDate(opportunity.lastChecked)}</dd>
        </div>
      </dl>

      <a
        className="official-link"
        href={opportunity.officialUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Official link <span aria-hidden="true">↗</span>
      </a>
    </article>
  )
}

export default OpportunityCard
