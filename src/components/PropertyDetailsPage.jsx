import React from 'react';
import PropertyDetailBar from './PropertyDetailBar';

const PropertyDetailsPage = ({ property, onBack }) => {
  const images = property.images || [];

  return (
    <div className="property-details-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* Հետադարձ Կոճակ */}
      <button 
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
          cursor: 'pointer', fontSize: '15px', fontWeight: '600', color: '#1a222d', marginBottom: '20px'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Հետ գնալ
      </button>

      {/* 1+4 ԳՐԻԴ ՊԱՏԿԵՐԱՍՐԱՀ (GALLERY GRID) */}
      <div style={{ display: 'flex', gap: '10px', height: '420px', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' }}>
        
        {/* Ձախակողմյան մեծ նկարը */}
        <div style={{ width: '50%', height: '100%' }}>
          <img src={images[0]} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Աջակողմյան 4 փոքր նկարների գրիդը */}
        <div style={{ width: '50%', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '10px', height: '100%', position: 'relative' }}>
          <img src={images[1] || images[0]} alt="Sub 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <img src={images[2] || images[0]} alt="Sub 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <img src={images[3] || images[0]} alt="Sub 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          
          {/* Չորրորդ նկարը՝ «Տեսնել բոլորը» կոճակով */}
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img src={images[4] || images[0]} alt="Sub 4" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button style={{
              position: 'absolute', bottom: '15px', right: '15px',
              backgroundColor: '#ffffff', color: '#1a222d', border: 'none',
              padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700',
              cursor: 'pointer', boxShadow: '0px 2px 8px rgba(0,0,0,0.15)'
            }}>
              Տեսնել բոլորը
            </button>
          </div>
        </div>
      </div>

      {/* ԳՆԵՐԻ ԵՎ ԱՐԺՈՒՅԹԻ ՎԱՀԱՆԱԿԸ */}
      <PropertyDetailBar property={property} />

      {/* ՆԵՐՔԵՎԻ ՄԱՍ՝ ՏՎՅԱԼՆԵՐ + ՕՐԱՑՈՒՅՑ */}
      <div style={{ display: 'flex', gap: '30px', marginTop: '30px' }}>
        
        {/* Ձախ կողմ՝ Հայտարարության մասին */}
        <div style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e8e8e8', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', color: '#1a222d' }}>Հայտարարության մասին</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: '# Կոդ', value: property.code || 'AM484' },
              { label: 'Հասցե', value: property.location },
              { label: 'Գիշերակաց', value: property.hasNightStay ? 'Այո' : 'Ոչ' },
              { label: 'Շինության մակերես', value: property.builtArea || '280 քմ' },
              { label: 'Ընդհանուր մակերես', value: property.totalArea || '600 քմ' },
              { label: 'Մարդկանց թույլատրելի քանակ', value: property.capacity },
              { label: 'Մարդկանց քանակը գիշերակացով', value: property.capacityNight || '10' },
              { label: 'Սենյակների քանակ', value: property.rooms || '5' },
              { label: 'Սանհանգույցների քանակ', value: property.bathrooms || '2' },
              { label: 'Լողավազան', value: property.poolType },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', paddingBottom: '8px', borderBottom: '1px stroke #f5f5f5' }}>
                <span style={{ color: '#555555', fontWeight: '500' }}>{item.label}</span>
                <span style={{ color: '#1a222d', fontWeight: '700' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Աջ կողմ՝ Օրացույց (Calendar Placeholder) */}
        <div style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e8e8e8', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', color: '#1a222d' }}>Նշեք Ձեր ցանկալի օրերը</h3>
          
          {/* Նարնջագույն Ամսվա վերնագիր */}
          <div style={{ backgroundColor: '#f48020', color: '#ffffff', textAlign: 'center', padding: '10px', borderRadius: '8px', fontWeight: '700', fontSize: '16px', marginBottom: '15px' }}>
            ՀՈՒԼԻՍ
          </div>

          {/* Օրացույցի ցանցի մոդելավորում */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center', fontSize: '13px' }}>
            {['Երկ', 'Երք', 'Չոր', 'Հնգ', 'Ուրբ', 'Շաբ', 'Կիր'].map((day, i) => (
              <div key={i} style={{ fontWeight: '700', color: i >= 5 ? '#f48020' : '#555' }}>{day}</div>
            ))}
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} style={{ padding: '8px', color: '#1a222d', fontWeight: '600', cursor: 'pointer' }}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default PropertyDetailsPage;