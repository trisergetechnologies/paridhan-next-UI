"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { heroSlides } from "./heroData";
import HeroSlide from "./HeroSlide";

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={heroSlides[index].id}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <HeroSlide slide={heroSlides[index]} />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
