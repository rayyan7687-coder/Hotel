# Rayyan's Luxury Stay 🏨✨

A modern, elegant, and fully responsive luxury hotel website and reservation system built with HTML5, CSS3, JavaScript (ES6+), and Google Apps Script integration.

---

## 🌟 Live Demo & Web Deployment

- **Live Website:** [https://rayyan7687-coder.github.io/Hotel/](https://rayyan7687-coder.github.io/Hotel/)
- **Backend Service:** Google Apps Script Web App API (`Code.gs`)

---

## 📌 Features Overview

### 🏛️ Luxury Homepage & User Experience
- **Fixed Blur Navigation Bar:** Includes a responsive mobile menu toggle, smooth anchor links, dark mode toggle, and active page indicator.
- **Hero & Quick Search Bar:** Overlapping quick booking widget allowing users to search check-in/out dates, guest count, and room type, seamlessly populating data into the main booking page.
- **Featured Room Comparison Cards:** Desktop grid highlighting room pricing, capacity, bed size, area in sq.ft, key amenities, "View Details", and "Book Now" CTA buttons.
- **Interactive Lightbox Gallery:** Categorized gallery filters (Rooms, Pool & Spa, Dining) with full-screen lightbox modal, keyboard navigation (Left/Right/Esc), and next/previous controls.
- **Accessible FAQ Accordion:** Interactive drop-down answers addressing common guest queries (Check-in times, Wi-Fi, cancellation policy, parking).
- **Floating WhatsApp Button:** Fixed bottom-right quick contact trigger for instant customer inquiries.

### 🛌 Room Detail Pages
Dedicated detail pages with rich visual showcases, specifications, amenity lists, and direct reservation links:
1. **Standard Room** (`standard-room.html`) - ₹999 / night
2. **Deluxe Room** (`deluxe-room.html`) - ₹1,999 / night
3. **Executive Suite** (`executive-suite.html`) - ₹3,499 / night

### 💳 Dynamic Booking & Pricing Engine
- **Centralized Pricing Data:** Standardized room rates and configurable 9% GST tax rate.
- **Automatic Night Calculation:** Dynamically calculates stay duration based on selected check-in and check-out dates.
- **Live Booking Breakdown:** Displays real-time breakdown including Room Rate x Nights, Room Charges, Tax Amount, and Final Grand Total.
- **URL Parameter Auto-Fill:** Pre-populates booking form fields directly from Quick Search bar or Room Detail page CTA links.
- **Booking Confirmation Modal:** Generates a unique booking reference ID (`RLS-XXXX`) and renders a clean summary card upon submission.

### 🌗 Comprehensive Dark Mode & Accessibility
- System theme detection (`prefers-color-scheme`) with `localStorage` persistence across all pages.
- Full ARIA labels (`aria-label`, `aria-expanded`, `aria-hidden`), focus outline accessibility, and semantic HTML5 elements.

### 📬 Spam Protection & Backend Integration
- Integrated with Google Apps Script (`Code.gs`) to store bookings in Google Sheets and trigger automated confirmation emails via Gmail API.
- Client-side honeypot protection, submission cooldown, and date validation.

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3 (Custom Variables, CSS Grid, Flexbox), Vanilla JavaScript (ES6+).
- **Icons & Fonts:** Font Awesome 6.5, Google Fonts (Poppins).
- **Animations:** AOS (Animate On Scroll) library.
- **Backend:** Google Apps Script (`Code.gs`) integrated with Google Sheets & Gmail API.
- **Hosting:** GitHub Pages.

---

## 📁 Project Structure

```text
Hotel/
├── index.html              # Main homepage
├── booking.html            # Interactive booking page with price calculator
├── contact.html            # Contact page with Google Maps & information cards
├── standard-room.html      # Standard Room detail page
├── deluxe-room.html        # Deluxe Room detail page
├── executive-suite.html    # Executive Suite detail page
├── style.css               # Main stylesheet with CSS variables & dark mode
├── script.js              # Main application JS (Theme, Lightbox, Price Math, Form)
├── Code.gs                 # Google Apps Script backend source code
└── README.md               # Project documentation
```

---

## 🚀 How to Run Locally

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/rayyan7687-coder/Hotel.git
   cd Hotel
   ```

2. **Open in Browser:**
   Simply open `index.html` in any web browser or use VS Code's **Live Server** extension.

---

## ⚙️ Backend Integration (Google Apps Script)

To connect your own Google Sheet & Email service:
1. Open [Google Apps Script](https://script.google.com/).
2. Copy the contents of `Code.gs` into your Apps Script editor.
3. Update `HOTEL_EMAIL` variable with your target notification email address.
4. Deploy as a Web App with access granted to **"Anyone"**.
5. Update `SCRIPT_URL` at the top of `script.js` with your Web App deployment URL.

---

## 👨‍💻 Author

**Rayyan**
*Rayyan's Luxury Stay - College Project & Showcase*
