import { create } from 'zustand';

export const useCurrencyStore = create((set) => ({
  currency: '֏', // Լռելյայն արժույթը
  
  // Մոտավոր փոխարժեքներ դրամի նկատմամբ (կարող ես փոխել ըստ ցանկության)
  rates: {
    '֏': 1,
    '$': 400,  // 1 USD = 400 AMD
    '€': 430,  // 1 EUR = 430 AMD
    '₽': 4.5,  // 1 RUB = 4.5 AMD
  },

  // Արժույթը փոխելու ֆունկցիա
  setCurrency: (newCurrency) => set({ currency: newCurrency }),

  // Գինը դինամիկ փոխարկող և ձևավորող օժանդակ ֆունկցիա
  convertAndFormat: (priceStr, currentCurrency, rates) => {
    // Հեռացնում ենք ստորակետները թվի վերածելու համար
    const amdPrice = parseInt(priceStr.replace(/,/g, ''), 10);
    if (isNaN(amdPrice)) return '0';

    // Փոխարկում ենք ընտրված արժույթին
    const converted = amdPrice / rates[currentCurrency];

    // Կլորացման տրամաբանություն. դրամի դեպքում ամբողջական, այլ արժույթների դեպքում՝ 1 տասնորդական նիշով
    const rounded = currentCurrency === '֏' 
      ? Math.round(converted) 
      : parseFloat(converted.toFixed(1));

    // Վերադարձնում ենք ստորակետներով ձևավորված տեքստը
    return rounded.toLocaleString();
  }
}));