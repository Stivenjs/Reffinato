import { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toast } from "@/components/ui/toast";
import Header from "@/components/shared/Header";
import VideoSection from "@/components/shared/VideoSection";
import NewArrivals from "@/components/shared/NewArrivals";
import Newsletter from "@/components/shared/Newsletter";
import Collections from "@/components/shared/Collections";
import Footer from "@/components/shared/Footer";
import CartDrawer from "@/components/shared/CartDrawer";

export default function Home() {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setToastMessage("Producto añadido al carrito");
    setShowToast(true);
  };

  const updateQuantity = (id, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const toggleWishlist = (productId) => {
    setWishlistItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
    setToastMessage(
      wishlistItems.includes(productId)
        ? "Producto eliminado de favoritos"
        : "Producto añadido a favoritos"
    );
    setShowToast(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-blue-50">
        <Header
          isScrolled={isScrolled}
          cartItems={cartItems}
          wishlistItems={wishlistItems}
          openCart={() => setIsCartOpen(true)}
        />
        <main className="pt-20">
          <VideoSection />
          <NewArrivals
            addToCart={addToCart}
            toggleWishlist={toggleWishlist}
            wishlistItems={wishlistItems}
          />
          <Newsletter />
          <Collections />
        </main>
        <Footer />
        {showToast && (
          <Toast
            variant="default"
            onClose={() => setShowToast(false)}
            className="fixed bottom-4 right-4 z-50"
          >
            {toastMessage}
          </Toast>
        )}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
        />
      </div>
    </TooltipProvider>
  );
}
