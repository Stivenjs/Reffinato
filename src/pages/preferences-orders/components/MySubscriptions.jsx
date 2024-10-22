import { useSubscription } from "@/hooks/fetchSucriptions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useAuthStore from "@/store/authStore";
import { CalendarDays, Percent, User } from "lucide-react";

export default function MySubscriptions() {
  const { user } = useAuthStore();
  const { data: subscription, isLoading, error } = useSubscription(user?.uid);

  const payerName = subscription?.payment_details?.payer?.name;
  const fullName = `${payerName?.given_name || ""} ${
    payerName?.surname || ""
  }`.trim();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">My Subscription</CardTitle>
        {!isLoading && (
          <Badge variant={subscription ? "default" : "secondary"}>
            {subscription ? "Active" : "Inactive"}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">
            You don't have any active subscription.
          </p>
        ) : subscription ? (
          <div className="grid gap-4">
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <CalendarDays className="h-6 w-6 text-primary" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Subscription Period
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(subscription.created_at).toLocaleDateString()} -{" "}
                  {new Date(subscription.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <Percent className="h-6 w-6 text-primary" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Discount</p>
                <p className="text-sm text-muted-foreground">
                  {subscription.discount_percentage}%
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <User className="h-6 w-6 text-primary" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Subscriber</p>
                <p className="text-sm text-muted-foreground">{fullName}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            You do not have any active subscriptions.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
