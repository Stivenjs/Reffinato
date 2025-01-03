import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/instances/axiosInstance";

const useOrdersList = () => {
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/all-orders");

      if (data) {
        setOrdersList(data);
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { ordersList, loading, fetchOrders };
};

export default useOrdersList;
