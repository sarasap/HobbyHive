import {React, useEffect} from 'react';
import './Dashboard.css';
import { FaHome, FaSearch, FaPlusSquare, FaHeart, FaUserCircle } from 'react-icons/fa';


const Dashboard = () => {
  useEffect(() => {
    document.title = 'HobbyHive - Home';
  }, []);

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <div className="navbar">
        <h2 className="logo">HobbyHive</h2>
        <div className="profile-icon">
          <FaUserCircle size={24} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="content-area">
        <div className="post-placeholder">
          <p>Posts will appear here</p>
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="bottom-navbar">
        <FaHome size={24} />
        <div className="search-bar">
          <FaSearch />
          <input type="text" placeholder="Search" />
        </div>
        <FaPlusSquare size={24} />
        <FaHeart size={24} />
        <FaUserCircle size={24} />
      </div>
    </div>
  );
};

export default Dashboard;
