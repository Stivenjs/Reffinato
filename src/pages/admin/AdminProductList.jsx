import axiosInstance from "../../instances/axiosInstance";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import SideBar from "../../components/shared/SideBar";
import useProductList from "../../hooks/useProductList";



const AdminProductList = () => {

  const {productList, fetchProducts} = useProductList();
  console.log()

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
  return (
    <div className="flex flex-col md:flex-row">
      <SideBar />
      <div className="flex flex-col gap-2 w-full md:w-[80%] mt-24 mb-9 relative md:left-3 px-4">
        <b className="mb-2 text-lg">Products list</b>

        <div className="hidden md:grid grid-cols-[1fr_0.9fr_0.89fr_0.88fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Color</b>
          <b>Price</b>
          <b>Size</b>
          <b>Category</b>
          <b className="text-center">Action</b>
        </div>

        {productList.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
          >
            <img
              src={item.photos[0]}
              alt="Product image"
              className="w-16 h-16 md:w-12 md:h-20 object-cover"
            />
            <p>{item.name}</p>
            <p className="hidden sm:block">{item.color}</p>
            <p>{item.price}</p>
            <p className="hidden sm:block">{item.sizes.join(", ")}</p>
            <p className="hidden sm:block">{item.category}</p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => deleteProduct(item.id)}
                className="bg-red-600 w-24 text-xs sm:text-sm"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductList;
