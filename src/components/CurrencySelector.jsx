import React from 'react';
import { useCurrencyStore } from '../store/useCurrencyStore';

const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrencyStore();
  const currencies = ['֏', '$', '€', '₽'];

  return (
    <div className="currency-selector" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {currencies.map((cur) => {
        const isActive = currency === cur;
        return (
          <button
            key={cur}
            onClick={() => setCurrency(cur)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: isActive ? 'none' : '1px solid #e0e0e0',
              backgroundColor: isActive ? '#1a222d' : '#ffffff', // Մուգ գույն ակտիվի համար
              color: isActive ? '#ffffff' : '#555555',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? '0px 2px 5px rgba(0,0,0,0.2)' : 'none'
            }}
          >
            {cur}
          </button>
        );
      })}
    </div>
  );
};

export default CurrencySelector;