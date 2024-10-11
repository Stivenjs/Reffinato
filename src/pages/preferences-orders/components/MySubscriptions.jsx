import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MySubscriptions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Your active subscriptions will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
