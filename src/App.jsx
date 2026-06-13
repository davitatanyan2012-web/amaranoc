import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Discounts from './pages/Discounts';
import Favorites from './pages/Favorites';
import Services from './pages/Services';
import PremiumChat from './components/PremiumChat'; // 💬 Չատի ներմուծումը
import './App.css'; // 🎨 Քո գլխավոր CSS-ը
import About from './pages/About'
function App() {
  return (
    <Router>
      {/* Քո հուսալի և անհրաժեշտ կոնտեյները, որը պահում է ողջ դիզայնը */}
      <div className="app-container">
        <Header />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discounts" element={<Discounts />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/services" element={<Services/>}/>
          <Route path="/about" element={<About />} />
        </Routes>
        
        {/* ⚡ Չատը տեղադրում ենք այստեղ՝ Routes-ից դուրս, բայց app-container-ի ներսում */}
        <PremiumChat /> 

        <Footer />
      </div>
    </Router>
  );
}

export default App;