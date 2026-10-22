import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { HotelContext } from '../context/HotelContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { config, fetchConfig } = useContext(HotelContext);

  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Pricing / Room state
  const [editingRoom, setEditingRoom] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editAvailable, setEditAvailable] = useState('');
  const [editTotal, setEditTotal] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadAdminData();
  }, [token]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [resStats, resBookings, resFeedbacks] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/bookings'),
        fetch('/api/admin/feedback')
      ]);

      const dataStats = await resStats.json();
      const dataBookings = await resBookings.json();
      const dataFeedbacks = await resFeedbacks.json();

      if (dataStats.status === 'success') setStats(dataStats.stats);
      if (dataBookings.status === 'success') setBookings(dataBookings.bookings);
      if (dataFeedbacks.status === 'success') setFeedbacks(dataFeedbacks.feedbacks);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleUpdatePrice = async (roomName) => {
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomtype: roomName, price: Number(editPrice) })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setUpdateMsg(`Price updated for ${roomName}!`);
        setEditingRoom(null);
        fetchConfig();
        loadAdminData();
      }
    } catch (err) {
      alert('Failed to update price');
    }
  };

  const handleUpdateRooms = async (roomName) => {
    try {
      const res = await fetch('/api/admin/rooms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomtype: roomName,
          availableRooms: Number(editAvailable),
          totalRooms: Number(editTotal)
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setUpdateMsg(`Inventory updated for ${roomName}!`);
        setEditingRoom(null);
        fetchConfig();
        loadAdminData();
      }
    } catch (err) {
      alert('Failed to update inventory');
    }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '150px', textAlign: 'center', minHeight: '60vh' }}>
        <h2>Loading Admin Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container">
        {/* DASHBOARD HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '30px', background: 'var(--bg-card, #fff)', padding: '20px 30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Admin Control Console</h1>
            <p style={{ margin: '5px 0 0', color: '#666' }}>Welcome back, Administrator | Rayyan's Luxury Stay</p>
          </div>
          <button className="btn secondary-btn" onClick={handleLogout} style={{ padding: '8px 20px' }}>
            <i className="fa-solid fa-right-from-bracket" style={{ marginRight: '6px' }}></i> Logout
          </button>
        </div>

        {updateMsg && (
          <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', fontWeight: '600' }}>
            ✓ {updateMsg}
          </div>
        )}

        {/* TABS NAVIGATION */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '5px' }}>
          {[
            { id: 'stats', label: 'Analytics & Sales', icon: 'fa-chart-line' },
            { id: 'pricing', label: 'Pricing & Inventory', icon: 'fa-tags' },
            { id: 'bookings', label: 'Guest Bookings', icon: 'fa-users' },
            { id: 'feedback', label: 'Customer Feedback', icon: 'fa-comments' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setUpdateMsg(''); }}
              className="btn"
              style={{
                background: activeTab === tab.id ? '#b89146' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-color, #333)',
                border: '1px solid #b89146',
                padding: '10px 20px'
              }}
            >
              <i className={`fa-solid ${tab.icon}`} style={{ marginRight: '8px' }}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: ANALYTICS & SALES */}
        {activeTab === 'stats' && stats && (
          <div>
            {/* TOP METRICS CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{ background: 'var(--bg-card, #fff)', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #b89146', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>Total Gross Revenue</span>
                <h2 style={{ fontSize: '1.8rem', color: '#b89146', margin: '5px 0 0' }}>₹{stats.totalSales.toLocaleString('en-IN')}</h2>
              </div>
              <div style={{ background: 'var(--bg-card, #fff)', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #2e7d32', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>Total Bookings</span>
                <h2 style={{ fontSize: '1.8rem', color: '#2e7d32', margin: '5px 0 0' }}>{stats.totalBookingsCount} Reservations</h2>
              </div>
              <div style={{ background: 'var(--bg-card, #fff)', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #1976d2', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>Average Guest Rating</span>
                <h2 style={{ fontSize: '1.8rem', color: '#1976d2', margin: '5px 0 0' }}>★ {stats.avgRating} / 5.0</h2>
              </div>
            </div>

            {/* TIMELINE SALES STATS */}
            <div style={{ background: 'var(--bg-card, #fff)', padding: '25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <h3 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' }}>
                <i className="fa-solid fa-calendar-days" style={{ color: '#b89146', marginRight: '8px' }}></i>
                Sales Over Timeline
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                  <span style={{ color: '#666' }}>This Week's Revenue:</span>
                  <h3 style={{ margin: '5px 0 0', color: '#2e7d32' }}>₹{stats.timelineStats.weekly.toLocaleString('en-IN')}</h3>
                </div>
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                  <span style={{ color: '#666' }}>This Month's Revenue:</span>
                  <h3 style={{ margin: '5px 0 0', color: '#1976d2' }}>₹{stats.timelineStats.monthly.toLocaleString('en-IN')}</h3>
                </div>
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                  <span style={{ color: '#666' }}>This Year's Revenue:</span>
                  <h3 style={{ margin: '5px 0 0', color: '#b89146' }}>₹{stats.timelineStats.yearly.toLocaleString('en-IN')}</h3>
                </div>
              </div>
            </div>

            {/* ROOM TYPE REVENUE BREAKDOWN */}
            <div style={{ background: 'var(--bg-card, #fff)', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <h3 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' }}>
                <i className="fa-solid fa-bed" style={{ color: '#b89146', marginRight: '8px' }}></i>
                Sales Breakdown by Room Type
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                      <th style={{ padding: '12px' }}>Room Type</th>
                      <th style={{ padding: '12px' }}>Bookings Count</th>
                      <th style={{ padding: '12px' }}>Total Revenue Generated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(stats.roomSalesBreakdown).map(([roomName, data]) => (
                      <tr key={roomName} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px', fontWeight: '600' }}>{roomName}</td>
                        <td style={{ padding: '12px' }}>{data.count} Bookings</td>
                        <td style={{ padding: '12px', color: '#b89146', fontWeight: 'bold' }}>₹{data.revenue.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRICING & ROOM INVENTORY MANAGER */}
        {activeTab === 'pricing' && config && (
          <div style={{ background: 'var(--bg-card, #fff)', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' }}>
              Manage Room Rates & Available Inventory
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {Object.entries(config.rooms).map(([roomName, room]) => (
                <div key={roomName} style={{ border: '1px solid #e0e0e0', borderRadius: '10px', padding: '20px' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: '1.2rem', color: '#b89146' }}>{roomName}</h4>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Current Price:</strong> ₹{room.price.toLocaleString('en-IN')} / night
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Available Rooms:</strong> <span style={{ color: room.availableRooms > 0 ? '#2e7d32' : '#d32f2f', fontWeight: 'bold' }}>{room.availableRooms}</span> / {room.totalRooms} Total
                  </div>

                  {editingRoom === roomName ? (
                    <div style={{ marginTop: '15px', background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontSize: '0.85rem' }}>Set Price (₹):</label>
                        <input
                          type="number"
                          value={editPrice}
                          onChange={e => setEditPrice(e.target.value)}
                          style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontSize: '0.85rem' }}>Available Rooms:</label>
                        <input
                          type="number"
                          value={editAvailable}
                          onChange={e => setEditAvailable(e.target.value)}
                          style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontSize: '0.85rem' }}>Total Rooms:</label>
                        <input
                          type="number"
                          value={editTotal}
                          onChange={e => setEditTotal(e.target.value)}
                          style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => { handleUpdatePrice(roomName); handleUpdateRooms(roomName); }}>Save Changes</button>
                        <button className="btn secondary-btn" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => setEditingRoom(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="btn secondary-btn"
                      style={{ marginTop: '15px', padding: '6px 16px', fontSize: '0.85rem' }}
                      onClick={() => {
                        setEditingRoom(roomName);
                        setEditPrice(room.price);
                        setEditAvailable(room.availableRooms);
                        setEditTotal(room.totalRooms);
                      }}
                    >
                      <i className="fa-solid fa-pen-to-square"></i> Edit Pricing & Availability
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GUEST BOOKINGS & REQUESTS */}
        {activeTab === 'bookings' && (
          <div style={{ background: 'var(--bg-card, #fff)', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' }}>
              Customer Bookings & Information
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    <th style={{ padding: '10px' }}>Booking ID</th>
                    <th style={{ padding: '10px' }}>Guest Name</th>
                    <th style={{ padding: '10px' }}>Contact</th>
                    <th style={{ padding: '10px' }}>Room</th>
                    <th style={{ padding: '10px' }}>Check-in / Out</th>
                    <th style={{ padding: '10px' }}>Total Amount</th>
                    <th style={{ padding: '10px' }}>Special Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.refId} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: '#b89146' }}>{b.refId}</td>
                      <td style={{ padding: '10px' }}>{b.name}</td>
                      <td style={{ padding: '10px', fontSize: '0.85rem' }}>{b.email}<br/>{b.phone}</td>
                      <td style={{ padding: '10px' }}>{b.roomtype}</td>
                      <td style={{ padding: '10px', fontSize: '0.85rem' }}>{b.checkin} to {b.checkout} ({b.nights} night)</td>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>₹{b.totalAmount.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '10px', fontSize: '0.85rem', fontStyle: b.message ? 'normal' : 'italic', color: b.message ? 'inherit' : '#999' }}>
                        {b.message || 'None'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMER FEEDBACK MANAGEMENT */}
        {activeTab === 'feedback' && (
          <div style={{ background: 'var(--bg-card, #fff)', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' }}>
              Guest Feedback & Reviews
            </h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {feedbacks.map((fb) => (
                <div key={fb.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <strong>{fb.guestName}</strong> <span style={{ color: '#666', fontSize: '0.85rem' }}>({fb.roomtype} • Booking ID: {fb.refId})</span>
                    </div>
                    <div style={{ color: '#fbc02d', fontWeight: 'bold' }}>
                      {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)} ({fb.rating}/5)
                    </div>
                  </div>
                  <p style={{ margin: '5px 0 0', color: '#444', fontStyle: 'italic' }}>"{fb.comments}"</p>
                  <small style={{ color: '#888', display: 'block', marginTop: '8px' }}>
                    Submitted on: {new Date(fb.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
