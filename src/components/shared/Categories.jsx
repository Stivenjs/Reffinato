import { useState } from "react";
import { motion } from "framer-motion";
import BlurFade from "@/components/ui/blur-fade";

const categories = [
  { id: 1, title: "Swimsuits", seed: 1 },
  { id: 2, title: "Bikini", seed: 2 },
  { id: 3, title: "Beachwear", seed: 3 },
];

const images = categories.map((category) => {
  return `https://picsum.photos/seed/${category.seed}/800/800`;
});

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
            <CategoryCard category={category} imageUrl={images[idx]} />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}

function CategoryCard({ category, imageUrl }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
          src={imageUrl}
          alt={`${category.title} category`}
        />
      </motion.div>
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <h3 className="text-white text-3xl font-bold">{category.title}</h3>
      </div>
    </motion.div>
  );
}
