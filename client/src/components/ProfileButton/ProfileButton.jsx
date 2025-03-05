import React, { useState, useEffect } from 'react';
import { FaUser, FaCaretDown, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './ProfileButton.css';

const ProfileButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      // Ensure all required fields exist
      const defaultUser = {
        username: 'User',
        email: 'user@example.com',
        userType: 'regular',
        ...user
      };
      setUserData(defaultUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!userData) return null;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getProfileColor = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
    if (!userData?.email) return colors[0];
    const hash = userData.email.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="profile-button-container">
      <button 
        className="profile-button"
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: getProfileColor() }}
      >
        {userData.profilePic ? (
          <img src={userData.profilePic} alt={userData.username} className="profile-image" />
        ) : (
          <span className="profile-initials">{getInitials(userData.username)}</span>
        )}
        <span className="profile-name">{userData.username || 'User'}</span>
        <FaCaretDown className={`dropdown-icon ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="dropdown-header">
            <div className="user-info">
              <strong>{userData.username || 'User'}</strong>
              <span className="user-email">{userData.email || 'No email provided'}</span>
              <span className="user-type">{userData.userType === 'ngo' ? 'NGO Partner' : 'Regular User'}</span>
            </div>
          </div>
          <div className="dropdown-divider"></div>
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
