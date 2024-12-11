import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import Layout from '../components/Layout';
import './Hobbies.css'; // Import the CSS file

function HobbiesPage({ setIsAuth }) {
  const [hobbies, setHobbies] = useState([]);
  const [newHobby, setNewHobby] = useState('');
  const [message, setMessage] = useState('');
  const [selectedHobby, setSelectedHobby] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const response = await axiosInstance.get('/api/hobbies/');
        setHobbies(response.data);
      } catch (error) {
        console.error('Error fetching hobbies:', error);
      }
    };
    fetchHobbies();
  }, []);

  const handleAddHobby = async (e) => {
    e.preventDefault();
    if (!newHobby.trim()) {
      setMessage('Hobby name cannot be empty');
      return;
    }
    try {
      const response = await axiosInstance.post('/api/hobbies/', { name: newHobby });
      setHobbies([...hobbies, response.data]);
      setNewHobby('');
      setMessage('Hobby added successfully');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to add hobby');
    }
  };

  const handleHobbySelect = async (e) => {
    const hobbyId = e.target.value;
    setSelectedHobby(hobbyId);
    if (hobbyId) {
      try {
        const response = await axiosInstance.get(`/api/hobbies/${hobbyId}/posts/`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    } else {
      setPosts([]);
    }
  };

  return (
    <Layout setIsAuth={setIsAuth}>
      <div className="hobbies-container">
        <h2>Create Hobbies</h2>

        <form className="hobby-form" onSubmit={handleAddHobby}>
          <input
            type="text"
            placeholder="Add a new hobby"
            value={newHobby}
            onChange={(e) => setNewHobby(e.target.value)}
            required
          />
          <button type="submit">Add Hobby</button>
        </form>

        {message && <p className="message">{message}</p>}

        <div className="hobby-selector">
          <h3>Select a Hobby to View Posts</h3>
          <select onChange={handleHobbySelect} defaultValue="">
            <option value="" disabled>
              Select a hobby
            </option>
            {hobbies.map((hobby) => (
              <option key={hobby.id} value={hobby.id}>
                {hobby.name}
              </option>
            ))}
          </select>
        </div>

        {selectedHobby && (
          <div className="posts-container">
            <h3>Posts for Selected Hobby</h3>
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
              <p className="no-posts">No posts available for this hobby.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default HobbiesPage;
