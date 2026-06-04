import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src="https://amaranoc.am/images/logo.svg" alt="Amaranoc Logo" />
      </div>
      
      <nav className="header-nav">
        <ul>
          <li><a href="/" className="active">Գլխավոր</a></li>
          <li><a href="/discounts">Զեղչեր</a></li>
          <li><a href="/services">Ծառայություններ</a></li>
          <li><a href="/about">Մեր մասին</a></li>
        </ul>
      </nav>

      <div className="header-right">
        {/* 🌐 Լեզու */}
        <button className="icon-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </button>

        {/* 👤 Պրոֆիլ */}
        <button className="icon-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>

        {/* Որոնման դաշտ */}
        <div className="search-box">
          <input type="text" placeholder="Որոնում" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;