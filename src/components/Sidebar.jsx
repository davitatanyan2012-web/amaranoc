import React from 'react';

const Sidebar = ({
  selectedRegions, setSelectedRegions,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  nightStay, setNightStay,
  poolType, setPoolType,
  currency, setCurrency
}) => {

  // Տարածաշրջանի Checkbox-ների փոփոխման ֆունկցիա
  const handleRegionChange = (regionName) => {
    if (selectedRegions.includes(regionName)) {
      setSelectedRegions(selectedRegions.filter(r => r !== regionName));
    } else {
      setSelectedRegions([...selectedRegions, regionName]);
    }
  };

  const regionsData = [
    { name: 'Դիլիջան', label: 'Դիլիջան 169' },
    { name: 'Ծաղկաձոր', label: 'Ծաղկաձոր 112' },
    { name: 'Աշտարակ', label: 'Աշտարակ 34' },
    { name: 'Գառնի', label: 'Գառնի 31' },
    { name: 'Երևան', label: 'Երևան 28' }
  ];

  return (
    <aside className="sidebar">
      {/* Տարածաշրջան */}
      <div className="filter-section">
        <h4>Տարածաշրջան</h4>
        <div className="checkbox-group">
          {regionsData.map((reg, i) => (
            <label key={i}>
              <input 
                type="checkbox" 
                checked={selectedRegions.includes(reg.name)}
                onChange={() => handleRegionChange(reg.name)}
              /> {reg.label}
            </label>
          ))}
        </div>
      </div>

      {/* Արժեք */}
      <div className="filter-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4>Արժեք</h4>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['֏', '$', '€', '₽'].map(cur => (
              <button 
                key={cur}
                onClick={() => setCurrency(cur)}
                style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '50%', 
                  width: '26px', 
                  height: '26px', 
                  background: currency === cur ? '#f48020' : '#fff',
                  color: currency === cur ? '#fff' : '#1a1a1a',
                  border: currency === cur ? '1px solid #f48020' : '1px solid #ddd',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {cur}
              </button>
            ))}
          </div>
        </div>
        <div className="price-inputs" style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="number" 
            placeholder="Սկսած" 
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
          <input 
            type="number" 
            placeholder="Մինչև" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
        </div>
      </div>

      {/* Գիշերակացի առկայություն */}
      <div className="filter-section">
        <h4>Գիշերակացի առկայություն</h4>
        <div className="toggle-group" style={{ display: 'flex', gap: '5px' }}>
          {['Բոլորը', 'Այո', 'Ոչ'].map(opt => (
            <button 
              key={opt}
              className={`toggle-btn ${nightStay === opt ? 'active' : ''}`}
              onClick={() => setNightStay(opt)}
              style={{
                flex: 1,
                padding: '6px',
                background: nightStay === opt ? '#f48020' : '#fff',
                color: nightStay === opt ? '#fff' : '#555',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Լողավազան */}
      <div className="filter-section">
        <h4>Լողավազան</h4>
        <div className="toggle-group" style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
          {['Բոլորը', 'Բաց', 'Փակ'].map(opt => (
            <button 
              key={opt}
              className={`toggle-btn ${poolType === opt ? 'active' : ''}`}
              onClick={() => setPoolType(opt)}
              style={{
                flex: 1,
                padding: '6px',
                background: poolType === opt ? '#f48020' : '#fff',
                color: poolType === opt ? '#fff' : '#555',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;