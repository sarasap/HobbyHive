import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { setToken } from '../utils/auth';

function Login({ setIsAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'HobbyHive - Login';
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login/', {
        username,
        password,
      });

      const token = response.data.token;
      setToken(token);
      setIsAuth(true);
      navigate('/home');
    } catch (error) {
      alert('Invalid credentials');
    }
  };
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`d-flex justify-content-center align-items-center vh-100 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="card-title text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn w-100" style={{ backgroundColor: '#ff7f50', color: 'white' }}>Login</button>
        </form>
        <p className="text-center mt-3 mb-0">
          Don't have an account? <Link to="/signup" className={darkMode ? 'text-light' : 'text-dark'}>Create Account</Link>
        </p>
      </div>


      <button
        className={`btn position-fixed bottom-0 end-0 m-4 ${darkMode ? 'btn-light' : 'btn-dark'}`}
        onClick={toggleDarkMode}
        style={{ borderRadius: '50%', width: '50px', height: '50px' }}
      >
        {darkMode ? '🌞' : '🌜'}
      </button>
    </div>
  );
}

export default Login;
