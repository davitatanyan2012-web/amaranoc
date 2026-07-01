import React, { useState } from 'react';
import PropertyCard from './PropertyCard';

// Պրոֆեսիոնալ SVG պատկերներ կատեգորիաների համար
const SVGIcons = {
  villa: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  guesthouse: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21V9a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v12"/>
      <path d="M2 14h20"/><path d="M10 14v7"/><path d="M14 14v7"/>
    </svg>
  ),
  hut: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-10 9h3v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8h3Z"/>
      <path d="M10 21v-4a2 2 0 0 1 4 0v4"/>
    </svg>
  ),
  pool: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h20"/><path d="M2 16c3.5 0 3.5-2 7-2s3.5 2 7 2 3.5-2 7-2"/><path d="M2 8c3.5 0 3.5-2 7-2s3.5 2 7 2 3.5-2 7-2"/>
    </svg>
  ),
  pavilion: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 2 7l10 5 10-5Z"/><path d="M2 17v-3.5L12 9l10 4.5V17"/><path d="M12 12v9"/>
    </svg>
  ),
  sevan: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10c3-1.5 3 1.5 6 0s3-1.5 6 0 3-1.5 6 0"/><path d="M2 15c3-1.5 3 1.5 6 0s3-1.5 6 0 3-1.5 6 0"/>
    </svg>
  ),
  dilijan: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 17h6v5h6v-5h6L12 2z"/>
    </svg>
  ),
  tsaghkadzor: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM4 16l4-3 3 2v6M20 16l-4-3-3 2v6"/>
    </svg>
  ),
  // Grid layout սիմվոլներ
  grid3: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="2" width="5" height="20" rx="1"/>
      <rect x="9.5" y="2" width="5" height="20" rx="1"/>
      <rect x="17" y="2" width="5" height="20" rx="1"/>
    </svg>
  ),
  grid2: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="2" width="8" height="20" rx="1"/>
      <rect x="13" y="2" width="8" height="20" rx="1"/>
    </svg>
  )
};

const categories = [
  { id: 1, label: 'Վիլլաներ', icon: SVGIcons.villa },
  { id: 2, label: 'Guest house', icon: SVGIcons.guesthouse },
  { id: 3, label: 'Տնակներ', icon: SVGIcons.hut },
  { id: 4, label: 'Փակ լողավազան', icon: SVGIcons.pool },
  { id: 5, label: 'Բացօթյա տաղավար', icon: SVGIcons.pavilion },
  { id: 6, label: 'Սևան', icon: SVGIcons.sevan },
  { id: 7, label: 'Դիլիջան', icon: SVGIcons.dilijan },
  { id: 8, label: 'Ծաղկաձոր', icon: SVGIcons.tsaghkadzor },
];

const MainContent = ({ properties, onPropertySelect }) => {
  // Սյուների քանակի կառավարում (լռելյայն 3 սյունակ)
  const [viewMode, setViewMode] = useState(3);

  return (
    <main className="main-content" style={{ flex: 1, padding: '0 20px' }}>
      {/* Կատեգորիաների սլայդեր */}
      <div className="categories-bar" style={{ display: 'flex', gap: '25px', overflowX: 'auto', padding: '15px 0', marginBottom: '25px', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <div key={cat.id} style={{ textAlign: 'center', cursor: 'pointer', minWidth: '80px', color: '#555' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30px', color: '#1a222d' }}>
              {cat.icon}
            </div>
            <div style={{ fontSize: '13px', fontWeight: '500', marginTop: '8px', whiteSpace: 'nowrap' }}>{cat.label}</div>
          </div>
        ))}
      </div>

      {/* Վերնագիր և Դասավորության փոփոխման կոճակներ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a222d' }}>Լավագույն առաջարկներ ({properties.length})</h2>
        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#f5f5f5', padding: '4px', borderRadius: '8px' }}>
          {/* 3 սյունակով դասավորելու կոճակ */}
          <button 
            onClick={() => setViewMode(3)}
            style={{ 
              border: 'none', 
              background: viewMode === 3 ? '#fff' : 'transparent', 
              color: viewMode === 3 ? '#1a222d' : '#888',
              padding: '6px 10px', 
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              boxShadow: viewMode === 3 ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {SVGIcons.grid3}
          </button>
          
          {/* 2 սյունակով դասավորելու կոճակ */}
          <button 
            onClick={() => setViewMode(2)}
            style={{ 
              border: 'none', 
              background: viewMode === 2 ? '#fff' : 'transparent', 
              color: viewMode === 2 ? '#1a222d' : '#888',
              padding: '6px 10px', 
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              boxShadow: viewMode === 2 ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {SVGIcons.grid2}
          </button>
        </div>
      </div>

      {properties.length === 0 ? (
        <div style={{ padding: '40px', color: '#666', textAlign: 'center' }}>
          Տվյալներին համապատասխանող հայտարարություններ չեն գտնվել:
        </div>
      ) : (
        /* Դինամիկ Grid ըստ ընտրված viewMode-ի */
        <div 
          className="property-grid" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${viewMode}, 1fr)`, 
            gap: '25px',
            transition: 'grid-template-columns 0.3s ease'
          }}
        >
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