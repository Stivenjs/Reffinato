import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProductsByCategory } from "@/hooks/useProductsByCategory";
import BlurFade from "@/components/ui/blur-fade";

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
              src={isHovered ? product.photos[0] : product.photos[1]}
              alt={`${product.name} - ${
                isHovered ? "Imagen alternativa" : "Imagen principal"
              }`}
              className="w-full h-60 md:h-72 lg:h-96 object-cover transition-opacity duration-300"
            />
          </div>
          <div className="p-4">
            <h2 className="text-base md:text-lg lg:text-xl font-semibold">
              {product.name}
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              {product.color}
            </p>
            <p className="text-base md:text-lg lg:text-xl font-bold mt-2">
              {product.price} $
            </p>
          </div>
        </div>
      </Link>
    </BlurFade>
  );
}

export default function Products() {
  const [activeTab, setActiveTab] = useState(0);
  const categories = ["Bikini", "Swimsuits", "Beachwear"];
  const selectedCategory = categories[activeTab];
  const location = useLocation();

  useEffect(() => {
    const categoryFromState = location.state?.category;
    if (categoryFromState) {
      const index = categories.indexOf(categoryFromState);
      if (index !== -1) {
        setActiveTab(index);
      }
    }
  }, [location]);
  // Usa el hook para obtener productos de la categoría activa
  const {
    data: products,
    isLoading,
    error,
  } = useProductsByCategory(selectedCategory);

  // Manejo de carga y errores
  if (isLoading) return <p>Cargando productos...</p>;
  if (error) return <p>Error al cargar productos: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 mt-24 md:mt-32 lg:mt-48">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center my-8">
        Shop
      </h1>
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
      <div>
        {categories.map((tab, index) => (
          <div
            key={tab}
            role="tabpanel"
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            hidden={activeTab !== index}
          >
            {activeTab === index ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
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
