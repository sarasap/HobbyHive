import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import {
  FaHome, FaSearch, FaPlus, FaBell, FaUser, FaFire,
  FaListAlt, FaLayerGroup, FaCalendarAlt, FaMoon, FaSun, FaSignOutAlt, FaHeart, FaComment
} from 'react-icons/fa';
import './Dashboard.css';
import './CreateEvent.css';

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: 'social',
    maxAttendees: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/events/create-event/', eventData);
      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="create-event-container">

      <h1>Create New Event</h1>
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Event Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={eventData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={eventData.category}
            onChange={handleChange}
          >
            <option value="social">Social</option>
            <option value="business">Business</option>
            <option value="education">Education</option>
            <option value="sports">Sports</option>
            <option value="cultural">Cultural</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="maxAttendees">Maximum Attendees</label>
          <input
            type="number"
            id="maxAttendees"
            name="maxAttendees"
            value={eventData.maxAttendees}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Create Event
        </button>
      </form>

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

export default CreateEvent;