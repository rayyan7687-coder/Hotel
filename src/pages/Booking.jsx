import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { HotelContext } from '../context/HotelContext';

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { config, fetchConfig } = useContext(HotelContext);

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: searchParams.get('guests') || '2',
    checkin: searchParams.get('checkin') || todayStr,
    checkout: searchParams.get('checkout') || tomorrowStr,
    roomtype: searchParams.get('roomtype') || 'Standard Room',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const roomParam = searchParams.get('roomtype');
    if (roomParam) {
      if (roomParam.toLowerCase().includes('deluxe')) setFormData(prev => ({ ...prev, roomtype: 'Deluxe Room' }));
      else if (roomParam.toLowerCase().includes('executive')) setFormData(prev => ({ ...prev, roomtype: 'Executive Suite' }));
      else setFormData(prev => ({ ...prev, roomtype: 'Standard Room' }));
    }
  }, [searchParams]);

  // Pricing math
  const getPricing = () => {
    const roomName = formData.roomtype || 'Standard Room';
    const rate = config?.rooms?.[roomName]?.price || 999;
    const taxRate = config?.taxRate || 0.09;

    let nights = 1;
    if (formData.checkin && formData.checkout) {
      const start = new Date(formData.checkin);
      const end = new Date(formData.checkout);
      const diff = end.getTime() - start.getTime();
      if (diff > 0) {
        nights = Math.ceil(diff / (1000 * 3600 * 24));
      }
    }

    const roomCharges = rate * nights;
    const taxAmount = Math.round(roomCharges * taxRate);
    const totalAmount = roomCharges + taxAmount;

    return { rate, nights, roomCharges, taxAmount, totalAmount };
  };

  const pricing = getPricing();

  const validate = () => {
    let errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) errs.name = "Full name required (min 3 chars).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Valid email required.";
    if (!/^[6-9]\d{9}$/.test(formData.phone)) errs.phone = "Valid 10-digit Indian phone number required.";
    if (!formData.checkin) errs.checkin = "Check-in date required.";
    if (!formData.checkout) errs.checkout = "Check-out date required.";
    if (new Date(formData.checkout) <= new Date(formData.checkin)) errs.checkout = "Check-out must be after check-in.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setShowReviewModal(true);
    }
  };

  const handleConfirmAndPay = async () => {
    setLoading(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.status === 'success') {
        setBookingResult(data);
        setShowReviewModal(false);
        setShowSuccessModal(true);
        fetchConfig(); // Refresh room counts
      } else {
        setSubmitError(data.message || 'Booking failed.');
      }
    } catch (err) {
      setSubmitError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container">
        <div className="booking-card">
          <h1>Book Your Luxury Stay</h1>
          <p>Fill in your reservation details below. Review your summary before confirming.</p>

          <form onSubmit={handleInitialSubmit} className="booking-form" novalidate>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  placeholder="Enter full name"
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <small className="error" style={{ color: 'red' }}>{errors.name}</small>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  placeholder="example@email.com"
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <small className="error" style={{ color: 'red' }}>{errors.email}</small>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  maxLength="10"
                  value={formData.phone}
                  placeholder="9876543210"
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
                {errors.phone && <small className="error" style={{ color: 'red' }}>{errors.phone}</small>}
              </div>

              <div className="form-group">
                <label htmlFor="guests">Guests *</label>
                <select id="guests" value={formData.guests} onChange={e => setFormData({ ...formData, guests: e.target.value })}>
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="checkin">Check-in Date *</label>
                <input
                  type="date"
                  id="checkin"
                  min={todayStr}
                  value={formData.checkin}
                  onChange={e => setFormData({ ...formData, checkin: e.target.value })}
                />
                {errors.checkin && <small className="error" style={{ color: 'red' }}>{errors.checkin}</small>}
              </div>

              <div className="form-group">
                <label htmlFor="checkout">Check-out Date *</label>
                <input
                  type="date"
                  id="checkout"
                  min={formData.checkin || todayStr}
                  value={formData.checkout}
                  onChange={e => setFormData({ ...formData, checkout: e.target.value })}
                />
                {errors.checkout && <small className="error" style={{ color: 'red' }}>{errors.checkout}</small>}
              </div>

              <div className="form-group full">
                <label htmlFor="roomtype">Room Type *</label>
                <select id="roomtype" value={formData.roomtype} onChange={e => setFormData({ ...formData, roomtype: e.target.value })}>
                  <option value="Standard Room">Standard Room (₹{config?.rooms?.['Standard Room']?.price || 999}/night)</option>
                  <option value="Deluxe Room">Deluxe Room (₹{config?.rooms?.['Deluxe Room']?.price || 1999}/night)</option>
                  <option value="Executive Suite">Executive Suite (₹{config?.rooms?.['Executive Suite']?.price || 3499}/night)</option>
                </select>
              </div>

              <div className="form-group full">
                <label htmlFor="message">Special Requests</label>
                <textarea
                  id="message"
                  rows="3"
                  placeholder="Mention airport pickup, food preferences, extra bed, etc."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              {/* PRICE BREAKDOWN SUMMARY */}
              <div className="booking-summary-box full">
                <h3><i className="fa-solid fa-receipt"></i> Live Price Breakdown</h3>
                <div className="summary-details">
                  <div className="summary-row"><span>Selected Room:</span> <strong>{formData.roomtype}</strong></div>
                  <div className="summary-row"><span>Rate per Night:</span> <strong>₹{pricing.rate.toLocaleString('en-IN')}</strong></div>
                  <div className="summary-row"><span>Duration:</span> <strong>{pricing.nights} {pricing.nights === 1 ? 'Night' : 'Nights'}</strong></div>
                  <div className="summary-row"><span>Room Charges:</span> <strong>₹{pricing.roomCharges.toLocaleString('en-IN')}</strong></div>
                  <div className="summary-row"><span>Taxes (9% GST):</span> <strong>₹{pricing.taxAmount.toLocaleString('en-IN')}</strong></div>
                  <div className="summary-row total-row"><span>Estimated Total:</span> <strong>₹{pricing.totalAmount.toLocaleString('en-IN')}</strong></div>
                </div>
              </div>

              <button type="submit" className="btn full" style={{ marginTop: '20px' }}>
                Review & Confirm Booking Details
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* PRE-SUBMIT CONFIRMATION MODAL */}
      {showReviewModal && (
        <div className="modal show" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <h2 style={{ color: '#b89146', marginBottom: '15px' }}>Verify Your Stay Details</h2>
            <p style={{ marginBottom: '20px', color: '#666' }}>Please double-check your booking details before final submission.</p>

            <div className="confirmation-details-card" style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', textAlign: 'left' }}>
              <div className="conf-row"><span>Guest Name:</span> <strong>{formData.name}</strong></div>
              <div className="conf-row"><span>Email:</span> <strong>{formData.email}</strong></div>
              <div className="conf-row"><span>Phone:</span> <strong>{formData.phone}</strong></div>
              <div className="conf-row"><span>Room Choice:</span> <strong>{formData.roomtype}</strong></div>
              <div className="conf-row"><span>Check-In / Check-Out:</span> <strong>{formData.checkin} to {formData.checkout} ({pricing.nights} night{pricing.nights > 1 ? 's' : ''})</strong></div>
              <div className="conf-row"><span>Guests:</span> <strong>{formData.guests} Guest(s)</strong></div>
              <div className="conf-row conf-total" style={{ borderTop: '2px solid #ddd', paddingTop: '10px', marginTop: '10px' }}>
                <span>Grand Total Amount:</span> <strong style={{ color: '#b89146', fontSize: '1.2rem' }}>₹{pricing.totalAmount.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {submitError && <p style={{ color: 'red', marginTop: '10px' }}>{submitError}</p>}

            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <button className="btn secondary-btn" style={{ flex: 1 }} onClick={() => setShowReviewModal(false)}>Edit Form</button>
              <button className="btn" style={{ flex: 1 }} onClick={handleConfirmAndPay} disabled={loading}>
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS CONFIRMATION RECEIPT MODAL */}
      {showSuccessModal && bookingResult && (
        <div className="modal show">
          <div className="modal-content booking-confirmation-content" style={{ maxWidth: '600px' }}>
            <i className="fa-solid fa-circle-check success-icon" style={{ fontSize: '3.5rem', color: '#2e7d32', marginBottom: '15px' }}></i>
            <h2>Booking Confirmed!</h2>
            <p className="mb-3">Thank you for choosing <strong>Rayyan's Luxury Stay</strong>. Your booking has been registered and a confirmation email has been dispatched.</p>

            <div className="confirmation-details-card mb-4" style={{ background: '#f4f6f8', padding: '20px', borderRadius: '10px', textAlign: 'left', margin: '20px 0' }}>
              <div className="conf-row" style={{ fontSize: '1.1rem', color: '#b89146', fontWeight: 'bold' }}>
                <span>Booking ID:</span> <strong>{bookingResult.refId}</strong>
              </div>
              <div className="conf-row"><span>Guest Name:</span> <strong>{bookingResult.booking.name}</strong></div>
              <div className="conf-row"><span>Room Type:</span> <strong>{bookingResult.booking.roomtype}</strong></div>
              <div className="conf-row"><span>Stay Dates:</span> <strong>{bookingResult.booking.checkin} to {bookingResult.booking.checkout}</strong></div>
              <div className="conf-row"><span>Total Paid/Due:</span> <strong>₹{bookingResult.booking.totalAmount.toLocaleString('en-IN')}</strong></div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '20px' }}>
              Note down your Booking Reference ID (<strong>{bookingResult.refId}</strong>) to share your stay feedback!
            </p>

            <button className="btn" onClick={() => navigate('/')}>Return to Homepage</button>
          </div>
        </div>
      )}
    </div>
  );
}
