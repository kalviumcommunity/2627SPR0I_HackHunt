import { useEffect, useState } from 'react';
import OpportunityCard from '../components/OpportunityCard.jsx';

function StudentPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [mode, setMode] = useState('');
  const [type, setType] = useState('');
  const [window, setWindow] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => setSearchQuery(searchInput.trim()), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOpportunities() {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();
        if (mode) params.set('mode', mode);
        if (type) params.set('type', type);
        if (window) params.set('window', window);
        if (searchQuery) params.set('q', searchQuery);
        const query = params.toString();
        const url = query ? `/api/opportunities?${query}` : '/api/opportunities';
        const response = await fetch(url, { signal: controller.signal });
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
  }, [mode, type, window, searchQuery]);

  function clearFilters() {
    setMode('');
    setType('');
    setWindow('');
    setSearchInput('');
    setSearchQuery('');
  }

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
        <div className="listing-controls" role="group" aria-label="Filter opportunities">
          <label className="filter-field">
            <span>Mode</span>
            <select value={mode} onChange={(event) => setMode(event.target.value)}>
              <option value="">All modes</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>
          <label className="filter-field">
            <span>Type</span>
            <select value={type} onChange={(event) => setType(event.target.value)}>
              <option value="">All types</option>
              <option value="hackathon">Hackathon</option>
              <option value="contest">Contest</option>
              <option value="fellowship">Fellowship</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="filter-field">
            <span>Deadline</span>
            <select value={window} onChange={(event) => setWindow(event.target.value)}>
              <option value="">All current</option>
              <option value="7">Next 7 days</option>
              <option value="30">Next 30 days</option>
            </select>
          </label>
          <label className="filter-field search-field">
            <span>Search</span>
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Title, organizer, or eligibility"
            />
          </label>
          <button className="clear-filters" type="button" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
        <p className="sort-note">Nearest deadline first</p>
        {loading && <p className="state-message" role="status">Loading opportunities…</p>}
        {!loading && error && <p className="state-message error-message" role="alert">{error}</p>}
        {!loading && !error && opportunities.length === 0 && (
          <p className="state-message" role="status">No opportunities match these filters.</p>
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
