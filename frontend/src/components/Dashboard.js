import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHome, FaSearch, FaPlus, FaBell, FaUser, FaFire,
  FaListAlt, FaLayerGroup, FaCalendarAlt, FaMoon, FaSun, FaSignOutAlt, FaHeart, FaComment
} from 'react-icons/fa';
import axiosInstance from '../utils/axiosConfig';
import { removeToken } from '../utils/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

function Dashboard({ setIsAuth }) {
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const navigate = useNavigate();

  // Toggle between light and dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  // Handle logout and navigate to login page
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

  // Verify authentication and fetch user data
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/home/');
        setUserData(response.data);
        await fetchPosts();
      } catch (error) {
        if (error.response && error.response.status === 401) {
          handleLogout(); // Log out if unauthorized
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [handleLogout]);

  useEffect(() => {
    document.title = 'HobbyHive - Dashboard';
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get('/api/posts/');
      setPosts(response.data); // Update posts state with fetched data
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleLike = async (postId) => {
    try {
      await axiosInstance.post(`/api/posts/${postId}/like/`);
      fetchPosts();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleCommentChange = (postId, value) => {
    setNewComment((prev) => ({
      ...prev,
      [postId]: value
    }));
  };

  const submitComment = async (postId) => {
    try {
      await axiosInstance.post(`/api/posts/${postId}/comment/`, {
        text: newComment[postId],
      });
      fetchPosts();
      setNewComment((prev) => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleComment = (postId) => {
    navigate(`/posts/${postId}/comment`);
  };

  const addNewPost = (post) => {
    setPosts([post, ...posts]); // Prepend the new post to the posts array
  };

  // Navigate to different routes
  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleCreatePostClick = () => {
    navigate('/create-post');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

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

        {/* Main Content Area */}
        <div className="content-area">
          {/* Welcome Banner */}
          <div className="welcome-banner">
            <h1>Welcome to HobbyHive!</h1>
            <p>Connect, Share, and Explore Hobbies with enthusiasts around the world.</p>
          </div>

          {/* User-Specific Message */}
          {userData?.message && (
            <div className="user-message">
              {userData.message}
            </div>
          )}

          {/* Featured Cards */}
          <div className="featured-cards">
            <div className="card">
              <h3>Upcoming Events</h3>
              <p>Stay tuned for events that bring hobbyists together!</p>
            </div>
            <div className="card">
              <h3>Trending Hobbies</h3>
              <p>Discover popular hobbies and join the community!</p>
            </div>
            <div className="card">
              <h3>Groups</h3>
              <p>Connect with like-minded people and form groups.</p>
            </div>
          </div>

          {/* Posts Section */}
          <div className="posts-section">
            <h2>Posts</h2>
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <strong>{post.user}</strong>
                    <span>{new Date(post.created_at).toLocaleString()}</span>
                  </div>
                  {post.media_url && (
                    <div className="post-media">
                      {post.media_url.endsWith(".mp4") || post.media_url.endsWith(".webm") ? (
                        <video src={post.media_url} controls />
                      ) : (
                        <img src={post.media_url} alt="Post media" />
                      )}
                    </div>
                  )}
                  <div className="post-caption">
                    <p>{post.caption}</p>
                  </div>
                  <div className="post-actions">
                    <button onClick={() => handleLike(post.id)} className="like-button">
                      <FaHeart /> {post.likes_count}
                    </button>
                    <button onClick={() => toggleComments(post.id)} className="comment-button">
                      <FaComment /> {post.comments.length}
                    </button>
                  </div>
                  {/* comment section */}
                  {showComments[post.id] && (
                    <div className="comments-section">
                      <div className='comments-list'>
                        {post.comments.map((comment) => (
                          <p key={comment.id}>
                            <strong>{comment.user}</strong>{comment.text}
                          </p>
                        ))}
                      </div>
                      <div className='comment-input'>
                        <input type="text" placeholder="Add a comment..." value={newComment[post.id] || ''}
                          onChange={(e) => handleCommentChange(post.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') submitComment(post.id);
                          }}
                        />
                        <button onClick={() => submitComment(post.id)}>Post</button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button for Creating New Posts */}
      <div className="floating-action-button" onClick={handleCreatePostClick}>
        <FaPlus size={24} />
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

export default Dashboard;
