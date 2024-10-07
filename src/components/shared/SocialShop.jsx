import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Mail,
  Twitter,
  Link,
} from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";

const photos = Array.from({ length: 9 }, (_, i) => {
  const isLandscape = i % 2 === 0;
  const width = isLandscape ? 800 : 600;
  const height = isLandscape ? 600 : 800;
  return {
    id: i + 1,
    src: `https://picsum.photos/seed/${i + 1}/${width}/${height}`,
    caption: `Beautiful image ${i + 1} from our latest collection`,
    date: `${(i + 1).toString().padStart(2, "0")} OCTOBER 2024`,
    username: "REFFINATO",
  };
});

export default function SocialShop() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const openModal = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  const nextPhoto = () => {
    if (selectedPhoto) {
      const currentIndex = photos.findIndex(
        (photo) => photo.id === selectedPhoto.id
      );
      const nextIndex = (currentIndex + 1) % photos.length;
      setSelectedPhoto(photos[nextIndex]);
    }
  };

  const prevPhoto = () => {
    if (selectedPhoto) {
      const currentIndex = photos.findIndex(
        (photo) => photo.id === selectedPhoto.id
      );
      const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
      setSelectedPhoto(photos[prevIndex]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-8">
        <div className="flex-grow h-px bg-gray-300"></div>
        <h2 className="text-2xl md:text-3xl font-bold mx-4 text-center uppercase">
          Social Shop
        </h2>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>
      <section id="photos">
        <div className="columns-2 gap-4 sm:columns-3">
          {photos.map((photo, idx) => (
            <BlurFade key={photo.src} delay={0.25 + idx * 0.05} inView>
              <img
                className="mb-4 w-full rounded-lg object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                src={photo.src}
                alt={`Social shop photo ${photo.id}`}
                onClick={() => openModal(photo)}
              />
            </BlurFade>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                onClick={closeModal}
              >
                <X size={24} />
              </button>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 relative">
                  <img
                    src={selectedPhoto.src}
                    alt={`Selected photo ${selectedPhoto.id}`}
                    className="w-full h-auto object-cover"
                  />
                  {!isMobile && (
                    <>
                      <button
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                        onClick={prevPhoto}
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                        onClick={nextPhoto}
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                </div>
                <div className="md:w-1/3 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      {selectedPhoto.username}
                    </h3>
                    <p className="text-gray-600 mb-6 text-sm md:text-base">
                      {selectedPhoto.caption}
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                      {selectedPhoto.date}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                    <Facebook
                      className="text-gray-600 hover:text-blue-600 cursor-pointer"
                      size={28}
                    />
                    <Mail
                      className="text-gray-600 hover:text-red-600 cursor-pointer"
                      size={28}
                    />
                    <Twitter
                      className="text-gray-600 hover:text-blue-400 cursor-pointer"
                      size={28}
                    />
                    <Link
                      className="text-gray-600 hover:text-green-600 cursor-pointer"
                      size={28}
                    />
                  </div>
                </div>
              </div>
              {isMobile && (
                <div className="flex justify-between p-4 bg-gray-100">
                  <button onClick={prevPhoto} className="p-2">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={nextPhoto} className="p-2">
                    <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
