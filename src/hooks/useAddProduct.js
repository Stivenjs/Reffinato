// useAddProduct.js
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/instances/axiosInstance";

const useAddProduct = () => {
  const [loading, setLoading] = useState(false);

  const addProduct = async (product) => {
    setLoading(true);
    try {
      // Crear un FormData para enviar archivos y otros datos
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("color", product.color);
      formData.append("price", product.price);
      formData.append("sizes", JSON.stringify(product.sizes)); // Convertimos los arrays a JSON
      formData.append("description", product.description);
      formData.append("details", product.details);
      formData.append("category", product.category);

      // Adjuntar archivos al FormData
      product.photos.forEach((photo) => {
        formData.append("photos", photo);
      });

      // Enviar los datos del producto y las fotos al backend
      const response = await axiosInstance.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Product added",
        description: "The product has been successfully added.",
      });

      return response.data; // Devuelve los datos de la respuesta si es necesario
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "There was an error adding the product.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { addProduct, loading };
};

export default useAddProduct;
