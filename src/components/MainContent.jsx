import React from 'react';
import PropertyCard from './PropertyCard';

import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { log } from 'firebase/firestore/pipelines';

// async function getPlaceAndRating() {
//   const docRef = doc(db, "data", "UR8GaFbe1SoqTkGv58G6");
//   const docSnap = await getDoc(docRef);

//   if (docSnap.exists()) {
//     const data = docSnap.data();

//     return {
//       place: data.place,
//       rating: data.rating
//     };
//   }

//   return null;
// }
// let result=await getPlaceAndRating();
const MainContent = () => {
  // Ուղիղ API հղումներ, որոնք հաստատ կբացվեն localhost-ում
  const mockProperties = [
    { 
      id: 1, 
      img: "https://api.amaranoc.am/compressed_images/compressed_1775558484173--0.3606161648706505image.webp", 
      location: "Գառնի",
      capacity: 6, 
      rating:5, 
      price: "45,000" 
    },
    { 
      id: 2, 
      img: "https://api.amaranoc.am/compressed_images/compressed_1768380706620--0.5416288751044531image.webp", 
      location: "Օհանավան", 
      capacity: 40, 
      rating: null, 
      price: "80,000" 
    },
    { 
      id: 3, 
      img: "https://api.amaranoc.am/compressed_images/compressed_1705829500856--0.9156560389221753image.webp", 
      location: "Ծաղկաձոր", 
      capacity: 20, 
      rating: null, 
      price: "130,000" 
    },
    { 
      id: 4, 
      img: "https://api.amaranoc.am/compressed_images/compressed_1762850175532--0.184902584358007image.webp", 
      location: "Ծաղկաձոր", 
      capacity: 8, 
      rating: 5, 
      price: "40,000" 
    },
    { 
      id: 5, 
      img: "https://api.amaranoc.am/compressed_images/compressed_1760005109569--0.9947990042313706image.webp", 
      location: "Բյուրական", 
      capacity: 4, 
      rating: null, 
      price: "29,000" 
    },
    { 
      id: 6, 
      img: "https://api.amaranoc.am/compressed_images/compressed_1772031992147--0.08273550679993247image.webp", 
      location: "Նոր Հաճն", 
      capacity: 25, 
      rating: 5, 
      price: "140,000" 
    },
  ];

  return (
    <main className="main-content">
      <h2>Լավագույն առաջարկներ</h2>
      <div className="property-grid">
        {mockProperties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </main>
  );
};

export default MainContent;