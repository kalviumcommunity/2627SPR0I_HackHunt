import { useState } from 'react'
import { Link } from 'react-router-dom'

function CoordinatorLoginPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="eyebrow">COORDINATOR PORTAL</p>
        <h1>Welcome back.</h1>
        <p className="login-copy">Sign in to manage HackHunt opportunities.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" type="text" autoComplete="username" required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
          <button className="login-submit" type="submit">Sign in</button>
        </form>
        {submitted && (
          <p className="login-notice" role="status">
            Coordinator sign-in is not connected yet.
          </p>
        )}
        <Link className="back-link" to="/">← Back to opportunities</Link>
      </section>
    </main>
  )
}

export default CoordinatorLoginPage
