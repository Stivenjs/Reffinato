import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/instances/axiosInstance";

const fetchProductsByCategory = async (category) => {
  const response = await axiosInstance.get(
    `/products/category?category=${category}`
  );
  return response.data;
};

export const useProductsByCategory = (category) => {
  return useQuery({
    queryKey: ["products", category],
    queryFn: () => fetchProductsByCategory(category),
    enabled: !!category, 
  });
};
