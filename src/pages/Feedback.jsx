import React, { useState, useEffect } from 'react';

export default function Feedback() {
  const [refId, setRefId] = useState('');
  const [roomtype, setRoomtype] = useState('Standard Room');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');

  // Dynamic verification state
  const [verifying, setVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [verifyMessage, setVerifyMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Dynamic Verification Effect (Debounced)
  useEffect(() => {
    if (!refId.trim() || refId.trim().length < 5) {
      setIsVerified(false);
      setVerifyMessage('');
      return;
    }

    setVerifying(true);
    setVerifyMessage('Verifying booking reference...');

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/bookings/verify?refId=${encodeURIComponent(refId.trim())}&roomtype=${encodeURIComponent(roomtype)}`);
        const data = await res.json();

        if (data.status === 'success' && data.valid) {
          setIsVerified(true);
          setGuestName(data.guestName);
          setVerifyMessage(`✓ Verified Booking for ${data.guestName}`);
        } else {
          setIsVerified(false);
          setGuestName('');
          setVerifyMessage('✕ Invalid Booking ID or Room choice.');
        }
      } catch (err) {
        setIsVerified(false);
        setVerifyMessage('✕ Error verifying booking ID.');
      } finally {
        setVerifying(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [refId, roomtype]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) return;

    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refId: refId.trim(),
          roomtype,
          rating,
          comments
        })
      });
      const data = await res.json();

      if (data.status === 'success') {
        setSuccessMessage('Thank you! Your feedback has been submitted successfully.');
        setRefId('');
        setComments('');
        setIsVerified(false);
        setVerifyMessage('');
      } else {
        setErrorMessage(data.message || 'Failed to submit feedback.');
      }
    } catch (err) {
      setErrorMessage('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-page" style={{ paddingTop: '110px', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '650px' }}>
        <div className="booking-card" style={{ padding: '35px' }}>
          <h1 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '10px' }}>
            Guest Feedback & Review
          </h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '25px' }}>
            We value your stay experience! Enter your Booking ID and room choice to share your feedback.
          </p>

          {successMessage && (
            <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: '500' }}>
              <i className="fa-solid fa-circle-check" style={{ marginRight: '8px' }}></i>
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div style={{ background: '#ffebee', color: '#c62828', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: '500' }}>
              <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="booking-form">
            {/* ROOM STAYED */}
            <div className="form-group full">
              <label htmlFor="feedbackRoom">Room Type Stayed *</label>
              <select
                id="feedbackRoom"
                value={roomtype}
                onChange={e => setRoomtype(e.target.value)}
              >
                <option value="Standard Room">Standard Room</option>
                <option value="Deluxe Room">Deluxe Room</option>
                <option value="Executive Suite">Executive Suite</option>
              </select>
            </div>

            {/* BOOKING REFERENCE ID WITH REAL-TIME VERIFICATION */}
            <div className="form-group full">
              <label htmlFor="refId">Booking Reference ID *</label>
              <input
                type="text"
                id="refId"
                placeholder="e.g. RLS-839201"
                value={refId}
                onChange={e => setRefId(e.target.value)}
                required
              />
              {verifyMessage && (
                <div style={{
                  marginTop: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: isVerified ? '#2e7d32' : (verifying ? '#1976d2' : '#d32f2f')
                }}>
                  {verifying && <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '6px' }}></i>}
                  {verifyMessage}
                </div>
              )}
            </div>

            {/* STAR RATING */}
            <div className="form-group full">
              <label>Rating *</label>
              <div style={{ display: 'flex', gap: '10px', fontSize: '1.6rem', color: '#fbc02d', cursor: 'pointer', margin: '5px 0' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <i
                    key={star}
                    className={`fa-star ${star <= rating ? 'fa-solid' : 'fa-regular'}`}
                    onClick={() => setRating(star)}
                    role="button"
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  ></i>
                ))}
              </div>
            </div>

            {/* COMMENTS */}
            <div className="form-group full">
              <label htmlFor="comments">Your Stay Experience & Comments *</label>
              <textarea
                id="comments"
                rows="4"
                placeholder="Tell us about the room cleanliness, staff service, food, or amenities..."
                value={comments}
                onChange={e => setComments(e.target.value)}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn full"
              disabled={!isVerified || submitting || !comments.trim()}
              style={{ opacity: (!isVerified || submitting || !comments.trim()) ? 0.6 : 1, marginTop: '15px' }}
            >
              {submitting ? 'Submitting Feedback...' : 'Submit Guest Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
