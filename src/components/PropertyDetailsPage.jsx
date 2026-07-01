import React, { useState } from 'react';
import PropertyDetailBar from './PropertyDetailBar';
import ImageSlider from './ImageSlider';

// 1. ԼՈՒՐՋ ԵՎ ԿՈԿԻԿ ԻԿՈՆԱՆԵՐԻ ՓԱԹԵԹ (PROPERTY INFO ICONS)
const PropertyInfoIcons = {
  code: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>
    </svg>
  ),
  address: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  overnight: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  ),
  buildingArea: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  totalArea: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18"/><path d="M18 9H9v9"/>
    </svg>
  ),
  capacity: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  capacityOvernight: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16M2 11h20M22 4v16M2 8h18A2 2 0 0 1 22 10v6H2v-8Z"/>
    </svg>
  ),
  rooms: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 12h18M12 3v18"/>
    </svg>
  ),
  bathrooms: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7Z"/><path d="M9 11V6a3 3 0 0 1 6 0v5"/>
    </svg>
  ),
  pool: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6c.6.5 1.2 1 2.5 1C5.8 7 7 5 9.5 5c2.5 0 3.7 2 5 2 1.3 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 1.3 0 2.5-2 5-2 2.5 0 3.7 2 5 2 1.3 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
    </svg>
  )
};

// Առավելությունների բաժնի իկոնաները
const DetailIcons = {
  share: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  heart: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  pavilionClosed: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f48020" strokeWidth="1.8"><path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6"/></svg>,
  manghal: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f48020" strokeWidth="1.8"><rect x="4" y="8" width="16" height="8" rx="1"/><path d="M6 8V4m6 4V4m6 4V4M7 16v4m10-4v4"/></svg>,
  kitchen: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f48020" strokeWidth="1.8"><path d="M4 3h16v18H4zM4 11h16M9 3v8m0 4v2"/></svg>,
  music: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f48020" strokeWidth="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  tv: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f48020" strokeWidth="1.8"><rect width="20" height="15" x="2" y="3" rx="2"/><path d="M12 18v3M8 21h8"/></svg>,
  dishes: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f48020" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>,
  parking: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f48020" strokeWidth="1.8"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 16V8h3.5a2.5 2.5 0 0 1 0 5H9"/></svg>,
  firepit: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f48020" strokeWidth="1.8"><path d="M12 2c0 0 4 4 4 7a4 4 0 0 1-8 0c0-3 4-7 4-7zM5 22h14M7 19h10"/></svg>,
};

