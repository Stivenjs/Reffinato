import React, { useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useCartStore from "@/store/cartStore";
import useAuthStore from "@/store/authStore";

const CartItem = ({
  item,
  updateQuantity,
  removeFromCart,
  handleImageClick,
}) => {
  return (
    <div className="flex items-center justify-between py-4 border-b">
      <div className="flex items-center">
        <img
          src={item.photos[0]}
          alt={item.name}
          className="w-20 h-20 object-cover mr-4 cursor-pointer"
          onClick={(e) => handleImageClick(e, item.product_id)}
        />
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p>${item.price}</p>
          <p>Size: {item.size}</p>
          <div className="flex gap-1">
            <p>Color: </p>
            <div
              className="w-6 h-6 rounded-full border border-gray-200"
              style={{ backgroundColor: item.color }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => {
            if (item.quantity > 1) {
              updateQuantity(item.product_id, item.size, item.quantity - 1);
            }
          }}
          className="p-1"
        >
          <Minus className="h-4 w-4" />
        </button>

        <span className="mx-2">{item.quantity}</span>
        <button
          onClick={() => {
            const newQuantity = item.quantity ? item.quantity + 1 : 1;
            updateQuantity(item.product_id, item.size, newQuantity);
          }}
          className="p-1"
        >
          <Plus className="h-4 w-4" />
        </button>

        <button
          onClick={() => removeFromCart(item.product_id, item.size)}
          className="ml-2 p-1"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const Cart = React.forwardRef(({ isOpen, onClose, onOpen }, ref) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, loadCart } =
    useCartStore();
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const prevLocationRef = useRef(location);

  useEffect(() => {
    if (isOpen && location !== prevLocationRef.current) {
      onClose();
    }
    prevLocationRef.current = location;
  }, [location, isOpen, onClose]);

  useEffect(() => {
    if (user) {
      loadCart(user.uid);
    }
  }, [user, loadCart]);

  const memoizedCartItems = useMemo(() => cartItems, [cartItems]);

  const totalPrice = useMemo(() => {
    return memoizedCartItems.reduce(
      (sum, item) => sum + (item.price || 0) * item.quantity,
      0
    );
  }, [memoizedCartItems]);

  const itemCount = useMemo(() => {
    return memoizedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [memoizedCartItems]);

  const handleImageClick = (e, itemId) => {
    e.preventDefault();
    navigate(`/products-details/${itemId}`);
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    onClose();
    setTimeout(() => {
      navigate("/cart");
    }, 300);
  };

  const handleClearCart = () => {
    clearCart();
  };

  return (
    <>
      <button onClick={onOpen} className="relative p-2">
        <ShoppingBag className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#a0501a] text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-lg overflow-y-auto"
            ref={ref}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <button onClick={onClose} className="p-2">
                  <X className="h-6 w-6" />
                </button>
              </div>
              {memoizedCartItems.length > 0 ? (
                <>
                  {memoizedCartItems.map((item) => (
                    <CartItem
                      key={`${item.id}-${item.size}`}
                      item={item}
                      updateQuantity={updateQuantity}
                      removeFromCart={removeFromCart}
                      handleImageClick={handleImageClick}
                    />
                  ))}
                  <div className="mt-4">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-[#a0501a] text-white py-2 px-4 rounded mt-4 hover:bg-[#8b4513] transition-colors"
                    >
                      Checkout
                    </button>
                    <button
                      onClick={handleClearCart}
                      className="w-full bg-red-500 text-white py-2 px-4 rounded mt-2 hover:bg-red-600 transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>
                </>
              ) : (
                <p>Your cart is empty.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default Cart;
