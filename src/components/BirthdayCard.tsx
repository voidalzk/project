import React from "react";
import { motion } from "framer-motion";
import Carousel from "./Carousel";
import { images } from "../data/images";

const BirthdayCard: React.FC = () => {
  return (
    <motion.div
      className="w-full min-h-screen bg-background flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full max-w-2xl">
        <motion.h1
          className="font-heading text-4xl md:text-5xl text-foreground text-center mb-8 font-semibold"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Feliz Aniversário meu amor! 🎉
        </motion.h1>

        <div className="w-full h-[75vh] md:h-auto md:aspect-[9/16] bg-black/50 rounded-lg overflow-hidden">
          <Carousel images={images} />
        </div>

      </div>
    </motion.div>
  );
};

export default BirthdayCard;
