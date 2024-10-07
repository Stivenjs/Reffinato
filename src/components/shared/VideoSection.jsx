import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const videos = [
  {
    src: "https://videos.pexels.com/video-files/27545637/12164137_1920_1080_60fps.mp4",
    phrase: "Descubre la elegancia playera",
  },
  {
    src: "https://videos.pexels.com/video-files/28339273/12362445_2560_1440_24fps.mp4",
    phrase: "Vive el verano con estilo",
  },
  {
    src: "https://videos.pexels.com/video-files/26890208/12027365_2560_1440_24fps.mp4",
    phrase: "Siente la brisa del mar",
  },
];

export default function VideoSection() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        setCurrentVideo((prev) => (prev + 1) % videos.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isTransitioning]);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);

    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentVideo) {
          video.play();
        }
      }
    });

    return () => clearTimeout(timer);
  }, [currentVideo]);

  return (
    <section className="relative h-screen overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentVideo}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <video
            ref={(el) => (videoRefs.current[currentVideo] = el)}
            src={videos[currentVideo].src}
            className="absolute w-full h-full object-cover"
            muted
            loop
          />
          <div className="absolute inset-0  flex items-center justify-center">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-4xl md:text-6xl text-white font-bold text-center px-4"
            >
              {videos[currentVideo].phrase}
            </motion.h2>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        <div className="flex space-x-2">
          {videos.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentVideo
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              onClick={() => !isTransitioning && setCurrentVideo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
