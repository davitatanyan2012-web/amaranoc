import React, { useState } from 'react';

const ImageSlider = ({ images, onClose, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const next = (e) => { e.stopPropagation(); setCurrentIndex((currentIndex + 1) % images.length); };
  const prev = (e) => { e.stopPropagation(); setCurrentIndex((currentIndex - 1 + images.length) % images.length); };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(255,255,255,0.98)', zIndex: 1000, display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '30px', fontSize: '30px', border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
      
      <div style={{ position: 'relative', width: '80%', height: '70%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={prev} style={navButtonStyle}>〈</button>
        <img src={images[currentIndex]} alt="Slider" style={{ maxHeight: '100%', maxWidth: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
        <button onClick={next} style={{ ...navButtonStyle, right: 0 }}>〉</button>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px' }}>
        {images.map((img, idx) => (
          <img 
            key={idx} src={img} alt="Thumb" 
            onClick={() => setCurrentIndex(idx)}
            style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer', border: currentIndex === idx ? '3px solid #f48020' : 'none' }} 
          />
        ))}
      </div>
    </div>
  );
};

const navButtonStyle = {
  position: 'absolute', left: 0, background: '#fff', border: 'none', borderRadius: '50%',
  width: '50px', height: '50px', fontSize: '20px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
};

export default ImageSlider;