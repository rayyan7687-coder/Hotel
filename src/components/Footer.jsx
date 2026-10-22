import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <h3>Rayyan's Luxury Stay</h3>
          <p>Experience luxury, comfort and unforgettable hospitality.</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Visit Rayyan's Luxury Stay on Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Visit Rayyan's Luxury Stay on Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Visit Rayyan's Luxury Stay on Twitter">
              <i className="fab fa-x-twitter"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="Visit Rayyan's Luxury Stay on LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><a href="/#rooms">Rooms</a></li>
            <li><Link to="/booking">Booking</Link></li>
            <li><Link to="/feedback">Feedback</Link></li>
            <li><Link to="/admin">Admin Console</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contact & Location</h4>
          <p><i className="fa-solid fa-location-dot"></i> Hyderabad, Telangana</p>
          <p><i className="fa-solid fa-phone"></i> +91 9876543210</p>
          <p><i className="fa-solid fa-envelope"></i> info@rayyansluxurystay.com</p>
          <p><i className="fa-solid fa-clock"></i> Open 24 × 7</p>
        </div>
      </div>

      <div className="copyright">
        <p>© 2026 Rayyan's Luxury Stay. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
