import { useState } from "react";
import { Link } from "react-router-dom";
import BlurFade from "@/components/ui/blur-fade";
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
  },
];

const tabs = ["Ropa", "Novedades", "Homewear", "Best Sellers"];

function ProductCard({ product, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <BlurFade delay={0.25 + index * 0.05} inView={true}>
      <Link to={`/products-details/${product.id}`}>
        <div
          className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative">
            <img
              src={isHovered ? product.images[1] : product.images[0]}
              alt={`${product.name} - ${
                isHovered ? "Imagen alternativa" : "Imagen principal"
              }`}
              className="w-full h-96 object-cover transition-opacity duration-300"
            />
          </div>
          <div className="p-4">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.brand}</p>
            <p className="text-lg font-bold mt-2">
              {product.price.toFixed(2)} €
            </p>
          </div>
        </div>
      </Link>
    </BlurFade>
  );
}

export default function Products() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="container mx-auto px-4 mt-32">
      <h1 className="text-3xl font-bold text-center my-8">Shop</h1>
      <div className="mb-8">
        <ul className="flex space-x-4 border-b" role="tablist">
          {tabs.map((tab, index) => (
            <li key={tab} role="presentation">
              <button
                className={`px-4 py-2 font-medium ${
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
      <div>
        {tabs.map((tab, index) => (
          <div
            key={tab}
            role="tabpanel"
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            hidden={activeTab !== index}
          >
            {index === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, productIndex) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={productIndex}
                  />
                ))}
              </div>
            ) : (
              <p>Contenido de {tab}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
