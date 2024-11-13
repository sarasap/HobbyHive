import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import PrivateRoute from './PrivateRoute';
import { isAuthenticated } from './utils/auth';
import CreatePost from './components/CreatePost';
import LandingPage from './components/LandingPage';
import ContactPage from './components/ContactPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import Dashboard from './components/Dashboard';
import AboutPage from './components/AboutPage';
import Events from './components/Events';
import Hobbies from './components/Hobbies';
import Trending from './components/Trending';
import Groups from './components/Groups';
import CreateEvent from './components/CreateEvent';

function App() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute isAuth={isAuth}>
              <Dashboard setIsAuth={setIsAuth} />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-post"
          element={
            <PrivateRoute isAuth={isAuth}>
              <CreatePost />
            </PrivateRoute>
          }
        />
        <Route path="/events" 
          element={ 
          <PrivateRoute isAuth={isAuth}>
            <Events />
          </PrivateRoute>
          } 
        />
        <Route path="/hobbies" element={<PrivateRoute isAuth={isAuth}><Hobbies /></PrivateRoute>} />
        <Route path="/trending" element={<PrivateRoute isAuth={isAuth}><Trending /></PrivateRoute>} />
        <Route path="/groups" element={<PrivateRoute isAuth={isAuth}><Groups /></PrivateRoute>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/create-event" element={<CreateEvent />} />
      </Routes>
    </Router>
  );
}

export default App;
