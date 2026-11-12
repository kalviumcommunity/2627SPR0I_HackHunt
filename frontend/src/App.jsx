import { useEffect, useState } from 'react';
import OpportunityCard from './components/OpportunityCard.jsx';

export default function App() {
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
            // Keep the readable fallback when the server response is not JSON.
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
    <main className="page-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="HackHunt home">
          <span className="brand-mark" aria-hidden="true">H</span>
          <span>HackHunt</span>
        </a>
        <span className="header-note">Opportunities for curious minds</span>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">THE OPPORTUNITY BOARD</p>
        <h1 id="page-title">Find your next big idea.</h1>
        <p className="intro-copy">
          Handpicked hackathons, challenges, and fellowships to help you build what’s next.
        </p>
      </section>

      <section className="listings" aria-labelledby="listings-title">
        <div className="listings-heading">
          <div>
            <p className="eyebrow">WHAT’S OPEN</p>
            <h2 id="listings-title">Current opportunities</h2>
          </div>
          <span className="result-count" aria-live="polite">
            {loading ? 'Loading…' : `${opportunities.length} ${opportunities.length === 1 ? 'result' : 'results'}`}
          </span>
        </div>

        {loading && (
          <p className="state-message" role="status">Loading opportunities…</p>
        )}

        {!loading && error && (
          <p className="state-message error-message" role="alert">{error}</p>
        )}

        {!loading && !error && opportunities.length === 0 && (
          <p className="state-message" role="status">No current opportunities yet</p>
        )}

        {!loading && !error && opportunities.length > 0 && (
          <div className="opportunity-grid">
            {opportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity._id}
                opportunity={opportunity}
              />
            ))}
          </div>
        )}
      </section>

      <footer className="site-footer">
        <span>Curated opportunities, checked by people.</span>
        <span>Make your next move count.</span>
      </footer>
    </main>
  );
}
