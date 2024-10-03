import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Bikini Tropical",
    price: 89.99,
    category: "BIKINI",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Traje de Baño Sunset",
    price: 99.99,
    category: "SWIMSUITS",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Pareo Oceánico",
    price: 49.99,
    category: "BEACHWEAR",
    rating: 4.2,
  },
  {
    id: 4,
    name: "Bikini Dorado Playa",
    price: 129.99,
    category: "REFFINATO GOLD",
    rating: 4.9,
  },
];

export default function NewArrivals({
  addToCart,
  toggleWishlist,
  wishlistItems,
}) {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-semibold text-teal-800 mb-6">
        Nuevas Llegadas
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="bg-white hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <CardTitle className="text-lg font-medium text-teal-700">
                {product.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={`/placeholder.svg?height=300&width=300&text=${product.name}`}
                alt={product.name}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <p className="text-orange-600">{product.category}</p>
              <p className="text-lg font-semibold text-teal-800 mt-2">
                ${product.price.toFixed(2)}
              </p>
              <div className="flex items-center mt-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 ${
                      index < Math.floor(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating.toFixed(1)}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                onClick={addToCart}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Añadir al carrito
              </Button>
              <Button
                onClick={() => toggleWishlist(product.id)}
                variant="outline"
                className={`text-teal-600 hover:text-teal-700 ${
                  wishlistItems.includes(product.id) ? "bg-teal-100" : ""
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${
                    wishlistItems.includes(product.id) ? "fill-current" : ""
                  }`}
                />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
