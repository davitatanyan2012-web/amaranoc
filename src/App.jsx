import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Discounts from './pages/Discounts';
import Favorites from './pages/Favorites';
import Services from './pages/Services';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discounts" element={<Discounts />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/services" element={<Services/>}/>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;