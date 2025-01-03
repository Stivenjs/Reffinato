import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/instances/axiosInstance";

const useAddProduct = () => {
  const [loading, setLoading] = useState(false);

  const addProduct = async (product) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("colors", JSON.stringify(product.colors));
      formData.append("price", product.price);
      formData.append("sizes", JSON.stringify(product.sizes));
      formData.append("description", product.description);
      formData.append("details", product.details);
      formData.append("category", product.category);

      product.photos.forEach((photo) => {
        formData.append("photos", photo);
      });

      const response = await axiosInstance.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Producto agregado",
        description: "El producto ha sido agregado exitosamente.",
      });

      return response.data;
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      toast({
        title: "Error",
        description: "Hubo un error al agregar el producto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { addProduct, loading };
};

export default useAddProduct;
