import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsResultsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setIsResultsOpen(true);
    // Simular una búsqueda
    setTimeout(() => {
      setResults([
        { id: 1, name: "Bikini Rojo" },
        { id: 2, name: "Traje de baño Azul" },
        { id: 3, name: "Vestido de playa" },
      ]);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={handleSearch} className="flex items-center w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsResultsOpen(true)}
          placeholder="Search Products..."
          className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:bg-white focus:ring-1 "
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
        >
          <Search className="h-5 w-5 text-gray-400" />
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </form>
      <AnimatePresence>
        {isResultsOpen && (isSearching || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-x-0 top-full mt-2 bg-white rounded-md shadow-lg z-10"
          >
            {isSearching ? (
              <div className="p-4 text-sm text-gray-500">Searching...</div>
            ) : (
              results.map((result) => (
                <div
                  key={result.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {result.name}
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
