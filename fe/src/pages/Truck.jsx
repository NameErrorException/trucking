import React from 'react';

export default function Truck() {
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
    <div className="absolute top-4 right-14 h-16 w-16">
      <button class=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>

        <span>Trucks</span>
      </button>
    </div>
    </a>
    </div>
    </header>
    <div className='flex-1 w-11/12 mx-auto p-4 text-lg bg-[#D6DBDf] h-full shadow-lg rounded-2xl after:clear-both after:block after:content-[""]'>
      <style>
        {`
          body {
            background-color: rgb(17 24 39); /* Set your desired background color */
            color: #ccc; /* Set your desired text color */
          }
        `}
      </style>
      <div className='m-10'>
        <img src="http://127.0.0.1:5000/camera" width="50%" alt="Truck Image" />
        
      </div> 
    </div>
    <div className="flex flex-wrap">
        {/* Sidebar */}
        <aside className=" mt-16 text-gray-400 bg-transparent body-font w-1/5 overflow-y-auto h-screen fixed top-0 right-10">
          <div className="container mx-auto flex flex-col items-center p-5">
            <a className="flex title-font font-medium items-center text-white mb-4">
              <span className="ml-3 text-lg hover:text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105">Truck Info</span>
            </a>
            <nav className="md:ml-auto md:mr-auto flex flex-col items-center text-base">
              <button className="mb-4 hover:text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105" onClick={routeChange}>Sidebar Link 1</button>
              <a className="mb-4 hover:hover:text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105 ">Sidebar Link 2</a>
              <a className="mb-4 hover:hover:text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105">Sidebar Link 3</a>
              <a className="mb-4 hover:hover:text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105">Sidebar Link 3</a>
              <a className="hover:hover:text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105">Sidebar Link 4</a>
            </nav>
          </div>
        </aside>
     </div>

   </div>

    </>  

  );
}
