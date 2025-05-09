import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  return (
    <div className="w-full flex flex-col items-center">
      {/* Navigation Arrows */}
      <div className="w-full flex justify-between px-4 mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-white/10 backdrop-blur-sm rounded-full p-2 text-champagne hover:bg-pink-600 transition-colors"
          onClick={onPrevious}
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-white/10 backdrop-blur-sm rounded-full p-2 text-champagne hover:bg-pink-600 transition-colors"
          onClick={onNext}
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
              currentIndex === index ? 'bg-pink-500' : 'bg-white/30'
            } transition-colors`}
            onClick={() => onDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselControls;