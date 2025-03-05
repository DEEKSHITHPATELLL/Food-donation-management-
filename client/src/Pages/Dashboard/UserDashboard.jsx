import React, { useState, useEffect } from 'react';
import { FaUtensils, FaHandHoldingHeart, FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaPhoneAlt, FaEnvelope, FaStar, FaMapMarked, FaDonate } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './UserDashboard.css';
import { useNavigate } from 'react-router-dom';
import ProfileButton from '../../components/ProfileButton/ProfileButton';

ChartJS.register(ArcElement, Tooltip, Legend);

// Custom marker icons
const ngoIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ngoImages = [
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1459183885421-5cc683b8dbba?w=500&auto=format&fit=crop'
];

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is a regular user
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    // Redirect NGO users to their dashboard
    if (user.userType === 'ngo') {
      navigate('/dashboard');
      return;
    }

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    }
  }, [navigate]);

  const stats = [
    {
      icon: <FaUtensils />,
      title: 'Meals Served',
      value: '50,000+',
      description: 'Successfully distributed over 50,000 meals to communities in need, making a significant impact in fighting hunger.'
    },
    {
      icon: <FaHandHoldingHeart />,
      title: 'Active Donors',
      value: '1,000+',
      description: 'A growing community of over 1,000 dedicated donors, including individuals, restaurants, and corporations.'
    },
    {
      icon: <FaUsers />,
      title: 'NGO Partners',
      value: '50+',
      description: 'Collaborating with more than 50 verified NGOs to ensure efficient food distribution and maximum impact.'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Cities Covered',
      value: '10+',
      description: 'Operating in over 10 major cities, with plans to expand our reach to more locations.'
    }
  ];

  const services = [
    {
      title: 'Food Donation',
      description: 'Our flagship service enables seamless food donation from individuals and businesses. We ensure proper food handling, storage, and timely distribution to those in need. Our technology platform makes it easy to schedule pickups and track your donations.',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&h=300&fit=crop',
      features: [
        'Easy donation scheduling',
        'Safe food handling protocols',
        'Real-time donation tracking',
        'Impact reporting'
      ]
    },
    {
      title: 'NGO Collaboration',
      description: 'We partner with verified NGOs to create a robust distribution network. Our platform connects donors directly with NGOs, ensuring efficient resource allocation and maximum impact. NGOs can manage their requirements and coordinate pickups through our system.',
      image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=500&h=300&fit=crop',
      features: [
        'Verified NGO partnerships',
        'Resource management system',
        'Coordination platform',
        'Performance analytics'
      ]
    },
    {
      title: 'Food Pickup',
      description: 'Our dedicated pickup service ensures timely collection of donations. We have a network of verified volunteers and transportation partners who follow strict food safety guidelines. Real-time tracking keeps donors informed about their contribution\'s journey.',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500&h=300&fit=crop',
      features: [
        'Scheduled pickups',
        'Verified volunteers',
        'Safety protocols',
        'Live tracking'
      ]
    }
  ];

  const achievements = [
    {
      title: 'Zero Hunger Initiative',
      description: 'Our flagship program has successfully provided meals to 10,000 families in need. Through strategic partnerships and efficient distribution networks, we\'ve created sustainable feeding programs in multiple communities.',
      image: 'https://images.unsplash.com/photo-1459183885421-5cc683b8dbba?w=500&h=300&fit=crop',
      stats: {
        familiesHelped: 10000,
        mealsProvided: 50000,
        volunteers: 500
      }
    },
    {
      title: 'Community Impact',
      description: 'Built a network of over 500 regular donors who contribute consistently. Our community engagement programs have raised awareness about food waste and hunger, leading to increased participation and support.',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=500&h=300&fit=crop',
      stats: {
        regularDonors: 500,
        communityEvents: 50,
        awarenessReach: 100000
      }
    },
    {
      title: 'Food Waste Reduction',
      description: 'Successfully prevented 25,000 kg of food from going to waste through our efficient collection and distribution system. Our technology platform helps match excess food with immediate needs.',
      image: 'https://images.unsplash.com/photo-1576188973526-0e5d7047b0cf?w=500&h=300&fit=crop',
      stats: {
        foodSaved: 25000,
        carbonOffset: 47500,
        treesEquivalent: 2375
      }
    }
  ];

  const upcomingEvents = [
    {
      title: 'Food Distribution Drive',
      date: 'December 25, 2023',
      location: 'City Community Center',
      description: 'Join us for our largest food distribution event of the year. We aim to serve 1000+ families in a single day.',
      image: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=500&h=300&fit=crop'
    },
    {
      title: 'Donor Appreciation Event',
      date: 'January 1, 2024',
      location: 'Grand Hotel',
      description: 'A special evening to recognize and celebrate our dedicated donors and volunteers who make our mission possible.',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&h=300&fit=crop'
    },
    {
      title: 'NGO Partnership Meet',
      date: 'January 15, 2024',
      location: 'Conference Center',
      description: 'Annual gathering of our NGO partners to discuss strategies, share success stories, and plan future collaborations.',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=500&h=300&fit=crop'
    }
  ];

  const ngoPartners = [
    {
      id: 1,
      name: "Tumkur Food Bank",
      location: "Near City Market, Tumkur",
      coordinates: [13.3379, 77.1173],
      description: "Collecting and distributing food to needy people in Tumkur",
      detailedDescription: "Tumkur Food Bank has been serving the community since 2015. We work closely with local restaurants, marriage halls, and food businesses to collect excess food and distribute it to those in need.",
      image: ngoImages[0],
      phone: "080-12345678",
      email: "tumkurfoodbank@email.com",
      rating: 4.5,
      activePickups: 3,
      address: "Near City Market, Tumkur Main Road, Tumakuru, Karnataka 572101",
      workingHours: "8:00 AM - 8:00 PM",
      impact: {
        mealsServed: "50,000+",
        communitiesReached: "20+",
        volunteers: "100+"
      }
    },
    {
      id: 2,
      name: "Sri Siddaganga Food Relief",
      location: "Siddaganga Mutt Road, Tumkur",
      coordinates: [13.3416, 77.1138],
      description: "Food donation center near Siddaganga Mutt",
      detailedDescription: "Inspired by the principles of Sri Siddaganga Mutt, we are committed to feeding the hungry and supporting the underprivileged.",
      image: ngoImages[1],
      phone: "080-23456789",
      email: "siddaganga.relief@email.com",
      rating: 4.8,
      activePickups: 5,
      address: "Siddaganga Mutt Road, B H Road, Tumakuru, Karnataka 572102",
      workingHours: "6:00 AM - 9:00 PM",
      impact: {
        mealsServed: "75,000+",
        communitiesReached: "25+",
        volunteers: "150+"
      }
    },
    {
      id: 3,
      name: "Akshaya Patra Foundation",
      location: "Rajajinagar, Bangalore",
      coordinates: [12.9850, 77.5533],
      description: "Implementing school lunch programs and community feeding",
      detailedDescription: "Akshaya Patra Foundation is dedicated to serving mid-day meals to school children and supporting community feeding programs.",
      image: ngoImages[2],
      phone: "080-34567890",
      email: "akshayapatra@email.com",
      rating: 4.9,
      activePickups: 8,
      address: "Rajajinagar Industrial Estate, Bangalore, Karnataka 560010",
      workingHours: "7:00 AM - 8:00 PM",
      impact: {
        mealsServed: "100,000+",
        communitiesReached: "30+",
        volunteers: "200+"
      }
    }
  ];

  const NGOCard = ({ ngo }) => (
    <div className="ngo-card" onClick={() => setSelectedNGO(ngo)}>
      <div className="ngo-card-image">
        <img src={ngo.image} alt={ngo.name} />
        <div className="ngo-card-rating">
          <FaStar /> {ngo.rating}
        </div>
      </div>
      <div className="ngo-card-content">
        <h3>{ngo.name}</h3>
        <p className="ngo-location"><FaMapMarkerAlt /> {ngo.location}</p>
        <p className="ngo-description">{ngo.description}</p>
        <div className="ngo-impact">
          <div className="impact-item">
            <span className="impact-value">{ngo.impact.mealsServed}</span>
            <span className="impact-label">Meals Served</span>
          </div>
          <div className="impact-item">
            <span className="impact-value">{ngo.impact.communitiesReached}</span>
            <span className="impact-label">Communities</span>
          </div>
        </div>
        <button className="view-details-btn">View Details</button>
      </div>
    </div>
  );

  const NGODetailsModal = ({ ngo, onClose }) => (
    <div className="ngo-modal">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <div className="ngo-modal-header">
          <img src={ngo.image} alt={ngo.name} />
          <div className="ngo-modal-title">
            <h2>{ngo.name}</h2>
            <div className="ngo-rating">
              <FaStar /> {ngo.rating}
            </div>
          </div>
        </div>
        <div className="ngo-modal-body">
          <p className="ngo-detailed-description">{ngo.detailedDescription}</p>
          <div className="ngo-contact-info">
            <h3>Contact Information</h3>
            <p><FaMapMarkerAlt /> {ngo.address}</p>
            <p><FaPhoneAlt /> {ngo.phone}</p>
            <p><FaEnvelope /> {ngo.email}</p>
            <p><FaCalendarAlt /> {ngo.workingHours}</p>
          </div>
          <div className="ngo-impact-stats">
            <h3>Impact</h3>
            <div className="impact-grid">
              <div className="impact-stat">
                <span className="impact-number">{ngo.impact.mealsServed}</span>
                <span className="impact-label">Meals Served</span>
              </div>
              <div className="impact-stat">
                <span className="impact-number">{ngo.impact.communitiesReached}</span>
                <span className="impact-label">Communities Reached</span>
              </div>
              <div className="impact-stat">
                <span className="impact-number">{ngo.impact.volunteers}</span>
                <span className="impact-label">Active Volunteers</span>
              </div>
            </div>
          </div>
          <div className="ngo-actions">
            <button onClick={() => window.location.href = `tel:${ngo.phone}`} className="action-button phone">
              <FaPhoneAlt /> Call Now
            </button>
            <button onClick={() => window.location.href = `mailto:${ngo.email}`} className="action-button email">
              <FaEnvelope /> Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNGOMap = () => {
    if (loading) {
      return <div className="loading">Loading map...</div>;
    }

    if (!userLocation) {
      return <div className="error">Unable to get your location. Please enable location services.</div>;
    }

    return (
      <div className="ngo-map-container">
        <MapContainer
          center={[userLocation.latitude, userLocation.longitude]}
          zoom={13}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* User Location Marker */}
          <Marker 
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userIcon}
          >
            <Popup>Your Location</Popup>
          </Marker>

          {/* NGO Markers */}
          {ngoPartners.map(ngo => (
            <Marker
              key={ngo.id}
              position={ngo.coordinates}
              icon={ngoIcon}
              eventHandlers={{
                click: () => setSelectedNGO(ngo)
              }}
            >
              <Popup>
                <div className="ngo-popup">
                  <h3>{ngo.name}</h3>
                  <p>{ngo.description}</p>
                  <button onClick={() => setSelectedNGO(ngo)}>View Details</button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    );
  };

  const donationDistributionData = {
    labels: ['Restaurants', 'Individual Donors', 'Corporate Events', 'Food Banks'],
    datasets: [{
      data: [40, 25, 20, 15],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      hoverBackgroundColor: ['#FF6394', '#36A2EB', '#FFCE56', '#4BC0C0']
    }]
  };

  const impactMetricsData = {
    labels: ['Meals Served', 'Food Saved (kg)', 'Families Reached', 'Volunteer Hours'],
    datasets: [{
      data: [50000, 25000, 10000, 5000],
      backgroundColor: ['#FF9F40', '#4BC0C0', '#36A2EB', '#FF6384'],
      hoverBackgroundColor: ['#FF9F40', '#4BC0C0', '#36A2EB', '#FF6384']
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      }
    }
  };

  const handleDonateClick = () => {
    navigate('/donate');
  };

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <h1>Welcome to Food Donation Platform</h1>
        <div className="header-right">
          <div className="dashboard-tabs">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'ngo-partners' ? 'active' : ''}`}
              onClick={() => setActiveTab('ngo-partners')}
            >
              NGO Partners
            </button>
            <button 
              className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              Our Services
            </button>
            <button 
              className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </button>
            <button 
              className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              Events
            </button>
          </div>
          <div className="header-actions">
            <button className="donate-button" onClick={handleDonateClick}>
              <FaDonate /> Make a Donation
            </button>
            <ProfileButton />
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-info">
                    <h3>{stat.title}</h3>
                    <div className="stat-number">{stat.value}</div>
                    <p className="stat-description">{stat.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="charts-container">
              <div className="chart-wrapper">
                <h3>Donation Sources</h3>
                <div className="chart">
                  <Doughnut data={donationDistributionData} options={chartOptions} />
                </div>
              </div>
              <div className="chart-wrapper">
                <h3>Impact Metrics</h3>
                <div className="chart">
                  <Doughnut data={impactMetricsData} options={chartOptions} />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'ngo-partners' && (
          <div className="ngo-partners-section">
            <div className="section-header">
              <h2><FaMapMarked /> NGO Partners Near You</h2>
              <p>Discover and connect with our verified NGO partners in your area</p>
            </div>
            
            {renderNGOMap()}
            
            <div className="ngo-cards-container">
              {ngoPartners.map(ngo => (
                <NGOCard key={ngo.id} ngo={ngo} />
              ))}
            </div>

            {selectedNGO && (
              <NGODetailsModal
                ngo={selectedNGO}
                onClose={() => setSelectedNGO(null)}
              />
            )}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <img src={service.image} alt={service.title} className="service-image" />
                <h3>{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <div className="service-features">
                  <h4>Key Features:</h4>
                  <ul>
                    {service.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-card">
                <img src={achievement.image} alt={achievement.title} className="achievement-image" />
                <h3>{achievement.title}</h3>
                <p className="achievement-description">{achievement.description}</p>
                <div className="achievement-stats">
                  {Object.entries(achievement.stats).map(([key, value], idx) => (
                    <div key={idx} className="achievement-stat">
                      <span className="stat-label">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="stat-value">{value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-section">
            <div className="events-grid">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="event-card">
                  <img src={event.image} alt={event.title} className="event-image" />
                  <div className="event-details">
                    <h3>{event.title}</h3>
                    <p className="event-date"><FaCalendarAlt /> {event.date}</p>
                    <p className="event-location"><FaMapMarkerAlt /> {event.location}</p>
                    <p className="event-description">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="dashboard-footer">
        <div className="contact-info">
          <h3>Need Help?</h3>
          <p><FaPhoneAlt /> +1 234 567 8900</p>
          <p><FaEnvelope /> support@fooddonation.com</p>
        </div>
      </footer>
    </div>
  );
};

export default UserDashboard;
