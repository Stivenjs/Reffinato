import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../instances/axiosInstance";

// Función para obtener la suscripción del usuario
const fetchSubscription = async (userId) => {
  const response = await axiosInstance.get(`/subscription/${userId}`);

  return response.data.subscription;
};

// Hook personalizado para obtener la suscripción
export const useSubscription = (userId) => {
  return useQuery({
    queryKey: ["subscription", userId],
    queryFn: () => fetchSubscription(userId),
    enabled: !!userId, // Solo se ejecuta si userId está disponible
  });
};
