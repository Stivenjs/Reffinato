import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BlurFade from "@/components/ui/blur-fade";
import swimsuits from "../../assets/imgs/swimsuits.webp";
import bikini from "../../assets/imgs/bikini.webp";
import beachwear from "../../assets/imgs/beachwear.webp";

const categories = [
  {
    id: 1,
    title: "Swimsuits",
    imageUrl: swimsuits,
    path: "/products",
  },
  {
    id: 2,
    title: "Bikini",
    imageUrl: bikini,
    path: "/products",
  },
  {
    id: 3,
    title: "Beachwear",
    imageUrl: beachwear,
    path: "/products",
  },
];

export default function BeachwearCategories() {
  return (
    <section id="beachwear-categories" className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-center mb-10">
        <div className="flex-grow h-px bg-gray-300"></div>
        <h2 className="text-2xl font-bold mx-4 text-center uppercase">
          Categories
        </h2>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, idx) => (
          <BlurFade key={category.id} delay={0.25 + idx * 0.05} inView>
            <CategoryCard category={category} />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}

function CategoryCard({ category }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(category.path, { state: { category: category.title } });
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-full pb-[100%] relative"
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={category.imageUrl}
          alt={category.title}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold">
          {category.title}
        </div>
      </motion.div>
    </motion.div>
  );
}
