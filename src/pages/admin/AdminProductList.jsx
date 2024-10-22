import { useEffect, useState } from "react";
import axiosInstance from "../../instances/axiosInstance";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import SideBar from "../../components/shared/SideBar";

const AdminProductList = () => {
  const [productList, setProductList] = useState([]);

  const fetchProducts = async () => {
    try {
      const { data } = await axiosInstance.get("/products/list");

      if (data) {
        setProductList(data);
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
    }
  };

  const deleteProduct = async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/products/delete/${id}`);

      if (data.success) {
        toast({
          title: "Deleted product",
          description: "The product has been successfully deleted.",
        });
        await fetchProducts();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-row">
      <SideBar/>
      <div className="flex flex-col gap-2 w-[80%] mt-24 mb-9 relative left-3">
      <b className="mb-2">Products list</b>
        {/* titulo de la tabla */}
        <div className="hidden md:grid grid-cols-[1fr_0.9fr_0.89fr_0.88fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>image</b>
          <b>Name</b>
          <b>Color</b>
          <b>Price</b>
          <b>Size</b>
          <b>Category</b>
          <b className="text-center">Action</b>
        </div>
        {/* Prouct list */}
        {productList.map((item, x) => (
          <div
            key={x}
            className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
          >
            <img src={item.photos[0]} alt="Product image" className="w-12 h-20" />
            <p>{item.name}</p>
            <p>{item.color}</p>
            <p>{item.price}</p>
            <p>{item.sizes}</p>
            <p>{item.category}</p>
            <div className="flex gap-2">
              <Button
                onClick={() => deleteProduct(item.id)}
                className="bg-red-600 w-24"
              >
                Delete
              </Button>
              <Button className="w-24">Edit</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductList;
