import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Leaflet CSS
import './MapComponent.css'; // Import custom styles for the map

const MapComponent = ({ setLocation, closeMap }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);

  // Get user's location and initialize the map
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          if (!map) {
            const newMap = L.map('map').setView([latitude, longitude], 15); // Set zoom level to 15 for a closer view
            setMap(newMap);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(newMap);

            // Add marker for current location
            L.marker([latitude, longitude])
              .addTo(newMap)
              .bindPopup('Your current location')
              .openPopup();

            // Map click event to set a location
            newMap.on('click', (e) => {
              const { lat, lng } = e.latlng;
              setLocation({ lat, lng });
              L.marker([lat, lng])
                .addTo(newMap)
                .bindPopup('Selected Location')
                .openPopup();
            });
          } else {
            // Update map if it's already created
            map.setView([latitude, longitude], 15); // Recenter the map
            L.marker([latitude, longitude])
              .addTo(map)
              .bindPopup('Your current location')
              .openPopup();
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    getUserLocation();
  }, [map]); // Run when map is initialized

  return (
    <div className="map-overlay">
      <div className="map-container">
        <button className="close-map-btn" onClick={closeMap}>
          X
        </button>
        <div id="map" style={{ height: '100%', width: '100%' }}></div>
      </div>
    </div>
  );
};

export default MapComponent;
