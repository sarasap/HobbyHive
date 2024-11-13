// src/components/CreatePost.js

import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome, FaSearch, FaPlus, FaBell, FaUser, FaFire,
  FaListAlt, FaLayerGroup, FaCalendarAlt, FaMoon, FaSun, FaSignOutAlt, FaHeart, FaComment
} from 'react-icons/fa';
import { removeToken } from '../utils/auth';
import axiosInstance from '../utils/axiosConfig';
import './CreatePost.css';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';

function CreatePost({setIsAuth}) {
  const [darkMode, setDarkMode] = useState(false);
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

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

  const location = useLocation();
  const addNewPost = location.state?.addNewPost;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
      
      if (!validTypes.includes(fileType)) {
        alert('Unsupported file type. Please upload an image in JPG, PNG, GIF, BMP, or WEBP format.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image file too large. Max size allowed is 5MB.');
        return;
      }

      // Read the file and set it as image source for preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageSrc(reader.result);
        setMedia(null); // Reset media until cropping is done
      };
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels
      );
      
      // Convert cropped image URL to a file
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
      
      setCroppedImage(croppedImage);
      setMedia(file); // Set the cropped image file as media to upload
      setImageSrc(null); // Close the cropping view
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!media) {
      setMessage('Please select an image or video to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('media', media);

    try {
      const response = await axiosInstance.post('/api/posts/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.status === 201) {
        setMessage('Post created successfully!');
        setCaption('');
        setMedia(null);
        if (addNewPost) {
          addNewPost(response.data); // Update the Dashboard with the new post
        }
        navigate('/dashboard', { state: { newPost: response.data } }); // Pass new post to Dashboard
      } else {
        setMessage(response.data.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while creating the post');
    }
  };

  return (
    <div className={`dashboard-container ${darkMode ? 'dark' : 'light'}`}>
      {/* Top Navbar */}
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
  
      {/* Content Wrapper */}
      <div className="content-wrapper">
        {/* Sidebar */}
        <div className={`sidebar ${darkMode ? 'dark' : ''}`}>
          <h3>Explore</h3>
          <ul>
            <li onClick={() => handleNavigation('/events')} className="sidebar-item">
              <FaCalendarAlt className="icon" />
              <div className="sidebar-text">Events</div>
              <span className="tooltip">Find upcoming events and gatherings.</span>
            </li>
            <li onClick={() => handleNavigation('/trending')} className="sidebar-item">
              <FaFire className="icon" />
              <div className="sidebar-text">Trending</div>
              <span className="tooltip">Discover what’s popular among hobbyists.</span>
            </li>
            <li onClick={() => handleNavigation('/hobbies')} className="sidebar-item">
              <FaListAlt className="icon" />
              <div className="sidebar-text">Hobbies</div>
              <span className="tooltip">Explore various hobbies and communities.</span>
            </li>
            <li onClick={() => handleNavigation('/groups')} className="sidebar-item">
              <FaLayerGroup className="icon" />
              <div className="sidebar-text">Groups</div>
              <span className="tooltip">Connect with groups of similar interests.</span>
            </li>
          </ul>
        </div>
  
        {/* Create Post Section */}
        <div className="create-post-container">
          <h2>Create New Post</h2>
          
          {/* Image Cropping Modal */}
          {imageSrc && (
            <div className="cropper-modal">
              <div className="cropper-container">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1} // 1:1 aspect ratio
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              
              <div className="crop-controls">
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />
                <div className="crop-buttons">
                  <button onClick={() => setImageSrc(null)}>Cancel</button>
                  <button onClick={showCroppedImage}>Crop</button>
                </div>
              </div>
            </div>
          )}

          {/* Cropped Image Preview */}
          {croppedImage && (
            <div className="cropped-image-preview">
              <img src={croppedImage} alt="Cropped" />
              <button onClick={() => {
                setCroppedImage(null);
                setMedia(null);
              }}>Change Image</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="create-post-form">
            <label>
              <strong>Upload Image:</strong>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </label>
            
            <label>
              <strong>Caption:</strong>
              <textarea
                value={caption}
                onChange={handleCaptionChange}
                placeholder="Write a caption..."
                rows="3"
              />
            </label>
            
            <button 
              type="submit" 
              className="create-post-button" 
              disabled={!media}
            >
              Post
            </button>
            {message && <p className="create-post-message">{message}</p>}
          </form>
        </div>
      </div>
  
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
  
      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 HobbyHive. Connecting hobby enthusiasts worldwide.</p>
      </footer>
    </div>
  );
}


export default CreatePost;
