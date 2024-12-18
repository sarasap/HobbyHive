import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import './HobbyDetailPage.css';

function HobbyDetailPage() {
  const { hobbyName } = useParams(); // Get the hobby name from the URL
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]); // State for users
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHobbyDetails = async () => {
      try {
        // Fetch posts and users for the selected hobby
        const response = await axiosInstance.get(`/api/hobbies/${hobbyName}/`);
        setPosts(response.data.posts); // Set posts
        setUsers(response.data.users); // Set users
      } catch (error) {
        console.error('Error fetching hobby details:', error);
      }
    };
    fetchHobbyDetails();
  }, [hobbyName]);

  const handleBackToHobbies = () => {
    navigate('/hobbies'); // Navigate back to hobbies list
  };

  return (
    <div className="hobby-detail-page">
      <button onClick={handleBackToHobbies}>Back to All Hobbies</button>
      <h1>{hobbyName.charAt(0).toUpperCase() + hobbyName.slice(1)}</h1>

      <div className="posts-section">
        <h2>Posts for {hobbyName}</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              {post.media_url && <img src={post.media_url} alt="Post" />}
              <p>{post.caption}</p>
              <p>
                <strong>By:</strong> {post.user}
              </p>
            </div>
          ))
        ) : (
          <p>No posts available for this hobby.</p>
        )}
      </div>

      <div className="users-section">
        <h2>Users in this Hobby</h2>
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="user-card">
              <p>{user.username}</p>
            </div>
          ))
        ) : (
          <p>No users have joined this hobby yet.</p>
        )}
      </div>
    </div>
  );
}

export default HobbyDetailPage;
