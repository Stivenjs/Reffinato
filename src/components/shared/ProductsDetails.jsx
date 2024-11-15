import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Heart,
  Share2,
  Loader2,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useProductById } from "@/hooks/fetchProductById";
import { useSubscription } from "@/hooks/fetchSucriptions";
import useFavoritesStore from "@/store/favoriteStore";
import SizeSelector from "./SizeSelector";
import useCartStore from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import {
  calculateWeeklyDiscounts,
  getDiscountForProduct,
  calculateDiscountedPrice,
} from "./discountLogic";

export default function ProductDetails() {
  const { addToCart } = useCartStore();
  const { addToFavorites, removeFromFavorites, isFavorite } =
    useFavoritesStore();
  const { id } = useParams();
  const location = useLocation();
  const { data: product, isLoading, isError } = useProductById(id);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const { toast } = useToast();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data: subscription } = useSubscription(user?.uid);
  const [discountPercentage, setDiscountPercentage] = useState(0);

  useEffect(() => {
    if (product && subscription && subscription.status === "active") {
      const weeklyDiscounts = calculateWeeklyDiscounts([product], true);
      const discount = getDiscountForProduct(product.id, weeklyDiscounts);
      setDiscountPercentage(discount);
    } else if (location.state && location.state.discountPercentage) {
      setDiscountPercentage(location.state.discountPercentage);
    }
  }, [product, subscription, location.state]);

  useEffect(() => {
    if (product) {
      setMainImage(product.photos[0]);
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading product</div>;
  }

  const handleImageClick = (image) => {
    setMainImage(image);
  };

  const handleMouseMove = (e) => {
    if (isZoomed) {
      const { left, top, width, height } = e.target.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setZoomPosition({ x, y });
    }
  };

  const toggleShareMenu = () => {
    setIsShareMenuOpen(!isShareMenuOpen);
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (selectedSize && selectedColor) {
      const discountedPrice = calculateDiscountedPrice(
        product.price,
        discountPercentage
      );

      const productWithDiscount = {
        ...product,
        price: discountedPrice,
        originalPrice: product.price,
        discountPercentage: discountPercentage,
      };

      addToCart(productWithDiscount, selectedSize, quantity, selectedColor);

      toast({
        title: "Added to cart",
        description: `${quantity} ${product.name} (Size: ${selectedSize}, Color: ${selectedColor}) added to cart`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a size and color before adding to cart",
      });
    }
  };

  const handleFavoriteClick = () => {
    const discountedPrice = calculateDiscountedPrice(
      product.price,
      discountPercentage
    );

    const productWithDiscount = {
      ...product,
      price: discountedPrice,
      originalPrice: product.price,
      discountPercentage: discountPercentage,
    };

    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(productWithDiscount);
    }
  };

  const discountedPrice = calculateDiscountedPrice(
    product.price,
    discountPercentage
  );

  const handleGoBack = () => {
    navigate(-1);
  };

  const productUrl = `${window.location.origin}/product/${id}`;

  const handleShare = (platform) => {
    let shareUrl;
    const encodedProductUrl = encodeURIComponent(productUrl);
    const encodedMessage = encodeURIComponent(
      `Check out this product: ${product.name}`
    );

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedProductUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedProductUrl}&text=${encodedMessage}`;
        break;
      case "instagram":
        shareUrl = "https://www.instagram.com/";
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
    setIsShareMenuOpen(false);
  };

  return (
    <div className="container mx-auto px-15 md:px-8 lg:px-16 py-20 mt-24">
      <button
        className="mb-6 flex items-center gap-2 text-lg font-semibold  hover:text-gray-900 transition-colors duration-200"
        onClick={handleGoBack}
      >
        <ChevronLeft className="h-5 w-5" />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative overflow-hidden">
          <div
            className="aspect-w-3 aspect-h-4 bg-gray-100 cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={mainImage}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
                isZoomed ? "scale-150" : "scale-100"
              }`}
              style={{
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
          </div>
          <div className="mt-4 flex space-x-2 overflow-x-auto">
            {product.photos.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} thumbnail ${index + 1}`}
                className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-cover cursor-pointer"
                onClick={() => handleImageClick(img)}
              />
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
          <div className="mt-4">
            {discountPercentage > 0 ? (
              <>
                <p className="text-xl md:text-2xl font-bold line-through text-gray-500">
                  ${Number(product.price).toFixed(2)}
                </p>
                <p className="text-xl md:text-2xl font-bold text-red-600">
                  ${Number(discountedPrice).toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-xl md:text-2xl font-bold">
                {" "}
                ${Number(product.price).toFixed(2)}
              </p>
            )}
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex space-x-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    selectedColor === color
                      ? "ring-2 ring-offset-2 ring-gray-500"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select ${color} color`}
                />
              ))}
            </div>
            {selectedColor && (
              <p className="mt-2 text-sm text-gray-500">
                Selected: {selectedColor}
              </p>
            )}
          </div>
          <div className="mt-6">
            <SizeSelector
              sizes={product.sizes}
              onSizeChange={setSelectedSize}
            />
          </div>
          <div className="mt-6">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-800 focus:border-teal-800 sm:text-sm"
            />
          </div>
          <button
            className="mt-8 w-full bg-[#a0501a] border border-transparent py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-[#8b4513] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-[#8b4513]"
            onClick={handleAddToCart}
          >
            Add to cart
          </button>
          <div className="mt-6 flex items-center justify-between">
            <button onClick={handleFavoriteClick}>
              <Heart
                className={`h-6 w-6 ${
                  isFavorite(product.id) ? "fill-[#a0501a]" : ""
                }`}
              />
            </button>
            <div className="relative">
              <button
                className="hover:text-[#8b4513]"
                onClick={toggleShareMenu}
              >
                <Share2 className="h-6 w-6" />
              </button>
              {isShareMenuOpen && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white shadow-xl z-20">
                  <button
                    onClick={() => handleShare("facebook")}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center w-full"
                  >
                    <Facebook className="w-4 h-4 mr-2" /> Facebook
                  </button>
                  <button
                    onClick={() => handleShare("twitter")}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center w-full"
                  >
                    <Twitter className="w-4 h-4 mr-2" /> Twitter
                  </button>
                  <button
                    onClick={() => handleShare("instagram")}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center w-full"
                  >
                    <Instagram className="w-4 h-4 mr-2" /> Instagram
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 border-t pt-8">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => toggleSection("description")}
            >
              <span className="text-sm font-medium text-gray-900">
                Description
              </span>
              {openSection === "description" ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {openSection === "description" && (
              <p className="mt-4 text-sm text-gray-700">
                {product.description}
              </p>
            )}
          </div>
          <div className="mt-8 border-t pt-8">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => toggleSection("details")}
            >
              <span className="text-sm font-medium text-gray-900">Details</span>
              {openSection === "details" ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {openSection === "details" && (
              <p className="mt-4 text-sm text-gray-700">{product.details}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
