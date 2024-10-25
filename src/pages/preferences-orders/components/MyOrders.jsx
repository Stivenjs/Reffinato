import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrderFetch } from "@/hooks/useOrderFetch";
import useAuthStore from "@/store/authStore";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function MyOrders() {
  const { user } = useAuthStore();
  const { orders, loading, error } = useOrderFetch(user?.uid);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  useEffect(() => {
    if (!loading) {
      setHasAttemptedLoad(true);
    }
  }, [loading]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      completed: "bg-green-500",
      processing: "bg-yellow-500",
      cancelled: "bg-red-500",
    };

    return (
      <Badge className={`${statusColors[status] || "bg-gray-500"}`}>
        {status}
      </Badge>
    );
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const renderShippingAddress = (address) => {
    if (!address) return "No shipping information available";
    return (
      <div>
        <p>{address.fullName}</p>
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>{`${address.adminArea2}, ${address.adminArea1} ${address.postalCode}`}</p>
        <p>{address.countryCode}</p>
      </div>
    );
  };

  const renderContent = () => {
    if (loading && !hasAttemptedLoad) {
      return <p>Loading your orders...</p>;
    }

    if (!orders || orders.length === 0) {
      return (
        <p className="text-gray-500">
          It looks like you haven't placed any orders yet. Start shopping now!
        </p>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead className="w-[120px]">Total Amount</TableHead>
              <TableHead className="w-[100px]">State</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <>
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>${order.total_amount}</TableCell>
                  <TableCell>{getStatusBadge(order.payment_status)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      onClick={() => toggleOrderExpansion(order.id)}
                      aria-expanded={expandedOrder === order.id}
                      aria-controls={`order-details-${order.id}`}
                    >
                      {expandedOrder === order.id ? (
                        <ChevronUp className="h-4 w-4 mr-2" />
                      ) : (
                        <ChevronDown className="h-4 w-4 mr-2" />
                      )}
                      {expandedOrder === order.id ? "Hide" : "Show"} Details
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedOrder === order.id && (
                  <TableRow id={`order-details-${order.id}`}>
                    <TableCell colSpan={5}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">
                            Shipping Address
                          </h4>
                          {renderShippingAddress(order.shipping_address)}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Products</h4>
                          <div className="space-y-4">
                            {order.cart.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center space-x-4"
                              >
                                <img
                                  src={item.photos[0] || "/placeholder.svg"}
                                  alt={item.product_name}
                                  width={60}
                                  height={60}
                                  className="rounded-md object-cover"
                                />
                                <div>
                                  <p className="font-medium">
                                    {item.product_name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Size: {item.size}, Quantity: {item.quantity}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Price: ${item.price}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>My Orders</CardTitle>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
