import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/instances/axiosInstance";
import useAuthStore from "@/store/authStore";

// Hook para enviar datos al backend
const useSendData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener el usuario desde el store
  const { user } = useAuthStore();

  // Función para enviar nuevos datos (crear dirección)
  const sendData = async (data) => {
    setLoading(true);
    setError(null);

    // Verifica si hay un usuario autenticado
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      // Incluye el uid en los datos que se envían
      const response = await axiosInstance.post("/addresses", {
        ...data,
        userId: user.uid, // Agrega el uid aquí
      });

      // Muestra un toast con la respuesta del servidor
      toast({
        title: "Data Sent",
        description: response.data.message || "Address added successfully.",
      });
      return response.data; // Retorna los datos de respuesta del backend
    } catch (err) {
      setError(err);
      console.error("Error sending data:", err);
      // Muestra un toast en caso de error
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to send data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para editar una dirección existente
  const editData = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(`/addresses/${id}`, data);
      // Muestra un toast con la respuesta del servidor
      toast({
        title: "Data Updated",
        description: response.data.message || "Address updated successfully.",
      });
      return response.data; // Retorna los datos de respuesta del backend
    } catch (err) {
      setError(err);
      console.error("Error updating data:", err);
      // Muestra un toast en caso de error
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { sendData, editData, loading, error };
};

export default useSendData;
