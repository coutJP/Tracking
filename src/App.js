import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LocationTracker() {
  const [permission, setPermission] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (permission) {
      navigator.geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          axios.post('/api/location', { latitude, longitude })
            .catch(error => setError(error.message));
        },
        error => setError(error.message),
        { enableHighAccuracy: true, maximumAge: 0, timeout: Infinity }
      );
    }
  }, [permission]);

  function handlePermission() {
    navigator.permissions.query({ name: 'geolocation' }).then(result => {
      if (result.state === 'granted') {
        setPermission(true);
      } else if (result.state === 'denied') {
        setError('You have denied location access.');
      } else if (result.state === 'prompt') {
        setError('Please grant location access to use this feature.');
      }
    }).catch(error => setError(error.message));

    // Load the Google Maps API with a callback function
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC2kkIP27_L5pzjvLHiXp_8YlEDlQtqLiw&callback=initMap`;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);

    // Define the callback function to initialize the map
    window.initMap = () => {
      if (location) {
        const { latitude, longitude } = location;

        const map = new window.google.maps.Map(document.getElementById('map'), {
          center: { lat: latitude, lng: longitude },
          zoom: 14,
        });

        const marker = new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: map,
          title: 'My Location'
        });
      }
    };

    // Cleanup the script tag and the initMap function
    return () => {
      document.head.removeChild(script);
      delete window.initMap;
    };
  }

  return (
    <div>
      {location ?
        <div>
          <h1>My Location:</h1>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <div id="map" style={{ height: '400px', width: '100%' }}></div>
        </div> :
        permission ?
        //test
          error ?
            <div>
              <p>{error}</p>
              <button onClick={() => setError(null)}>Try Again</button>
            </div> :
            <div>
              <h1>Tracking Location...</h1>
              <div id="map" style={{ height: '400px', width: '100%' }}></div>
            </div> :
          <button onClick={handlePermission}>Enable Location Tracking</button>
      }
    </div>
  );
}

export default LocationTracker;
