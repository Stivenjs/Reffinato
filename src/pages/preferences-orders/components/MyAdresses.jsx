import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MyAddresses() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Addresses</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Your saved addresses will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