const PropertyDetailsPage = ({ property, onBack }) => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const images = property.images || [];
  const weekDays = ['երկ', 'երք', 'չոր', 'հնգ', 'ուրբ', 'շաբ', 'կիր'];

  return (
    <div className="property-details-page" style={{ padding: '0 0 120px 0', backgroundColor: '#fdfdfd', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {isSliderOpen && <ImageSlider images={images} onClose={() => setIsSliderOpen(false)} />}

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '20px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
           <button onClick={onBack} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', color: '#1a222d', fontSize: '14px' }}>
              〈 ՀԵՏ ԳՆԱԼ
           </button>
           <div style={{ display: 'flex', gap: '10px' }}>
             <button style={topSmallBtn}>{DetailIcons.share}</button>
             <button style={topSmallBtn}>{DetailIcons.heart}</button>
           </div>
        </div>

        {/* Gallery Grid */}
        <div style={{ display: 'flex', gap: '10px', height: '460px', borderRadius: '16px', overflow: 'hidden', marginBottom: '25px' }}>
          <div style={{ width: '50%', cursor: 'pointer' }} onClick={() => setIsSliderOpen(true)}>
            <img src={images[0]} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ width: '50%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {images.slice(1, 5).map((img, i) => (
              <div key={i} style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setIsSliderOpen(true)}>
                <img src={img} alt="Sub" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {i === 3 && (
                  <button style={seeAllBtnStyle} onClick={(e) => { e.stopPropagation(); setIsSliderOpen(true); }}>
                    Տեսնել բոլորը
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Price Detail Bar */}
        <div style={{ marginBottom: '30px' }}>
          <PropertyDetailBar property={property} />
        </div>

        {/* Main Grid Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '25px', marginBottom: '25px' }}>
          
          {/* ՁԱԽ ԲԼՈԿ: Հայտարարության մասին (ԹԱՐՄԱՑՎԱԾ ՊՐՈՖԵՍԻՈՆԱԼ ԻԿՈՆԱՆԵՐՈՎ) */}
          <div style={sectionBox}>
            <h3 style={sectionTitle}>Հայտարարության մասին</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div style={tableRow}>
                <div style={labelWithIcon}>{PropertyInfoIcons.code} <span>Կոդ</span></div>
                <span style={tableVal}>{property.code || 'AM577'}</span>
              </div>
              
              <div style={tableRow}>
                <div style={labelWithIcon}>{PropertyInfoIcons.address} <span>Հասցե</span></div>
                <span style={tableVal}>{property.location || 'Եղվարդ'}</span>
              </div>
              
              <div style={tableRow}>
                <div style={labelWithIcon}>{PropertyInfoIcons.overnight} <span>Գիշերակաց</span></div>
                <span style={tableVal}>{property.hasOvernight ? 'Այո' : 'Այո'}</span>
              </div>
              
              <div style={tableRow}>
                <div style={labelWithIcon}>{PropertyInfoIcons.buildingArea} <span>Շինության մակերես</span></div>
                <span style={tableVal}>{property.buildingArea || '120 քմ'}</span>
              </div>
              
              <div style={tableRow}>
                <div style={labelWithIcon}>{PropertyInfoIcons.totalArea} <span>Ընդհանուր մակերես</span></div>
                <span style={tableVal}>{property.totalArea || '500 քմ'}</span>
              </div>
              
              <div style={tableRow}>
                <div style={labelWithIcon}>{PropertyInfoIcons.capacity} <span>Մարդկանց թույլատրելի քանակ</span></div>
                <span style={tableVal}>{property.capacity || '25'}</span>
              </div>
              
              <div style={tableRow}>
                <div style={labelWithIcon}>{PropertyInfoIcons.capacityOvernight} <span>Մարդկանց քանակը գիշերակացով</span></div>
                <span style={tableVal}>{property.capacityOvernight || '5'}</span>
              </div>
              
              <div style={tableRow}>
                <div style={labelWithIcon}>{PropertyInfoIcons.rooms} <span>Սենյակների քանակ</span></div>
                <span style={tableVal}>{property.rooms || '3'}</span>
              </div>
              
              <div style={tableRow}>
                <div style={labelWithIcon}>{PropertyInfoIcons.bathrooms} <span>Սանհանգույցների քանակ</span></div>
                <span style={tableVal}>{property.bathrooms || '2'}</span>
              </div>
              
              <div style={tableRow}>
                <div style={labelWithIcon}>{PropertyInfoIcons.pool} <span>Լողավազան</span></div>
                <span style={tableVal}>{property.poolType || 'Բաց'}</span>
              </div>

            </div>
          </div>

          {/* ԱՋ ԲԼՈԿ: Օրացույց */}
          <div style={sectionBox}>
            <h3 style={sectionTitle}>Նշեք Ձեր ցանկալի օրերը</h3>
            <div style={{ textAlign: 'center', backgroundColor: '#f48020', color: '#fff', padding: '12px', borderRadius: '10px 10px 0 0', fontWeight: '700', letterSpacing: '1px', fontSize: '15px' }}>
              ՀՈՒԼԻՍ
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: '#fff', padding: '10px 5px 5px 5px', borderLeft: '1px solid #eee', borderRight: '1px solid #eee', textAlign: 'center' }}>
              {weekDays.map((day, index) => (
                <span key={index} style={{ fontSize: '12px', fontWeight: '600', color: index >= 5 ? '#f48020' : '#555' }}>{day}</span>
              ))}
            </div>
            <div style={calendarGrid}>
               <div style={calDayPassive}>29</div>
               <div style={calDayPassive}>30</div>
               {Array.from({ length: 31 }).map((_, i) => {
                 const dayNum = i + 1;
                 const isWeekend = dayNum === 6 || dayNum === 7 || dayNum === 13 || dayNum === 14 || dayNum === 20 || dayNum === 21 || dayNum === 27 || dayNum === 28;
                 return (
                   <div key={i} style={{ ...calDay, color: isWeekend ? '#f48020' : '#1a222d', fontWeight: isWeekend ? '700' : '500' }}>
                     {dayNum}
                   </div>
                 );
               })}
               <div style={calDayPassive}>1</div>
               <div style={calDayPassive}>2</div>
            </div>
          </div>

        </div>

        {/* Ընդհանուր նկարագրություն */}
        <div style={{ ...sectionBox, marginBottom: '25px' }}>
          <h3 style={sectionTitle}>Ընդհանուր նկարագրություն</h3>
          <p style={{ color: '#1a222d', lineHeight: '1.6', fontSize: '14px', fontWeight: '500', marginBottom: '20px' }}>
            Գտար վերջապես... Հաստատ արժեր երկար փնտրել ու վերջապես գտնել հենց այս տարբերակը։ Քեզ ու այս տանը իրարից բաժանում է ընդամենը մեկ զանգ։ <br />
            <strong>Տնակը նախատեսված է {property.capacity || 30} անձի համար։</strong> <br />
            <strong>Ունի գիշերակացի հնարավորություն 4-5 անձի համար։</strong>
          </p>
          
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1a222d', marginBottom: '10px' }}>Տնակում առկա է՝</h4>
          <ul style={featureList}>
            <li>• Բաց լողավազան</li>
            <li>• Տաղավար 25 անձի համար</li>
            <li>• Սպասք</li>
            <li>• Նվագարկիչ</li>
            <li>• TV</li>
            <li>• Խարույկի գոտի</li>
            <li>• 2 ննջասենյակ</li>
            <li>• Հյուրասենյակ</li>
            <li>• 2 սանհանգույց</li>
            <li>• Կայանատեղի</li>
          </ul>

          <div style={{ borderTop: '1px solid #eee', marginTop: '20px', paddingTop: '15px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1a222d', marginBottom: '8px' }}>Տնակի 1 օրվա արժեքն է՝</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0', fontSize: '14px', color: '#444', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <li>• <strong>Երկուշաբթի - Ուրբաթ:</strong> 80,000 դրամ</li>
              <li>• <strong>Շաբաթ - Կիրակի:</strong> 110,000 դրամ</li>
            </ul>

            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1a222d', marginBottom: '5px' }}>Մուտքի և ելքի ժամանակացույց՝</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#444' }}>
              Մուտք՝ <strong>13:00</strong> <br />
              Ելք՝ <strong>23:00 / 11:00</strong>
            </p>
          </div>
        </div>

        {/* Առավելություններ */}
        <div style={sectionBox}>
          <h3 style={sectionTitle}>Առավելություններ</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px' }}>
            <div style={iconBox}>{DetailIcons.pavilionClosed} <span>Փակ տաղավար</span></div>
            <div style={iconBox}>{DetailIcons.manghal} <span>Մանղալ</span></div>
            <div style={iconBox}>{DetailIcons.kitchen} <span>Ամառային խոհանոց</span></div>
            <div style={iconBox}>{DetailIcons.music} <span>Նվագարկիչ</span></div>
            <div style={iconBox}>{DetailIcons.tv} <span>Smart հեռուստացույց</span></div>
            <div style={iconBox}>{DetailIcons.dishes} <span>Սպասք</span></div>
            <div style={iconBox}>{DetailIcons.parking} <span>Կայանատեղի</span></div>
            <div style={iconBox}>{DetailIcons.firepit} <span>Խարույկ</span></div>
          </div>
        </div>

      </div>

      {/* Sticky Bottom Nav Bar */}
      <div style={stickyFooter}>
        <div style={footerPill}>
          <button style={footerBtnActive}>Նկարներ</button>
          <button style={footerBtn}>Հայտարարության մասին</button>
          <button style={footerBtn}>Քարտեզ</button>
          <button style={footerBtn}>Կարծիքներ</button>
          <button style={bookBtn}>Ամրագրել</button>
        </div>
      </div>
    </div>
  );
};

