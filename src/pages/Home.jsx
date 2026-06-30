import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import PropertyDetailsPage from '../components/PropertyDetailsPage'; // Ներմուծում ենք մանրամասների նոր էջը

// Թարմացված Բազա՝ քո տրամադրած իրական նկարներով և 12 քարտերով
const ALL_PROPERTIES = [
  { 
    id: 1, 
    code: "AM484", 
    location: "Ծաղկաձոր", 
    hasNightStay: true, 
    builtArea: "280 քմ", 
    totalArea: "600 քմ", 
    capacity: 20, 
    capacityNight: 10, 
    rooms: 5, 
    bathrooms: 2, 
    poolType: "Փակ", 
    rating: 5, 
    priceDay: "45,000", 
    priceNight: "45,000", 
    images: [
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1782225697486--0.10842396390261366image.webp&w=3840&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1782224314455--0.7934552497712941image.webp&w=3840&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1782217460735--0.7831559135912047image_optimized.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1782216689601--0.41735032671259753image_optimized.webp&w=1920&q=75"
    ]
  },
  { 
    id: 2, 
    code: "OV012", 
    location: "Օհանավան", 
    hasNightStay: false, 
    builtArea: "150 քմ", 
    totalArea: "900 քմ", 
    capacity: 40, 
    capacityNight: 0, 
    rooms: 3, 
    bathrooms: 1, 
    poolType: "Բաց", 
    rating: 4.8, 
    priceDay: "80,000", 
    priceNight: null, 
    images: [
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1782215429171--0.3630351414083641image.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1782212863402--0.23734091396063683image.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1782046120677--0.0018022922553218024image.webp&w=1920&q=75"
    ]
  },
  { 
    id: 3, 
    code: "DL741", 
    location: "Դիլիջան", 
    hasNightStay: true, 
    builtArea: "210 քմ", 
    totalArea: "500 քմ", 
    capacity: 12, 
    capacityNight: 8, 
    rooms: 4, 
    bathrooms: 3, 
    poolType: "Բաց", 
    rating: 5, 
    priceDay: "75,000", 
    priceNight: "95,000", 
    images: [
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1782043244124--0.7204784243761135image.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1782038123089--0.5649445696982529image.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1782037560113--0.07541316460736436image.webp&w=1920&q=75"
    ]
  },
  { 
    id: 4, 
    code: "GR099", 
    location: "Գառնի", 
    hasNightStay: true, 
    builtArea: "320 քմ", 
    totalArea: "1200 քմ", 
    capacity: 25, 
    capacityNight: 15, 
    rooms: 6, 
    bathrooms: 4, 
    poolType: "Փակ", 
    rating: 4.9, 
    priceDay: "120,000", 
    priceNight: "150,000", 
    images: [
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1781962504654--0.9895653413518022image.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1781956450902--0.4688806011175384image_optimized.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1781962657990--0.5021620307497872image.webp&w=1920&q=75"
    ]
  },
  { 
    id: 5, 
    code: "BY223", 
    location: "Բյուրական", 
    hasNightStay: false, 
    builtArea: "110 քմ", 
    totalArea: "800 քմ", 
    capacity: 15, 
    capacityNight: 0, 
    rooms: 2, 
    bathrooms: 1, 
    poolType: "Բաց", 
    rating: 4.6, 
    priceDay: "35,000", 
    priceNight: null, 
    images: [
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1781953630440--0.14019565092110486image.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1781788613144--0.756965176974624image.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1782213423756--0.8908435196457378image.webp&w=1920&q=75"
    ]
  },
  { 
    id: 6, 
    code: "NH115", 
    location: "Նոր Հաճն", 
    hasNightStay: true, 
    builtArea: "190 քմ", 
    totalArea: "450 քմ", 
    capacity: 18, 
    capacityNight: 8, 
    rooms: 4, 
    bathrooms: 2, 
    poolType: "Փակ", 
    rating: 5, 
    priceDay: "60,000", 
    priceNight: "80,000", 
    images: [
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1781702144360--0.531467709228058image.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1781692138915--0.6771320158416667image.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1781690785609--0.3110576409041277image.webp&w=1920&q=75"
    ]
  },
  { 
    id: 7, 
    code: "AZ041", 
    location: "Արզնի", 
    hasNightStay: false, 
    builtArea: "260 քմ", 
    totalArea: "1000 քմ", 
    capacity: 35, 
    capacityNight: 0, 
    rooms: 5, 
    bathrooms: 2, 
    poolType: "Բաց", 
    rating: 4.7, 
    priceDay: "90,000", 
    priceNight: null, 
    images: [
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1781690785555--0.07368186291089818image.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1781690407557--0.03744585759949448image.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1781688420744--0.6763048347857996image.webp&w=1920&q=75"
    ]
  },
  { 
    id: 8, 
    code: "JV305", 
    location: "Ջրվեժ", 
    hasNightStay: true, 
    builtArea: "220 քմ", 
    totalArea: "700 քմ", 
    capacity: 22, 
    capacityNight: 12, 
    rooms: 4, 
    bathrooms: 3, 
    poolType: "Բաց", 
    rating: 5, 
    priceDay: "55,000", 
    priceNight: "70,000", 
    images: [
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1774603454003--0.8626553444149481image.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1766138959706--0.3054419188731099image.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1766753068454--0.4833220196831416image.webp&w=1920&q=75"
    ]
  },
  { 
    id: 9, 
    code: "SV881", 
    location: "Սևան", 
    hasNightStay: true, 
    builtArea: "170 քմ", 
    totalArea: "550 քմ", 
    capacity: 10, 
    capacityNight: 6, 
    rooms: 3, 
    bathrooms: 2, 
    poolType: "Առանց լողավազանի", 
    rating: 4.9, 
    priceDay: "40,000", 
    priceNight: "55,000", 
    images: [
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1771598110451--0.4151095122496744image.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1778744544176--0.9742892469611801image.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1782729517484--0.5286791557173605image_optimized.webp&w=1920&q=75"
    ]
  },
  { 
    id: 10, 
    code: "AS034", 
    location: "Աշտարակ", 
    hasNightStay: true, 
    builtArea: "400 քմ", 
    totalArea: "1500 քմ", 
    capacity: 50, 
    capacityNight: 20, 
    rooms: 7, 
    bathrooms: 5, 
    poolType: "Բաց", 
    rating: 5, 
    priceDay: "150,000", 
    priceNight: "200,000", 
    images: [
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1782729517489--0.15618543680923214image_optimized.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1782729517492--0.20675391902071172image_optimized.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1782655550943--0.5780160916094081image_optimized.webp&w=1920&q=75"
    ]
  },
  { 
    id: 11, 
    code: "DL742", 
    location: "Դիլիջան", 
    hasNightStay: true, 
    builtArea: "180 քմ", 
    totalArea: "520 քմ", 
    capacity: 14, 
    capacityNight: 6, 
    rooms: 3, 
    bathrooms: 2, 
    poolType: "Բաց", 
    rating: 4.9, 
    priceDay: "65,000", 
    priceNight: "85,000", 
    images: [
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1782480545755--0.2874348714337793image_optimized.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1782480545756--0.2424467240398287image_optimized.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1782480545751--0.9410254717881623image_optimized.webp&w=1920&q=75"
    ]
  },
  { 
    id: 12, 
    code: "AM485", 
    location: "Ծաղկաձոր", 
    hasNightStay: true, 
    builtArea: "310 քմ", 
    totalArea: "700 քմ", 
    capacity: 24, 
    capacityNight: 12, 
    rooms: 6, 
    bathrooms: 4, 
    poolType: "Փակ", 
    rating: 5, 
    priceDay: "110,000", 
    priceNight: "140,000", 
    images: [
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1782480545747--0.8094271486895008image_optimized.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1782464341479--0.9216674191555019image_optimized.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1782464341473--0.5796053218539989image_optimized.webp&w=1920&q=75",
      "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2F1782464341496--0.9554925553576863image_optimized.webp&w=1920&q=75"
    ]
  }
];

