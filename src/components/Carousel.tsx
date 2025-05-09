import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageData } from "../data/images";

interface CarouselProps {
  images: ImageData[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Updated slide variants with smoother transitions
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const swipePower = useCallback((offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  }, []);

  const paginate = useCallback(
    (newDirection: number) => {
      // Remove this check to allow navigation even during dragging
      setDirection(newDirection);
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex + newDirection + images.length) % images.length
      );
    },
    [images.length]
  );

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setDragPosition(info.offset.x);
    },
    []
  );

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(false);
      setDragPosition(0);

      // Make swipe detection much more sensitive
      // Even a very small drag should trigger navigation
      if (info.offset.x < -10) {
        paginate(1);
      } else if (info.offset.x > 10) {
        paginate(-1);
      }
    },
    [paginate]
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        if (Math.abs(e.deltaX) > 30) {
          // Reduzido de 50 para 30
          paginate(e.deltaX > 0 ? 1 : -1);
        }
      }
    },
    [paginate]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  // Preload images logic
  useEffect(() => {
    // Preload current image plus next and previous
    const imagesToPreload: string[] = [];
    const currentImg = images[currentIndex].src;
    const nextImg = images[(currentIndex + 1) % images.length].src;
    const prevImg =
      images[(currentIndex - 1 + images.length) % images.length].src;

    // Add all unique images to preload array
    [currentImg, nextImg, prevImg].forEach((src) => {
      if (!preloadedImages.includes(src)) {
        imagesToPreload.push(src);
      }
    });

    // Preload all images at once
    if (imagesToPreload.length > 0) {
      const newPreloadedImages = [...preloadedImages];

      imagesToPreload.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          if (!preloadedImages.includes(src)) {
            newPreloadedImages.push(src);
            setPreloadedImages(newPreloadedImages);
          }
        };
      });
    }
  }, [currentIndex, images, preloadedImages]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      {/* Hidden div for preloading images */}
      <div className="hidden">
        {images.map((image, index) => (
          <img
            key={`preload-${index}`}
            src={image.src}
            alt="Preloaded content"
            className="hidden"
          />
        ))}
      </div>

      {/* Main carousel container */}
      <div className="relative w-full h-full">
        {/* Slides container - removed mode="popLayout" */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              // Smoother, linear transitions without spring bounce
              x: { type: "tween", ease: "easeInOut", duration: 0.3 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8} // Reduced from 1.2 for less "springy" feel
            dragMomentum={false} // Disabled momentum to prevent overshoot
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            <div className="w-full h-full">
              <img
                src={images[currentIndex].src}
                alt="Birthday moment"
                className="w-full h-full object-cover object-center select-none"
                draggable={false}
              />

              {/* Image overlay with message */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="font-heading text-xl text-white text-center">
                  {images[currentIndex].messageBelow}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Visual feedback indicators for dragging */}
      {isDragging && dragPosition > 20 && (
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-black/40 rounded-full p-2">
          <ChevronLeft size={24} className="text-white animate-pulse" />
        </div>
      )}
      {isDragging && dragPosition < -20 && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-black/40 rounded-full p-2">
          <ChevronRight size={24} className="text-white animate-pulse" />
        </div>
      )}

      {/* Navigation controls - positioned with higher z-index */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full flex items-center justify-between px-4">
          {/* Left navigation button */}
          <button
            className="z-20 pointer-events-auto p-2.5 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-colors focus:outline-none"
            onClick={() => paginate(-1)}
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right navigation button */}
          <button
            className="z-20 pointer-events-auto p-2.5 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-colors focus:outline-none"
            onClick={() => paginate(1)}
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Instagram-style dots indicator */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center z-20 pointer-events-auto">
          <div className="flex gap-1.5 px-2 py-1.5 bg-black/20 backdrop-blur-sm rounded-full">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all focus:outline-none ${
                  index === currentIndex ? "bg-white" : "bg-white/40"
                }`}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