// Ոճեր (Styles)
const topSmallBtn = { 
  border: '1px solid #e8e8e8', borderRadius: '50%', width: '38px', height: '38px', 
  background: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#555'
};
const seeAllBtnStyle = { 
  position: 'absolute', bottom: '15px', right: '15px', background: '#fff', border: 'none', 
  padding: '10px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
};
const sectionBox = { 
  backgroundColor: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #eaeaea', boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
};
const sectionTitle = { 
  fontSize: '16px', fontWeight: '800', marginBottom: '20px', color: '#1a222d', borderBottom: '2px solid #f48020', paddingBottom: '6px', display: 'inline-block'
};

// ԹԱՐՄԱՑՎԱԾ ՍՏԻԼՆԵՐ ԱՂՅՈՒՍԱԿԻ ՀԱՄԱՐ
const tableRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '13.5px',
  color: '#475569',
  borderBottom: '1px dashed #f1f5f9',
  paddingBottom: '8px',
  paddingTop: '4px'
};
const labelWithIcon = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontWeight: '500'
};
const tableVal = {
  fontWeight: '700',
  color: '#0f172a'
};

const featureList = { 
  listStyle: 'none', padding: 0, margin: 0, fontSize: '13.5px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', color: '#333', fontWeight: '500'
};
const iconBox = { 
  display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13.5px', fontWeight: '600', color: '#1a222d' 
};
const calendarGrid = { 
  display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', padding: '10px 5px', border: '1px solid #eee', borderTop: 'none', backgroundColor: '#fafafa'
};
const calDay = { 
  backgroundColor: '#fff', padding: '12px 0', fontSize: '13px', cursor: 'pointer', textAlign: 'center', border: '1px solid #f9f9f9'
};
const calDayPassive = {
  backgroundColor: '#fff', padding: '12px 0', fontSize: '13px', textAlign: 'center', color: '#ccc', border: '1px solid #f9f9f9'
};
const stickyFooter = { 
  position: 'fixed', bottom: '25px', width: '100%', display: 'flex', justifyContent: 'center', zIndex: 950 
};
const footerPill = { 
  display: 'flex', alignItems: 'center', backgroundColor: '#1a222dd9', padding: '6px 6px 6px 24px', borderRadius: '40px', gap: '25px', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.24)' 
};
const footerBtn = { 
  background: 'none', border: 'none', color: '#b0b5bc', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s'
};
const footerBtnActive = { 
  background: 'none', border: 'none', color: '#f48020', fontSize: '13px', fontWeight: '700', cursor: 'pointer' 
};
const bookBtn = { 
  backgroundColor: '#f48020', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '30px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(244,128,32,0.3)'
};

export default PropertyDetailsPage;