const Home = () => {
  // Ընտրված տան state-ը էջերի միջև անցում կատարելու համար
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Ֆիլտրերի State-երը
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [nightStay, setNightStay] = useState('Բոլորը');
  const [poolType, setPoolType] = useState('Բոլորը');
  const [currency, setCurrency] = useState('֏');

  // ՖԻԼՏՐՄԱՆ ՏՐԱՄԱԲԱՆՈՒԹՅՈՒՆԸ
  const filteredProperties = ALL_PROPERTIES.filter(property => {
    // Գնի ֆիլտրումն իրականացնում ենք ըստ հիմնական (priceDay) գնի
    const propertyPrice = parseInt((property.priceDay || "0").replace(/,/g, ''), 10);
    if (minPrice && propertyPrice < parseInt(minPrice, 10)) return false;
    if (maxPrice && propertyPrice > parseInt(maxPrice, 10)) return false;

    // Տարածաշրջանի ֆիլտր
    if (selectedRegions.length > 0 && !selectedRegions.includes(property.location)) return false;

    // Գիշերակացի ֆիլտր
    if (nightStay !== 'Բոլորը') {
      const needsNightStay = nightStay === 'Այո';
      if (property.hasNightStay !== needsNightStay) return false;
    }

    // Լողավազանի ֆիլտր
    if (poolType !== 'Բոլորը' && property.poolType !== poolType) return false;

    return true;
  });

  // Եթե օգտատերը սեղմել է որևէ քարտի վրա, ցույց ենք տալիս Մանրամասների առանձին էջը
  if (selectedProperty) {
    return (
      <PropertyDetailsPage 
        property={selectedProperty} 
        onBack={() => setSelectedProperty(null)} 
      />
    );
  }

  return (
    <div className="content-wrapper" style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <Sidebar 
        selectedRegions={selectedRegions}
        setSelectedRegions={setSelectedRegions}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        nightStay={nightStay}
        setNightStay={setNightStay}
        poolType={poolType}
        setPoolType={setPoolType}
        currency={currency}
        setCurrency={setCurrency}
      />
      {/* Փոխանցում ենք ընտրության ֆունկցիան MainContent-ին */}
      <MainContent 
        properties={filteredProperties} 
        onPropertySelect={setSelectedProperty} 
      />
    </div>
  );
};

export default Home;