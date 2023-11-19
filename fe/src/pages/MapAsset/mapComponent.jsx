import React, { useState, useEffect, useRef } from 'react';



const MapComponent = () => {
  const [users, setUsers] = useState([]);
  const [trucks, setTrucks] = useState({});
  const mapRef = useRef(null); // useRef to hold the map instance


  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);



  const initMap = () => {
    mapRef.current = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 7,
      center: { lat: 45.5, lng:-73.56 },
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
    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({ suppressMarkers: true, polylineOptions: { strokeColor: '#5cb85c' } });
    directionsRendererRef.current.setMap(mapRef.current);
    fetchUserData(); // Fetch user data after map initialization
  };

  const fetchUserData = () => {
    Promise.all([
      fetch("http://127.0.0.1:5000/data").then(response => response.json()),
      fetch("http://127.0.0.1:5000/filtered").then(response => response.json())
    ])
    .then(([data, filteredData]) => {
      const newTrucks = {};

      fetchedData.forEach(item => {
        if (item.type === "Truck") {
          newTrucks[item.id] = { ...item, loads: [] };
        }
      });

      filteredData.forEach(filteredItem => {
        const load_id = filteredItem.load_id;
        const truck_id = filteredItem.truck_id;
        const load = fetchedData.find(item => item.type === "Load" && item.loadId === load_id);
        const truck = newTrucks[truck_id];

        if (load && truck) {
          truck.loads.push(load_id);
          load.assigned = truck_id; // Add new attribute 'assigned' to the load
        }
      });
        setTrucks(newTrucks);
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



const displayRoutesForTruck = (truckId) => {
  const truck = trucks[truckId];
  if (!truck) {
    console.error('Truck not found');
    return;
  }

  const directionsService = new window.google.maps.DirectionsService();
  const directionsRenderer = new window.google.maps.DirectionsRenderer();
  directionsRenderer.setMap(mapRef.current);

  let lastDestination = { lat: truck.positionLatitude, lng: truck.positionLongitude }; // Starting point is the truck's current location

  truck.loads.forEach(loadId => {
    const load = data.find(item => item.id === loadId && item.type === "Load");
    if (load) {
      const loadOrigin = new window.google.maps.LatLng(load.originLatitude, load.originLongitude);
      const loadDestination = new window.google.maps.LatLng(load.destinationLatitude, load.destinationLongitude);

      // Route from last destination to load's origin
      plotRoute(directionsService, directionsRenderer, lastDestination, loadOrigin);

      // Route from load's origin to load's destination
      plotRoute(directionsService, directionsRenderer, loadOrigin, loadDestination);

      lastDestination = loadDestination; // Update last destination to current load's destination
    }
  });
};

const plotRoute = (directionsService, directionsRenderer, start, end) => {
  directionsService.route({
    origin: start,
    destination: end,
    travelMode: window.google.maps.TravelMode.DRIVING
  }, (response, status) => {
    if (status === 'OK') {
      directionsRenderer.setDirections(response);
    } else {
      console.error('Directions request failed due to ' + status);
    }
  });
};