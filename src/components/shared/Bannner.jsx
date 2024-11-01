import { useState, useEffect } from "react";
import banner1 from "../../assets/imgs/banner1.webp";
import banner2 from "../../assets/imgs/banner2.webp";
import banner3 from "../../assets/imgs/banner3.webp";
const bannerImages = [banner1, banner2, banner3];

export default function Banner() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % bannerImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mb-8 h-48 md:h-64 lg:h-80 overflow-hidden rounded-lg pt-16 md:pt-0">
      {bannerImages.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`Banner image ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center"></div>
    </div>
  );
}
