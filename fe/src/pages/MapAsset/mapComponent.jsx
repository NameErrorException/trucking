import React, { useEffect } from 'react';

const MapComponent = () => {
  useEffect(() => {
    const setOriginFromJson = (directionsService, directionsRenderer) => {
      // Fetch data and set the origin here
      // ...

      // Example:
      const origin = { lat: 41.85, lng: -87.65 };
      const destination = document.getElementById("end").value;

      calculateAndDisplayRoute(directionsService, directionsRenderer, origin, destination);
    };

    const calculateAndDisplayRoute = (directionsService, directionsRenderer, origin, destination) => {
      // Implement your route calculation logic here
      // ...

      directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      }, (response, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    };

    const initMap = () => {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: { lat: 41.85, lng: -87.65 },
      });

      directionsRenderer.setMap(map);
      document.getElementById("submit").addEventListener("click", () => {
        setOriginFromJson(directionsService, directionsRenderer);
      });
    };

    // Load the Google Maps API script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDPg2P5Z_oSGZMeQ273Q-35JWwr9IMrBi4&callback=initMap&v=weekly`;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      // Initialize the map once the script has loaded
      initMap();
    };

    return () => {
      // Cleanup script on unmount
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div>
      {/* The map container */}
      <div id="map" style={{ height: '800px', width: '70%' }}></div>
      <div id="sidebar">
        <div>
          <b>Start:</b>
          <select id="start">
            <option value="Halifax, NS">LAT1</option>
            <option value="Boston, MA">Boston, MA</option>
            <option value="New York, NY">New York, NY</option>
            <option value="Miami, FL">Miami, FL</option>
          </select>
          <br />
          <b>Waypoints:</b> <br />
          <i>(Ctrl+Click or Cmd+Click for multiple selection)</i> <br />
          <select multiple id="waypoints">
            <option value="montreal, quebec">Montreal, QBC</option>
            <option value="toronto, ont">Toronto, ONT</option>
            <option value="chicago, il">Chicago</option>
            <option value="winnipeg, mb">Winnipeg</option>
            <option value="fargo, nd">Fargo</option>
            <option value="calgary, ab">Calgary</option>
            <option value="spokane, wa">Spokane</option>
          </select>
          <br />
          <b>End:</b>
          <select id="end">
            <option value="Vancouver, BC">Vancouver, BC</option>
            <option value="Seattle, WA">Seattle, WA</option>
            <option value="San Francisco, CA">San Francisco, CA</option>
            <option value="Los Angeles, CA">Los Angeles, CA</option>
          </select>
          <br />
          <input type="submit" id="submit" />
        </div>
        <div id="directions-panel"></div>
      </div>

      {/* Rest of the HTML for the form and directions panel */}
      {/* ... */}
    </div>
  );
};

export default MapComponent;
