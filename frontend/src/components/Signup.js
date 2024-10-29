import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setconfirm_password] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'HobbyHive - Signup';
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.');
      setLoading(false);
      return;
    }

    if (password !== confirm_password) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    const payload = { username, email, password, confirm_password };
  
    try {
      const registerResponse = await axiosInstance.post('/api/auth/register/', payload);

      if (registerResponse.status === 201) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Signup error:', error);
      if (error.response?.data) {
        const errorMessage = error.response.data.username || 
                           error.response.data.email || 
                           error.response.data.password ||
                           error.response.data.non_field_errors ||
                           error.response.data.message ||
                           'Registration failed. Please try again.';
        setError(typeof errorMessage === 'object' ? errorMessage[0] : errorMessage);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`d-flex justify-content-center align-items-center vh-100 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="card-title text-center mb-4">Sign Up</h2>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSignup}>
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
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input 
              type="email" 
              id="email" 
              className="form-control" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={loading}
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
              disabled={loading}
            />
            <small className="form-text text-muted">
              Must be 8 characters or more with at least one uppercase, one lowercase, one number, and one special character.
            </small>
          </div>
          <div className="mb-3">
            <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
            <input 
              type="password" 
              id="confirm_password" 
              className="form-control" 
              placeholder="Confirm your password"
              value={confirm_password}
              onChange={(e) => setconfirm_password(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="btn w-100" 
            style={{ backgroundColor: '#ff7f50', color: 'white' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing up...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        <p className="text-center mt-3 mb-0">
          Already have an account? <Link to="/login" className={darkMode ? 'text-light' : 'text-dark'}>Login</Link>
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

export default Signup;