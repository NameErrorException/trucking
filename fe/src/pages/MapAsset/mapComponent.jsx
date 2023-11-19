import React, { useState, useEffect, useRef } from 'react';



const MapComponent = () => {
  const [users, setUsers] = useState([]);
  const mapRef = useRef(null); // useRef to hold the map instance
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);



  const initMap = () => {
    mapRef.current = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 7,
      center: { lat: 41.85, lng: -87.65 },
      styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3d19c" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
      ],  
    });
    directionsServiceRef.current = new window.google.maps.DirectionsService();
    directionsRendererRef.current = new window.google.maps.DirectionsRenderer();
    directionsRendererRef.current.setMap(mapRef.current);
    fetchUserData(); // Fetch user data after map initialization
  };

  const fetchUserData = () => {
    fetch("http://127.0.0.1:5000/data")
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        data.forEach(item => {
          if (item.type === "Truck") {
            // Add a marker for the truck
            new window.google.maps.Marker({
              position: { lat: item.positionLatitude, lng: item.positionLongitude },
              map: mapRef.current,
              label: 'T'
            });
          } else if (item.type === "Load") {
            // Log message for the load
            console.log('This is a Load');
            calculateAndDisplayRoute(item);
          }
        });
      })
      .catch(error => console.error('Error fetching user data:', error));
  };
const calculateAndDisplayRoute = (load) => {
  const directionsRenderer = new window.google.maps.DirectionsRenderer();
  directionsRenderer.setMap(mapRef.current); // Set the map for the DirectionsRenderer

  const origin = new window.google.maps.LatLng(load.originLatitude, load.originLongitude);
  const destination = new window.google.maps.LatLng(load.destinationLatitude, load.destinationLongitude);

  directionsServiceRef.current.route({
    origin: origin,
    destination: destination,
    travelMode: window.google.maps.TravelMode.DRIVING,
  }, (response, status) => {
    if (status === 'OK') {
      directionsRenderer.setDirections(response); // Set the directions for the DirectionsRenderer
    } else {
      console.error('Directions request failed due to ' + status);
    }
  });
};

  
  useEffect(() => {
    // const initMap = () => {
    //   const directionsService = new google.maps.DirectionsService();
    //   const directionsRenderer = new google.maps.DirectionsRenderer();
    //   const map = new google.maps.Map(document.getElementById("map"), {
    //     zoom: 7,
    //     center: { lat: 41.85, lng: -87.65 },
    //   });

    //   directionsRenderer.setMap(map);
    //   // If you have a setOriginFromJson function, call it here
    // };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDPg2P5Z_oSGZMeQ273Q-35JWwr9IMrBi4&callback=initMap&v=weekly`;
    script.defer = true;
    document.head.appendChild(script);
    window.initMap = initMap; // Assign initMap to window object
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div>
      <div id="map" style={{ height: '900px', width: '100%' }}></div>
    </div>
  );
};

export default MapComponent;
