import { useState } from "react";
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
import useCartStore from "@/store/cartStore";

export default function ShoppingCarts() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } =
    useCartStore();
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [payerName, setPayerName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  console.log(cartItems);
  const handlePaymentSuccess = (details) => {
    setPaymentComplete(true);
    clearCart();
    setPayerName(details.payer.name.given_name);
    setShowAlert(true);
  };

  const handlePaymentError = (error) => {
    console.error("Error en la transacción:", error);
    toast({
      variant: "destructive",
      title: "Error en el pago",
      description:
        "Ha ocurrido un error al procesar su pago. Por favor, inténtelo de nuevo.",
    });
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    navigate("/");
  };

  if (cartItems.length === 0 && !showAlert) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex flex-col items-center justify-center mt-48">
        <ShoppingCart className="w-16 h-16 mb-4" />
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
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Payment Successful!</AlertTitle>
              <AlertDescription>
                Thank you for your purchase, {payerName}! Your order has been
                processed successfully.
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
                  <button className="text-sm text-gray-600 flex items-center mt-2">
                    More Details <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
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
                    >
                      <ChevronDown className="w-4 h-4" />
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
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product_id, item.size)}
                    className="mt-2"
                  >
                    <Trash2 className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <Input
                  placeholder="Enter a promo code"
                  className="flex-1 mr-2"
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
                }}
              >
                <PayPalButtons
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
              <Lock className="w-4 h-4 mr-1" /> Secure Checkout
            </div>
          </div>
        </>
      )}
    </div>
  );
}
