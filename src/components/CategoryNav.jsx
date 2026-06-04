import React from 'react';

const CategoryNav = () => {
  const categories = [
    { id: 1, icon: '🏠', name: 'Աղմուկից հեռու' },
    { id: 2, icon: '🌄', name: 'Շքեղ տեսարան' },
    { id: 3, icon: '🔥', name: 'Պահանջված' },
    { id: 4, icon: '🌊', name: 'Լճի ափին' },
    { id: 5, icon: '🏞️', name: 'Գետի ափին' },
    { id: 6, icon: '🛖', name: 'Տաղավար' },
    { id: 7, icon: '🏨', name: 'Հյուրանոց' },
  ];

  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', margin: '20px 0', overflowX: 'auto' }}>
      <button className="nav-arrow">&larr;</button>
      {categories.map(cat => (
        <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px', cursor: 'pointer' }}>
          <span style={{ fontSize: '24px' }}>{cat.icon}</span>
          <span style={{ fontSize: '12px', marginTop: '5px' }}>{cat.name}</span>
        </div>
      ))}
      <button className="nav-arrow">&rarr;</button>
    </div>
  );
};

export default CategoryNav;