import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import GoogleMapReact from 'google-map-react';


const UserMarker = () => <div style={{color: 'red'}}>You are here!</div>;

const RealTimeMap = () => {
  const [location, setLocation] = useState({ lat: 37.7749, lng: -122.4194 });

  useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.on('location', (data) => {
      setLocation({ lat: data.latitude, lng: data.longitude });
    });
  }, []);

  return (
    <div style={{ height: '500px', width: '800px' }}>
      <GoogleMapReact
  bootstrapURLKeys={{
    key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY}}
         defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
        defaultZoom={13}
        center={location}
      >
        <UserMarker lat={location.lat} lng={location.lng} />
      </GoogleMapReact>
    </div>
  );
};

export default RealTimeMap;
