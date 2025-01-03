import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SizeSelector({ onSizeChange, sizes = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    onSizeChange(size);
    setIsOpen(false);
  };

  if (sizes.length === 0) {
    return <div>No hay tallas disponibles</div>;
  }

  return (
    <div className="relative w-full max-w-xs">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Size
      </label>
      <div
        className="border border-gray-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between p-2 cursor-pointer">
          <span className="text-sm">{selectedSize || "size"}</span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        {isOpen && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 border-t-1 rounded-b-md shadow-lg">
            {sizes.map((size, index) => (
              <li
                key={index}
                className={`p-2 cursor-pointer flex items-center justify-between ${
                  selectedSize === size
                    ? "bg-[#a0501a] text-white"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => handleSizeSelect(size)}
              >
                <span>{size.toUpperCase()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
