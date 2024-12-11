// Layout.js
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from './TopNavbar';
import BottomNavbar from './BottomNavbar';
import Footer from './Footer';
import axiosInstance from '../utils/axiosConfig';
import { removeToken } from '../utils/auth';

const Layout = ({ setIsAuth, children }) => {
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-mode');
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

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className={`dashboard-container ${darkMode ? 'dark' : 'light'}`}>
            <TopNavbar
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                handleLogout={handleLogout}
            />
            {children}
            <BottomNavbar handleNavigation={handleNavigation} />
            <Footer />
        </div>
    );
};

export default Layout;
