"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ShoppingBag,
  Search,
  User,
  Heart,
  Menu,
  ChevronDown,
  Shirt,
  Umbrella,
  ShoppingCart,
} from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

const categories = {
  BIKINI: [
    { name: "Triángulo" },
    { name: "Bandeau" },
    { name: "Tanga" },
    { name: "Push-up" },
  ],
  SWIMSUITS: [
    { name: "Una pieza" },
    { name: "Tankini" },
    { name: "Monokini" },
    { name: "Trikini" },
  ],
  BEACHWEAR: [
    { name: "Pareos", icon: <Shirt className="w-4 h-4 mr-2" /> },
    { name: "Vestidos de playa", icon: <Shirt className="w-4 h-4 mr-2" /> },
    { name: "Túnicas", icon: <Shirt className="w-4 h-4 mr-2" /> },
    { name: "Shorts", icon: <Shirt className="w-4 h-4 mr-2" /> },
  ],
};

const NavItem = ({ item, isScrolled }) => {
  if (["BIKINI", "SWIMSUITS", "BEACHWEAR"].includes(item)) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`text-white hover:bg-teal-600 hover:text-white transition-all duration-300 ${
              isScrolled ? "text-sm py-1" : "text-base py-2"
            }`}
          >
            {item} <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 bg-white/95 backdrop-blur-md border border-teal-200 rounded-lg shadow-lg p-2"
          align="start"
        >
          <AnimatePresence>
            {categories[item].map((subItem, index) => (
              <motion.div
                key={subItem.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <DropdownMenuItem className="text-teal-800 hover:bg-teal-100 focus:bg-teal-100 rounded-md transition-colors duration-200 flex items-center">
                  {subItem.icon}
                  {subItem.name}
                </DropdownMenuItem>
              </motion.div>
            ))}
          </AnimatePresence>
          <DropdownMenuSeparator className="my-2 bg-teal-200" />
          <DropdownMenuItem className="text-teal-800 hover:bg-teal-100 focus:bg-teal-100 rounded-md transition-colors duration-200 flex items-center">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Ver todo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return (
    <Button
      variant="ghost"
      className={`text-white hover:bg-teal-600 hover:text-white transition-all duration-300 ${
        isScrolled ? "text-sm py-1" : "text-base py-2"
      }`}
    >
      {item}
    </Button>
  );
};

export default function Component({
  cartItems = [],
  wishlistItems = [],
  openCart = () => {},
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const controls = useAnimation();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Búsqueda realizada:", searchQuery);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsAtTop(scrollY < 50);
      setIsScrolled(scrollY >= 50);

      if (scrollY >= 50) {
        controls.start({
          height: "60px",
          backgroundColor: "rgba(20, 184, 166, 0.9)",
          transition: { duration: 0.3 },
        });
      } else {
        controls.start({
          height: "80px",
          backgroundColor: "rgb(20, 184, 166)",
          transition: { duration: 0.3 },
        });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  return (
    <motion.header
      className="fixed w-full z-50"
      initial={false}
      animate={controls}
    >
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between h-full`}>
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="mr-2 lg:hidden text-white hover:bg-teal-600 hover:text-white"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  <Accordion type="single" collapsible className="w-full">
                    {[
                      "BIKINI",
                      "SWIMSUITS",
                      "BEACHWEAR",
                      "SHOP",
                      "REFFINATO GOLD",
                    ].map((item) => (
                      <AccordionItem value={item} key={item}>
                        <AccordionTrigger className="text-teal-600 hover:text-teal-800">
                          {item}
                        </AccordionTrigger>
                        {["BIKINI", "SWIMSUITS", "BEACHWEAR"].includes(
                          item
                        ) && (
                          <AccordionContent>
                            <div className="ml-4 space-y-2">
                              {categories[item].map((subItem) => (
                                <Button
                                  key={subItem.name}
                                  variant="ghost"
                                  className="text-teal-600 hover:text-teal-800 justify-start w-full"
                                >
                                  {subItem.icon}
                                  {subItem.name}
                                </Button>
                              ))}
                            </div>
                          </AccordionContent>
                        )}
                      </AccordionItem>
                    ))}
                  </Accordion>
                </nav>
              </SheetContent>
            </Sheet>
            <motion.img
              src="/placeholder.svg?height=50&width=150&text=Reffinato%20Logo"
              alt="Reffinato Logo"
              className="h-8"
              initial={false}
              animate={{
                scale: isScrolled ? 0.8 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <nav className="hidden lg:flex space-x-4">
            {["BIKINI", "SWIMSUITS", "BEACHWEAR", "SHOP"].map((item) => (
              <NavItem key={item} item={item} isScrolled={isScrolled} />
            ))}
          </nav>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-teal-600 hover:text-white"
                >
                  <Search
                    className={`transition-all duration-300 ${
                      isScrolled ? "h-4 w-4" : "h-5 w-5"
                    }`}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <form onSubmit={handleSearch} className="flex items-center">
                  <Input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow border-none focus:ring-0"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="rounded-l-none bg-teal-600 hover:bg-teal-700"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </PopoverContent>
            </Popover>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-teal-600 hover:text-white"
                >
                  <User
                    className={`transition-all duration-300 ${
                      isScrolled ? "h-4 w-4" : "h-5 w-5"
                    }`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mi cuenta</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-teal-600 hover:text-white relative"
                >
                  <Heart
                    className={`transition-all duration-300 ${
                      isScrolled ? "h-4 w-4" : "h-5 w-5"
                    }`}
                  />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mis favoritos</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={openCart}
                  className="text-white hover:bg-teal-600 hover:text-white relative"
                >
                  <ShoppingBag
                    className={`transition-all duration-300 ${
                      isScrolled ? "h-4 w-4" : "h-5 w-5"
                    }`}
                  />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Carrito de compras</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
