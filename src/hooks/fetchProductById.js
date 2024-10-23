import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/instances/axiosInstance";

const fetchProductById = async (id) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

export const useProductById = (id) => {
  return useQuery({
    queryKey: ["product", id], 
    queryFn: () => fetchProductById(id), 
    enabled: !!id, 
  });
};
