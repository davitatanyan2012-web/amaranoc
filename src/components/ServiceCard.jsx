import React from 'react';

const ServiceCard = ({ service }) => {
  return (
    <div className="service-premium-card">
      {/* 🖼 Նկարի բաժին */}
      <div className="service-img-wrapper">
        <img src={service.image} alt={service.title} />
      </div>
      
      {/* 📝 Ինֆորմացիայի բաժին */}
      <div className="service-info-wrapper">
        <div className="service-text-content">
          <h3 className="service-card-title">{service.title}</h3>
          <p className="service-card-desc">{service.description}</p>
        </div>
        
        {/* 💰 Գին և Նուրբ Կոճակ */}
        <div className="service-card-bottom">
          <span className="service-card-price">{service.price} ֏</span>
          <button className="service-card-add-btn">
            {/* Նուրբ մինիմալիստական պլյուս իկոնա */}
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="btn-icon-plus"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Ավելացնել
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;