import { useState } from "react";
import { Link } from "react-router-dom";
import { User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const userMenuItems = [
  { label: "My Orders", href: "/orders" },
  { label: "My Addresses", href: "/addresses" },
  { label: "My Wallet", href: "/wallet" },
  { label: "My Wishlist", href: "/wishlist" },
  { label: "My Subscriptions", href: "/subscriptions" },
  { label: "My Account", href: "/account" },
  { label: "Log Out", href: "/logout" },
];

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 flex items-center"
          >
            <User className="h-5 w-5 mr-1" />
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
            className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          >
            <div className="py-1">
              {userMenuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
