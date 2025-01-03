import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../instances/axiosInstance";

const fetchAddresses = async (userId) => {
  const response = await axiosInstance.get(`/addresses/${userId}`);
  return response.data.data;
};
export const useAddresses = (userId) => {
  return useQuery({
    queryKey: ["addresses", userId],
    queryFn: () => fetchAddresses(userId),
    enabled: !!userId,
  });
};
