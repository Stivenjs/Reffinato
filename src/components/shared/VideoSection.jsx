import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const videos = [
  {
    src: "https://reffinatotest.blob.core.windows.net/main-videos/Video de WhatsApp 2024-10-24 a las 19.07.36_6cb0093b.mp4",
    phrase: "Discover beach elegance",
  },
  {
    src: "https://reffinatotest.blob.core.windows.net/main-videos/Video de WhatsApp 2024-10-24 a las 19.07.42_156c3193.mp4",
    phrase: "Live summer in style",
  },
  {
    src: "https://reffinatotest.blob.core.windows.net/main-videos/10493914-uhd_4096_2160_25fps.mp4",
    phrase: "Feel the sea breeze",
  },
];

export default function VideoSection() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const videoRefs = useRef([]);
  const sectionRef = useRef(null);

  const nextVideo = (currentVideo + 1) % videos.length;

  const changeVideo = useCallback(() => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(changeVideo, 8000);
    return () => clearInterval(interval);
  }, [changeVideo]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentVideo || index === nextVideo) {
          video
            .play()
            .catch((error) => console.error("Error playing video:", error));
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentVideo, nextVideo]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRefs.current[currentVideo]?.play();
            videoRefs.current[nextVideo]?.play();
          } else {
            videoRefs.current.forEach((video) => video?.pause());
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [currentVideo, nextVideo]);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {videos.map((video, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentVideo ? 1 : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: index === currentVideo ? 1 : 0 }}
        >
          <video
            ref={(el) => el && (videoRefs.current[index] = el)}
            src={video.src}
            className="absolute w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="auto"
          />
          <AnimatePresence>
            {index === currentVideo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30"
              >
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="text-4xl md:text-6xl text-white font-bold text-center px-4"
                >
                  {video.phrase}
                </motion.h2>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </section>
  );
}
