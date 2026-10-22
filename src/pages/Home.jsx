import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HotelContext } from '../context/HotelContext';

export default function Home() {
  const { config, loading } = useContext(HotelContext);
  const navigate = useNavigate();

  // Quick booking state
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [qbCheckin, setQbCheckin] = useState(todayStr);
  const [qbCheckout, setQbCheckout] = useState(tomorrowStr);
  const [qbGuests, setQbGuests] = useState('2');
  const [qbRoom, setQbRoom] = useState('Standard Room');

  // FAQ state
  const [activeFaq, setActiveFaq] = useState(null);

  // Gallery state
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [lightboxImg, setLightboxImg] = useState(null);

  const galleryItems = [
    { id: 1, category: 'rooms', title: 'Standard Luxury Room', img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80' },
    { id: 2, category: 'rooms', title: 'Deluxe Suite Interior', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },
    { id: 3, category: 'pool', title: 'Infinity Swimming Pool', img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80' },
    { id: 4, category: 'dining', title: 'Fine Dining Restaurant', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' },
    { id: 5, category: 'pool', title: 'Spa & Wellness Sanctuary', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80' },
    { id: 6, category: 'rooms', title: 'Executive Suite Master Bed', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleQuickBookingSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      checkin: qbCheckin,
      checkout: qbCheckout,
      guests: qbGuests,
      roomtype: qbRoom
    });
    navigate(`/booking?${params.toString()}`);
  };

  const filteredGallery = galleryFilter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === galleryFilter);

  const getRoomPrice = (roomName) => {
    return config?.rooms?.[roomName]?.price ?? 999;
  };

  const getRoomAvailability = (roomName) => {
    return config?.rooms?.[roomName]?.availableRooms ?? 0;
  };

  return (
    <div id="home">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>Experience Unmatched Luxury</h1>
          <p>Indulge in peaceful relaxation, exquisite dining, and world-class suites tailored for your ultimate comfort.</p>
          <a href="#rooms" className="btn primary-btn">Explore Rooms</a>
        </div>

        {/* QUICK SEARCH BAR */}
        <div className="quick-booking-container">
          <form className="quick-booking-form" onSubmit={handleQuickBookingSubmit}>
            <div className="qb-group">
              <label><i className="fa-solid fa-calendar-days"></i> Check-in</label>
              <input type="date" value={qbCheckin} min={todayStr} onChange={e => setQbCheckin(e.target.value)} required />
            </div>
            <div className="qb-group">
              <label><i className="fa-solid fa-calendar-check"></i> Check-out</label>
              <input type="date" value={qbCheckout} min={qbCheckin} onChange={e => setQbCheckout(e.target.value)} required />
            </div>
            <div className="qb-group">
              <label><i className="fa-solid fa-user-group"></i> Guests</label>
              <select value={qbGuests} onChange={e => setQbGuests(e.target.value)}>
                {[1,2,3,4,5,6,7,8].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>
            <div className="qb-group">
              <label><i className="fa-solid fa-bed"></i> Room Type</label>
              <select value={qbRoom} onChange={e => setQbRoom(e.target.value)}>
                <option value="Standard Room">Standard Room</option>
                <option value="Deluxe Room">Deluxe Room</option>
                <option value="Executive Suite">Executive Suite</option>
              </select>
            </div>
            <button type="submit" className="qb-btn">
              <i className="fa-solid fa-magnifying-glass"></i> Check Stay
            </button>
          </form>
        </div>
      </section>

      {/* ROOMS SHOWCASE */}
      <section id="rooms" className="rooms-section">
        <div className="container">
          <div className="section-title">
            <h2>Our Accommodations</h2>
            <p>Elegantly crafted rooms designed for supreme luxury and rest.</p>
          </div>

          <div className="rooms-grid">
            {/* Standard Room Card */}
            <div className="room-card">
              <div className="room-img">
                <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80" alt="Standard Room" />
                <span className="price-tag">₹{getRoomPrice("Standard Room").toLocaleString('en-IN')} / night</span>
              </div>
              <div className="room-info">
                <h3>Standard Room</h3>
                <p>Perfect for solo travelers or couples seeking cozy comfort.</p>
                <div className="availability-badge" style={{ marginBottom: '10px', fontSize: '0.9rem', color: getRoomAvailability("Standard Room") > 0 ? '#2e7d32' : '#d32f2f', fontWeight: '600' }}>
                  <i className={`fa-solid ${getRoomAvailability("Standard Room") > 0 ? 'fa-check-circle' : 'fa-times-circle'}`}></i> {getRoomAvailability("Standard Room")} Rooms Available
                </div>
                <div className="room-actions">
                  <Link to="/rooms/standard-room" className="btn secondary-btn">View Details</Link>
                  <Link to={`/booking?roomtype=Standard Room`} className="btn">Book Now</Link>
                </div>
              </div>
            </div>

            {/* Deluxe Room Card */}
            <div className="room-card">
              <div className="room-img">
                <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80" alt="Deluxe Room" />
                <span className="price-tag">₹{getRoomPrice("Deluxe Room").toLocaleString('en-IN')} / night</span>
              </div>
              <div className="room-info">
                <h3>Deluxe Room</h3>
                <p>Spacious elegance featuring scenic views and premium amenities.</p>
                <div className="availability-badge" style={{ marginBottom: '10px', fontSize: '0.9rem', color: getRoomAvailability("Deluxe Room") > 0 ? '#2e7d32' : '#d32f2f', fontWeight: '600' }}>
                  <i className={`fa-solid ${getRoomAvailability("Deluxe Room") > 0 ? 'fa-check-circle' : 'fa-times-circle'}`}></i> {getRoomAvailability("Deluxe Room")} Rooms Available
                </div>
                <div className="room-actions">
                  <Link to="/rooms/deluxe-room" className="btn secondary-btn">View Details</Link>
                  <Link to={`/booking?roomtype=Deluxe Room`} className="btn">Book Now</Link>
                </div>
              </div>
            </div>

            {/* Executive Suite Card */}
            <div className="room-card">
              <div className="room-img">
                <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80" alt="Executive Suite" />
                <span className="price-tag">₹{getRoomPrice("Executive Suite").toLocaleString('en-IN')} / night</span>
              </div>
              <div className="room-info">
                <h3>Executive Suite</h3>
                <p>Unrivaled luxury with private jacuzzi, butler service & panoramic views.</p>
                <div className="availability-badge" style={{ marginBottom: '10px', fontSize: '0.9rem', color: getRoomAvailability("Executive Suite") > 0 ? '#2e7d32' : '#d32f2f', fontWeight: '600' }}>
                  <i className={`fa-solid ${getRoomAvailability("Executive Suite") > 0 ? 'fa-check-circle' : 'fa-times-circle'}`}></i> {getRoomAvailability("Executive Suite")} Rooms Available
                </div>
                <div className="room-actions">
                  <Link to="/rooms/executive-suite" className="btn secondary-btn">View Details</Link>
                  <Link to={`/booking?roomtype=Executive Suite`} className="btn">Book Now</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AMENITIES SECTION */}
      <section id="amenities" className="amenities-section">
        <div className="container">
          <div className="section-title">
            <h2>Luxury Amenities</h2>
            <p>Designed to provide extraordinary hospitality during every moment of your stay.</p>
          </div>
          <div className="amenities-grid">
            <div className="amenity-card">
              <i className="fa-solid fa-wifi"></i>
              <h3>High-Speed Wi-Fi</h3>
              <p>Seamless 5G Wi-Fi coverage across all suites and hotel facilities.</p>
            </div>
            <div className="amenity-card">
              <i className="fa-solid fa-utensils"></i>
              <h3>Gourmet Dining</h3>
              <p>24/7 fine dining kitchen prepared by international chefs.</p>
            </div>
            <div className="amenity-card">
              <i className="fa-solid fa-spa"></i>
              <h3>Spa & Jacuzzi</h3>
              <p>Rejuvenating wellness spa, steam sauna, and therapeutic therapies.</p>
            </div>
            <div className="amenity-card">
              <i className="fa-solid fa-square-parking"></i>
              <h3>Valet Parking</h3>
              <p>Secure underground valet parking with 24/7 surveillance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="gallery-section">
        <div className="container">
          <div className="section-title">
            <h2>Photo Gallery</h2>
            <p>A glimpse into the refined elegance of Rayyan's Luxury Stay.</p>
          </div>

          <div className="gallery-filters">
            {['all', 'rooms', 'pool', 'dining'].map(filter => (
              <button
                key={filter}
                className={`gallery-filter-btn ${galleryFilter === filter ? 'active' : ''}`}
                onClick={() => setGalleryFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <div className="gallery-grid">
            {filteredGallery.map(item => (
              <div key={item.id} className="gallery-item" onClick={() => setLightboxImg(item)}>
                <img src={item.img} alt={item.title} />
                <div className="gallery-overlay">
                  <span>{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {lightboxImg && (
        <div className="modal show" onClick={() => setLightboxImg(null)}>
          <div className="modal-content" style={{ maxWidth: '800px', background: 'none', boxShadow: 'none' }} onClick={e => e.stopPropagation()}>
            <img src={lightboxImg.img} alt={lightboxImg.title} style={{ width: '100%', borderRadius: '12px' }} />
            <h3 style={{ color: '#fff', marginTop: '15px', textAlign: 'center' }}>{lightboxImg.title}</h3>
            <button className="btn" style={{ margin: '15px auto 0', display: 'block' }} onClick={() => setLightboxImg(null)}>Close Gallery</button>
          </div>
        </div>
      )}

      {/* FAQ SECTION */}
      <section className="faq-section">
        <div className="container">
          <div className="section-title">
            <h2>Frequently Asked Questions</h2>
            <p>Find quick answers to common questions about reservations and policies.</p>
          </div>

          <div className="faq-container">
            {[
              { id: 1, q: "What are the check-in and check-out times?", a: "Standard check-in time starts at 12:00 PM, and check-out is until 11:00 AM. Early check-in or late check-out can be requested based on availability." },
              { id: 2, q: "Is breakfast included in the booking?", a: "Yes, all room bookings include complimentary gourmet buffet breakfast every morning." },
              { id: 3, q: "What is your cancellation policy?", a: "Free cancellation is allowed up to 24 hours prior to check-in. Cancellations within 24 hours incur a 1-night charge." },
              { id: 4, q: "Do you offer airport transfer services?", a: "Executive Suite guests receive complimentary VIP airport pickup/drop. Standard and Deluxe guests can request transfer service during booking." }
            ].map(faq => (
              <div key={faq.id} className={`faq-item ${activeFaq === faq.id ? 'active' : ''}`}>
                <button className="faq-question" onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}>
                  <span>{faq.q}</span>
                  <i className={`fa-solid ${activeFaq === faq.id ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </button>
                {activeFaq === faq.id && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
