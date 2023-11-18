import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import GoogleMap from "./FullPageMap"
import MapComponent from './MapAsset/mapComponent';


export default function Home() {
  let navigate = useNavigate();
  const routeChange = () =>{
  let path = '/truck';
  navigate(path)
  }
  //fatch data
  const [users, setUsers] = useState([])

  const fetchUserData = () => {
    fetch("http://127.0.0.1:5000/data")
      .then(response => {
        return response.json()
      })
      .then(data => {
        setUsers(data)
      })
  }

  useEffect(() => {
    fetchUserData()
    
  }, [])

  return (
    
    <>
    <div>
      {users.length > 0 && (
        <ul> 
          {users.map(user => (
            <li key={user.id}> {console.log(users)}{user.name}</li>
          ))}
        </ul>
      )}
    </div>
     
    <div className="text-gray-400 bg-gray-900 body-font" >
        
    <header>
    <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
    <a className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
      <span className="ml-3 text-xl">123 LoadBoard</span>
    </a>
    <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
      <a className="mr-5 hover:hover:text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105">First Link</a>
      <a className="mr-5 hover:hover:text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105">Second Link</a>
      <a className="mr-5 hover:hover:text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105">Third Link</a>
      <a className="mr-5 hover:hover:text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105">Fourth Link</a>
    </nav>
    </div>
    </header>
    <div className='ml-10 h-screen w-screen bg-gray-900'>
      <MapComponent />

    </div>
    <div className="flex flex-wrap">
        {/* Sidebar */}
        <aside className=" mt-16 text-gray-400 bg-gray-900 body-font w-1/5 overflow-y-auto h-screen fixed top-0 right-10">
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
