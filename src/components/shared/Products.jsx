import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProductsByCategory } from "@/hooks/useProductsByCategory";
import { useSubscription } from "@/hooks/fetchSucriptions";
import { Loader2 } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";
import useAuthStore from "@/store/authStore";
import seedrandom from "seedrandom"; 

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
                isHovered ? "Imagen alternativa" : "Imagen principal"
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

export default function Products() {
  const [activeTab, setActiveTab] = useState(0);
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

  // Usa el hook para obtener productos de la categoría activa
  const {
    data: products,
    isLoading,
    error,
  } = useProductsByCategory(selectedCategory);

  // Generar descuentos aleatorios semanalmente
  const weeklyDiscounts = useMemo(() => {
    if (!products || !subscription || subscription.status !== "active")
      return {};

    const currentWeek = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    const rng = seedrandom(currentWeek.toString()); // Cambiar aquí

    const discounts = {};
    const discountedProductCount = Math.floor(products.length * 0.9); // 30% de los productos

    for (let i = 0; i < discountedProductCount; i++) {
      const randomIndex = Math.floor(rng() * products.length);
      const randomDiscount = rng() < 0.2 ? 25 : rng() < 0.5 ? 15 : 10;
      discounts[products[randomIndex].id] = randomDiscount;
    }

    return discounts;
  }, [products, subscription]);

  // Manejo de carga y errores
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p>Error al cargar productos: {error.message}</p>;
  }

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
                    discountPercentage={weeklyDiscounts[product.id] || 0}
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
