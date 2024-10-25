import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Menu, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import WordRotate from "@/components/ui/word-rotate";
import UserMenu from "../shared/UserMenu";
import Cart from "@/components/shared/Cart";
import SearchBar from "./SearchBar";
import logo from "../../../public/ReffinatoLogoBrowser.webp";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { id: 2, to: "/products", label: "BIKINI", category: "Bikini" },
    { id: 3, to: "/products", label: "SWIMWUITS", category: "Swimsuits" },
    { id: 4, to: "/products", label: "BEACHWEAR", category: "Beachwear" },
    { id: 5, to: "/products", label: "SHOP", category: "all" },
    { id: 6, to: "/reffinato-gold", label: "REFFINATO GOLD" },
  ];

  const handleMenuItemClick = (item) => {
    if (item.category) {
      navigate(item.to, { state: { category: item.category } });
    } else {
      navigate(item.to);
    }
    setIsMobileMenuOpen(false);
  };

  const handleFavorite = () => {
    navigate("/profile?section=wishlist");
  };

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
              <div className="bg-[#a0501a] text-white py-1 px-4 text-xs md:text-sm flex flex-col md:flex-row justify-between items-center overflow-hidden">
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
            <Link to="/" className="flex items-center text-2xl font-bold">
              <div className="w-14 h-14 relative">
                <img
                  src={logo}
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
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item)}
                  className="relative group"
                >
                  <span className="relative z-10 font-bold">{item.label}</span>
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#a0501a] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"></span>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden md:block">
                <SearchBar />
              </div>
              <div className="md:hidden">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
              <UserMenu />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2" onClick={handleFavorite}>
                    <Heart className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Favorite</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Cart
                    isOpen={isCartOpen}
                    onClose={() => setIsCartOpen(false)}
                    onOpen={() => setIsCartOpen(true)}
                  />
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
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2"
                >
                  <Menu className="h-6 w-6" />
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

      {/* Shopping Cart */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </TooltipProvider>
  );
}
