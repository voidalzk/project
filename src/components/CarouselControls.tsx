import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselControlsProps {
  currentIndex: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
}

const CarouselControls: React.FC<CarouselControlsProps> = ({
  currentIndex,
  totalSlides,
  onPrevious,
  onNext,
  onDotClick,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Show controls immediately
    setIsVisible(true);

    // Set a new timeout to hide controls after 2 seconds
    const id = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    setTimeoutId(id);
  }, [timeoutId]);

  // Set up initial timer
  useEffect(() => {
    resetTimer();

    // Add mouse move event listener to reset timer
    const handleMouseMove = () => resetTimer();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchstart", handleMouseMove);

    // Clean up
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchstart", handleMouseMove);
    };
  }, [resetTimer, timeoutId]);

  // Reset timer on any interaction
  const handleInteraction = (callback: () => void) => {
    return () => {
      resetTimer();
      callback();
    };
  };

  return (
    <AnimatePresence>
      <motion.div
        className="w-full flex flex-col items-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={resetTimer}
        onTouchStart={resetTimer}
      >
        {/* Navigation Arrows */}
        <div className="w-full flex justify-between px-4 mb-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white/10 backdrop-blur-sm rounded-full p-2 text-champagne hover:bg-pink-600 transition-colors"
            onClick={handleInteraction(onPrevious)}
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white/10 backdrop-blur-sm rounded-full p-2 text-champagne hover:bg-pink-600 transition-colors"
            onClick={handleInteraction(onNext)}
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>

        {/* Indicator Dots */}
        <div className="flex space-x-2 mb-6">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-3 h-3 rounded-full ${
                currentIndex === index ? "bg-pink-500" : "bg-white/30"
              } transition-colors`}
              onClick={handleInteraction(() => onDotClick(index))}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CarouselControls;
