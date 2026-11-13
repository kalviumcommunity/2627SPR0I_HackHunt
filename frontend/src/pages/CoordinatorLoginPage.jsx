import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function CoordinatorLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        let message = response.status === 401
          ? 'Incorrect username or password.'
          : 'Sign-in failed. Please try again.';
        try {
          const body = await response.json();
          if (response.status !== 401 && typeof body.error?.message === 'string') {
            message = body.error.message;
          }
        } catch {
          // Keep the fallback for non-JSON error responses.
        }
        setError(message);
        return;
      }

      navigate('/admin', { replace: true });
    } catch {
      setError('Unable to sign in right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="eyebrow">COORDINATOR PORTAL</p>
        <h1>Welcome back.</h1>
        <p className="login-copy">Sign in to manage HackHunt opportunities.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button className="login-submit" type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        {error && <p className="login-error" role="alert">{error}</p>}
        <Link className="back-link" to="/">← Back to opportunities</Link>
      </section>
    </main>
  )
}

export default CoordinatorLoginPage;
