import OpportunityCard from '../components/OpportunityCard.jsx'
import { opportunities } from '../data/opportunities.js'

function StudentPage() {
  return (
    <main>
      <section className="page-intro">
        <p className="eyebrow">YOUR NEXT BIG THING STARTS HERE</p>
        <h1>Find your next opportunity.</h1>
        <p className="intro-copy">
          A hand-picked collection of hackathons, contests and programs for student builders.
        </p>
      </section>

      <section className="listing-section" aria-labelledby="listing-title">
        <div className="listing-heading">
          <div>
            <p className="eyebrow">THE OPPORTUNITY BOARD</p>
            <h2 id="listing-title">Open opportunities</h2>
          </div>
          <span className="listing-count">{opportunities.length} listings</span>
        </div>
        <div className="opportunity-grid">
          {opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default StudentPage
