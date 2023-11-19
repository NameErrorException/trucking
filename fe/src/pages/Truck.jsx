import React from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function Truck() {
    
    let location = useLocation();
    let navigate = useNavigate();


    const GoHome = () => {
      navigate(`/`);
    };
    const GoRank = () => {
      navigate(`/ranking`);
    };

    
    let truckId = location.pathname.replace('/truck/', '')
    console.log("um so here we are!!")
    console.log(truckId)

  return (
    <div className='h-screen'>    
    <div className="text-gray-400 min-h-screen bg-gradient-to-r from-[#02040d] to-[#6b6e77] body-font" >
        
    <header>
    <div className="container bg-slate-400/1 mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
    <a className=" flex title-font font-medium items-center text-white/80 mb-4 md:mb-0">
      
      <div><span className="ml-3 text-xl">123 LoadBoard</span></div>
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
    </nav>
    </div>
    <div className="absolute top-4 right-14 h-16 w-16">

    </div>
    </a>
    </div>
    </header>
    <div className='flex-1 w-11/12 max-h-50% mx-auto p-4 text-lg bg-[#D6DBDf] shadow-lg rounded-2xl after:clear-both after:block after:content-[""]'>
      <style>
        {`
          body {
            background-color: rgb(17 24 39); /* Set your desired background color */
            color: #ccc; /* Set your desired text color */
          }
        `}
      </style>
        <div className='flex bg-slate-700 m-10 px-8 py-8 w-50% h-full justify-center items-center'>
            <img className='w-50%' src={`http://127.0.0.1:5000/camera/${truckId}`} alt="Truck Image" />
      </div> 
    </div>
    <div className="flex flex-wrap">
        {/* Sidebar */}
        <aside className=" mt-16 text-gray-400 bg-transparent body-font w-1/5 overflow-y-auto h-screen fixed top-0 right-10">
          <div className="container mx-auto flex flex-col items-center p-5">
            <nav className="md:ml-auto md:mr-auto flex flex-col items-center text-base">
            </nav>
          </div>
        </aside>
     </div>

   </div>

    </div>  

  );
}
