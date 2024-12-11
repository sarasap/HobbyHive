// BottomNavbar.js
import React from 'react';
import { FaHome, FaSearch, FaBell, FaUser } from 'react-icons/fa';

const BottomNavbar = ({ handleNavigation }) => (
    <div className="bottom-navbar">
        <FaHome size={24} onClick={() => handleNavigation('/dashboard')} />
        <div className="search-bar">
            <FaSearch />
            <input type="text" placeholder="Search" />
        </div>
        <FaBell size={24} onClick={() => alert('Notifications')} />
        <FaUser size={24} onClick={() => handleNavigation('/profile')} />
    </div>
);

export default BottomNavbar;
