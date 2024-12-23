import React, { useState, useEffect } from 'react';
import { FaUtensils, FaAppleAlt, FaBreadSlice, FaCarrot, FaWineBottle, FaMapMarkerAlt } from 'react-icons/fa';
import { useDonation } from '../../context/DonationContext';
import 'leaflet/dist/leaflet.css';
import './Donate.css';

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

  const foodTypes = [
    { id: 'cooked', icon: FaUtensils, label: 'Cooked Food' },
    { id: 'fruits', icon: FaAppleAlt, label: 'Fruits' },
    { id: 'grains', icon: FaBreadSlice, label: 'Grains & Bread' },
    { id: 'vegetables', icon: FaCarrot, label: 'Vegetables' },
    { id: 'beverages', icon: FaWineBottle, label: 'Beverages' }
  ];

  const getLocation = () => {
    setIsLocating(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          setFormData(prev => ({
            ...prev,
            pickupAddress: data.display_name || `${latitude}, ${longitude}`,
            location: { latitude, longitude }
          }));
          
          setIsLocating(false);
        } catch (error) {
          console.error('Error getting address:', error);
          setLocationError('Error getting address. Please enter manually.');
          setIsLocating(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('Error getting location. Please enter address manually.');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
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
          <form onSubmit={handleSubmit}>
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

              <div className="form-group full-width">
                <label className="form-label">Pickup Address</label>
                <div className="location-input-group">
                  <input
                    type="text"
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleChange}
                    placeholder="Enter pickup address"
                    required
                  />
                  <button
                    type="button"
                    className="location-button"
                    onClick={getLocation}
                    disabled={isLocating}
                  >
                    <FaMapMarkerAlt />
                    {isLocating ? 'Getting Location...' : 'Use Current Location'}
                  </button>
                </div>
                {locationError && <p className="error-message">{locationError}</p>}
              </div>
            </div>

            <button 
              type="submit" 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Donation'}
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
