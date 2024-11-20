import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './Map.css';
const containerStyle = {
  width: '100%',
  height: '600px',
};
const center = {
  lat: 13.3389,
  lng: 77.1010,
};
const ngoLocations = [
  { id: 1, name: 'NGO Care', position: { lat: 13.3398, lng: 77.1100 }, phone: '+919999999999' },
  { id: 2, name: 'Food for All', position: { lat: 13.3421, lng: 77.1050 }, phone: '+919888888888' },
  { id: 3, name: 'Help the Hungry', position: { lat: 13.3375, lng: 77.0970 }, phone: '+919777777777' },
];
const toRad = (value) => (value * Math.PI) / 180;
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

const Map = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyNgos, setNearbyNgos] = useState([]);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          const nearby = ngoLocations.filter((ngo) =>
            haversineDistance(latitude, longitude, ngo.position.lat, ngo.position.lng) <= 10
          );
          setNearbyNgos(nearby);
        },
        () => {
          alert('Could not fetch location.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }, []);

  const handleCall = async (phone) => {
    try {
      await axios.post('/api/call', { phoneNumber: phone });
      alert(`Calling NGO at ${phone}`);
    } catch (error) {
      console.error('Error initiating call:', error);
      alert('Failed to place a call');
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyAWehjD-JTPbCiGY_nlSWIqaYI0mQHhyfw">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || center} 
        zoom={14}
      >
        {nearbyNgos.map((ngo) => (
          <Marker
            key={ngo.id}
            position={ngo.position}
            label={ngo.name}
            onClick={() => handleCall(ngo.phone)} 
          />
        ))}
        {userLocation && (
          <Marker
            position={userLocation}
            label="You are here"
            icon={{
              path: "M 0,0 L 10,10 L 0,20 L -10,10 Z",
              fillColor: "red",
              fillOpacity: 1,
              scale: 2,
              strokeColor: "red",
              strokeWeight: 2,
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
