import React, {useRef, useState, useEffect } from 'react';


const MapComponent = () => {
  // State for storing data
  const [trucks, setTrucks] = useState([]);
  const [loads, setLoads] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [inputTruckId, setInputTruckId] = useState('');




  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const mapRef = useRef(null); // useRef to hold the map instance






  // Fetching data from the endpoints
  useEffect(() => {
    fetch('http://127.0.0.1:5000/data')
      .then(response => response.json())
      .then(data => {
        setTrucks(data.filter(item => item.type === 'Truck'));
        setLoads(data.filter(item => item.type === 'Load'));
      });
   
    fetch('http://127.0.0.1:5000/filtered')
      .then(response => response.json())
      .then(setAssignments);


    // Load Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDPg2P5Z_oSGZMeQ273Q-35JWwr9IMrBi4&callback=initMap&v=weekly`;
    script.defer = true;
    window.initMap = initMap;
    document.head.appendChild(script);


    return () => {
      document.head.removeChild(script);
    };
  }, []);


  // Initialize Google Map
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
    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({ suppressMarkers: true, polylineOptions: { strokeColor: '#5cb85c' } });
    directionsRendererRef.current.setMap(mapRef.current);
  };


  // Handle input change
  const handleInputChange = (e) => {
    setInputTruckId(e.target.value);
  };


  // Handle form submission
      const handleSubmit = (e) => {
        e.preventDefault();


        if (/^\d{5}$/.test(inputTruckId)) {
          // Search for Load
          const load = assignments.find(l => l.load_id === parseInt(inputTruckId))
          // const load = loads.find(l => l.loadId === parseInt(inputTruckId));
          if (!load) {
            alert('Load not found');
            return;
          }
     
          displayLoadRoute(load);
        } else {
        const truck = assignments.find(t => t.truck_id === parseInt(inputTruckId));
        if (!truck) {
          alert('Truck not found');
          return;
        }
        const itemm = loads.find(l => l.loadId === truck.load_id);
        const itemmm = trucks.find(t => t.truckId === truck.truck_id);
        new window.google.maps.Marker({
          position: { lat: itemmm.positionLatitude, lng: itemmm.positionLongitude },
          map: mapRef.current,
          label: 'T'
        });
        const origin = new window.google.maps.LatLng(itemm.originLatitude, itemm.originLongitude);
        const destination = new window.google.maps.LatLng(itemm.destinationLatitude, itemm.destinationLongitude);
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


    }
        // Logic to find the truck, its assignments, and display on the map
  };
  const displayLoadRoute = (load) => {
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    directionsRenderer.setMap(mapRef.current);
// Set the map for the DirectionsRenderer
    const itemm = loads.find(l => l.loadId === load.load_id)
    if(itemm){console.log(itemm);
    const origin = new window.google.maps.LatLng(itemm.originLatitude, itemm.originLongitude);
    const destination = new window.google.maps.LatLng(itemm.destinationLatitude, itemm.destinationLongitude);
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
    });}
    const itemmm = trucks.find(t => t.truckId === load.truck_id)
    if(itemmm){new window.google.maps.Marker({
      position: { lat: itemmm.positionLatitude, lng: itemmm.positionLongitude },
      map: mapRef.current,
      label: 'T'});}
  };


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="number" value={inputTruckId} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form>
      <div id="map" style={{ height: '900px', width: '100%' }}></div>
    </div>
  );
};


export default MapComponent;



