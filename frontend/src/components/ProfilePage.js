// src/components/ProfilePage.js

import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import './ProfilePage.css';
import { FaCamera, FaEdit, FaSave, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import Layout from '../components/Layout';

function ProfilePage({ setIsAuth }) {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [availableHobbies, setAvailableHobbies] = useState([]);
  const [joinedHobbies, setJoinedHobbies] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectedHobby, setSelectedHobby] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.title = 'HobbyHive - Profile';
    fetchProfile();
    fetchHobbies();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/profile/');
      setProfile(response.data);
      setJoinedHobbies(response.data.hobbies || []); // Populate joinedHobbies
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };


  const fetchHobbies = async () => {
    try {
      const response = await axiosInstance.get('/api/hobbies/');
      setAvailableHobbies(response.data);
    } catch (error) {
      console.error('Error fetching hobbies:', error);
    }
  };

  const handleJoinHobby = async (hobbyId) => {
    try {
      const updatedProfile = {
        bio: profile.bio || '',
        location: profile.location || '',
        hobbies: [...joinedHobbies, hobbyId],
      };
      const response = await axiosInstance.put('/api/auth/profile/', updatedProfile);
      setProfile(response.data);
      setJoinedHobbies(response.data.hobbies);
      setMessage('Hobby joined successfully!');
      fetchProfile(); // Refresh profile data after updating
    } catch (error) {
      if (error.response) {
        console.error('Response error:', error.response.data);
        setMessage(error.response.data.error || 'Failed to join hobby');
      } else {
        console.error('Request error:', error);
        setMessage('An error occurred while joining the hobby');
      }
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfilePictureChange = (e) => {
    if (e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
      setProfile({
        ...profile,
        profile_picture_preview: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleBackgroundImageChange = (e) => {
    if (e.target.files[0]) {
      setBackgroundImage(e.target.files[0]);
      setProfile({
        ...profile,
        background_image_preview: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  // eslint-disable-next-line no-unused-vars
  const handleSave = async () => {
    const formData = new FormData();
    formData.append('bio', profile.bio || '');
    formData.append('location', profile.location || '');
    formData.append('hobbies', joinedHobbies);
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }

    try {
      const response = await axiosInstance.put('/api/auth/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfile(response.data);
      setMessage('Profile updated successfully!');
      setEditMode(false);
      setProfilePicture(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile');
    }
  };

  return (
    <Layout setIsAuth={setIsAuth}>
    <div className="profile-container">
        <div className="profile-background">
          <img
            src={
              profile.background_image_preview ||
              profile.background_image ||
              '/default-background.jpg'
            }
            alt="Background"
            className="background-image"
          />
          {editMode && (
            <div className="background-upload-icon">
              <label htmlFor="background-image-upload">
                <FaCamera />
              </label>
              <input
                id="background-image-upload"
                type="file"
                accept="image/*"
                onChange={handleBackgroundImageChange}
              />
            </div>
          )}
        </div>

        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-picture-container">
              <img
                src={
                  profile.profile_picture_preview ||
                  profile.profile_picture ||
                  '/default-profile.png'
                }
                alt="Profile"
                className="profile-picture"
              />
              {editMode && (
                <div className="upload-icon">
                  <label htmlFor="profile-picture-upload">
                    <FaCamera />
                  </label>
                  <input
                    id="profile-picture-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                  />
                </div>
              )}
            </div>
            <h2 className="profile-username">{profile.username}</h2>
            <p className="profile-join-date">Joined: {profile.join_date || 'Date not available'}</p>
            <button
              className="edit-button"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? <FaSave /> : <FaEdit />}
              {editMode ? 'Save' : 'Edit Profile'}
            </button>
          </div>
          {message && <p className="profile-message">{message}</p>}

          {/* Joined Hobbies */}
          <div className="hobbies-section">
            <h3>Joined Hobbies</h3>
            <ul>
              {joinedHobbies.map((hobbyId) => {
                const hobby = availableHobbies.find((h) => h.id === hobbyId);
                return hobby ? <li key={hobby.id}>{hobby.name}</li> : null;
              })}
            </ul>
          </div>

          <div className="hobbies-section">
            <h3>Join a Hobby</h3>
            <label>
              <select
                value=""
                onChange={(e) => handleJoinHobby(e.target.value)}
                className="dropdown"
              >
                <option value="" disabled>
                  -- Select a hobby --
                </option>
                {availableHobbies
                  .filter((hobby) => !joinedHobbies.includes(hobby.id)) // Exclude already joined hobbies
                  .map((hobby) => (
                    <option key={hobby.id} value={hobby.id}>
                      {hobby.name}
                    </option>
                  ))}
              </select>
            </label>
          </div>



          <div className="profile-details">
            <label>
              <strong>Bio:</strong>
              {editMode ? (
                <textarea
                  name="bio"
                  value={profile.bio || ''}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.bio || 'Add a bio to your profile.'}</p>
              )}
            </label>
            <label>
              <strong>Location:</strong>
              {editMode ? (
                <input
                  type="text"
                  name="location"
                  value={profile.location || ''}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.location || 'Set your location.'}</p>
              )}
            </label>
            <div className="social-links">
              <strong>Social Links:</strong>
              <div className="social-icons">
                <a href={profile.twitter_link || '#'} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                <a href={profile.linkedin_link || '#'} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                <a href={profile.instagram_link || '#'} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              </div>
              {editMode && (
                <div className="social-edit">
                  <input
                    type="text"
                    name="twitter_link"
                    placeholder="Twitter URL"
                    value={profile.twitter_link || ''}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="linkedin_link"
                    placeholder="LinkedIn URL"
                    value={profile.linkedin_link || ''}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="instagram_link"
                    placeholder="Instagram URL"
                    value={profile.instagram_link || ''}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="activity-feed">
          <h3>Recent Activity</h3>
          {/* Replace with dynamic content */}
          <ul>
            <li>Shared a new post about hiking</li>
            <li>Liked a post on painting</li>
            <li>Joined the group "Photography Enthusiasts"</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}

export default ProfilePage;