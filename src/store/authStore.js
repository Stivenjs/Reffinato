import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (newUserData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...newUserData } : newUserData,
        })),
      clearUser: () => set({ user: null }),
      reloadUser: () => {
        const storage = localStorage;
        const storedState = storage.getItem("auth-store");
        if (storedState) {
          try {
            const parsedState = JSON.parse(storedState);
            set((state) => ({
              ...state,
              user: parsedState.state.user,
            }));
          } catch (error) {
            console.error("Error parsing stored state:", error);
            set({ user: null });
            storage.removeItem("auth-store");
          }
        }
      },
    }),
    {
      name: "auth-store",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
