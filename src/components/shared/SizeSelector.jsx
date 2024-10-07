import { useState } from "react";
import { ChevronDown, ChevronUp, Bell } from "lucide-react";

const sizes = [
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L", notifyMe: true },
  { value: "XL", label: "XL" },
];

export default function SizeSelector({ onSizeChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    onSizeChange(size);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-xs">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Size
      </label>
      <div
        className="border border-gray-300 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between p-2 cursor-pointer">
          <span className="text-sm">{selectedSize || "size"}</span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        {isOpen && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 border-t-0 rounded-b-md shadow-lg">
            {sizes.map((size) => (
              <li
                key={size.value}
                className={`p-2 cursor-pointer flex items-center justify-between ${
                  selectedSize === size.value
                    ? "bg-teal-600"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => handleSizeSelect(size.value)}
              >
                <span>{size.label}</span>
                {size.notifyMe && (
                  <button
                    onClick={(e) => handleNotifyMe(e, size.value)}
                    className="text-gray-600 hover:text-gray-800 focus:outline-none"
                  >
                    <Bell size={16} />
                    <span className="sr-only">Notificarme</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
