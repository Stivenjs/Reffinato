import { create } from "zustand";
import useAuthStore from "@/store/authStore";
import axiosInstance from "@/instances/axiosInstance";

const useCartStore = create((set, get) => ({
  cartItems: [],

  addToCart: async (product, size, quantity) => {
    try {
      const { user } = useAuthStore.getState();
      const { id, name, price, photos } = product;
      console.log(id, name, price, photos);
      const response = await axiosInstance.post("/cart/add", {
        userId: user.uid,
        productId: id,
        quantity,
        size,
        price,
        productName: name,
        photos,
      });

      if (response.status === 200 || response.status === 201) {
        const { loadCart } = get();
        await loadCart(user.uid);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  },

  removeFromCart: async (id, size) => {
    try {
      const { user } = useAuthStore.getState();

      const response = await axiosInstance.delete("/cart/remove", {
        data: {
          userId: user.uid,
          productId: id,
          size,
        },
      });

      if (response.status === 200) {
        // Reload the cart to get the updated state from the server
        const { loadCart } = get();
        await loadCart(user.uid);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  },

  updateQuantity: async (id, size, newQuantity) => {
    try {
      const { user } = useAuthStore.getState();

      // Guardar el estado anterior
      const previousItems = useCartStore.getState().cartItems;

      // Actualizar el estado localmente primero
      set((state) => {
        const updatedItems = state.cartItems.map((item) => {
          if (item.product_id === id && item.size === size) {
            return { ...item, quantity: Math.max(newQuantity, 0) }; // Evita cantidades negativas
          }
          return item;
        });
        return { cartItems: updatedItems };
      });

      // Ahora realiza la llamada al backend
      const response = await axiosInstance.put("/cart/update", {
        userId: user.uid,
        productId: id,
        quantity: newQuantity,
        size,
      });

      if (response.status !== 200) {
        // Revertir la actualización local si el servidor falla
        set({ cartItems: previousItems });
        console.error(
          "Failed to update quantity in the server:",
          response.status
        );
      }
    } catch (error) {
      // Revertir la actualización local en caso de error
      set({ cartItems: previousItems });
      console.error("Error updating quantity:", error);
    }
  },

  clearCart: async () => {
    try {
      const { user } = useAuthStore.getState();
      const response = await axiosInstance.delete("/cart/clear", {
        data: { userId: user.uid },
      });

      if (response.status === 200) {
        set({ cartItems: [] });
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  },

  loadCart: async (userId) => {
    try {
      const response = await axiosInstance.get(`/cart/${userId}`);
      if (response.status === 200) {
        set({ cartItems: response.data });
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  },
}));

export default useCartStore;
