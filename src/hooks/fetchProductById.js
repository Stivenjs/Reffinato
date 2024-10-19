import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/instances/axiosInstance";

const fetchProductById = async (id) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

export const useProductById = (id) => {
  return useQuery({
    queryKey: ["product", id], // Cambiado a queryKey
    queryFn: () => fetchProductById(id), // Cambiado a queryFn
    enabled: !!id, // Solo ejecutar la consulta si el ID es válido
  });
};
