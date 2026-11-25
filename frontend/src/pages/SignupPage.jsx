import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function validate() {
    const nextErrors = {};
    if (!fullName.trim()) nextErrors.fullName = 'Enter your full name.';
    else if (fullName.trim().length > 100) nextErrors.fullName = 'Name must be 100 characters or fewer.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (password.length < 8) nextErrors.password = 'Use at least 8 characters.';
    else if (new TextEncoder().encode(password).length > 72) {
      nextErrors.password = 'Password must be 72 bytes or fewer.';
    }
    if (password !== confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });

      if (!response.ok) {
        let message = response.status === 409
          ? 'An account with this email already exists.'
          : 'Unable to create your account. Please try again.';
        try {
          const body = await response.json();
          if (typeof body.error?.message === 'string') message = body.error.message;
        } catch {
          // Keep the readable fallback for non-JSON responses.
        }
        setServerError(message);
        return;
      }

      navigate('/login?registered=1', { replace: true });
    } catch {
      setServerError('Unable to reach HackHunt. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card signup-card">
        <p className="eyebrow">JOIN HACKHUNT</p>
        <h1>Create your account.</h1>
        <p className="login-copy">Save time finding opportunities built for you.</p>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="signup-name">Full name</label>
          <input
            id="signup-name"
            name="fullName"
            type="text"
            autoComplete="name"
            maxLength={100}
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'signup-name-error' : undefined}
            required
          />
          {errors.fullName && <span className="field-error" id="signup-name-error">{errors.fullName}</span>}

          <label htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'signup-email-error' : undefined}
            required
          />
          {errors.email && <span className="field-error" id="signup-email-error">{errors.email}</span>}

          <label htmlFor="signup-password">Password</label>
          <div className="password-input-wrap">
            <input
              id="signup-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              maxLength={72}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'signup-password-error' : 'signup-password-help'}
              required
            />
            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password
            ? <span className="field-error" id="signup-password-error">{errors.password}</span>
            : <span className="field-hint" id="signup-password-help">At least 8 characters.</span>}

          <label htmlFor="signup-confirm-password">Confirm password</label>
          <div className="password-input-wrap">
            <input
              id="signup-confirm-password"
              name="confirmPassword"
              type={showConfirmation ? 'text' : 'password'}
              autoComplete="new-password"
              maxLength={72}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? 'signup-confirm-error' : undefined}
              required
            />
            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowConfirmation(!showConfirmation)}
              aria-label={showConfirmation ? 'Hide confirmation password' : 'Show confirmation password'}
            >
              {showConfirmation ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="field-error" id="signup-confirm-error">{errors.confirmPassword}</span>
          )}

          {serverError && <p className="login-error" role="alert">{serverError}</p>}
          <button className="login-submit" type="submit" disabled={submitting}>
            {submitting && <span className="loading-spinner" aria-hidden="true" />}
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

export default SignupPage;
