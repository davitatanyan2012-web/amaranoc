import { create } from 'zustand';

export const useFavoritesStore = create((set) => ({
  favorites: [],
  
  // Ֆունկցիա, որը եթե ապրանքը չկա՝ ավելացնում է, եթե կա՝ հեռացնում է
  toggleFavorite: (product) => set((state) => {
    const isExist = state.favorites.some((item) => item.id === product.id);
    if (isExist) {
      return { favorites: state.favorites.filter((item) => item.id !== product.id) };
    } else {
      return { favorites: [...state.favorites, product] };
    }
  }),
}));