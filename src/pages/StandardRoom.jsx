import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { HotelContext } from '../context/HotelContext';

export default function StandardRoom() {
  const { config } = useContext(HotelContext);
  const room = config?.rooms?.['Standard Room'] || {
    price: 999,
    maxGuests: 2,
    availableRooms: 8,
    bedType: 'Queen Size Bed',
    size: '280 sq.ft',
    amenities: ['Free High-Speed Wi-Fi', 'Complimentary Breakfast', 'Smart LED TV', 'Digital Safe']
  };

  return (
    <div className="room-detail-page">
      <div className="container" style={{ padding: '120px 20px 60px' }}>
        <div className="room-detail-card" style={{ background: 'var(--bg-card, #fff)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
          <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80" alt="Standard Room" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
          <div style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h2>Standard Room</h2>
                <p style={{ color: '#666', marginTop: '5px' }}>Comfortable and cozy room for modern travelers.</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '700', color: '#b89146' }}>₹{room.price.toLocaleString('en-IN')}</span>
                <span style={{ color: '#666' }}> / night</span>
              </div>
            </div>

            <div style={{ margin: '20px 0', padding: '15px', background: 'rgba(184, 145, 70, 0.08)', borderRadius: '8px', display: 'flex', gap: '30px' }}>
              <div><strong>Capacity:</strong> Up to {room.maxGuests} Guests</div>
              <div><strong>Bed:</strong> {room.bedType}</div>
              <div><strong>Size:</strong> {room.size}</div>
              <div style={{ color: room.availableRooms > 0 ? '#2e7d32' : '#d32f2f', fontWeight: 'bold' }}>
                <strong>Available:</strong> {room.availableRooms} Rooms
              </div>
            </div>

            <h3>Room Amenities</h3>
            <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', margin: '15px 0 30px', paddingLeft: '20px' }}>
              {room.amenities.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: '15px' }}>
              <Link to="/booking?roomtype=Standard Room" className="btn" style={{ padding: '12px 30px' }}>Book Standard Room</Link>
              <Link to="/" className="btn secondary-btn" style={{ padding: '12px 30px' }}>Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
