import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom';
import CoordinatorLoginPage from './pages/CoordinatorLoginPage.jsx';
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
            <NavLink to="/admin/login">Coordinator</NavLink>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<StudentPage />} />
          <Route path="/admin/login" element={<CoordinatorLoginPage />} />
        </Routes>
        <footer className="site-footer">Curated opportunities for what you build next.</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
