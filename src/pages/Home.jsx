import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';

// Բոլոր պրոդուկտների բազան տեղափոխում ենք այստեղ
const ALL_PROPERTIES = [
  { id: 1, img: "https://api.amaranoc.am/compressed_images/compressed_1775558484173--0.3606161648706505image.webp", location: "Գառնի", capacity: 6, rating: 5, price: "45,000", hasNightStay: true, poolType: "Բաց" },
  { id: 2, img: "https://api.amaranoc.am/compressed_images/compressed_1768380706620--0.5416288751044531image.webp", location: "Օհանավան", capacity: 40, rating: 4.8, price: "80,000", hasNightStay: false, poolType: "Բաց" },
  { id: 3, img: "https://api.amaranoc.am/compressed_images/compressed_1705829500856--0.9156560389221753image.webp", location: "Ծաղկաձոր", capacity: 20, rating: null, price: "130,000", hasNightStay: true, poolType: "Փակ" },
  { id: 4, img: "https://api.amaranoc.am/compressed_images/compressed_1762850175532--0.184902584358007image.webp", location: "Ծաղկաձոր", capacity: 8, rating: 5, price: "40,000", hasNightStay: true, poolType: "Բաց" },
  { id: 5, img: "https://api.amaranoc.am/compressed_images/compressed_1760005109569--0.9947990042313706image.webp", location: "Բյուրական", capacity: 4, rating: null, price: "29,000", hasNightStay: false, poolType: "Բաց" },
  { id: 6, img: "https://api.amaranoc.am/compressed_images/compressed_1772031992147--0.08273550679993247image.webp", location: "Նոր Հաճն", capacity: 25, rating: 5, price: "140,000", hasNightStay: true, poolType: "Փակ" },
  { id: 7, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1782225697486--0.10842396390261366image.webp&w=3840&q=75", location: "Դիլիջան", capacity: 15, rating: 5, price: "80,000", hasNightStay: true, poolType: "Բաց" },
  { id: 8, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1782224314455--0.7934552497712941image.webp&w=3840&q=75", location: "Արզնի", capacity: 30, rating: 4.9, price: "70,000", hasNightStay: false, poolType: "Բաց" },
  { id: 9, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1782217460735--0.7831559135912047image_optimized.webp&w=1920&q=75", location: "Ջրվեժ", capacity: 45, rating: 5, price: "90,000", hasNightStay: true, poolType: "Բաց" },
  { id: 10, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1782216689601--0.41735032671259753image_optimized.webp&w=1920&q=75", location: "Աշտարակ", capacity: 20, rating: null, price: "60,000", hasNightStay: false, poolType: "Բաց" },
  { id: 11, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1782215429171--0.3630351414083641image.webp&w=1920&q=75", location: "Դիլիջան", capacity: 12, rating: 4.7, price: "120,000", hasNightStay: true, poolType: "Փակ" },
  { id: 12, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1782212863402--0.23734091396063683image.webp&w=1920&q=75", location: "Գառնի", capacity: 35, rating: 5, price: "75,000", hasNightStay: true, poolType: "Բաց" },
  { id: 13, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1782046120677--0.0018022922553218024image.webp&w=1920&q=75", location: "Երևան", capacity: 25, rating: 4.9, price: "100,000", hasNightStay: true, poolType: "Փակ" },
  { id: 14, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1782043244124--0.7204784243761135image.webp&w=1920&q=75", location: "Ծաղկաձոր", capacity: 16, rating: 5, price: "110,000", hasNightStay: true, poolType: "Փակ" },
  { id: 15, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1782038123089--0.5649445696982529image.webp&w=1920&q=75", location: "Նոր Հաճն", capacity: 40, rating: null, price: "85,000", hasNightStay: false, poolType: "Բաց" },
  { id: 16, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1782037560113--0.07541316460736436image.webp&w=1920&q=75", location: "Արզնի", capacity: 50, rating: 5, price: "130,000", hasNightStay: true, poolType: "Բաց" },
  { id: 17, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1781962504654--0.9895653413518022image.webp&w=1920&q=75", location: "Օհանավան", capacity: 30, rating: 4.6, price: "65,000", hasNightStay: false, poolType: "Բաց" },
  { id: 18, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1781956450902--0.4688806011175384image_optimized.webp&w=1920&q=75", location: "Դիլիջան", capacity: 10, rating: 5, price: "95,000", hasNightStay: true, poolType: "Բաց" },
  { id: 19, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1781962657990--0.5021620307497872image.webp&w=1920&q=75", location: "Ջրվեժ", capacity: 60, rating: 4.8, price: "150,000", hasNightStay: true, poolType: "Փակ" },
  { id: 20, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1781953630440--0.14019565092110486image.webp&w=1920&q=75", location: "Բյուրական", capacity: 15, rating: 5, price: "70,000", hasNightStay: true, poolType: "Բաց" },
  { id: 21, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1781788613144--0.756965176974624image.webp&w=1920&q=75", location: "Աշտարակ", capacity: 22, rating: null, price: "55,000", hasNightStay: false, poolType: "Բաց" },
  { id: 22, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1782213423756--0.8908435196457378image.webp&w=1920&q=75", location: "Ծաղկաձոր", capacity: 14, rating: 5, price: "125,000", hasNightStay: true, poolType: "Փակ" },
  { id: 23, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1781702144360--0.531467709228058image.webp&w=1920&q=75", location: "Գառնի", capacity: 18, rating: 4.9, price: "80,000", hasNightStay: true, poolType: "Բաց" },
  { id: 24, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1781692138915--0.6771320158416667image.webp&w=1920&q=75", location: "Երևան", capacity: 30, rating: 5, price: "115,000", hasNightStay: true, poolType: "Բաց" },
  { id: 25, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1781690785609--0.3110576409041277image.webp&w=1920&q=75", location: "Արզնի", capacity: 28, rating: null, price: "70,000", hasNightStay: false, poolType: "Բաց" },
  { id: 26, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1781690407557--0.03744585759949448image.webp&w=1920&q=75", location: "Դիլիջան", capacity: 20, rating: 5, price: "140,000", hasNightStay: true, poolType: "Փակ" },
  { id: 27, img: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1781688420744--0.6763048347857996image.webp&w=1920&q=75", location: "Նոր Հաճն", capacity: 35, rating: 4.8, price: "90,000", hasNightStay: true, poolType: "Բաց" }
];

const Home = () => {
  // Ֆիլտրերի State-երը
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [nightStay, setNightStay] = useState('Բոլորը');
  const [poolType, setPoolType] = useState('Բոլորը');
  const [currency, setCurrency] = useState('֏');

  // ՖԻԼՏՐՄԱՆ ՏՐԱՄԱԲԱՆՈՒԹՅՈՒՆԸ
  const filteredProperties = ALL_PROPERTIES.filter(property => {
    // 1. Գնի ֆիլտր (հեռացնում ենք ստորակետները թվի վերածելու համար)
    const propertyPrice = parseInt(property.price.replace(/,/g, ''), 10);
    if (minPrice && propertyPrice < parseInt(minPrice, 10)) return false;
    if (maxPrice && propertyPrice > parseInt(maxPrice, 10)) return false;

    // 2. Տարածաշրջանի ֆիլտր
    if (selectedRegions.length > 0 && !selectedRegions.includes(property.location)) return false;

    // 3. Գիշերակացի ֆիլտր
    if (nightStay !== 'Բոլորը') {
      const needsNightStay = nightStay === 'Այո';
      if (property.hasNightStay !== needsNightStay) return false;
    }

    // 4. Լողավազանի ֆիլտր
    if (poolType !== 'Բոլորը' && property.poolType !== poolType) return false;

    return true;
  });

  return (
    <div className="content-wrapper" style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <Sidebar 
        selectedRegions={selectedRegions}
        setSelectedRegions={setSelectedRegions}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={maxPrice}
        nightStay={nightStay}
        setNightStay={setNightStay}
        poolType={poolType}
        setPoolType={setPoolType}
        currency={currency}
        setCurrency={setCurrency}
      />
      <MainContent properties={filteredProperties} />
    </div>
  );
};

export default Home;