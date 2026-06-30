import React from 'react';
import { useCurrencyStore } from '../store/useCurrencyStore';

const PropertyDetailBar = ({ property }) => {
  const { currency, rates, convertAndFormat, setCurrency } = useCurrencyStore();
  const currencies = ['֏', '$', '€', '₽'];

  // Փոխարկում ենք ցերեկային և գիշերային գները ըստ ընտրված արժույթի
  const displayedPriceDay = convertAndFormat(property.priceDay || "0", currency, rates);
  const displayedPriceNight = property.priceNight 
    ? convertAndFormat(property.priceNight, currency, rates) 
    : null;

  return (
    <div 
      className="property-detail-bar" 
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        border: '1px solid #e8e8e8',
        borderRadius: '14px',
        padding: '12px 24px',
        width: '100%',
        boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
        fontFamily: 'sans-serif'
      }}
    >
      {/* ՁԱԽ ՀԱՏՎԱԾ՝ Տեղանուն և Ռեյտինգ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {/* Տեղանուն */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f48020" strokeWidth="2.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span style={{ fontSize: '16px', fontWeight: '800', color: '#1a222d', letterSpacing: '0.5px' }}>
            {property.location?.toUpperCase()}
          </span>
        </div>

        {/* Բաժանարար գիծ */}
        <div style={{ width: '1px', height: '20px', backgroundColor: '#e0e0e0' }}></div>

        {/* Ռեյտինգ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#f48020" stroke="#f48020" strokeWidth="1">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#1a222d' }}>
            {property.rating || 'N/A'}
          </span>
        </div>
      </div>

      {/* ԱՋ ՀԱՏՎԱԾ՝ Գներ և Արժույթի ընտրություն */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        
        {/* Սովորական Արժեք */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '11px', color: '#888888', fontWeight: '500', marginBottom: '2px' }}>
            Արժեք
          </span>
          <span style={{ fontSize: '20px', fontWeight: '800', color: '#f48020' }}>
            {displayedPriceDay} <span style={{ fontSize: '16px', fontWeight: '600' }}>{currency}</span>
          </span>
        </div>

        {/* Արժեքը գիշերակացով (ցուցադրվում է միայն եթե առկա է) */}
        {displayedPriceNight && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '11px', color: '#888888', fontWeight: '500', marginBottom: '2px' }}>
              Արժեքը գիշերակացով՝
            </span>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#f48020' }}>
              {displayedPriceNight} <span style={{ fontSize: '16px', fontWeight: '600' }}>{currency}</span>
            </span>
          </div>
        )}

        {/* Արժույթների կլոր կոճակները */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '10px' }}>
          {currencies.map((cur) => {
            const isActive = currency === cur;
            return (
              <button
                key={cur}
                onClick={() => setCurrency(cur)}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  border: isActive ? 'none' : '1px solid #e0e0e0',
                  backgroundColor: isActive ? '#141b22' : '#ffffff',
                  color: isActive ? '#ffffff' : '#555555',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                {cur}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default PropertyDetailBar;