import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userData, setUserData] = useState(null); 
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setMessage(""); 

    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/login', 
        { email, password }
      );

      if (response.status === 200) {
        setMessage('Login successful!');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setTimeout(() => navigate('/Dashboard'), 1000);
      } else {
        setMessage('Unexpected response format.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response) {
        setMessage(error.response.data.message || 'An error occurred during login.');
      } else {
        setMessage('An error occurred while processing your request.');
      }
    } finally {
      setLoading(false);
    }
  };
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-header">
          <h2>Login Here</h2>
          <p>Please enter your credentials to login</p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`submit-button ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        <Link to="/register" className="link">
          Don't have an account? Register here
        </Link>
      </div>
      {userData && (
        <div className="profile-container">
          <div className="profile-icon" onClick={toggleDropdown}>
            <img src="https://via.placeholder.com/40" alt="Profile" />
          </div>

          {showDropdown && (
            <div className="dropdown-menu">
              <p><strong>Username:</strong> {userData.username}</p>
              <p><strong>Password:</strong> ********</p>
              <Link to="/profile" className="link">Go to Profile</Link>
              <button className="logout-btn" onClick={() => {
                localStorage.removeItem('user');
                setUserData(null);
                navigate('/login');
              }}>
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Login;