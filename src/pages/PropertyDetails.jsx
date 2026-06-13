import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ստուգեք, որ ձեր firebase.js-ի ուղին ճիշտ լինի

const PropertyDetails = () => {
  const { id } = useParams(); // Վերցնում է ID-ն URL-ից
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        // Կապվում ենք Firestore-ի "properties" հավաքածուի տվյալ ID-ով փաստաթղթին
        const docRef = doc(db, "properties", id); 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("Տվյալները չգտնվեցին Firestore-ում");
        }
      } catch (error) {
        console.error("Սխալ տվյալները բեռնելիս՝", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [id]);

  if (loading) return <div className="loader">Բեռնվում է...</div>;
  if (!property) return <div className="error">Հայտարարությունը չգտնվեց:</div>;

  return (
    <div className="property-details-page" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>{property.title}</h1>
      <p style={{ fontSize: '20px', color: '#f48020' }}>Գինը՝ {property.price} ֏</p>
      <p>Հասցե՝ {property.location}</p>

      {/* Նկարների Գալերեա (Մնացած բոլոր նկարները) */}
      <div className="images-gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '20px' }}>
        {property.images && property.images.map((imgUrl, index) => (
          <img 
            key={index} 
            src={imgUrl} 
            alt={`property-${index}`} 
            style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '12px' }} 
          />
        ))}
      </div>

      {/* Լրացուցիչ ինֆորմացիա */}
      <div className="property-specs" style={{ marginTop: '30px' }}>
        <h3>Հարմարություններ և ինֆորմացիա</h3>
        <ul>
          <li>Տարողություն՝ {property.capacity} անձ</li>
          <li>Վարկանիշ՝ {property.rating} ★</li>
          {/* Եթե ունեք այլ դաշտեր, կարող եք ավելացնել այստեղ */}
        </ul>
        <p className="description">{property.description}</p>
      </div>
    </div>
  );
};

export default PropertyDetails;