import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSubscribe } from "@/hooks/useSubscribe";
import useAuthStore from "@/store/authStore";

export default function RefinnatoGold() {
  const [isHovered, setIsHovered] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { subscribe, isLoading, error, success } = useSubscribe();

  const handlePaymentSuccess = useCallback(
    async (details) => {
      console.log("Payment successful", details);
      try {
        await subscribe(user.uid, details);
      } catch (err) {
        console.error("Subscription error:", err);
        setAlert({
          type: "error",
          message: "An error occurred during subscription. Please try again.",
        });
      }
    },
    [subscribe, user]
  );

  const handlePaymentError = useCallback((error) => {
    console.error("Payment failed", error);
    setAlert({
      type: "error",
      message: "Payment failed. Please try again or contact support.",
    });
  }, []);

  useEffect(() => {
    if (success) {
      setAlert({
        type: "success",
        message:
          "Payment completed successfully! Redirecting to your account...",
      });
      const timer = setTimeout(() => {
        navigate("/profile?section=subscriptions");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  useEffect(() => {
    if (error) {
      setAlert({
        type: "error",
        message: error,
      });
    }
  }, [error]);

  return (
    <PayPalScriptProvider
      options={{
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
      }}
    >
      <motion.div
        className="max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden mt-16"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="px-20 py-32">
          {alert && (
            <Alert
              variant={alert.type === "success" ? "default" : "destructive"}
              className="mb-4"
            >
              <AlertTitle>
                {alert.type === "success" ? "Success" : "Error"}
              </AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}
          <h2 className="text-3xl font-bold text-center mb-4">
            Reffinato Gold
          </h2>
          <div className="text-center mb-8">
            <p className="text-xl text-gray-600 mb-2">Gold</p>
            <p className="text-5xl font-bold">$25</p>
            <p className="text-sm text-gray-500">Every year</p>
          </div>
          <p className="text-center text-gray-600 mb-8">
            Get up to 25% discount and free shipping on selected products with
            the Gold membership!
          </p>
          {isLoading && (
            <p className="text-center text-gray-600 mb-4">
              Processing your subscription...
            </p>
          )}
          <PayPalButtons
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: "25.00",
                    },
                  },
                ],
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then((details) => {
                handlePaymentSuccess(details);
              });
            }}
            onError={(err) => {
              handlePaymentError(err);
            }}
            style={{ layout: "vertical", shape: "rect" }}
          />
        </div>
      </motion.div>
    </PayPalScriptProvider>
  );
}
