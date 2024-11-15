import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, Menu, Search, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import WordRotate from "@/components/ui/word-rotate";
import UserMenu from "../shared/UserMenu";
import Cart from "@/components/shared/Cart";
import SearchBar from "./SearchBar";
import EnhancedFixedChatWindow from "../../pages/chat/AdminChat";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const cartRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { id: 2, to: "/products", label: "BIKINI", category: "Bikini" },
    { id: 3, to: "/products", label: "SWIMSUITS", category: "Swimsuits" },
    { id: 4, to: "/products", label: "BEACHWEAR", category: "Beachwear" },
    { id: 5, to: "/products", label: "SHOP", category: "all" },
    { id: 6, to: "/reffinato-gold", label: "REFFINATO GOLD" },
  ];

  const handleMenuItemClick = (item) => {
    if (item.category) {
      if (location.pathname === "/products") {
        navigate(item.to, {
          state: { category: item.category },
          replace: true,
        });
      } else {
        navigate(item.to, { state: { category: item.category } });
      }
    } else {
      navigate(item.to);
    }
    setIsMobileMenuOpen(false);
  };

  const handleFavorite = () => {
    navigate("/profile?section=wishlist");
  };

  const handleChatOpen = () => {
    setIsChatOpen(true);
  };

  return (
    <TooltipProvider>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200"
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
              <div className="bg-[#a0501a] text-white py-1 px-4 text-xs md:text-sm flex flex-col md:flex-row justify-between items-center">
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
              <div className="bg-gray-100 py-2 px-4 text-xs md:text-sm flex justify-between items-center">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={handleChatOpen}
                >
                  <span className="mr-4">Do you need help?</span>
                  <MessageCircle className="h-5 w-5" />
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
          initial={false}
          animate={{
            height: isScrolled ? 70 : 86,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between h-full">
            <Link to="/" className="flex items-center text-2xl font-bold">
              <div className="w-14 h-14 relative">
                <img
                  src="/ReffinatoLogoBrowser.webp"
                  alt="Reffinato"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
              <h1 className="ml-2 hidden sm:block font-snellbt text-3xl sm:text-4xl">
                Reffinato
              </h1>
            </Link>

            <div className="hidden md:flex items-center space-x-4 lg:space-x-6 text-xs lg:text-sm">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item)}
                  variant="ghost"
                  className="relative group px-2 py-1"
                >
                  <span className="relative z-10 font-bold">{item.label}</span>
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#a0501a] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"></span>
                </Button>
              ))}
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden md:block">
                <SearchBar />
              </div>
              <div className="md:hidden">
                <Button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  variant="ghost"
                  size="icon"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
              <UserMenu />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleFavorite} variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Favorite</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setIsCartOpen(true)}
                    variant="ghost"
                    size="icon"
                  >
                    <Cart className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cart</p>
                </TooltipContent>
              </Tooltip>
              <span className="hidden md:inline">COLOMBIA</span>
              <Button
                className="md:hidden"
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.nav>
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpen={() => setIsCartOpen(true)}
        ref={cartRef}
      />
      <div
        className={`h-${isScrolled ? "18" : "22"} md:h-${
          isScrolled ? "18" : "22"
        }`}
      />

      {/* Mobile Search */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-16 bg-white z-50 md:hidden p-4 shadow-md"
          >
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

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
                <Button
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="ghost"
                  size="icon"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item)}
                  variant="ghost"
                  className="w-full justify-start py-2 hover:bg-gray-100 relative group"
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"></span>
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <EnhancedFixedChatWindow
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </TooltipProvider>
  );
}
