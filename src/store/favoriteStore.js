import { create } from "zustand";
import { persist } from "zustand/middleware";

const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      addToFavorites: (product) =>
        set((state) => ({
          favorites: [...state.favorites, product],
        })),
      removeFromFavorites: (productId) =>
        set((state) => ({
          favorites: state.favorites.filter((item) => item.id !== productId),
        })),
      isFavorite: (productId) =>
        get().favorites.some((item) => item.id === productId),
    }),
    {
      name: "favorites-storage", // nombre del item en el almacenamiento (debe ser único)
      getStorage: () => localStorage, // (opcional) por defecto, se usa 'localStorage'
    }
  )
);

export default useFavoritesStore;
