import React, { useState, useEffect } from 'react';
import { FaHandsHelping, FaMapMarkedAlt, FaBell, FaChartLine, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [totalFoodDonated, setTotalFoodDonated] = useState(0);
  const [recentDonations, setRecentDonations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const navigate = useNavigate();

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem('user'));
    if (storedProfile) {
      setProfile(storedProfile);
      fetchData();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [donationsResponse, notificationsResponse] = await Promise.all([
        axios.get('/api/donations/total'),
        axios.get('/api/notifications'),
      ]);

      setTotalFoodDonated(donationsResponse.data.totalDonations);
      setRecentDonations(donationsResponse.data.recentDonations || []);
      setNotifications(notificationsResponse.data.notifications || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHelpCenterClick = async () => {
    try {
      await axios.post('/api/notifications/help-center', {
        message: 'Help Center requested via the dashboard',
      });
      alert('Help Center has been notified!');
    } catch (error) {
      console.error('Error notifying Help Center:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user data from localStorage
    navigate('/login'); // Navigate to login page
  };

  const renderNotifications = () => {
    if (notifications.length === 0) {
      return <p>No new notifications</p>;
    }
    return notifications.map((notification, index) => (
      <div key={index} className="notification-item">
        {notification.message}
      </div>
    ));
  };

  return (
    <div className="dashboard-container">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="header-content">
            <h1>Dashboard</h1>
            {profile && (
              <div className="profile-section">
                {/* Profile icon with dropdown toggle */}
                <div className="profile-icon" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <FaUserCircle size={30} />
                </div>

                {/* Profile dropdown content */}
                {isDropdownOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-info">
                      <p><strong style={{color:"black"}}>username:{profile.name}</strong></p>
                      <p> <strong style={{color:"black"}}>email:{profile.email}</strong></p>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="main-content">
            <div
              className="ngo-section clickable"
              onClick={() => navigate('/map')}
            >
              <FaMapMarkedAlt size={30} />
              <h2>Nearby NGOs</h2>
              <p>Find NGOs near you on the map</p>
            </div>
            <div
              className="donation-section clickable"
              onClick={() => navigate('/donations')}
            >
              <h2>Total Food Donations</h2>
              <p>{totalFoodDonated} Meals Donated</p>
              <ul>
                {recentDonations.slice(0, 3).map((donation, idx) => (
                  <li key={idx}>{donation.name} - {donation.amount} meals</li>
                ))}
              </ul>
            </div>
            <div
              className="help-section clickable"
              onClick={handleHelpCenterClick}
            >
              <FaHandsHelping size={30} />
              <h2>Help and Center</h2>
              <p>Contact the help center for urgent needs</p>
            </div>
          </div>

          <div className="additional-content">
            <div className="notifications">
              <h3>
                <FaBell /> Notifications
              </h3>
              {renderNotifications()}
            </div>

            <div className="leaderboard">
              <h3>
                <FaChartLine /> Top Donors
              </h3>
              <p>Coming Soon...</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
