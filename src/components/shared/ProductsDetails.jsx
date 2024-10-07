import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Heart,
  Share2,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import SizeSelector from "./SizeSelector";
const products = [
  {
    id: 1,
    name: "BLOUSON",
    brand: "KEYSTONE Crudo",
    price: 107.0,
    images: [
      "https://picsum.photos/seed/1/800/600",
      "https://picsum.photos/seed/2/800/600",
    ],
    description:
      "Un blouson elegante y versátil, perfecto para cualquier ocasión.",
    details:
      "• Material: 100% algodón\n• Cierre frontal con cremallera\n• Bolsillos laterales\n• Puños y cintura elásticos",
    deliveryReturns:
      "• Entrega estándar: 3-5 días hábiles\n• Devoluciones gratuitas dentro de los 30 días posteriores a la recepción",
  },
  {
    id: 2,
    name: "PANTALÓN",
    brand: "KEYSTONE Crudo",
    price: 90.0,
    images: [
      "https://picsum.photos/seed/3/600/800",
      "https://picsum.photos/seed/4/600/800",
    ],
    description: "Pantalón cómodo y estilizado, ideal para el día a día.",
    details:
      "• Material: 98% algodón, 2% elastano\n• Cierre con botón y cremallera\n• Bolsillos frontales y traseros\n• Corte recto",
    deliveryReturns:
      "• Entrega estándar: 3-5 días hábiles\n• Devoluciones gratuitas dentro de los 30 días posteriores a la recepción",
  },
  {
    id: 3,
    name: "POLAR",
    brand: "DEERVALLEY Crudo",
    price: 126.0,
    images: [
      "https://picsum.photos/seed/5/800/600",
      "https://picsum.photos/seed/6/800/600",
    ],
    description: "Polar cálido y confortable, perfecto para los días fríos.",
    details:
      "• Material: 100% poliéster\n• Cierre frontal con cremallera\n• Bolsillos laterales con cremallera\n• Puños elásticos",
    deliveryReturns:
      "• Entrega estándar: 3-5 días hábiles\n• Devoluciones gratuitas dentro de los 30 días posteriores a la recepción",
  },
];

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    const productId = parseInt(id);
    const foundProduct = products.find((p) => p.id === productId);
    setProduct(foundProduct);
    if (foundProduct) {
      setMainImage(foundProduct.images[0]);
    }
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
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

  return (
    <div className="container mx-auto px-15 md:px-8 lg:px-16 py-20 mt-24">
      <Link
        to="/products"
        className="text-teal-800 hover:underline mb-4 inline-block"
      >
        &larr; Back to products
      </Link>
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
            {product.images.map((img, index) => (
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
          <p className="text-lg md:text-xl text-gray-600 mt-2">
            {product.brand}
          </p>
          <p className="text-xl md:text-2xl font-bold mt-4">
            {product.price.toFixed(2)} €
          </p>
          <div className="mt-6">
            <SizeSelector onSizeChange={setSelectedSize} />
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
          <button className="mt-8 w-full bg-teal-800 border border-transparent py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
            Add to cart
          </button>
          <div className="mt-6 flex items-center justify-between">
            <button className="text-teal-800 hover:text-teal-800">
              <Heart className="h-6 w-6" />
            </button>
            <div className="relative">
              <button
                className="text-teal-800 hover:text-teal-800"
                onClick={toggleShareMenu}
              >
                <Share2 className="h-6 w-6" />
              </button>
              {isShareMenuOpen && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white shadow-xl z-20">
                  <a
                    href="#"
                    className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Facebook className="w-4 h-4 mr-2" /> Facebook
                  </a>
                  <a
                    href="#"
                    className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Twitter className="w-4 h-4 mr-2" /> Twitter
                  </a>
                  <a
                    href="#"
                    className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Instagram className="w-4 h-4 mr-2" /> Instagram
                  </a>
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
              <p className="mt-4 text-sm text-gray-500">
                {product.description}
              </p>
            )}
          </div>
          <div className="mt-4 border-t pt-8">
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
              <p className="mt-4 text-sm text-gray-500 whitespace-pre-line">
                {product.details}
              </p>
            )}
          </div>
          <div className="mt-4 border-t pt-8">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => toggleSection("deliveryReturns")}
            >
              <span className="text-sm font-medium text-gray-900">
                Delivery and returns
              </span>
              {openSection === "deliveryReturns" ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {openSection === "deliveryReturns" && (
              <p className="mt-4 text-sm text-gray-500 whitespace-pre-line">
                {product.deliveryReturns}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
