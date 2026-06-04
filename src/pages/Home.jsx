import React from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';

const Home = () => {
  return (
    <div className="content-wrapper">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default Home;