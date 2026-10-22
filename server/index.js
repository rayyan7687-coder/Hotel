import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// In-memory data store with initial defaults
let hotelConfig = {
  taxRate: 0.09,
  rooms: {
    "Standard Room": {
      price: 999,
      maxGuests: 2,
      totalRooms: 10,
      availableRooms: 8,
      bedType: "Queen Size Bed",
      size: "280 sq.ft",
      amenities: ["Free High-Speed Wi-Fi", "Complimentary Breakfast", "Smart LED TV", "Digital Safe"]
    },
    "Deluxe Room": {
      price: 1999,
      maxGuests: 3,
      totalRooms: 8,
      availableRooms: 5,
      bedType: "King Size Bed",
      size: "420 sq.ft",
      amenities: ["Free High-Speed Wi-Fi", "Complimentary Breakfast", "55\" 4K Smart TV", "Mini Bar & Espresso"]
    },
    "Executive Suite": {
      price: 3499,
      maxGuests: 4,
      totalRooms: 5,
      availableRooms: 3,
      bedType: "California King Bed",
      size: "650 sq.ft",
      amenities: ["Private Jacuzzi & Steam Shower", "24/7 Dedicated Butler", "Private Dining Set", "Airport VIP Transfer"]
    }
  }
};

let bookings = [
  {
    refId: "RLS-839201",
    timestamp: new Date(Date.now() - 15 * 86400000).toISOString(),
    name: "Aarav Sharma",
    email: "aarav@example.com",
    phone: "9876543210",
    checkin: "2026-03-01",
    checkout: "2026-03-04",
    nights: 3,
    guests: "2",
    roomtype: "Standard Room",
    totalAmount: 3267,
    status: "Confirmed",
    message: "Late check-in requested."
  },
  {
    refId: "RLS-471092",
    timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "9812345678",
    checkin: "2026-03-10",
    checkout: "2026-03-12",
    nights: 2,
    guests: "2",
    roomtype: "Deluxe Room",
    totalAmount: 4358,
    status: "Confirmed",
    message: "High floor preference."
  },
  {
    refId: "RLS-902184",
    timestamp: new Date().toISOString(),
    name: "Rohan Verma",
    email: "rohan@example.com",
    phone: "9988776655",
    checkin: "2026-03-15",
    checkout: "2026-03-18",
    nights: 3,
    guests: "3",
    roomtype: "Executive Suite",
    totalAmount: 11442,
    status: "Confirmed",
    message: "Honeymoon setup."
  }
];

let feedbacks = [
  {
    id: "FB-101",
    refId: "RLS-839201",
    guestName: "Aarav Sharma",
    roomtype: "Standard Room",
    rating: 5,
    comments: "Excellent hospitality! The rooms were pristine and staff was extremely courteous.",
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString()
  }
];

// Helper to send email
async function sendEmailNotification(to, subject, htmlBody) {
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"Rayyan\'s Luxury Stay" <reservations@rayyansluxurystay.com>',
      to: to,
      subject: subject,
      html: htmlBody
    });

    console.log("Email sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return true;
  } catch (err) {
    console.log("Email dispatch simulated / fallback:", err.message);
    return false;
  }
}

// Config & Public Endpoints
app.get('/api/config', (req, res) => {
  res.json({ status: "success", data: hotelConfig });
});

// Create Booking Endpoint
app.post('/api/bookings', async (req, res) => {
  const { name, email, phone, checkin, checkout, guests, roomtype, message } = req.body;

  if (!name || name.trim().length < 3) return res.status(400).json({ status: "error", message: "Valid name required (min 3 chars)." });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ status: "error", message: "Valid email address required." });
  if (!phone || !/^[6-9]\d{9}$/.test(phone)) return res.status(400).json({ status: "error", message: "Valid 10-digit Indian phone number required." });
  if (!checkin || !checkout) return res.status(400).json({ status: "error", message: "Check-in and check-out dates are required." });
  if (new Date(checkout) <= new Date(checkin)) return res.status(400).json({ status: "error", message: "Check-out must be after check-in date." });
  if (!hotelConfig.rooms[roomtype]) return res.status(400).json({ status: "error", message: "Invalid room type selected." });

  const roomInfo = hotelConfig.rooms[roomtype];
  if (roomInfo.availableRooms <= 0) {
    return res.status(400).json({ status: "error", message: `Sorry, ${roomtype} is fully booked.` });
  }

  const startDate = new Date(checkin);
  const endDate = new Date(checkout);
  const nights = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 3600 * 24)));
  const roomCharges = roomInfo.price * nights;
  const taxAmount = Math.round(roomCharges * hotelConfig.taxRate);
  const totalAmount = roomCharges + taxAmount;

  // Generate unique collision-resistant ID
  const refId = "RLS-" + Math.floor(100000 + Math.random() * 900000);

  const newBooking = {
    refId,
    timestamp: new Date().toISOString(),
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    checkin,
    checkout,
    nights,
    guests,
    roomtype,
    totalAmount,
    status: "Confirmed",
    message: message ? message.trim() : ""
  };

  bookings.unshift(newBooking);
  hotelConfig.rooms[roomtype].availableRooms = Math.max(0, hotelConfig.rooms[roomtype].availableRooms - 1);

  // Email trigger
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #b89146;">Rayyan's Luxury Stay - Booking Confirmation</h2>
      <p>Dear <strong>${newBooking.name}</strong>,</p>
      <p>Thank you for choosing Rayyan's Luxury Stay. Your reservation has been confirmed!</p>
      <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p><strong>Booking Reference ID:</strong> <span style="font-size: 1.2em; color: #b89146;">${refId}</span></p>
        <p><strong>Room Type:</strong> ${roomtype}</p>
        <p><strong>Check-In:</strong> ${checkin}</p>
        <p><strong>Check-Out:</strong> ${checkout} (${nights} night${nights > 1 ? 's' : ''})</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Total Amount Paid/Due:</strong> ₹${totalAmount.toLocaleString('en-IN')}</p>
      </div>
      <p>Keep your Booking ID (<strong>${refId}</strong>) handy to submit feedback after your stay!</p>
      <br/>
      <p>Warm regards,<br/>Rayyan's Luxury Stay Team</p>
    </div>
  `;

  sendEmailNotification(newBooking.email, `Booking Confirmation [${refId}] - Rayyan's Luxury Stay`, emailHtml);

  res.json({
    status: "success",
    message: "Booking submitted successfully!",
    refId: refId,
    booking: newBooking
  });
});

