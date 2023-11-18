import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Test from './pages/Test'
import Truck from './pages/Truck';

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />}/>
          <Route path="/truck" element={<Truck />} />
          <Route path="/test" element={<Test />} />
          <Route path="*" element={<Home />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}