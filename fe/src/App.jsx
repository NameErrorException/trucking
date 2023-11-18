import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Test from './pages/Test'

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />}/>
          <Route path="/test" element={<Test />} />
          <Route path="*" element={<Home />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}