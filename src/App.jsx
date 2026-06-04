import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Footer from './components/Footer'; // Նոր ներմուծումը
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="content-wrapper">
        <Sidebar />
        <MainContent />
      </div>
      <Footer /> {/* Մեր իդեալական ֆուտերը */}
    </div>
  );
}

export default App;