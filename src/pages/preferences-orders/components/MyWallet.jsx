import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MyWallet() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Your wallet information and transactions will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
