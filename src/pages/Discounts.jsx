import React, { useState } from 'react';
import PropertyCard from '../components/PropertyCard';

const Discounts = () => {
  const [priceRange, setPriceRange] = useState(1000000);

  const discountProperties = [
    { id: 10, img: "https://api.amaranoc.am/compressed_images/compressed_1775558484173--0.3606161648706505image.webp", location: "Դիլիջան", capacity: 8, rating: 5, price: "35,000" },
    { id: 11, img: "https://api.amaranoc.am/compressed_images/compressed_1768380706620--0.5416288751044531image.webp", location: "Բջնի", capacity: 6, rating: 5, price: "45,000" },
    { id: 12, img: "https://api.amaranoc.am/compressed_images/compressed_1705829500856--0.9156560389221753image.webp", location: "Դիլիջան", capacity: 20, rating: 5, price: "75,000" }
  ];

  return (
    <div className="discounts-page-container">
      {/* Տոկոսային Զեղչերի Բլոկ */}
      <div className="discount-banners-grid">
        <div className="discount-banner-card">
          <div className="badge-percent">-15%</div>
          <p>Մինչև հունվարի կեսեր ամրագրելու դեպքում կգործի սկսած 3 օրից</p>
        </div>
        <div className="discount-banner-card">
          <div className="badge-percent">-10%</div>
          <p>Ամառանոցների մեծ մասի կանխավճարի հնարավորություն ամսական 10%</p>
        </div>
        <div className="discount-banner-card">
          <div className="badge-percent">-5%</div>
          <p>Ավելացրու 5% զեղչ քո յուրաքանչյուր 3-րդ ամրագրման ժամանակ</p>
        </div>
      </div>

      
       {/* ✨ ՊՐԵՄԻՈՒՄ ՈՃԻ ՆՎԵՐ ՔԱՐՏԻ ԲԱԺԻՆ */}
<div className="premium-gift-banner">
  <div className="banner-overlay">
    <div className="gift-content-left">
      <h2>ՊԱՏՎԻՐԻՐ ՆՎԵՐ ՔԱՐՏ <br /><span className="brand-orange-text">ՔՈ ԿԱՄ ԸՆԿԵՐՆԵՐԻԴ ՀԱՄԱՐ</span></h2>
      <p>Բաց մի թող ձեր թանկարժեք պահերը վայելելու և անմոռանալի հիշողություններ պարգևելու հնարավորությունը։</p>
      
      <div className="gift-values-grid">
        {['50,000 ֏', '60,000 ֏', '70,000 ֏', '80,000 ֏', '90,000 ֏', '100,000 ֏'].map((value, index) => (
          <button key={index} className="value-chip-btn">{value}</button>
        ))}
      </div>
      
      <button className="premium-order-btn">Պատվիրել</button>
    </div>
    
    <div className="gift-content-right">
      {/* Ռեալիստիկ պլաստիկ նվեր քարտի մոդելավորում */}
      <div className="luxury-plastic-card">
        <div className="card-chip"></div>
        <div className="card-brand-name">AMARANOC</div>
        <div className="card-holder">BY HASCO AM</div>
      </div>
    </div>
  </div>
</div>

      {/* Թեժ Առաջարկներ */}
      <div className="hot-offers-section">
        <h2>ԹԵԺ ԱՌԱՋԱՐԿՆԵՐ</h2>
        
        <div className="horizontal-filter">
          <label>Գնային զոնա</label>
          <div className="slider-wrapper">
            <input 
              type="range" 
              min="0" 
              max="1000000" 
              value={priceRange} 
              onChange={(e) => setPriceRange(e.target.value)}
            />
            <div className="slider-labels">
              <span>0 ֏</span>
              <span className="current-val">{Number(priceRange).toLocaleString()} ֏</span>
            </div>
          </div>
        </div>

        <div className="property-grid">
          {discountProperties.map(prop => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discounts;