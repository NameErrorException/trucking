import React, { useRef, useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';



export default function Home() {
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
  
  let navigate = useNavigate();
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Truck"); // Default selected option
  const [SearchInput,setSearchInput] = useState("");

  const GoHome = () => {
    navigate(`/`);
  };
  const GoRank = () => {
    navigate(`/ranking`);
  };

  const toggleSearchBar = () => {
    setIsSearchBarOpen(!isSearchBarOpen);
  };
  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    
    <>    
    <div className="text-gray-400 bg-gradient-to-r from-[#02040d] to-[#6b6e77] body-font" >
        
    <header>
    <div className="container bg-slate-400/1 mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
    <a className=" flex title-font font-medium items-center text-white/80 mb-4 md:mb-0">
      
      <div><span className="ml-2 text-xl"><span class="animate-[wave_5s_ease-in-out_2]">123 LoadBoard👋🏻</span></span></div>
      <div className="ml-32">
    <nav className="md:ml-auto md:mr-auto w-full flex flex-wrap items-center text-base justify-center">
    <button class="relative inline-flex items-center justify-center p-0.5 ml-4 mb-0 me-0 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-slate-700 to-blue-700 group-hover:from-purple-600 group-hover:to-slate-500 hover:text-white dark:text-white" onClick={GoHome}>
    <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
    HOME
    </span>
    </button>
    <button class="relative inline-flex items-center justify-center p-0.5 ml-4 mb-0 me-0 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-slate-700 to-blue-700 group-hover:from-purple-600 group-hover:to-slate-500 hover:text-white dark:text-white" onClick={GoRank}>
    <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
    RANK
    </span>
    </button>
{/* <a className="flex flex-col items-center w-32 rounded-2xl mr-5 text-white bg-slate-500 hover:bg-slate-600 active:bg-slate-700 focus:outline-none focus:ring focus:ring-slate-300 shadow-lg transition duration-300 ease-in-out transform hover:scale-105"> Third Link </a>
      <a className="flex flex-col items-center w-32 rounded-2xl mr-5 text-white bg-slate-500 hover:bg-slate-600 active:bg-slate-700 focus:outline-none focus:ring focus:ring-slate-300 shadow-lg transition duration-300 ease-in-out transform hover:scale-105"> Fourth Link </a> */}
    </nav>
    </div>
    <div className="absolute top-4 right-14 h-16 w-16 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
      <button onClick={toggleSearchBar} class=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>

        <span>Search</span>
      </button>
    </div>
    </a>
    </div>
    </header>
    <div className='flex-1 w-11/12 mx-auto p-4 text-lg bg-[#D6DBDf] h-full shadow-lg rounded-2xl after:clear-both after:block after:content-[""]'>
    <div>
      {/* <form onSubmit={handleSubmit}>
        <input type="number" value={inputTruckId} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form> */}
      <div id="map" style={{ height: '900px', width: '100%' }}></div>
    </div>
    </div>

    {isSearchBarOpen && (
          <div className="flex flex-wrap">
            {/* Search Bar */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-400 bg-opacity-50 p-10 rounded-xl">
              <div className="container mx-auto flex flex-col items-center p-5">
                {/* Search bar components */}
                <input
                  type="text"
                  value={inputTruckId}
                  placeholder={`${selectedOption} Search...`}
                  className="w-full px-10 py-2 border rounded focus:outline-none focus:border-blue-500 mb-4"
                  onChange={handleInputChange}
                />
                <div className="flex justify-center space-x-4 mb-4">
                  {/* Search Options */}
                  <button
                    className={`text-white rounded-2xl px-6 py-2 bg-slate-600 hover:text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-gray-800 ${selectedOption === 'Truck' ? 'bg-orange-300  text-gray-800' : ''}`}
                    onClick={() => setSelectedOption('Truck')}
                  >
                    Truck
                  </button>
                  <button
                    className={`text-white rounded-2xl px-6 py-2 bg-slate-600 hover:text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-gray-800 ${selectedOption === 'Load' ? 'bg-slate-400 text-gray-800' : ''}`}
                    onClick={() => setSelectedOption('Load')}
                  >
                    Load
                  </button>
                </div>
                <button
                  className="w-full text-white rounded-2xl bg-orange-300 py-2 hover:text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={handleSubmit}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        )}
  
   </div>

    </>
  );
}
