import React from "react";
import { motion } from "framer-motion";
import { ImageData } from "../data/images";

interface CarouselItemProps {
  image: ImageData;
  isActive: boolean;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ image, isActive }) => {
  return (
    <motion.div
      className={`flex-shrink-0 w-full h-full flex flex-col items-center justify-center px-4 ${
        isActive ? "opacity-100" : "opacity-0"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="font-dancing text-3xl md:text-4xl text-champagne mb-6 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: isActive ? 0 : -20, opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {image.messageAbove}
      </motion.h2>

      <motion.div
        className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-2xl mb-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: isActive ? 1 : 0.9, opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.7 }}
      >
        <img
          src={image.src}
          alt="Romantic moment"
          className="w-full h-auto object-cover aspect-[9/16] select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      </motion.div>

      <motion.p
        className="font-nunito text-lg md:text-xl text-pink-300 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        {image.messageBelow}
      </motion.p>
    </motion.div>
  );
};

export default CarouselItem;
