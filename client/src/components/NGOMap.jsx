import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

const NGOMap = ({ ngos }) => {
  if (!Array.isArray(ngos) || ngos.length === 0) {
    return (
      <div className="map-placeholder">
        <p>No locations available</p>
      </div>
    );
  }

  return (
    <div className="map-container">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {ngos.map(ngo => (
          <Marker
            key={ngo.id}
            position={[ngo.location.latitude, ngo.location.longitude]}
          >
            <Popup>
              <div className="map-popup">
                <h4>{ngo.name}</h4>
                <p>{ngo.description}</p>
                <p>{ngo.location.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default NGOMap;
