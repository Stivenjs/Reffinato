import { create } from "zustand";
import { persist } from "zustand/middleware";
import useAuthStore from "@/store/authStore";

const useFavoriteStore = create(
  persist(
    (set, get) => ({
      userFavorites: {},
      addToFavorites: (product) => {
        const { user } = useAuthStore.getState();
        if (!user) return; // Verificar si el usuario está autenticado
        set((state) => {
          const updatedFavorites = {
            ...state.userFavorites,
            [user.uid]: [...(state.userFavorites[user.uid] || []), product],
          };
          // Emitir una actualización
          get().notifySubscribers();
          return { userFavorites: updatedFavorites };
        });
      },
      removeFromFavorites: (productId) => {
        const { user } = useAuthStore.getState();
        if (!user) return; // Verificar si el usuario está autenticado
        set((state) => {
          const updatedFavorites = {
            ...state.userFavorites,
            [user.uid]: (state.userFavorites[user.uid] || []).filter(
              (item) => item.id !== productId
            ),
          };
          // Emitir una actualización
          get().notifySubscribers();
          return { userFavorites: updatedFavorites };
        });
      },
      isFavorite: (productId) => {
        const { user } = useAuthStore.getState();
        if (!user) return false; // Si no hay usuario, no puede ser favorito
        const userFavorites = get().userFavorites[user.uid] || [];
        return userFavorites.some((item) => item.id === productId);
      },
      getUserFavorites: () => {
        const { user } = useAuthStore.getState();
        if (!user) return []; // Si no hay usuario, retorna un array vacío
        return get().userFavorites[user.uid] || [];
      },
      // Nuevo método para notificar a los suscriptores
      notifySubscribers: () => {},
      // Nuevo método para suscribirse a cambios
      subscribe: (callback) => {
        get().notifySubscribers = callback;
        return () => {
          get().notifySubscribers = () => {};
        };
      },
    }),
    {
      name: "user-favorites-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useFavoriteStore;
