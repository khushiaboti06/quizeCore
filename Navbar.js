import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-icon">🎯</span>
          <span className="logo-text">QuizCore</span>
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setMenuOpen(false)}>Home</Link>

          {user && (
            <Link to="/quiz" className={`nav-link ${isActive('/quiz')}`} onClick={() => setMenuOpen(false)}>Take Quiz</Link>
          )}

          {user && user.isAdmin && (
            <Link to="/admin" className={`nav-link ${isActive('/admin')}`} onClick={() => setMenuOpen(false)}>Admin Panel</Link>
          )}

          {!user ? (
            <div className="nav-auth">
              <Link to="/login" className={`nav-link ${isActive('/login')}`} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="nav-btn" onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          ) : (
            <div className="nav-auth">
              <span className="nav-user">👤 {user.name}</span>
              <button className="nav-btn nav-btn-outline" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
