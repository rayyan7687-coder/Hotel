import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.status === 'success') {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', data.username);
        navigate('/admin');
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      setError('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page" style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="booking-card" style={{ padding: '35px', boxShadow: '0 10px 40px rgba(0,0,0,0.12)' }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <i className="fa-solid fa-user-shield" style={{ fontSize: '3rem', color: '#b89146', marginBottom: '10px' }}></i>
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Admin Console</h1>
            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '5px' }}>Management Portal Login</p>
          </div>

          {error && (
            <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '6px' }}></i>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="booking-form">
            <div className="form-group full">
              <label htmlFor="adminUsername">Username</label>
              <input
                type="text"
                id="adminUsername"
                placeholder="Enter admin username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group full">
              <label htmlFor="adminPassword">Password</label>
              <input
                type="password"
                id="adminPassword"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn full" disabled={loading} style={{ marginTop: '15px' }}>
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
