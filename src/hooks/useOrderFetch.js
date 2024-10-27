import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/instances/axiosInstance";

async function fetchOrders(userId) {
  if (!userId) {
    throw new Error("No se ha proporcionado un ID de usuario.");
  }
  const response = await axiosInstance.get(`/user/${userId}`);
  console.log(response);
  return response.data.orders;
}

export function useOrderFetch(userId) {
  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", userId],
    queryFn: () => fetchOrders(userId),
    enabled: !!userId,
  });

  return {
    orders,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
