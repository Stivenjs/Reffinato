import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MyWishlist() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Wishlist</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Your wishlist items will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
