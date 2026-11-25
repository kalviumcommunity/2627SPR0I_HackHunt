import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom';
import CoordinatorLoginPage from './pages/CoordinatorLoginPage.jsx';
import CoordinatorDashboardPage from './pages/CoordinatorDashboardPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import StudentLoginPage from './pages/StudentLoginPage.jsx';
import StudentPage from './pages/StudentPage.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="site-header">
          <Link className="brand" to="/" aria-label="HackHunt home">
            <span className="brand-mark" aria-hidden="true">H</span>
            <span>HackHunt</span>
          </Link>
          <nav aria-label="Main navigation">
            <NavLink to="/" end>Opportunities</NavLink>
            <NavLink to="/login">Sign in</NavLink>
            <NavLink to="/signup">Sign up</NavLink>
            <NavLink to="/admin">Coordinator</NavLink>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<StudentPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<StudentLoginPage />} />
          <Route path="/admin/login" element={<CoordinatorLoginPage />} />
          <Route path="/admin" element={<CoordinatorDashboardPage />} />
        </Routes>
        <footer className="site-footer">Curated opportunities for what you build next.</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
