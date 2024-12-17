import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import {
  FaHome, FaSearch, FaBell, FaUser,
} from 'react-icons/fa';
import './Dashboard.css';
import './CreateEvent.css';


const CreateEvent = ({ setIsAuth}) => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: 'social',
    maxAttendees: '',
  });
  const [imageFile, setImageFile] = useState(null); // For handling image upload
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    // Append form data fields
    Object.keys(eventData).forEach((key) => {
      formData.append(key, eventData[key]);
    });

    // Append image file if available
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await axiosInstance.post('/api/events/create-event/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/events'); // Navigate to events page after successful submission
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Error creating event:', error.response.data.detail);
        window.alert(error.response.data.detail);
      } else {
        console.error('Unexpected error:', error);
        window.alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // Set the selected file
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="create-event-container">
      <h1>Create New Event</h1>
      {/* Display the error message if exists */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
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

        <div className="form-group">
          <label htmlFor="image">Event Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
          />
          {imageFile && (
            <p className="file-name">
              Selected File: <strong>{imageFile.name}</strong>
            </p>
          )}
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
