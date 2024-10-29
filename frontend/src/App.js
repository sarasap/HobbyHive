import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import PrivateRoute from './PrivateRoute';
import { isAuthenticated } from './utils/auth';
import CreatePost from './components/CreatePost';
import ListPosts from './components/ListPost';
import LandingPage from './components/LandingPage';
import ContactPage from './components/ContactPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import Dashboard from './components/Dashboard';
import AboutPage from './components/AboutPage';

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
          path="/home"
          element={
            <PrivateRoute isAuth={isAuth}>
              <Home setIsAuth={setIsAuth} />
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
        <Route
          path="/list-posts"
          element={
            <PrivateRoute isAuth={isAuth}>
              <ListPosts />
            </PrivateRoute>
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
