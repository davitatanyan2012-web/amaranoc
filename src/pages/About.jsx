import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page-container">
      {/* 1. Գլխավոր Մեծ Banner (Hero Section) */}
      <div className="about-hero-section">
        <img 
          src="https://amaranoc.am/_next/image?url=%2Fimages%2Fabout-us%2Famaranoc.jpg&w=1200&q=75" 
          alt="Amaranoc Behind The Scenes" 
          className="about-hero-img"
        />
      </div>

      <div className="about-content-wrapper">
        
        {/* 2. Սեկցիա 1: Մեր Մասին (Նկար Ձախից, Տեքստ Աջից) */}
        <section className="about-row-section">
          <div className="about-image-block">
            <img src="https://amaranoc.am/_next/image?url=%2Fimages%2Fabout-us%2Fsecond.jpg&w=1200&q=75" alt="Մեր մասին" />
          </div>
          <div className="about-text-block">
            <h2 className="about-section-title">ՄԵՐ ՄԱՍԻՆ</h2>
            <p>
              Amaranoc.am-ը փնտրտուքի, հարմարավետության և գեղեցկության միաձուլման արդյունքն է։ 
              Հանդիսանալով ամառանոցների վարձակալության ոլորտում առաջատար հարթակներից մեկը, 
              մենք մեզ առաջադրել ենք զարգացնել տուրիզմի, քոթեջների, վիլլաների և առանձնատների մշակույթը Հայաստանում։ 
              Մեր հիմնական նպատակն է հարմարավետության ամենաբարձր չափանիշներով ապահովել յուրաքանչյուր հանգստացողի հեքիաթային օրերը։
            </p>
          </div>
        </section>

        {/* 3. Սեկցիա 2: Մեր Թիմը (Տեքստ Ձախից, Նկար Աջից) */}
        <section className="about-row-section reverse">
          <div className="about-image-block">
            <img src="https://amaranoc.am/_next/image?url=%2Fimages%2Fabout-us%2Fmarketing.jpg&w=1200&q=75" alt="Մեր Թիմը" />
          </div>
          <div className="about-text-block">
            <h2 className="about-section-title">ՄԵՐ ԹԻՄԸ</h2>
            <p>
              Շուրջ 20 մասնագետներից բաղկացած մեր պրոֆեսիոնալ թիմը իր աշխատանքը իրականացնում է փայլուն հեռանկարով։ 
              Շնորհիվ ոլորտում ունեցած մեծ փորձառության՝ մեր նպատակն է սահմանել անթերի որակ մեր հաճախորդների համար։ 
              Մենք սիրով պատրաստ ենք աջակցել ձեզ ցանկացած հարցում, որպեսզի ձեր կողմից ընտրված յուրաքանչյուր ամառանոց 
              դառնա անմոռանալի հիշողությունների վայր։
            </p>
          </div>
        </section>

        {/* 4. Մեջտեղի Մեծ Լայն Նկարը */}
        <div className="about-middle-banner">
          <img 
            src="https://amaranoc.am/_next/image?url=%2Fimages%2Fabout-us%2Fthird.jpg&w=1200&q=75" 
            alt="Amaranoc Production" 
          />
        </div>

        {/* 5. Սեկցիա 3: Ինչու ընտրել Amaranoc.am-ը (Նկար Ձախից, Տեքստ Աջից) */}
        <section className="about-row-section">
          <div className="about-image-block">
            <img src="https://amaranoc.am/_next/image?url=%2Fimages%2Fabout-us%2Fhistory.jpg&w=1200&q=75" alt="Ինչու ընտրել մեզ" />
          </div>
          <div className="about-text-block">
            <h2 className="about-section-title">ԻՆՉՈՒ ԸՆՏՐԵԼ AMARANOC.AM-Ը</h2>
            <p>
              Մենք առաջարկում ենք միայն ստուգված և որակյալ տարբերակներ հանրապետության ողջ տարածքից։ 
              Հեշտ ու արագ ամրագրման համակարգը, ճշգրիտ տեղեկատվությունը և անհատական մոտեցումը 
              յուրաքանչյուր հաճախորդին՝ մեր աշխատանքի հիմնաքարերն են։ Ձեր հանգիստը վստահեք պրոֆեսիոնալներին։
            </p>
          </div>
        </section>

        {/* 6. ԿԱՐԾԻՔՆԵՐԻ (REVIEWS) ՀԱՏՎԱԾ */}
        <section className="about-reviews-section">
          <h2 className="reviews-main-title">ԿԱՐԾԻՔՆԵՐ</h2>
          
          <div className="reviews-grid">
            {/* Կարծիք 1 */}
            <div className="review-card">
              <div className="review-user-info">
                <div className="user-avatar-placeholder">🧑‍💼</div>
                <div>
                  <h4>Gurgen</h4>
                  <div className="stars">★★★★★</div>
                </div>
              </div>
              <p className="review-text">Thanks for providing great service us 👍</p>
            </div>

            {/* Կարծիք 2 */}
            <div className="review-card">
              <div className="review-user-info">
                <div className="user-avatar-placeholder">👩‍💼</div>
                <div>
                  <h4>Armine</h4>
                  <div className="stars">★★★★★</div>
                </div>
              </div>
              <p className="review-text">Очень довольна. Они очень помогли нам в выборе дома, и все было просто замечательно.</p>
            </div>

            {/* Կարծիք 3 */}
            <div className="review-card">
              <div className="review-user-info">
                <div className="user-avatar-placeholder">👩‍💼</div>
                <div>
                  <h4>Aghajanyan Zara</h4>
                  <div className="stars">★★★★★</div>
                </div>
              </div>
              <p className="review-text">Անթերի կազմակերպված աշխատանք, շնորհակալ եմ շատ։</p>
            </div>

            {/* Կարծիք 4 */}
            <div className="review-card">
              <div className="review-user-info">
                <div className="user-avatar-placeholder">👩‍💼</div>
                <div>
                  <h4>Ani Arzumanyan</h4>
                  <div className="stars">★★★★★</div>
                </div>
              </div>
              <p className="review-text">Сдавали наш дом и имели отличный результат, очень довольны!!</p>
            </div>
          </div>

          {/* Կարծիքների Կոճակները */}
          <div className="reviews-buttons-row">
            <button className="btn-leave-review">Թողնել կարծիք</button>
            <button className="btn-see-all">Տեսնել բոլորը</button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;