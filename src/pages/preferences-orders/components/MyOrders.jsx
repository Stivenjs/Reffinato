import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MyOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Your order history and details will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
