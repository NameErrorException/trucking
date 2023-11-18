import React from 'react';

export default function Truck() {
  return (
    <>
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
    </>
  );
}
