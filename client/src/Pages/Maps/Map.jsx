import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useDonation } from '../../context/DonationContext';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

// Tumkur coordinates
const defaultCenter = {
  lat: 13.3379,
  lng: 77.1173,
};

// Sample NGO data for Tumkur area
const tumkurNGOs = [
  {
    id: 1,
    name: "Tumkur Food Bank",
    description: "Collecting and distributing food to needy people in Tumkur",
    location: {
      latitude: 13.3422,
      longitude: 77.1138,
      address: "Near City Market, Tumkur"
    },
    phone: "080-12345678",
    email: "tumkurfoodbank@email.com",
    rating: 4.5,
    activePickups: 3
  },
  {
    id: 2,
    name: "Sri Siddaganga Food Relief",
    description: "Food donation center near Siddaganga Mutt",
    location: {
      latitude: 13.3486,
      longitude: 77.1144,
      address: "Siddaganga Mutt Road, Tumkur"
    },
    phone: "080-23456789",
    email: "siddaganga.relief@email.com",
    rating: 4.8,
    activePickups: 5
  },
  {
    id: 3,
    name: "Tumkur District Food Support",
    description: "District-level food collection and distribution center",
    location: {
      latitude: 13.3341,
      longitude: 77.1198,
      address: "District Office Road, Tumkur"
    },
    phone: "080-34567890",
    email: "districtfood@email.com",
    rating: 4.3,
    activePickups: 4
  }
];

// Define custom markers
const ngoIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <path fill="#4CAF50" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <path fill="#2196F3" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const Map = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const history = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userPos = { lat: latitude, lng: longitude };
          setUserLocation(userPos);
        },
        () => {
          console.warn('Could not fetch location.');
        }
      );
    }
  }, []);

  const handleNgoSelect = (ngo) => {
    setSelectedNgo(ngo);
    setMapCenter({
      lat: ngo.location?.latitude || defaultCenter.lat,
      lng: ngo.location?.longitude || defaultCenter.lng
    });
  };

  const handleInfoWindowClose = () => {
    setSelectedNgo(null);
  };

  const handleDonateClick = (ngo) => {
    localStorage.setItem('selectedNgo', JSON.stringify(ngo));
    history('/help');
  };

  return (
    <div className="map-container">
      <div className="nearby-ngos">
        <h3>NGOs in Tumkur</h3>
        <div className="ngo-list">
          {tumkurNGOs.map(ngo => (
            <div key={ngo.id} className="ngo-item" onClick={() => handleNgoSelect(ngo)}>
              <h4>{ngo.name}</h4>
              <p>{ngo.location?.address}</p>
              <div className="ngo-stats">
                <span>Rating: {ngo.rating}★</span>
                <span>{ngo.activePickups} active pickups</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={14}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* NGO Markers */}
        {tumkurNGOs.map((ngo) => (
          <Marker
            key={ngo.id}
            position={{
              lat: ngo.location?.latitude || defaultCenter.lat,
              lng: ngo.location?.longitude || defaultCenter.lng
            }}
            icon={ngoIcon}
          >
            <Popup>
              <div className="map-info-window">
                <h3>{ngo.name}</h3>
                <p>{ngo.description}</p>
                <div className="info-details">
                  <p><FaMapMarkerAlt /> {ngo.location?.address}</p>
                  <p><FaPhone /> {ngo.phone}</p>
                  <p><FaEnvelope /> {ngo.email}</p>
                </div>
                <div className="info-stats">
                  <span>Rating: {ngo.rating}★</span>
                  <span>Active Pickups: {ngo.activePickups}</span>
                </div>
                <button
                  className="donate-btn"
                  onClick={() => handleDonateClick(ngo)}
                >
                  Donate Now
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div className="user-location">
                <p>Your Location</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
