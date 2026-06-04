import React, { useState } from 'react';

const Footer = () => {
  // Օգտագործում ենք Hook-եր ձևաթղթի (form) տվյալների կառավարման համար
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Հայտի տվյալները՝', formData);
    // Այստեղ հետագայում կավելացնենք API հարցումը
  };

  return (
    <footer className="footer-container">
      {/* 1. Հայտարարության տեղադրման հատված (Անտառի ֆոնով բլոկ) */}
      <div className="announcement-section">
        <div className="glass-card">
          <h3>ՏԵՂԱԴՐԵԼ ՀԱՅՏԱՐԱՐՈՒԹՅՈՒՆ</h3>
          <p className="subtitle">Մուտքագրեք Ձեր տվյալները նշված դաշտերում և մենք կկապնվենք Ձեզ հետ</p>
          
          <form onSubmit={handleSubmit} className="announcement-form">
            <input 
              type="text" 
              name="fullName"
              placeholder="Անուն Ազգանուն" 
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
            <input 
              type="tel" 
              name="phone"
              placeholder="Հեռախոսահամար" 
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            <input 
              type="email" 
              name="email"
              placeholder="Էլ. հասցե" 
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <button type="submit" className="submit-btn">Ուղարկել</button>
          </form>
        </div>
      </div>

      {/* 2. Կոնտակտային տվյալների հատված (Մուգ բլոկ՝ սարերի պատկերով) */}
      <div className="contacts-section">
        <h2>ԿՈՆՏԱԿՏՆԵՐ</h2>
        
        <div className="contacts-grid">
          {/* Հեռախոս */}
          <div className="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>041-611-611 / 044-611-611</span>
          </div>

          {/* Էլ. Փոստ */}
          <div className="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>AMARANOC.INFO@GMAIL.COM</span>
          </div>

          {/* Կայք */}
          <div className="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span>AMARANOC.AM</span>
          </div>

          {/* Սոց. ցանցեր */}
          <div className="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            <span>AMARANOC.AM</span>
          </div>

          {/* Հասցե */}
          <div className="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>ԹՈՒՄԱՆՅԱՆ 5</span>
          </div>
        </div>

        <div className="footer-links">
          <a href="/privacy">Գաղտնիության քաղաքականություն</a>
        </div>

        <div className="copyright">
          Ամառանոց ՍՊԸ | Amaranoc LLC | Амараноц ООО
        </div>

        {/* Իդեալական սպիտակ սարերի ուրվագիծը ներքևի մասում */}
        <div className="mountain-vector">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120H1440V85L1380 65L1310 95L1220 40L1140 75L1050 30L960 80L880 50L790 90L710 45L620 85L530 35L450 70L360 25L270 75L190 45L100 85L0 55V120Z" fill="rgba(255,255,255,0.08)"/>
            <path d="M0 120H1440V95L1350 70L1260 100L1180 55L1090 85L1000 40L910 90L820 60L730 95L650 50L560 85L470 40L380 90L300 55L210 85L120 45L0 95V120Z" fill="rgba(255,255,255,0.04)"/>
          </svg>
        </div>
      </div>
    </footer>
  );
};

export default Footer;