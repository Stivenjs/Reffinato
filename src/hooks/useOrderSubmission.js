import { useState } from "react";
import axiosInstance from "@/instances/axiosInstance";

export function useOrderSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submitOrder = async (userId, cart, totalAmount) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/orders", {
        userId,
        cart,
        totalAmount,
      });
      console.log("Order created:", response);

      if (response.status === 201) {
        return response.data.order;
      } else {
        throw new Error("Failed to create order");
      }
    } catch (err) {
      console.error("Error creating order:", err);
      setError("There was an error creating your order. Please try again.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitOrder, isSubmitting, error };
}
