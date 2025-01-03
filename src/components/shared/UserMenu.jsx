import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  { label: "My Orders", to: "/profile", query: "section=orders" },
  { label: "My Addresses", to: "/profile", query: "section=addresses" },
  { label: "My Wishlist", to: "/profile", query: "section=wishlist" },
  { label: "My Subscriptions", to: "/profile", query: "section=subscriptions" },
  { label: "My Account", to: "/profile", query: "section=account" },
  { label: "Admin Panel", to: "/admin/add-product" },
];

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const adminUID = import.meta.env.VITE_ADMIN_UID;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", checkMobile);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getInitials = (name) => {
    return name.split(" ")[0][0].toUpperCase();
  };

  const userInitial = user?.displayName ? getInitials(user.displayName) : "?";

  const handleMenuItemClick = (to, query) => {
    navigate(`${to}?${query}`);
    setIsOpen(false);
  };

  // Renderiza el componente UserMenu solo si hay un usuario autenticado
  if (!user) {
    return (
      <Link to="/login" className="text-primary">
        Log In
      </Link>
    );
  }

  return (
    <div className="relative font-bold" ref={menuRef}>
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
            className={`fixed sm:absolute 
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
              {userMenuItems.map((item) =>
                // Solo muestra el "Admin Panel" si el UID coincide
                item.label === "Admin Panel" &&
                user?.uid !== adminUID ? null : (
                  <button
                    key={item.label}
                    onClick={() => handleMenuItemClick(item.to, item.query)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {item.label}
                  </button>
                )
              )}
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
