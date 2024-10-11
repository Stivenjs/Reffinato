import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, ShoppingBag, X, Menu, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import WordRotate from "@/components/ui/word-rotate";
import UserMenu from "../shared/UserMenu";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Summer Breeze Bikini",
      price: 59.99,
      image: "/placeholder.svg?height=80&width=80",
      quantity: 1,
    },
    {
      id: 2,
      name: "Tropical Paradise Shorts",
      price: 39.99,
      image: "/placeholder.svg?height=80&width=80",
      quantity: 2,
    },
    {
      id: 3,
      name: "Sunset Glow Beach Towel",
      price: 24.99,
      image: "/placeholder.svg?height=80&width=80",
      quantity: 1,
    },
  ]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { id: 2, to: "/products/swimwear", label: "Bikini" },
    { id: 3, to: "/products/beach-clothing", label: "Swimsuits" },
    { id: 4, to: "/products/activewear", label: "Beachwear" },
    { id: 5, to: "/products", label: "Shop" },
    { id: 6, to: "/reffinato-gold", label: "Reffinato Gold" },
  ];

  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <TooltipProvider>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 bg-white"
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence initial={false}>
          {!isScrolled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                opacity: { duration: 0.2, ease: "easeInOut" },
                height: { duration: 0.3, ease: "easeInOut" },
              }}
            >
              <div className="bg-teal-800 text-white py-1 px-4 text-xs md:text-sm flex flex-col md:flex-row justify-between items-center overflow-hidden">
                <div className="flex items-center mb-1 md:mb-0"></div>
                <div className="mb-1 md:mb-0">
                  <WordRotate
                    words={[
                      "TAKE ADVANTAGE",
                      "NEWSLETTER 10% DISCOUNT ON THE FIRST ORDER",
                    ]}
                  />
                </div>
                <div>New collection 2024</div>
              </div>
              <div className="bg-gray-100 py-2 px-4 text-xs md:text-sm flex justify-between items-center overflow-hidden">
                <div className="flex items-center">
                  <span className="mr-4">Do you need help?</span>
                </div>
                <div className="flex items-center">
                  <span>POINT OF SALE</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className={`container mx-auto px-4 transition-all duration-300 ${
            isScrolled ? "border-b" : ""
          }`}
          initial={true}
          animate={{
            paddingTop: isScrolled ? 8 : 8,
            paddingBottom: isScrolled ? 8 : 8,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold">
              <img src="#" alt="Reffinato" className="h-6 md:h-8" />
            </Link>
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6 text-xs lg:text-sm">
              {menuItems.map((item) => (
                <Link key={item.id} to={item.to} className="relative group">
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"></span>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => setIsSearchOpen(true)} className="p-2">
                    <Search className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search</p>
                </TooltipContent>
              </Tooltip>
              <UserMenu />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2">
                    <Heart className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Favorites</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => setIsCartOpen(true)} className="p-2">
                    <ShoppingBag className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cart</p>
                </TooltipContent>
              </Tooltip>
              <span className="hidden md:inline">COLOMBIA</span>
              <button
                className="md:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.nav>
      {isScrolled && <div className="h-16 md:h-20" />}

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-0 bg-white z-50 md:hidden h-full overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  className="block py-2 hover:bg-gray-100 relative group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"></span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Slide-out */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween" }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-lg overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2">
                  <X className="h-6 w-6" />
                </button>
              </div>
              {cartItems.length > 0 ? (
                <>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-4 border-b"
                    >
                      <div className="flex items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover mr-4"
                        />
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-gray-600">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <button className="w-full bg-black text-white py-2 px-4 rounded mt-4 hover:bg-gray-800 transition-colors">
                      Checkout
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

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          >
            <div className="bg-white p-4 rounded-lg w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Search</h2>
                <button onClick={() => setIsSearchOpen(false)} className="p-2">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}
