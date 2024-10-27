import { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useProductById } from "@/hooks/fetchProductById";
import { Loader2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import useFavoritesStore from "@/store/favoriteStore";

export default function MyWishlist() {
  const { user } = useAuthStore();
  const { getUserFavorites, removeFromFavorites, subscribe } =
    useFavoritesStore();
  const [productIds, setProductIds] = useState([]);

  const updateFavorites = useCallback(() => {
    const favorites = getUserFavorites();
    setProductIds(favorites.map((fav) => fav.id));
  }, [getUserFavorites]);

  useEffect(() => {
    if (user) {
      updateFavorites();
      const unsubscribe = subscribe(updateFavorites);

      return () => unsubscribe();
    }
  }, [user, updateFavorites, subscribe]);

  const handleRemoveFromFavorites = useCallback(
    (id) => {
      removeFromFavorites(id);
      updateFavorites();
    },
    [removeFromFavorites, updateFavorites]
  );

  if (!user) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent>
          <p>Please log in to view your wishlist.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Wishlist</CardTitle>
      </CardHeader>
      <CardContent>
        {productIds.length === 0 ? (
          <p>Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productIds.map((id) => (
              <ProductCard
                key={id}
                id={id}
                removeFromFavorites={handleRemoveFromFavorites}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProductCard({ id, removeFromFavorites }) {
  const { data: product, isLoading, isError } = useProductById(id);
  const navigate = useNavigate();
  const handleDetails = (id) => {
    navigate(`/products-details/${id}`);
  };

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="h-48">
        <CardContent className="flex items-center justify-center h-full">
          Error loading product
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative">
      <button
        onClick={() => removeFromFavorites(id)}
        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
      >
        <X className="h-4 w-4" />
      </button>
      <CardContent
        className="pt-8 cursor-pointer"
        onClick={() => handleDetails(id)}
      >
        <img
          src={product.photos[0]}
          alt={product.name}
          className="w-full h-48 object-cover mb-4 rounded"
        />
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-2">{product.color}</p>
        <p className="font-bold">${product.price}</p>
      </CardContent>
    </Card>
  );
}
