import { useEffect, useState } from 'react';
import OpportunityCard from '../components/OpportunityCard.jsx';

function StudentPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadOpportunities() {
      try {
        const response = await fetch('/api/opportunities', { signal: controller.signal });
        if (!response.ok) {
          let message = 'Could not load opportunities. Please try again.';
          try {
            const body = await response.json();
            if (typeof body.error?.message === 'string') {
              message = body.error.message;
            }
          } catch {
            // Use the fallback for non-JSON server errors.
          }
          throw new Error(message);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('The server returned an invalid opportunities response.');
        }
        setOpportunities(data);
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Could not load opportunities. Please try again.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadOpportunities();
    return () => controller.abort();
  }, []);

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
            <h2 id="listing-title">Current opportunities</h2>
          </div>
          <span className="listing-count" aria-live="polite">
            {loading ? 'Loading…' : `${opportunities.length} ${opportunities.length === 1 ? 'result' : 'results'}`}
          </span>
        </div>
        {loading && <p className="state-message" role="status">Loading opportunities…</p>}
        {!loading && error && <p className="state-message error-message" role="alert">{error}</p>}
        {!loading && !error && opportunities.length === 0 && (
          <p className="state-message" role="status">No current opportunities yet</p>
        )}
        {!loading && !error && opportunities.length > 0 && (
          <div className="opportunity-grid">
            {opportunities.map((opportunity) => (
              <OpportunityCard key={opportunity._id} opportunity={opportunity} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default StudentPage;
