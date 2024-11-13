import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHome, FaSearch, FaPlus, FaBell, FaUser, FaFire,
  FaListAlt, FaLayerGroup, FaCalendarAlt, FaMoon, FaSun, FaSignOutAlt, FaHeart, FaComment
} from 'react-icons/fa';
import axiosInstance from '../utils/axiosConfig';
import { removeToken } from '../utils/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

const Events = ({ setIsAuth }) => {
  const [darkMode, setDarkMode] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleCreateEventClick = () => {
    navigate('/create-event');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = useCallback(async () => {
    try {
      await axiosInstance.post('/api/auth/logout/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      removeToken();
      setIsAuth(false);
      window.location.replace('/login');
    }
  }, [setIsAuth]);

  // if (isLoading) {
  //   return (
  //     <div className="loading-container">
  //       <div className="spinner-border text-primary" role="status">
  //         <span className="visually-hidden">Loading...</span>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>

      {/* Top Navbar */}
      <div className="navbar">
        <h2 className="logo">HobbyHive</h2>
        <div className="top-right-actions">
          <div onClick={toggleDarkMode} className="icon-container">
            {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
          </div>
          <div onClick={handleLogout} className="icon-container">
            <FaSignOutAlt size={24} title="Logout" />
          </div>
        </div>
      </div>

      <h1>Events Page</h1>
      <p>Here you'll find all the latest events.</p>
      <div className="floating-action-button" onClick={handleCreateEventClick}>
        <FaPlus size={24} />
      </div>

      {/* Bottom Navbar */}
      <div className="bottom-navbar">
        <FaHome size={24} onClick={() => handleNavigation('/dashboard')} />
        <div className="search-bar">
          <FaSearch />
          <input type="text" placeholder="Search" />
        </div>
        <FaBell size={24} onClick={() => alert('Notifications')} />
        <FaUser size={24} onClick={() => handleNavigation('/profile')} />
      </div>
    </div>
  );
};

export default Events;