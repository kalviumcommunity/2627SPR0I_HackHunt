import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

function StudentLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/student/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let message = response.status === 401
          ? 'Incorrect email or password.'
          : 'Sign-in failed. Please try again.';
        try {
          const body = await response.json();
          if (typeof body.error?.message === 'string') message = body.error.message;
        } catch {
          // Keep the fallback for non-JSON error responses.
        }
        setError(message);
        return;
      }

      navigate('/', { replace: true });
    } catch {
      setError('Unable to reach HackHunt. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="eyebrow">STUDENT SIGN IN</p>
        <h1>Welcome back.</h1>
        <p className="login-copy">Sign in to continue exploring opportunities.</p>
        {searchParams.get('registered') === '1' && (
          <p className="auth-success" role="status">Your account is ready. Sign in to continue.</p>
        )}
        <form onSubmit={handleSubmit}>
          <label htmlFor="student-email">Email address</label>
          <input
            id="student-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <label htmlFor="student-password">Password</label>
          <input
            id="student-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="login-submit" type="submit" disabled={submitting}>
            {submitting && <span className="loading-spinner" aria-hidden="true" />}
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="auth-switch">
          New to HackHunt? <Link to="/signup">Create an account</Link>
        </p>
        <Link className="back-link" to="/">← Back to opportunities</Link>
      </section>
    </main>
  );
}

export default StudentLoginPage;
