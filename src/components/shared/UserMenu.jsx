import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, LogOut, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import useAuthStore from "@/store/authStore";

const userMenuItems = [
  { label: "My Orders", to: "/orders" },
  { label: "My Addresses", to: "/addresses" },
  { label: "My Wallet", to: "/wallet" },
  { label: "My Wishlist", to: "/wishlist" },
  { label: "My Subscriptions", to: "/subscriptions" },
  { label: "My Account", to: "/preferences-orders/update-profile" },
];

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuthStore();
  const { logout } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const userInitial = user?.displayName ? getInitials(user.displayName) : "?";

  return (
    <div className="relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 flex items-center space-x-2"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.photoURL} alt={user?.displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="h-4 w-4" />
          </button>
        </TooltipTrigger>

        <TooltipContent>
          <p>Account</p>
        </TooltipContent>
      </Tooltip>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`
              fixed sm:absolute 
              ${isMobile ? "inset-x-4 top-16" : "right-0 mt-2"} 
              w-auto sm:w-56 rounded-md shadow-lg bg-white 
              ring-1 ring-black ring-opacity-5 focus:outline-none z-50
              max-h-[80vh] overflow-y-auto
            `}
          >
            {isMobile && (
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close menu</span>
              </button>
            )}
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL} alt={user?.displayName} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium truncate max-w-[150px]">
                    {user?.displayName}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>
            <div className="py-1">
              {userMenuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
