import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import Layout from '../components/Layout';
import './Hobbies.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

function HobbiesPage({ setIsAuth }) {
  const [hobbies, setHobbies] = useState([]);
  const [newHobby, setNewHobby] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

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
      const hobbyName = response.data.name.toLowerCase().replace(' ', '-');
      navigate(`/hobbies/${hobbyName}/`); // Redirect to the new hobby page
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to add hobby');
    }
  };

  const handleHobbySelect = (hobbyName) => {
    if (hobbyName) {
      const hobbySlug = hobbyName.toLowerCase().replace(' ', '-');
      navigate(`/hobbies/${hobbySlug}/`); // Redirect to the selected hobby's page
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
          <h3>Select a Hobby</h3>
          <select onChange={(e) => handleHobbySelect(e.target.value)} defaultValue="">
            <option value="" disabled>
              Select a hobby
            </option>
            {hobbies.map((hobby) => (
              <option key={hobby.id} value={hobby.name}>
                {hobby.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Layout>
  );
}

export default HobbiesPage;
