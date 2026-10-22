import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HotelProvider } from './context/HotelContext';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import StandardRoom from './pages/StandardRoom';
import DeluxeRoom from './pages/DeluxeRoom';
import ExecutiveSuite from './pages/ExecutiveSuite';
import Booking from './pages/Booking';
import Feedback from './pages/Feedback';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <HotelProvider>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms/standard-room" element={<StandardRoom />} />
            <Route path="/rooms/deluxe-room" element={<DeluxeRoom />} />
            <Route path="/rooms/executive-suite" element={<ExecutiveSuite />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HotelProvider>
  );
}
