import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { removeToken } from '../utils/auth';
import { FaHome, FaSearch, FaPlusSquare, FaHeart, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

function Home({ setIsAuth }) {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'HobbyHive - Home';
  }, []);

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

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/home/');
        setUserData(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          handleLogout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [handleLogout]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <div className="navbar">
        <h2 className="logo">HobbyHive</h2>
        <div className="profile-actions">
          <FaSignOutAlt 
            size={24} 
            onClick={handleLogout}
            className="logout-icon"
            title="Logout"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="content-area">
        {userData?.message && (
          <div className="user-message">
            {userData.message}
          </div>
        )}
        <div className="post-placeholder">
          <p>Posts will appear here</p>
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="bottom-navbar">
        <FaHome size={24} className="nav-icon active" />
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search" />
        </div>
        <FaPlusSquare size={24} className="nav-icon" />
        <FaHeart size={24} className="nav-icon" />
        <FaUserCircle size={24} className="nav-icon" />
      </div>
    </div>
  );
}

export default Home;