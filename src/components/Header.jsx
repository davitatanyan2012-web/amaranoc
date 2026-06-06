import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFavoritesStore } from '../store/useFavoritesStore';

const Header = () => {
  const location = useLocation();
  const { favorites } = useFavoritesStore();

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src="https://amaranoc.am/images/logo.svg" alt="Amaranoc Logo" />
        </Link>
      </div>
      
      <nav className="header-nav">
        <ul>
          <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Գլխավոր</Link></li>
          <li><Link to="/discounts" className={location.pathname === '/discounts' ? 'active' : ''}>Զեղչեր</Link></li>
          <li><Link to="/services" className={location.pathname === '/services' ? 'active' : ''}>Ծառայություններ</Link></li>
          <li><a href="#about">Մեր մասին</a></li>
        </ul>
      </nav>

      <div className="header-right">
        {/* ❤️ Սրտիկների էջի կոճակ նորացված տեսքով */}
        <Link to="/favorites" className="icon-btn favorite-header-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill={favorites.length > 0 ? "#ff9900" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          {favorites.length > 0 && <span className="fav-badge">{favorites.length}</span>}
        </Link>

        <button className="icon-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
        </button>

        <button className="icon-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </button>

        <div className="search-box">
          <input type="text" placeholder="Որոնում" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
      </div>
    </header>
  );
};

export default Header;