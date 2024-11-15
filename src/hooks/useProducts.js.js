import { useQuery } from "@tanstack/react-query";
import AxiosInstance from "@/instances/AxiosInstance";

const fetchProducts = async () => {
  const { data } = await AxiosInstance.get("/products/list");
  return data;
};

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
}
