import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/instances/axiosInstance";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axiosInstance.get("/products/list");
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (
        typeof response.data === "object" &&
        Array.isArray(response.data.products)
      ) {
        return response.data.products;
      } else {
        throw new Error("Oops, an error occurred, try again");
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });
};