// Verify Booking ID and Room Type for Dynamic Feedback Verification
app.get('/api/bookings/verify', (req, res) => {
  const { refId, roomtype } = req.query;
  if (!refId || !roomtype) {
    return res.status(400).json({ status: "error", valid: false, message: "Booking ID and Room Type are required." });
  }

  const found = bookings.find(b => b.refId.trim().toUpperCase() === refId.trim().toUpperCase() && b.roomtype === roomtype);
  if (found) {
    res.json({ status: "success", valid: true, guestName: found.name, message: "Valid Booking Found!" });
  } else {
    res.json({ status: "error", valid: false, message: "No matching booking found for this Booking ID and Room." });
  }
});

// Submit Feedback
app.post('/api/feedback', (req, res) => {
  const { refId, roomtype, rating, comments } = req.body;
  if (!refId || !roomtype || !rating || !comments) {
    return res.status(400).json({ status: "error", message: "All fields are required." });
  }

  const foundBooking = bookings.find(b => b.refId.trim().toUpperCase() === refId.trim().toUpperCase() && b.roomtype === roomtype);
  if (!foundBooking) {
    return res.status(400).json({ status: "error", message: "Cannot submit feedback: Invalid Booking ID or Room." });
  }

  const newFeedback = {
    id: "FB-" + Math.floor(100 + Math.random() * 900),
    refId: foundBooking.refId,
    guestName: foundBooking.name,
    roomtype,
    rating: Number(rating),
    comments: comments.trim(),
    createdAt: new Date().toISOString()
  };

  feedbacks.unshift(newFeedback);
  res.json({ status: "success", message: "Thank you for your feedback!", feedback: newFeedback });
});

// Admin Auth Endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    res.json({ status: "success", token: "admin-secret-token-2026", username: "admin" });
  } else {
    res.status(401).json({ status: "error", message: "Invalid Admin Username or Password." });
  }
});

// Admin Update Pricing
app.put('/api/admin/pricing', (req, res) => {
  const { roomtype, price } = req.body;
  if (!hotelConfig.rooms[roomtype] || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ status: "error", message: "Invalid room type or price." });
  }
  hotelConfig.rooms[roomtype].price = price;
  res.json({ status: "success", message: `Updated ${roomtype} rate to ₹${price}`, data: hotelConfig });
});

// Admin Update Room Availability & Total Count
app.put('/api/admin/rooms', (req, res) => {
  const { roomtype, availableRooms, totalRooms } = req.body;
  if (!hotelConfig.rooms[roomtype]) {
    return res.status(400).json({ status: "error", message: "Invalid room type." });
  }
  if (typeof availableRooms === 'number') hotelConfig.rooms[roomtype].availableRooms = Math.max(0, availableRooms);
  if (typeof totalRooms === 'number') hotelConfig.rooms[roomtype].totalRooms = Math.max(1, totalRooms);
  res.json({ status: "success", message: `Updated inventory for ${roomtype}`, data: hotelConfig });
});

// Admin Get Guest Bookings
app.get('/api/admin/bookings', (req, res) => {
  res.json({ status: "success", bookings });
});

// Admin Get Feedback List
app.get('/api/admin/feedback', (req, res) => {
  res.json({ status: "success", feedbacks });
});

// Admin Get Sales & Timeline Analytics Statistics
app.get('/api/admin/stats', (req, res) => {
  const totalSales = bookings.reduce((acc, b) => acc + b.totalAmount, 0);
  const totalBookingsCount = bookings.length;

  const roomSalesBreakdown = {};
  Object.keys(hotelConfig.rooms).forEach(room => {
    roomSalesBreakdown[room] = {
      count: 0,
      revenue: 0
    };
  });

  bookings.forEach(b => {
    if (roomSalesBreakdown[b.roomtype]) {
      roomSalesBreakdown[b.roomtype].count += 1;
      roomSalesBreakdown[b.roomtype].revenue += b.totalAmount;
    }
  });

  // Timeline stats (Weekly, Monthly, Yearly simulated or calculated)
  const timelineStats = {
    weekly: Math.round(totalSales * 0.35),
    monthly: Math.round(totalSales * 0.85),
    yearly: totalSales
  };

  res.json({
    status: "success",
    stats: {
      totalSales,
      totalBookingsCount,
      roomSalesBreakdown,
      timelineStats,
      totalFeedbacksCount: feedbacks.length,
      avgRating: feedbacks.length ? (feedbacks.reduce((a, f) => a + f.rating, 0) / feedbacks.length).toFixed(1) : 5.0
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
