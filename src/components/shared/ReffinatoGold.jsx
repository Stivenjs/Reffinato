import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function RefinnatoGold() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="px-20 py-32">
        <h2 className="text-3xl font-bold text-center  mb-4">Reffinato Gold</h2>
        <div className="text-center mb-8">
          <p className="text-xl text-gray-600 mb-2">Gold</p>
          <p className="text-5xl font-bold">$25</p>
          <p className="text-sm text-gray-500">Every year</p>
        </div>
        <p className="text-center text-gray-600 mb-8">
          Get up to 25% discount and free shipping on selected products with the
          Gold membership!
        </p>
        <motion.button
          className="w-full py-3 px-6 bg-teal-800 text-white rounded-md text-lg font-semibold hover:bg-teal-800 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isHovered ? (
            <span className="flex items-center justify-center">
              Select <Sparkles className="ml-2" size={20} />
            </span>
          ) : (
            "Select"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
