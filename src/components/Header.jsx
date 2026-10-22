import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HotelContext } from '../context/HotelContext';

export default function Header() {
  const { theme, toggleTheme } = useContext(HotelContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isCurrent = (path) => location.pathname === path;

  return (
    <header className="scrolled">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <h2>Rayyan's Luxury Stay</h2>
            <span>Comfort • Elegance • Luxury</span>
          </Link>
        </div>

        <button
          className="menu-toggle"
          id="menuToggle"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        <nav id="menu" className={menuOpen ? 'active' : ''}>
          <ul>
            <li>
              <Link to="/" className={`nav-link ${isCurrent('/') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <a href="/#rooms" className="nav-link" onClick={() => setMenuOpen(false)}>
                Rooms
              </a>
            </li>
            <li>
              <a href="/#amenities" className="nav-link" onClick={() => setMenuOpen(false)}>
                Amenities
              </a>
            </li>
            <li>
              <Link to="/feedback" className={`nav-link ${isCurrent('/feedback') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                Feedback
              </Link>
            </li>
            <li>
              <Link to="/booking" className="book-btn" onClick={() => setMenuOpen(false)}>
                Book Now
              </Link>
            </li>
            <li>
              <Link to="/admin" className="nav-link admin-link" style={{ color: '#b89146', fontWeight: '600' }} onClick={() => setMenuOpen(false)}>
                <i className="fa-solid fa-user-gear"></i> Admin
              </Link>
            </li>
            <li>
              <button
                id="darkMode"
                className="dark-btn"
                aria-label={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                onClick={toggleTheme}
              >
                <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
