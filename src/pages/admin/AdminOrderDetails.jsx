import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import axiosInstance from "../../instances/axiosInstance";

const AdminOrderDetails = (props) => {
  const { orderId } = props;
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderStatus, setOrderStatus] = useState("Processing");
  const list = [
    { name: "hola", payment_status: "complete", total_amount: 123 },
  ];

  const handleStatusChange = (newStatus) => {
    setOrderStatus(newStatus);
    console.log(`Order status updated to: ${newStatus}`);
  };

  const showDetails = async (id) => {
    const { data } = await axiosInstance.get(`/orders/${id}`);
    setOrderDetails([data.order]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={() => showDetails(orderId)} variant="outline">
          Details
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order details</DialogTitle>
          <DialogDescription>See the details of this order</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mb-9 px-2">
          <div className="container mx-auto p-2">
            <div className="flex items-center mb-6"></div>
            {orderDetails.map((item, x) => (
              <div key={x} className="grid gap-6 mb-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Name: </strong>
                      {item.shipping_address.fullName}
                    </p>
                    <p>
                      <strong>Area: </strong>
                      {item.shipping_address.adminArea1}
                    </p>
                    <p>
                      <strong>Postal code: </strong>
                      {item.shipping_address.postalCode}
                    </p>
                    <p>
                      <strong>Country code: </strong>
                      {item.shipping_address.countryCode}
                    </p>
                    <p>
                      <strong>Address: </strong>
                      {item.shipping_address.addressLine1}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Total Amount: $</strong>
                      {item.total_amount}
                    </p>
                    <p>
                      <strong>Current Status: </strong>
                      {orderStatus}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full">
                      <Label htmlFor="status">Update Status</Label>
                      <Select
                        onValueChange={handleStatusChange}
                        defaultValue={orderStatus}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
            <b className="mb-2 text-lg">Purchased products</b>
            <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
              <b>Image</b>
              <b>Name</b>
              <b>Size</b>
              <b>Color</b>
              <b>Amount</b>
            </div>
            {orderDetails.map((item, index) =>
              item.cart.map((cartItem, x) => (
                <div
                  key={x}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
                >
                  <img
                    src={cartItem.photos[0]}
                    alt="Product image"
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-20 object-cover"
                  />
                  <p className="text-xs sm:text-sm md:text-base">
                    {cartItem.product_name}
                  </p>
                  <p className="hidden sm:block text-xs sm:text-sm md:text-base">
                    {cartItem.size}
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: cartItem.color }}
                      title={cartItem.color}
                    ></div>
                    <strong></strong> {cartItem.color}
                  </div>
                  <p className="text-xs sm:text-sm md:text-base">
                    ${cartItem.price}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminOrderDetails;
