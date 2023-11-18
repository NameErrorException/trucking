import React from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

const GoogleMap = (props) => {
  const mapStyles = {
    width: '70%',
    height: '100vh',
  };

  return (
    <Map
      google={props.google}
      zoom={14}
      style={mapStyles}
      initialCenter={{
        lat: 41.85,
        lng: -87.65,
      }}
      
    />
    
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDPg2P5Z_oSGZMeQ273Q-35JWwr9IMrBi4',
})(GoogleMap);