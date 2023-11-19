import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import GoogleMap from "./FullPageMap"
import MapComponent from './MapAsset/mapComponent';


export default function Home() {
  let navigate = useNavigate();
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Truck"); // Default selected option

  const routeChange = () => {
    let path = `/${selectedOption.toLowerCase()}`;
    navigate(path);
  };

  const toggleSearchBar = () => {
    setIsSearchBarOpen(!isSearchBarOpen);
  };

  return (
    
    <>    
    <div className="text-gray-400 bg-gradient-to-r from-[#02040d] to-[#6b6e77] body-font" >
        
    <header>
    <div className="container bg-slate-400/1 mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
    <a className=" flex title-font font-medium items-center text-white/80 mb-4 md:mb-0">
      
      <div><span className="ml-3 text-xl">123 LoadBoard</span></div>
      <div className="ml-32">
    <nav className="md:ml-auto md:mr-auto w-full flex flex-wrap items-center text-base justify-center">
      <a className="flex flex-col items-center w-32 rounded-2xl mr-5 text-white bg-slate-500 hover:bg-slate-600 active:bg-slate-700 focus:outline-none focus:ring focus:ring-slate-300 shadow-lg transition duration-300 ease-in-out transform hover:scale-105"> First Link </a>
      <a className="flex flex-col items-center w-32 rounded-2xl mr-5 text-white bg-slate-500 hover:bg-slate-600 active:bg-slate-700 focus:outline-none focus:ring focus:ring-slate-300 shadow-lg transition duration-300 ease-in-out transform hover:scale-105"> Second Link </a>
      <a className="flex flex-col items-center w-32 rounded-2xl mr-5 text-white bg-slate-500 hover:bg-slate-600 active:bg-slate-700 focus:outline-none focus:ring focus:ring-slate-300 shadow-lg transition duration-300 ease-in-out transform hover:scale-105"> Third Link </a>
      <a className="flex flex-col items-center w-32 rounded-2xl mr-5 text-white bg-slate-500 hover:bg-slate-600 active:bg-slate-700 focus:outline-none focus:ring focus:ring-slate-300 shadow-lg transition duration-300 ease-in-out transform hover:scale-105"> Fourth Link </a>
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
      <MapComponent />
    </div>

    {isSearchBarOpen && (
          <div className="flex flex-wrap">
            {/* Search Bar */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-400 bg-opacity-50 p-10 rounded-xl">
              <div className="container mx-auto flex flex-col items-center p-5">
                {/* Search bar components */}
                <input
                  type="text"
                  placeholder={`${selectedOption} Search...`}
                  className="w-full px-10 py-2 border rounded focus:outline-none focus:border-blue-500 mb-4"
                />
                <div className="flex justify-center space-x-4 mb-4">
                  {/* Search Options */}
                  <button
                    className={`text-white rounded-2xl px-6 py-2 bg-slate-400 hover:text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105 ${selectedOption === 'Truck' ? 'bg-orange-300  text-gray-800' : ''}`}
                    onClick={() => setSelectedOption('Truck')}
                  >
                    Truck
                  </button>
                  <button
                    className={`text-white rounded-2xl px-6 py-2 bg-slate-400 hover:text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105 ${selectedOption === 'Load' ? 'bg-slate-400 text-gray-800' : ''}`}
                    onClick={() => setSelectedOption('Load')}
                  >
                    Load
                  </button>
                </div>
                <button
                  className="w-full text-white rounded-2xl bg-orange-300 py-2 hover:text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={routeChange}
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
