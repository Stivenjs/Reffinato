import React, { useState, useEffect } from "react";
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  Lock,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useOrderSubmission } from "@/hooks/useOrderSubmission";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";

export default function ShoppingCarts() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } =
    useCartStore();
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [payerName, setPayerName] = useState("");
  const [shippingAddress, setShippingAddress] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { submitOrder, isSubmitting, error } = useOrderSubmission();
  const [expandedItems, setExpandedItems] = useState({});

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePaymentSuccess = async (details, data) => {
    const userId = user.uid;
    const paypalShippingAddress = details.purchase_units[0].shipping;

    const formattedAddress = {
      fullName: paypalShippingAddress.name.full_name,
      addressLine1: paypalShippingAddress.address.address_line_1,
      addressLine2: paypalShippingAddress.address.address_line_2 || "",
      adminArea2: paypalShippingAddress.address.admin_area_2,
      adminArea1: paypalShippingAddress.address.admin_area_1,
      postalCode: paypalShippingAddress.address.postal_code,
      countryCode: paypalShippingAddress.address.country_code,
    };

    setShippingAddress(formattedAddress);

    const order = await submitOrder(
      userId,
      cartItems,
      total,
      formattedAddress,
      details.id
    );

    if (order) {
      setPaymentComplete(true);
      clearCart();
      setPayerName(details.payer.name.given_name);
      setShowAlert(true);
    } else {
      toast({
        variant: "destructive",
        title: "Order Creation Failed",
        description:
          error ||
          "There was an error creating your order. Please contact support.",
      });
    }
  };

  const handlePaymentError = (error) => {
    console.error("Error en la transacción:", error);
    toast({
      variant: "destructive",
      title: "Payment error",
      description:
        "An error occurred while processing your payment. Please try again.",
    });
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    navigate("/profile?section=orders");
  };

  const toggleItemDetails = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  if (cartItems.length === 0 && !showAlert) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex flex-col items-center justify-center mt-48">
        <ShoppingCart className="w-16 h-16 mb-4" aria-hidden="true" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-4">
          Add some items to your cart to continue shopping.
        </p>
        <Link to="/products">
          <Button className="bg-[#a0501a] hover:bg-[#8b4513]">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-8 mt-48">
      {showAlert ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <Alert variant="success">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              <AlertTitle>Payment Successful!</AlertTitle>
              <AlertDescription>
                Thank you for your purchase, {payerName}! Your order has been
                processed successfully and will be shipped to:
                <address className="mt-2 not-italic">
                  {shippingAddress.fullName}
                  <br />
                  {shippingAddress.addressLine1}
                  <br />
                  {shippingAddress.addressLine2 &&
                    `${shippingAddress.addressLine2}<br />`}
                  {shippingAddress.adminArea2}, {shippingAddress.adminArea1}{" "}
                  {shippingAddress.postalCode}
                  <br />
                  {shippingAddress.countryCode}
                </address>
              </AlertDescription>
            </Alert>
            <Button
              className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white"
              onClick={handleCloseAlert}
            >
              View Your Orders
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-4">My cart</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4 mb-4">
                <Link to={`/products-details/${item.product_id}`}>
                  <img
                    src={item.photos[0]}
                    alt={item.name}
                    width={150}
                    height={150}
                    className="object-cover"
                  />
                </Link>
                <div className="flex-1">
                  <Link to={`/products-details/${item.product_id}`}>
                    <h3 className="font-semibold">{item.product_name}</h3>
                  </Link>
                  <p className="text-sm text-gray-600">${item.price}</p>
                  <p className="text-sm text-gray-600">Size: {item.size}</p>
                  <div className="flex gap-1">
                    <p className="text-gray-500">Color: </p>
                    <div
                      className="w-6 h-6 rounded-full border border-gray-200"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>

                  <button
                    className="text-sm text-gray-600 flex items-center mt-2"
                    onClick={() => toggleItemDetails(item.id)}
                  >
                    More Details{" "}
                    {expandedItems[item.id] ? (
                      <ChevronUp className="w-4 h-4 ml-1" aria-hidden="true" />
                    ) : (
                      <ChevronDown
                        className="w-4 h-4 ml-1"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                  {expandedItems[item.id] && (
                    <p className="text-sm text-gray-600 mt-2">
                      Pre Order: Your order will take an approximate of two
                      months when preordered!
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => {
                        if (item.quantity > 1) {
                          updateQuantity(
                            item.product_id,
                            item.size,
                            item.quantity - 1
                          );
                        }
                      }}
                      className="p-2"
                      aria-label="Decrease quantity"
                    >
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                      onClick={() => {
                        const newQuantity = item.quantity
                          ? item.quantity + 1
                          : 1;
                        updateQuantity(item.product_id, item.size, newQuantity);
                      }}
                      className="p-2"
                      aria-label="Increase quantity"
                    >
                      <ChevronUp className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product_id, item.size)}
                    className="mt-2"
                    aria-label="Remove item from cart"
                  >
                    <Trash2
                      className="w-5 h-5 text-gray-500"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <Input
                  placeholder="Enter a promo code"
                  className="flex-1 mr-2"
                  aria-label="Promo code"
                />
                <Button variant="outline">Apply</Button>
              </div>
              <Button variant="outline" className="w-full">
                Add a note
              </Button>
            </div>
          </div>
          <div className="w-full md:w-80">
            <h2 className="text-2xl font-semibold mb-4">Order summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Colombia</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {!paymentComplete && (
              <PayPalScriptProvider
                options={{
                  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
                  locale: "en_US",
                }}
              >
                <PayPalButtons
                  style={{
                    label: "pay",
                  }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: total.toFixed(2),
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={(data, actions) => {
                    return actions.order.capture().then(handlePaymentSuccess);
                  }}
                  onError={handlePaymentError}
                />
              </PayPalScriptProvider>
            )}

            <div className="flex items-center justify-center mt-2 text-sm text-gray-600">
              <Lock className="w-4 h-4 mr-1" aria-hidden="true" /> Secure
              Checkout
            </div>
          </div>
        </>
      )}
    </div>
  );
}
