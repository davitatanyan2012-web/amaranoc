import React, { useState } from 'react';

const Sidebar = () => {
  const [currency, setCurrency] = useState('֏');
  const [nightStay, setNightStay] = useState('Բոլորը');
  const [poolType, setPoolType] = useState('Բոլորը');
  const [capacity, setCapacity] = useState(1);

  return (
    <aside className="sidebar">
      {/* Տարածաշրջան */}
      <div className="filter-section">
        <h4>Տարածաշրջան</h4>
        <div className="checkbox-group">
          {['Դիլիջան 169', 'Ծաղկաձոր 112', 'Աշտարակ 34', 'Գառնի 31', 'Երևան 28'].map((region, i) => (
            <label key={i}>
              <input type="checkbox" /> {region}
            </label>
          ))}
        </div>
      </div>

      {/* Արժեք */}
      <div className="filter-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4>Արժեք</h4>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['֏', '$', '€', '₽'].map(cur => (
              <button 
                key={cur}
                onClick={() => setCurrency(cur)}
                style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '50%', 
                  width: '24px', 
                  height: '24px', 
                  background: currency === cur ? '#1a1a1a' : '#fff',
                  color: currency === cur ? '#fff' : '#1a1a1a',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                {cur}
              </button>
            ))}
          </div>
        </div>
        <div className="price-inputs">
          <input type="number" placeholder="Սկսած" />
          <input type="number" placeholder="Մինչև" />
        </div>
      </div>

      {/* Գիշերակացի առկայություն */}
      <div className="filter-section">
        <h4>Գիշերակացի առկայություն</h4>
        <div className="toggle-group">
          {['Բոլորը', 'Այո', 'Ոչ'].map(opt => (
            <button 
              key={opt}
              className={`toggle-btn ${nightStay === opt ? 'active' : ''}`}
              onClick={() => setNightStay(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Լողավազան */}
      <div className="filter-section">
        <h4>Լողավազան</h4>
        <div className="toggle-group" style={{ marginBottom: '10px' }}>
          {['Բոլորը', 'Բաց', 'Փակ'].map(opt => (
            <button 
              key={opt}
              className={`toggle-btn ${poolType === opt ? 'active' : ''}`}
              onClick={() => setPoolType(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="checkbox-group">
          <label><input type="checkbox" /> Տաքացվող</label>
          <label><input type="checkbox" /> Ֆիլտրվող</label>
          <label><input type="checkbox" /> Առանց ֆիլտրման</label>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;