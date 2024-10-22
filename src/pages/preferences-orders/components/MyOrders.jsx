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
import { useOrderFetch } from "@/hooks/useOrderFetch";
import useAuthStore from "@/store/authStore";

export default function MyOrders() {
  const { user } = useAuthStore();
  const { orders, loading, error } = useOrderFetch(user?.uid);

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

  const renderContent = () => {
    if (orders.length === 0) {
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
              <TableHead>Products</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>${order.total_amount}</TableCell>
                <TableCell>{getStatusBadge(order.payment_status)}</TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-4">
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
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-gray-500">
                            Talla: {item.size}, Cantidad: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            Precio: ${item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
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
