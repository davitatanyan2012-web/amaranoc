import React, { useState } from 'react';
import ServiceCard from '../components/ServiceCard';

const Services = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Բոլորը' },
    { id: 'service', label: 'Սպասարկում' },
    { id: 'show', label: 'Շոու' },
    { id: 'events', label: 'Միջոցառումներ' },
    { id: 'decor', label: 'Դեկորներ' },
    { id: 'rent', label: 'Օրավարձով գույք' },
    { id: 'shooting', label: 'Նկարահանում' }
  ];

  const servicesData = [
    {
      id: 1,
      category: 'service',
      title: 'Սպասարկող',
      price: '20,000',
      description: 'Յուրաքանչյուր մասնագետ կիրականացնի 15-20 անձի պատշաճ սպասարկում: Ծառայության տևողությունը սահմանվում է միջոցառման սկզբից...',
      image: 'https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1724331775249--0.16594454212797016image.webp&w=1920&q=75'
    },
    {
      id: 2,
      category: 'service',
      title: 'Բարմեն',
      price: '25,000',
      description: 'Մեր պրոֆեսիոնալ բարմենները պատրաստում են տարբեր տեսակի խմիչքներ պատրաստված հենց ձեզ համար: Մեր բարմենները պատրաստվում են...',
      image: 'https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1724330468263--0.5829426973721912image.webp&w=1920&q=75'
    },
    {
      id: 3,
      category: 'service',
      title: 'Խոհարար',
      price: '35,000',
      description: 'Արդեն հոգնել ե՞ք միջոցառման ամբողջ ընթացքում խոհանոցում մնալուց: Ունենալով խոհարար փորձառու և արագաշարժ, դուք կկարողանաք անցկացնել ձեր հաճելի և հիշարժան...',
      image: 'https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1724331582281--0.8016246618454268image.webp&w=1920&q=75'
    },
    {
      id: 4,
      category: 'show',
      title: 'Հանդիսավար',
      price: '60,000',
      description: 'Այս բաժնում մենք կօգնենք ձեզ գտնել հանդիսավարի (թամադայի) ընտրության հարցում, քանի որ միայն հմուտ հանդիսավարը կարող է իր կազմակերպչական...',
      image: 'https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1724346434036--0.5362400594372552image.webp&w=1920&q=75'
    },
    {
      id: 5,
      category: 'show',
      title: 'Փրփուր Փարթի',
      price: '26,900',
      description: 'Դարձրեք ձեր երեխաների և ոչ միայն, ձեր մանկության, ամենահիշարժան օրերից մեկը, անցկացրեք այն նաև շոգ եղանակին և թարմացնող...',
      image: 'https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1725721755318--0.3513684578103693image.webp&w=1920&q=75'
    }
  ];

  const filteredServices = activeCategory === 'all' 
    ? servicesData 
    : servicesData.filter(item => item.category === activeCategory);

  return (
    <div className="services-page-container">
      {/* 🗂 Կատեգորիաների նավիգացիա */}
      <div className="services-tabs-menu">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`services-tab-item ${activeCategory === cat.id ? 'is-active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ⚡ Ծառայությունների 2 սյունականի ցանց */}
      <div className="services-twin-grid">
        {filteredServices.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default Services;