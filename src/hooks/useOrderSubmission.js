import { useState } from "react";
import axiosInstance from "@/instances/axiosInstance";

export function useOrderSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submitOrder = async (
    userId,
    cart,
    totalAmount,
    shippingAddress,
    paypalTransactionId
  ) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Ensure each cart item includes its color
      const cartWithColors = cart.map((item) => ({
        ...item,
        color: item.color || "default", // Use 'default' if color is not set
      }));

      const response = await axiosInstance.post("/orders", {
        userId,
        cart: cartWithColors,
        totalAmount,
        shippingAddress,
        paypalTransactionId,
      });

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
