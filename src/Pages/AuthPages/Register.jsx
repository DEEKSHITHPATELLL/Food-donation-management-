import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import axios from 'axios'; 
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    organizationName: '',
    email: '',
    password: '',
    acceptTerms: false,
    userType: 'user', 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'password') calculatePasswordStrength(value);
  };
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return '#ff4d4d';
    if (passwordStrength <= 50) return '#ffd700'; 
    if (passwordStrength <= 75) return '#2ecc71'; 
    return '#27ae60'; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.acceptTerms) {
      setError('You must accept the terms and conditions.');
      return;
    }
    if (passwordStrength < 50) {
      setError('Password is too weak. Please make it stronger.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/auth/register',
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Store user information
        const userData = {
          username: formData.name,
          email: formData.email,
          userType: formData.userType,
          organizationName: formData.organizationName || ''
        };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userType', formData.userType);
        
        console.log('Registration successful, user type:', formData.userType);
        alert('Registration successful!');
        navigate('/login');
      } else {
        setError(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Join our community of food donors</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Choose a username"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Organization</label>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="organizationName"
                className="form-input"
                placeholder="Choose an organization"
                value={formData.organizationName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="password-strength">
              <div
                className="strength-bar"
                style={{
                  width: `${passwordStrength}%`,
                  backgroundColor: getStrengthColor(),
                }}
              ></div>
            </div>
            <span className="strength-text" style={{ color: getStrengthColor() }}>
              {passwordStrength <= 25
                ? 'Weak'
                : passwordStrength <= 50
                ? 'Fair'
                : passwordStrength <= 75
                ? 'Good'
                : 'Strong'}
            </span>
          </div>

          <div className="terms-checkbox">
            <input
              type="checkbox"
              name="acceptTerms"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
            />
            <label htmlFor="acceptTerms">
              I agree to the <Link to="/terms">Terms of Service</Link> and{' '}
              <Link to="/privacy">Privacy Policy</Link>
            </label>
          </div>

          <div className="user-type-selection">
            <label className="form-label">Register as:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="user"
                  checked={formData.userType === 'user'}
                  onChange={handleChange}
                />
                Regular User
              </label>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="ngo"
                  checked={formData.userType === 'ngo'}
                  onChange={handleChange}
                />
                NGO
              </label>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className={`register-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || !formData.acceptTerms}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="social-register">
          <p className="social-register-title">Or sign up with</p>
          <div className="social-buttons">
            <button className="social-button">
              <FaGoogle />
            </button>
            <button className="social-button">
              <FaFacebook />
            </button>
          </div>
        </div>

        <div className="login-link">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
