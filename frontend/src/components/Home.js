import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { removeToken } from '../utils/auth';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home({ setIsAuth }) {
  const [userData, setUserData] = useState(null);

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
      }
    };

    verifyAuth();
  }, [handleLogout]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-dark">
      <h1 className="text-center">Welcome to Home Page</h1>
      <p className="text-center">{userData.message}</p>
      <button 
        onClick={handleLogout} 
        className="btn btn-danger mt-3"
      >
        Logout
      </button>
    </div>
  );
}

export default Home;