import React, { createContext, useState, useEffect } from 'react';

export const HotelContext = createContext();

export const HotelProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      if (data.status === 'success') {
        setConfig(data.data);
      }
    } catch (err) {
      console.error('Failed to load hotel config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <HotelContext.Provider value={{ config, setConfig, fetchConfig, loading, theme, toggleTheme }}>
      {children}
    </HotelContext.Provider>
  );
};
