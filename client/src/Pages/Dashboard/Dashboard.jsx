import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaUsers, FaHandHoldingHeart, FaChartLine, FaBell, FaCheckCircle, FaClock, FaTruck, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { Line, Doughnut } from 'react-chartjs-2';
import ProfileButton from '../../components/ProfileButton/ProfileButton';
import "./Dashboard.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Sample NGO data - replace with your actual NGO data
const NGO_DATA = [
  {
    id: 1,
    name: "Tumkur Food Bank",
    location: "Near City Market, Tumkur",
    phone: "080-12345678",
    email: "tumkurfoodbank@email.com",
  },
  {
    id: 2,
    name: "Sri Siddaganga Food Relief",
    location: "Siddaganga Mutt Road, Tumkur",
    phone: "080-23456789",
    email: "siddaganga.relief@email.com",
  }
];

const Dashboard = () => {
  const [donationStats, setDonationStats] = useState({
    total: 0,
    today: 0,
    week: 0,
    month: 0
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [monthlyDonations, setMonthlyDonations] = useState([]);
  const [donationTypes, setDonationTypes] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Chart data for donation trends
  const chartData = {
    labels: Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return date.toLocaleString('default', { month: 'short' });
    }),
    datasets: [
      {
        label: 'Donations',
        data: monthlyDonations,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  // Doughnut chart data for donation types
  const doughnutData = {
    labels: Object.keys(donationTypes),
    datasets: [
      {
        data: Object.values(donationTypes),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const DonationStatus = ({ status }) => {
    const getStatusColor = () => {
      switch (status.toLowerCase()) {
        case 'completed':
          return 'status-completed';
        case 'processing':
          return 'status-processing';
        case 'pending':
          return 'status-pending';
        default:
          return '';
      }
    };

    const getStatusIcon = () => {
      switch (status.toLowerCase()) {
        case 'completed':
          return <FaCheckCircle />;
        case 'processing':
          return <FaTruck />;
        case 'pending':
          return <FaClock />;
        default:
          return null;
      }
    };

    return (
      <span className={`status-badge ${getStatusColor()}`}>
        {getStatusIcon()} {status}
      </span>
    );
  };

  const NotificationPanel = ({ notifications, onClose }) => (
    <div className="notification-panel">
      <div className="notification-header">
        <h3>Notifications</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <div className="notification-list">
        {notifications.map(notification => (
          <div key={notification.id} className="notification-item">
            <div className="notification-content">
              <p>{notification.message}</p>
              <span className="notification-time">
                {new Date(notification.date).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    // Check if user is logged in and is an NGO
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    // Redirect regular users to their dashboard
    if (user.userType !== 'ngo') {
      navigate('/user-dashboard');
      return;
    }

    // Load donations and update notifications
    const loadDonations = () => {
      try {
        const storedDonations = JSON.parse(localStorage.getItem('donations')) || [];
        
        // Ensure storedDonations is an array
        if (!Array.isArray(storedDonations)) {
          console.error('Stored donations is not an array:', storedDonations);
          setDonationStats({ total: 0, today: 0, week: 0, month: 0 });
          setRecentDonations([]);
          return;
        }

        const now = new Date();
        const today = now.toDateString();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Calculate statistics
        const stats = {
          total: storedDonations.length,
          today: storedDonations.filter(d => new Date(d.date).toDateString() === today).length,
          week: storedDonations.filter(d => new Date(d.date) >= weekAgo).length,
          month: storedDonations.filter(d => new Date(d.date) >= monthAgo).length
        };

        // Get recent donations and add NGO details
        const recent = [...storedDonations]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
          .map(donation => {
            // Assign random NGO for demo - replace with actual NGO assignment logic
            const assignedNGO = NGO_DATA[Math.floor(Math.random() * NGO_DATA.length)];
            return { ...donation, assignedNGO };
          });

        // Generate notifications
        const newNotifications = recent.map(donation => ({
          id: donation.id,
          type: donation.status === 'pending' ? 'new' : 'status',
          message: donation.status === 'pending' 
            ? `New donation received from ${donation.donorName}`
            : `Donation status updated to ${donation.status}`,
          date: donation.date,
          donation: donation
        }));

        // Calculate monthly trends
        const last6Months = Array.from({ length: 6 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return date.toLocaleString('default', { month: 'short' });
        }).reverse();

        const monthlyData = last6Months.map(month => {
          return storedDonations.filter(d => {
            const donationMonth = new Date(d.date).toLocaleString('default', { month: 'short' });
            return donationMonth === month;
          }).length;
        });

        // Calculate donation types
        const types = storedDonations.reduce((acc, donation) => {
          acc[donation.foodType] = (acc[donation.foodType] || 0) + 1;
          return acc;
        }, {});

        setDonationStats(stats);
        setRecentDonations(recent);
        setMonthlyDonations(monthlyData);
        setDonationTypes(types);
        setNotifications(newNotifications);
      } catch (error) {
        console.error('Error loading donations:', error);
        // Set default values if there's an error
        setDonationStats({ total: 0, today: 0, week: 0, month: 0 });
        setRecentDonations([]);
        setMonthlyDonations([0, 0, 0, 0, 0, 0]);
        setDonationTypes({});
        setNotifications([]);
      }
    };

    loadDonations();

    // Add event listener for storage changes
    window.addEventListener('storage', loadDonations);
    return () => window.removeEventListener('storage', loadDonations);
  }, [navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'donations') {
      // Load and display recent donations
      const loadDonations = () => {
        try {
          const storedDonations = JSON.parse(localStorage.getItem('donations')) || [];
          
          // Ensure storedDonations is an array
          if (!Array.isArray(storedDonations)) {
            console.error('Stored donations is not an array:', storedDonations);
            setDonationStats({ total: 0, today: 0, week: 0, month: 0 });
            setRecentDonations([]);
            return;
          }

          const now = new Date();
          const today = now.toDateString();
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

          // Calculate statistics
          const stats = {
            total: storedDonations.length,
            today: storedDonations.filter(d => new Date(d.date).toDateString() === today).length,
            week: storedDonations.filter(d => new Date(d.date) >= weekAgo).length,
            month: storedDonations.filter(d => new Date(d.date) >= monthAgo).length
          };

          // Get recent donations and add NGO details
          const recent = [...storedDonations]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(donation => {
              // Assign random NGO for demo - replace with actual NGO assignment logic
              const assignedNGO = NGO_DATA[Math.floor(Math.random() * NGO_DATA.length)];
              return { ...donation, assignedNGO };
            });

          // Generate notifications
          const newNotifications = recent.map(donation => ({
            id: donation.id,
            type: donation.status === 'pending' ? 'new' : 'status',
            message: donation.status === 'pending' 
              ? `New donation received from ${donation.donorName}`
              : `Donation status updated to ${donation.status}`,
            date: donation.date,
            donation: donation
          }));

          // Calculate monthly trends
          const last6Months = Array.from({ length: 6 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            return date.toLocaleString('default', { month: 'short' });
          }).reverse();

          const monthlyData = last6Months.map(month => {
            return storedDonations.filter(d => {
              const donationMonth = new Date(d.date).toLocaleString('default', { month: 'short' });
              return donationMonth === month;
            }).length;
          });

          // Calculate donation types
          const types = storedDonations.reduce((acc, donation) => {
            acc[donation.foodType] = (acc[donation.foodType] || 0) + 1;
            return acc;
          }, {});

          setDonationStats(stats);
          setRecentDonations(recent);
          setMonthlyDonations(monthlyData);
          setDonationTypes(types);
          setNotifications(newNotifications);
        } catch (error) {
          console.error('Error loading donations:', error);
          // Set default values if there's an error
          setDonationStats({ total: 0, today: 0, week: 0, month: 0 });
          setRecentDonations([]);
          setMonthlyDonations([0, 0, 0, 0, 0, 0]);
          setDonationTypes({});
          setNotifications([]);
        }
      };
      loadDonations();
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>NGO Dashboard</h1>
        <div className="header-right">
          <div className="dashboard-tabs">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => handleTabChange('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
              onClick={() => handleTabChange('donations')}
            >
              Donations
            </button>
          </div>
          <div className="header-actions">
            <FaBell 
              className="notification-icon" 
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
            {showNotifications && (
              <NotificationPanel 
                notifications={notifications} 
                onClose={() => setShowNotifications(false)} 
              />
            )}
            <ProfileButton />
          </div>
        </div>
      </header>

      {activeTab === 'overview' ? (
        <>
          <div className="stats-container">
            <div className="stat-card">
              <FaUtensils className="stat-icon" />
              <div className="stat-info">
                <h3>Total Donations</h3>
                <p>{donationStats.total}</p>
              </div>
            </div>
            <div className="stat-card">
              <FaHandHoldingHeart className="stat-icon" />
              <div className="stat-info">
                <h3>Today's Donations</h3>
                <p>{donationStats.today}</p>
              </div>
            </div>
            <div className="stat-card">
              <FaUsers className="stat-icon" />
              <div className="stat-info">
                <h3>Weekly Donations</h3>
                <p>{donationStats.week}</p>
              </div>
            </div>
            <div className="stat-card">
              <FaChartLine className="stat-icon" />
              <div className="stat-info">
                <h3>Monthly Donations</h3>
                <p>{donationStats.month}</p>
              </div>
            </div>
          </div>

          <div className="charts-container">
            <div className="chart-card">
              <h3>Donation Trends</h3>
              <Line data={chartData} />
            </div>
            <div className="chart-card">
              <h3>Donation Types</h3>
              <Doughnut data={doughnutData} />
            </div>
          </div>
        </>
      ) : (
        <div className="recent-donations">
          <h3>Recent Donations</h3>
          <div className="donations-list">
            {recentDonations.map((donation) => (
              <div key={donation.id} className="donation-item">
                <div className="donation-info">
                  <div className="donation-header">
                    <h4>{donation.foodType}</h4>
                    <DonationStatus status={donation.status} />
                  </div>
                  
                  <div className="donation-details">
                    <p className="quantity">{donation.quantity} items</p>
                    <p className="description">{donation.description}</p>
                  </div>

                  <div className="donor-info">
                    <div className="donor-details">
                      <p className="donor-name">
                        <FaUsers className="icon" /> {donation.donorName}
                      </p>
                      <p className="donor-contact">
                        <FaPhone className="icon" /> {donation.contactNumber}
                      </p>
                    </div>
                    <div className="pickup-details">
                      <p className="pickup-address">
                        <FaMapMarkerAlt className="icon" /> {donation.pickupAddress}
                      </p>
                      <p className="pickup-time">
                        <FaClock className="icon" /> Preferred Time: {donation.preferredTime}
                      </p>
                      <p className="expiry-date">
                        <FaUtensils className="icon" /> Expiry: {donation.expiryDate}
                      </p>
                    </div>
                  </div>

                  {donation.assignedNGO && (
                    <div className="ngo-info">
                      <p className="ngo-name">
                        <strong>Assigned NGO:</strong> {donation.assignedNGO.name}
                      </p>
                      <p className="ngo-details">
                        <FaMapMarkerAlt className="icon" /> {donation.assignedNGO.location}
                        <br />
                        <FaPhone className="icon" /> {donation.assignedNGO.phone}
                      </p>
                    </div>
                  )}
                </div>
                <div className="donation-meta">
                  <span className="donation-date">
                    Donated on: {new Date(donation.date).toLocaleDateString()}
                  </span>
                  <span className="donation-time">
                    at {new Date(donation.date).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
