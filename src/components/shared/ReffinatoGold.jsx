import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSubscribe } from "@/hooks/useSubscribe";
import useAuthStore from "@/store/authStore";
import { CheckCircle } from "lucide-react";

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
        locale: "en_US",
      }}
    >
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-48 px-4 sm:px-6 lg:px-8 ">
        <motion.div
          className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 bg-gray-50 p-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Reffinato Gold
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Elevate your shopping experience
              </p>
              <ul className="space-y-4">
                {[
                  "25% discount on selected products",
                  "Free shipping",
                  "Exclusive access to premium items",
                  "Priority customer support",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 p-12">
              {alert && (
                <Alert
                  variant={alert.type === "success" ? "default" : "destructive"}
                  className="mb-6"
                >
                  <AlertTitle>
                    {alert.type === "success" ? "Success" : "Error"}
                  </AlertTitle>
                  <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
              )}
              <div className="text-center mb-8">
                <p className="text-5xl font-bold text-gray-800">$25</p>
                <p className="text-xl text-gray-600">per year</p>
              </div>
              <p className="text-center text-gray-600 mb-8">
                Get up to 25% discount and free shipping on selected products
                with the Gold membership!
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
                style={{ layout: "vertical", shape: "rect", label: "pay" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </PayPalScriptProvider>
  );
}
