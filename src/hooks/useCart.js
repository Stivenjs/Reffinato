import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/instanaces/axiosInstance";

const fetchCart = async (userId) => {
  const response = await axiosInstance.get(`/cart/${userId}`);
  console.log(response);
  return response.data;
};

// Hook personalizado para obtener el carrito del usuario
export const useCart = (userId) => {
  return useQuery(["cart", userId], () => fetchCart(userId), {
    enabled: !!userId, // Solo se ejecuta si el userId es válido
    staleTime: 5 * 60 * 1000, // Mantiene los datos "frescos" por 5 minutos
  });
};
