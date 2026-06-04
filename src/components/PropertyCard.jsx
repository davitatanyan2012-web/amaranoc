import React from 'react';
import { useFavoritesStore } from '../store/useFavoritesStore';

const PropertyCard = ({ property }) => {
  const { favorites, toggleFavorite } = useFavoritesStore();
  
  // Ստուգում ենք՝ արդյոք տվյալ էլեմենտը սրտիկած է թե ոչ
  const isFavorite = favorites.some(item => item.id === property.id);

  return (
    <div className="property-card">
      <div className="card-image-wrapper">
        <img src={property.img} alt={property.location} loading="lazy" />
        
        {/* Սրտիկի ակտիվ վիճակի կառավարում */}
        <button 
          className="favorite-icon" 
          onClick={() => toggleFavorite(property)}
          style={{ transition: 'all 0.2s' }}
        >
          <svg 
            width="18" height="18" 
            viewBox="0 0 24 24" 
            fill={isFavorite ? "#f48020" : "none"} 
            stroke={isFavorite ? "#f48020" : "#444"} 
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      
      <div className="card-info">
        <div className="card-top-info">
          <div className="card-meta-details">
            <div className="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f48020" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>{property.location}</span>
            </div>
            <div className="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span>{property.capacity}</span>
            </div>
          </div>
          {property.rating && <span className="rating">★ {property.rating}</span>}
        </div>
        <div className="price-tag">{property.price} ֏</div>
      </div>
    </div>
  );
};

export default PropertyCard;