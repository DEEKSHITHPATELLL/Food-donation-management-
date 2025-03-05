import React, { useState, useEffect } from 'react';
import { FaUtensils, FaAppleAlt, FaBreadSlice, FaCarrot, FaWineBottle, FaMapMarkerAlt } from 'react-icons/fa';
import { useDonation } from '../../context/DonationContext';
import 'leaflet/dist/leaflet.css';
import emailjs from 'emailjs-com';
import axios from 'axios';
import './Donate.css';

const locationStyles = `
  .location-section {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin: 20px 0;
  }

  .location-buttons {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }

  .location-buttons button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .location-buttons button:first-child {
    background: #4CAF50;
    color: white;
  }

  .location-buttons button:first-child:hover {
    background: #45a049;
  }

  .location-buttons button:last-child {
    background: #f5f5f5;
    color: #333;
  }

  .location-buttons button:last-child:hover {
    background: #e0e0e0;
  }

  .location-buttons button:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }

  .location-search {
    margin-top: 16px;
  }

  .location-search-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s ease;
  }

  .location-search-input:focus {
    border-color: #4CAF50;
    outline: none;
  }

  .search-results {
    margin-top: 8px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .search-result-item {
    width: 100%;
    padding: 12px 16px;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .search-result-item:hover {
    background: #f5f5f5;
  }

  .current-location {
    margin-top: 16px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    position: relative;
  }

  .location-detail {
    color: #2c3e50;
    font-size: 16px;
    margin: 0;
    padding-right: 100px;
  }

  .edit-location-button {
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background: #e0e0e0;
    color: #333;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .edit-location-button:hover {
    background: #d0d0d0;
  }

  .error-message {
    color: #dc3545;
    margin: 8px 0;
    padding: 8px 12px;
    background: #fff3f3;
    border-radius: 6px;
    font-size: 14px;
  }

  .location-icon {
    color: #4CAF50;
    font-size: 20px;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  .detecting-location {
    animation: pulse 1.5s infinite;
  }
`;

