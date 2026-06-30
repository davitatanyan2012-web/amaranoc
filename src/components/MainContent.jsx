import React from 'react';
import PropertyCard from './PropertyCard';

const MainContent = ({ properties, onPropertySelect }) => {
  return (
    <main className="main-content" style={{ flex: 1 }}>
      <h2>Լավագույն առաջարկներ ({properties.length})</h2>
      {properties.length === 0 ? (
        <div style={{ padding: '20px', color: '#666', textAlign: 'center' }}>
          Տվյալներին համապատասխանող հայտարարություններ չեն գտնվել:
        </div>
      ) : (
        <div className="property-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {properties.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onSelect={onPropertySelect} 
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default MainContent;