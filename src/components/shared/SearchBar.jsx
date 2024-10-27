import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";

export default function Component({ onClose }) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSize, setFilterSize] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const { data: allProducts, isLoading, error } = useProducts();

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsResultsOpen(false);
        setIsFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() === "") {
      return;
    }
    setIsSearching(true);

    if (!Array.isArray(allProducts)) {
      console.error("allProducts no es un array:", allProducts);
      setIsSearching(false);
      return;
    }

    const filteredResults = allProducts
      .filter((product) => {
        const nameMatch = product.name
          .toLowerCase()
          .includes(query.toLowerCase());
        const categoryMatch =
          filterCategory === "all" || product.category === filterCategory;
        const sizeMatch =
          filterSize === "all" || product.sizes.includes(filterSize);
        return nameMatch && categoryMatch && sizeMatch;
      })
      .slice(0, 4); // Limit to 4 results

    setResults(filteredResults);
    setIsSearching(false);
  };

  const handleFocus = () => {
    setIsResultsOpen(true);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleDetails = (id) => {
    navigate(`/products-details/${id}`);
    setIsResultsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const categories = [
    "all",
    ...new Set(allProducts?.map((product) => product.category) || []),
  ];
  const sizes = [
    "all",
    ...new Set(allProducts?.flatMap((product) => product.sizes) || []),
  ];

  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={handleSearch} className="flex items-center w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder="Search Products..."
          className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:bg-white focus:ring-1"
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
        >
          <Search className="h-5 w-5 text-gray-400" />
        </button>
        <button
          type="button"
          className="absolute right-10 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200"
          onClick={toggleFilter}
        >
          <Filter className="h-5 w-5 text-gray-400" />
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
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-x-0 top-full mt-2 bg-white rounded-md shadow-lg z-20 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="category-select"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="category-select"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="size-select"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Size
                </label>
                <select
                  id="size-select"
                  value={filterSize}
                  onChange={(e) => setFilterSize(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size === "all" ? "All Sizes" : size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isResultsOpen &&
          (isSearching || results.length > 0 || error || isLoading) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-x-0 top-full mt-2 bg-white rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
            >
              {isLoading ? (
                <div className="p-4 text-sm text-gray-500">
                  Loading products...
                </div>
              ) : isSearching ? (
                <div className="p-4 text-sm text-gray-500">Searching...</div>
              ) : error ? (
                <div className="p-4 text-sm text-red-500">{error.message}</div>
              ) : results.length > 0 ? (
                results.map((result) => (
                  <div
                    onClick={() => handleDetails(result.id)}
                    key={result.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  >
                    <img
                      src={
                        result.photos[0] ||
                        "/placeholder.svg?height=50&width=50"
                      }
                      alt={result.name}
                      className="w-12 h-12 object-cover rounded-md mr-4"
                    />
                    <div>
                      <div className="font-medium">{result.name}</div>
                      <div className="text-sm text-gray-500">
                        {result.category} - Sizes: {result.sizes.join(", ")}
                      </div>
                    </div>
                  </div>
                ))
              ) : query.trim() !== "" ? (
                <div className="p-4 text-sm text-gray-500">
                  No results found for "{query}"
                </div>
              ) : null}
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
