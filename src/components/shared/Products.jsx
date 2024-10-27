import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProductsByCategory } from "@/hooks/useProductsByCategory";
import { useSubscription } from "@/hooks/fetchSucriptions";
import { Loader2, Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";
import useAuthStore from "@/store/authStore";
import seedrandom from "seedrandom";
import { Input } from "@/components/ui/input";

function ProductCard({ product, index, discountPercentage }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <BlurFade delay={0.25 + index * 0.05} inView={true}>
      <Link to={`/products-details/${product.id}`}>
        <div
          className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative">
            <img
              src={isHovered ? product.photos[0] : product.photos[1]}
              alt={`${product.name} - ${
                isHovered ? "Alternative image" : "Main image"
              }`}
              className="w-full h-60 md:h-72 lg:h-96 object-cover transition-opacity duration-300"
            />
            {discountPercentage > 0 && (
              <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded">
                {discountPercentage}% OFF
              </div>
            )}
          </div>
          <div className="p-4">
            <h2 className="text-base md:text-lg lg:text-xl font-semibold">
              {product.name}
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              {product.color}
            </p>
            <p className="text-base md:text-lg lg:text-xl font-bold mt-2">
              {discountPercentage > 0 ? (
                <>
                  <span className="line-through text-gray-500 mr-2">
                    ${product.price}
                  </span>
                  ${(product.price * (1 - discountPercentage / 100)).toFixed(2)}
                </>
              ) : (
                `$${product.price}`
              )}
            </p>
          </div>
        </div>
      </Link>
    </BlurFade>
  );
}

function CustomSelect({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          {options.find((option) => option.value === value)?.label ||
            "Select option"}
          <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 bottom-full mb-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {options.map((option) => (
              <button
                key={option.value}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Products() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const categories = ["Bikini", "Swimsuits", "Beachwear"];
  const selectedCategory = categories[activeTab];
  const location = useLocation();
  const { user } = useAuthStore();
  const { data: subscription } = useSubscription(user?.uid);

  useEffect(() => {
    const categoryFromState = location.state?.category;
    if (categoryFromState) {
      const index = categories.indexOf(categoryFromState);
      if (index !== -1) {
        setActiveTab(index);
      }
    }
  }, [location]);

  const {
    data: products,
    isLoading,
    error,
  } = useProductsByCategory(selectedCategory);

  const weeklyDiscounts = useMemo(() => {
    if (!products || !subscription || subscription.status !== "active")
      return {};

    const currentWeek = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    const rng = seedrandom(currentWeek.toString());

    const discounts = {};
    const discountedProductCount = Math.floor(products.length * 0.9);

    for (let i = 0; i < discountedProductCount; i++) {
      const randomIndex = Math.floor(rng() * products.length);
      const randomDiscount = rng() < 0.2 ? 25 : rng() < 0.5 ? 15 : 10;
      discounts[products[randomIndex].id] = randomDiscount;
    }

    return discounts;
  }, [products, subscription]);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortOption) {
      case "priceLowToHigh":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceHighToLow":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "nameAZ":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameZA":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // 'featured' - no sorting needed
        break;
    }

    return filtered;
  }, [products, searchTerm, sortOption]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p>Error loading products: {error.message}</p>;
  }

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "priceLowToHigh", label: "Price: Low to High" },
    { value: "priceHighToLow", label: "Price: High to Low" },
    { value: "nameAZ", label: "Name: A-Z" },
    { value: "nameZA", label: "Name: Z-A" },
  ];

  return (
    <div className="container mx-auto px-4 mt-24 md:mt-32 lg:mt-48">
      <div className="relative mb-8">
        <img
          src="/placeholder.svg?height=300&width=1200"
          alt="Shop Banner"
          className="w-full h-48 md:h-64 lg:h-80 object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Discover Our Collection
          </h1>
        </div>
      </div>

      <div className="mb-8">
        <ul className="flex space-x-2 md:space-x-4 border-b" role="tablist">
          {categories.map((tab, index) => (
            <li key={tab} role="presentation">
              <button
                className={`px-2 md:px-4 py-2 font-medium ${
                  activeTab === index ? "border-b-2 border-black" : ""
                }`}
                onClick={() => setActiveTab(index)}
                role="tab"
                aria-selected={activeTab === index}
                aria-controls={`tabpanel-${index}`}
                id={`tab-${index}`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-1/3 relative">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="w-full md:w-auto flex items-center gap-2">
          <SlidersHorizontal className="text-gray-400" />
          <CustomSelect
            value={sortOption}
            onChange={setSortOption}
            options={sortOptions}
          />
        </div>
      </div>

      <div>
        {categories.map((tab, index) => (
          <div
            key={tab}
            role="tabpanel"
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            hidden={activeTab !== index}
          >
            {activeTab === index && (
              <>
                <p className="mb-4 text-gray-600">
                  Showing {filteredAndSortedProducts.length} products
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                  {filteredAndSortedProducts.map((product, productIndex) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={productIndex}
                      discountPercentage={weeklyDiscounts[product.id] || 0}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
