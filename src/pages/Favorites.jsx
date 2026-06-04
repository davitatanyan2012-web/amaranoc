import React from 'react';
import { useFavoritesStore } from '../store/useFavoritesStore';
import PropertyCard from '../components/PropertyCard';

const Favorites = () => {
  const { favorites } = useFavoritesStore();

  return (
    <div className="favorites-page" style={{ padding: '40px 4%', minHeight: '60vh' }}>
      <h2 style={{ marginBottom: '25px', fontSize: '24px' }}>Ձեր նախընտրած հայտարարությունները</h2>
      {favorites.length === 0 ? (
        <div className="empty-favorites" style={{ color: '#666', textAlign: 'center', marginTop: '50px' }}>
          <p>Դեռևս չունեք նախընտրած տարբերակներ: Ավելացրեք սեղմելով սրտիկի վրա:</p>
        </div>
      ) : (
        <div className="property-grid">
          {favorites.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;