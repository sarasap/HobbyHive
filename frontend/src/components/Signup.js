import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'HobbyHive - Signup';
  }, []);

  // Check password requirements as user types
  useEffect(() => {
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@$!%*?&]/.test(password)
    });
  }, [password]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (password !== confirm_password) {
      setMessage('Passwords do not match!');
      setLoading(false);
      return;
    }

    const allRequirementsMet = Object.values(passwordRequirements).every(req => req);
    if (!allRequirementsMet) {
      setMessage('Please meet all password requirements');
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post('/api/auth/register/', {
        username,
        email,
        password,
        confirm_password
      });

      if (response.status === 201) {
        setMessage('Signup successful!');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.username || 
                         error.response?.data?.email || 
                         error.response?.data?.password ||
                         error.response?.data?.non_field_errors ||
                         'Registration failed. Please try again.';
      setMessage(typeof errorMessage === 'object' ? errorMessage[0] : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create an Account</h2>
        
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm_password}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />

          <div className="password-requirements">
            <div className={passwordRequirements.length ? 'requirement-met' : ''}>
              ✓ 8 characters minimum
            </div>
            <div className={passwordRequirements.uppercase ? 'requirement-met' : ''}>
              ✓ One uppercase letter
            </div>
            <div className={passwordRequirements.lowercase ? 'requirement-met' : ''}>
              ✓ One lowercase letter
            </div>
            <div className={passwordRequirements.number ? 'requirement-met' : ''}>
              ✓ One number
            </div>
            <div className={passwordRequirements.special ? 'requirement-met' : ''}>
              ✓ One special character (@$!%*?&)
            </div>
          </div>
          
          <button 
            type="submit" 
            className="signup-button"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="login-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
