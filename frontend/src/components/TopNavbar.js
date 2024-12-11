// TopNavbar.js
import React from 'react';
import { FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa';

const TopNavbar = ({ darkMode, toggleDarkMode, handleLogout }) => (
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
);

export default TopNavbar;