const Donate = () => {
  const { addDonation } = useDonation();
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: 1,
    description: '',
    expiryDate: '',
    pickupAddress: '',
    contactNumber: '',
    preferredTime: '',
    location: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [registeredNumbers, setRegisteredNumbers] = useState([
    { name: "NGO1", number: "+919353842851" },
    { name: "NGO2", number: "+14155552671" },
    { name: "NGO3", number: "+14155552672" }
]);
  const foodTypes = [
    { id: 'cooked', icon: FaUtensils, label: 'Cooked Food' },
    { id: 'fruits', icon: FaAppleAlt, label: 'Fruits' },
    { id: 'grains', icon: FaBreadSlice, label: 'Grains & Bread' },
    { id: 'vegetables', icon: FaCarrot, label: 'Vegetables' },
    { id: 'beverages', icon: FaWineBottle, label: 'Beverages' }
  ];
  const [selectedNumber, setSelectedNumber] = useState(registeredNumbers[0]?.number || '');
  const [manualLocationMode, setManualLocationMode] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [lastLocation, setLastLocation] = useState(null);
  const [locationMethod, setLocationMethod] = useState('auto'); // 'auto', 'ip', 'manual'
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Karnataka districts and major cities
  const karnatakaLocations = {
    'Hassan': [
      'Sakleshpura',
      'Champakanagara',
      'Alur',
      'Arkalgud',
      'Arsikere',
      'Belur',
      'Channarayapatna',
      'Hassan'
    ]
  };

  // Add predefined locations for Karnataka
  const predefinedLocations = [
    { name: "Sakleshpura, Hassan District, Karnataka", coords: { lat: 12.9647, lon: 75.7844 } },
    { name: "Hassan, Karnataka", coords: { lat: 13.0068, lon: 76.1030 } },
    { name: "Champakanagara, Sakleshpura", coords: { lat: 12.9440, lon: 75.7850 } }
  ];

  // Function to get detailed address from coordinates
  const getDetailedAddress = async (latitude, longitude) => {
    try {
      // Try multiple zoom levels to get the most accurate result
      for (let zoom of [18, 15, 12]) {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?` +
          `format=json&lat=${latitude}&lon=${longitude}&zoom=${zoom}&addressdetails=1&namedetails=1`,
          {
            headers: {
              'User-Agent': 'FoodDonationApp/1.0'
            }
          }
        );

        if (!response.ok) continue;

        const data = await response.json();
        
        // Extract all relevant address components
        const addressComponents = [
          data.address.village,
          data.address.suburb,
          data.address.town,
          data.address.city,
          data.address.county,
          data.address.state_district,
          data.address.state
        ].filter(Boolean);

        // Get the most specific location name
        const specificLocation = addressComponents[0] || '';
        
        // Combine components for full address
        const fullAddress = addressComponents.join(', ');

        return {
          specificLocation,
          fullAddress,
          raw: data.address
        };
      }
      throw new Error('Could not get detailed address');
    } catch (error) {
      console.error('Error getting detailed address:', error);
      return null;
    }
  };

  // Get location using IP address
  const getLocationByIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.region === 'Karnataka') {
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city,
          region: data.region,
          country: data.country_name
        };
      }
      return null;
    } catch (error) {
      console.error('IP location error:', error);
      return null;
    }
  };

  // Search for locations in Karnataka
  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query + ', Karnataka, India')}` +
        `&format=json&addressdetails=1&limit=5`,
        {
          headers: {
            'User-Agent': 'FoodDonationApp/1.0'
          }
        }
      );
      
      const data = await response.json();
      
      // Filter results to only Karnataka locations
      const karnatakaResults = data.filter(item => 
        item.address.state === 'Karnataka' &&
        item.type !== 'state' &&
        item.type !== 'administrative'
      );

      setSearchResults(karnatakaResults);
    } catch (error) {
      console.error('Location search error:', error);
      setSearchResults([]);
    }
  };

  // Select location from search results
  const selectSearchResult = (result) => {
    const address = [
      result.address.village || result.address.town || result.address.city,
      result.address.county || result.address.district,
      'Karnataka'
    ].filter(Boolean).join(', ');

    setFormData(prev => ({
      ...prev,
      pickupAddress: address,
      location: {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        address: address
      }
    }));
    setIsEditingLocation(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  // Initialize location detection
  const initializeLocation = async () => {
    setIsLocating(true);
    setLocationError('');

    try {
      // First try IP-based location
      const ipLocation = await getLocationByIP();
      
      if (ipLocation) {
        setFormData(prev => ({
          ...prev,
          pickupAddress: `${ipLocation.city}, ${ipLocation.region}`,
          location: {
            latitude: ipLocation.latitude,
            longitude: ipLocation.longitude,
            address: `${ipLocation.city}, ${ipLocation.region}`
          }
        }));
      }

      // Then try GPS if available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Verify if coordinates are within Karnataka bounds
            if (latitude >= 11.5 && latitude <= 18.5 && 
                longitude >= 74 && longitude <= 78.5) {
              const addressInfo = await getDetailedAddress(latitude, longitude);
              if (addressInfo && addressInfo.raw.state === 'Karnataka') {
                setFormData(prev => ({
                  ...prev,
                  pickupAddress: addressInfo.fullAddress,
                  location: {
                    latitude,
                    longitude,
                    address: addressInfo.fullAddress
                  }
                }));
              }
            } else {
              setLocationError('GPS location appears to be outside Karnataka. Please enter location manually.');
              setIsEditingLocation(true);
            }
          },
          (error) => {
            console.error('GPS error:', error);
            setLocationError('Could not get precise location. Please enter location manually.');
            setIsEditingLocation(true);
          }
        );
      }
    } catch (error) {
      console.error('Location initialization error:', error);
      setLocationError('Location detection failed. Please enter location manually.');
      setIsEditingLocation(true);
    } finally {
      setIsLocating(false);
    }
  };

  // Start watching location
  const startLocationWatch = () => {
    setIsLocating(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    // Clear any existing watch
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Check if location has changed significantly (more than 100 meters)
        if (lastLocation) {
          const distance = calculateDistance(
            lastLocation.latitude,
            lastLocation.longitude,
            latitude,
            longitude
          );
          if (distance < 0.1) return; // Less than 100 meters change
        }

        console.log(`New location detected - Latitude: ${latitude}, Longitude: ${longitude}`);
        setLastLocation({ latitude, longitude });

        try {
          const addressInfo = await getDetailedAddress(latitude, longitude);
          
          if (addressInfo) {
            console.log("Updated location:", addressInfo.fullAddress);
            
            setFormData(prev => ({
              ...prev,
              pickupAddress: addressInfo.fullAddress,
              location: {
                latitude,
                longitude,
                address: addressInfo.fullAddress,
                specificLocation: addressInfo.specificLocation
              }
            }));
          } else {
            throw new Error('Could not resolve address');
          }
        } catch (error) {
          console.error('Location update error:', error);
          setLocationError('Error updating location. Please try again or enter manually.');
        }
        
        setIsLocating(false);
      },
      (error) => {
        console.error('Location tracking error:', error);
        setLocationError(`Error tracking location: ${error.message}`);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );

    setWatchId(id);
  };

  // Calculate distance between two points in kilometers
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Cleanup watch on component unmount
  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = locationStyles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  const selectManualLocation = (location) => {
    setFormData(prev => ({
      ...prev,
      pickupAddress: location.name,
      location: {
        latitude: location.coords.lat,
        longitude: location.coords.lon,
        address: location.name
      }
    }));
    setManualLocationMode(false);
    setLocationError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFoodTypeSelect = (type) => {
    setFormData(prev => ({
      ...prev,
      foodType: type
    }));
  };

  const handleQuantityChange = (change) => {
    setFormData(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + change)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Submitting donation:', formData);
      
      const foodTypeLabel = foodTypes.find(type => type.id === formData.foodType)?.label || formData.foodType;
      
      const donationData = {
        id: Date.now(), // Add unique ID
        ...formData,
        foodType: foodTypeLabel,
        donorName: localStorage.getItem('userName') || 'Anonymous',
        date: new Date().toISOString(),
        status: 'pending',
        location: formData.location
      };

      // Add to context
      addDonation(donationData);
      
      // Store in localStorage with proper error handling
      let existingDonations = [];
      try {
        const storedDonations = localStorage.getItem('donations');
        if (storedDonations) {
          existingDonations = JSON.parse(storedDonations);
          // Ensure it's an array
          if (!Array.isArray(existingDonations)) {
            existingDonations = [];
          }
        }
      } catch (error) {
        console.error('Error parsing stored donations:', error);
        existingDonations = [];
      }

      // Save the updated donations
      localStorage.setItem('donations', JSON.stringify([...existingDonations, donationData]));
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      setFormData({
        foodType: '',
        quantity: 1,
        description: '',
        expiryDate: '',
        pickupAddress: '',
        contactNumber: '',
        preferredTime: '',
        location: null
      });
    } catch (error) {
      console.error('Error submitting donation:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const sendEmail = (e) => {
    e.preventDefault(); 
    emailjs.sendForm('service_2xoymwe', 'template_3tg8v6k', e.target,'G0HIDSqGVUhFvBEDC')
        .then((result) => {
            console.log('Email successfully sent!', result.text);
        }, (error) => {
            console.log('Failed to send email. Error:', error.text);
        });
      }
      const handleCombinedSubmit = (e) => {
        e.preventDefault(); 
        handleSubmit(e); 
        sendEmail(e); 
    }
    const makeCall = async () => {
      try {
          const response = await axios.post('http://localhost:8000/api/twilio/make-call', {
              to: selectedNumber
          });
          console.log('Call response:', response.data);
      } catch (error) {
          console.error('Error making call:', error);
      }
  };  
  return (
    <div className="donate-container">
      <div className="donate-wrapper">
        <div className="donate-header">
          <h1 className="donate-title">Make a Food Donation</h1>
          <p className="donate-subtitle">
            Your donation can make a real difference in someone's life. Fill out the form below to start your donation.
          </p>
        </div>

        <div className="donation-form">
          <form onSubmit={handleCombinedSubmit}>
            <div className="form-group full-width">
              <label className="form-label">Select Food Type</label>
              <div className="food-type-grid">
                {foodTypes.map(({ id, icon: Icon, label }) => (
                  <div
                    key={id}
                    className={`food-type-card ${formData.foodType === id ? 'selected' : ''}`}
                    onClick={() => handleFoodTypeSelect(id)}
                  >
                    <Icon className="food-icon" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Quantity (servings)</label>
                <div className="quantity-input">
                  <button 
                    type="button" 
                    className="quantity-button"
                    onClick={() => handleQuantityChange(-1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="quantity"
                    className="form-input"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                  <button 
                    type="button" 
                    className="quantity-button"
                    onClick={() => handleQuantityChange(1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  className="form-input"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  className="form-input"
                  placeholder="Your phone number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Pickup Time</label>
                <input
                  type="time"
                  name="preferredTime"
                  className="form-input"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  placeholder="Describe the food items you're donating..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="location-section">
                <div className="location-buttons">
                  <button 
                    type="button" 
                    onClick={initializeLocation} 
                    disabled={isLocating}
                    className={isLocating ? 'detecting-location' : ''}
                  >
                    <FaMapMarkerAlt className="location-icon" />
                    {isLocating ? 'Detecting Location...' : 'Detect location'}
                  </button>
                  <h4>Or</h4>
                  <button 
                    type="button" 
                    onClick={() => setIsEditingLocation(true)}
                  >
                    Enter Location Manually
                  </button>
                </div>
                
                {locationError && (
                  <p className="error-message">
                    <i className="fas fa-exclamation-circle"></i> {locationError}
                  </p>
                )}
                
                {isEditingLocation ? (
                  <div className="location-search">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        searchLocation(e.target.value);
                      }}
                      placeholder="Search for your location in Karnataka..."
                      className="location-search-input"
                    />
                    
                    {searchResults.length > 0 && (
                      <div className="search-results">
                        {searchResults.map((result, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectSearchResult(result)}
                            className="search-result-item"
                          >
                            {result.display_name.split(', ').slice(0, 3).join(', ')}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : formData.location ? (
                  <div className="current-location">
                    <p className="location-detail">
                      <FaMapMarkerAlt className="location-icon" /> {formData.pickupAddress}
                    </p>
                    <button 
                      type="button" 
                      onClick={() => setIsEditingLocation(true)}
                      className="edit-location-button"
                    >
                      Edit Location
                    </button>
                  </div>
                ) : null}
              </div>

            </div>
            
            <button 
              type="submit" 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Donation'}
            </button>
            <h1 style={{textAlign: 'center'}}>OR</h1>
            <select 
    value={selectedNumber} 
    onChange={(e) => setSelectedNumber(e.target.value)}
>
    {registeredNumbers.map((item) => (
        <option key={item.number} value={item.number}>
            {item.name} - {item.number}
        </option>
    ))}
</select>
                <button 
                    type="button" 
                    className="call-button"
                    onClick={makeCall}
                >
                    Call
                </button>
          </form>
        </div>

        {showSuccess && (
          <div className="success-message">
            Your donation has been submitted successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default Donate;
