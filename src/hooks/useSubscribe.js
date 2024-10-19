import { useState, useCallback } from "react";
import axiosInstance from "../instances/axiosInstance";

export const useSubscribe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const subscribe = useCallback(async (userId, paymentDetails) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axiosInstance.post("/subscribe", {
        userId,
        paymentDetails,
      });

      if (response.status === 200) {
        setSuccess("Subscription created successfully");
      } else {
        setError("Failed to create subscription");
      }
    } catch (error) {
      console.error("Error subscribing user:", error);
      setError("Error subscribing user. Please contact support.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    subscribe,
    isLoading,
    error,
    success,
  };
};
