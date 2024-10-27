import SideBar from "../../components/shared/SideBar";
import useOrdersList from "../../hooks/useOrdersList";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import AdminOrderDetails from "../admin/AdminOrderDetails"
import axiosInstance from "../../instances/axiosInstance";

const AdminOrdenedProducts = () => {
  const { ordersList, fetchOrders } = useOrdersList();
  const deleteOrder = async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/orders/delete/${id}`);

      if (data.success) {
        toast({
          title: "Deleted order",
          description: "The product has been successfully order.",
        });
        await fetchOrders();
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

        <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Name</b>
          <b>Status</b>
          <b>Amount</b>
          <b className="text-center">Action</b>
        </div>

        {ordersList.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
          >
            <p>{item.shipping_address.fullName}</p>
            <p className="hidden sm:block">{item.payment_status}</p>
            <p>{item.total_amount}</p>
            <div className="flex gap-2 justify-center">
              <AdminOrderDetails orderId={item.id}/>
              <Button
                onClick={() => deleteOrder(item.id)}
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

export default AdminOrdenedProducts;
