'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: 'HALLOWEEN COLLECTION 2026',
    subtitle: 'Patriotic & Spooky Designs Made For Halloween Night',
    image: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=1600&q=80',
    buttonText: 'Shop Halloween Now',
    link: '/collections/halloween',
  },
  {
    id: 2,
    title: 'TRENDING VINTAGE GRAPHIC TEES',
    subtitle: 'Exclusive 80s & 90s Pop-Culture & Horror Movie Apparel',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1600&q=80',
    buttonText: 'Explore Trending',
    link: '/collections/trending',
  },
  {
    id: 3,
    title: 'PATRIOTIC & AUTUMN SPECIALS',
    subtitle: 'Bold & Fearless Designs Built For Everyday Heroes',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1600&q=80',
    buttonText: 'Discover Specials',
    link: '/shop',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative w-full h-[65vh] min-h-[420px] max-h-[600px] overflow-hidden bg-gray-100 dark:bg-black hero-slider-section">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={SLIDES[current].image}
            alt={SLIDES[current].title}
            fill
            priority
            unoptimized
            className="object-cover brightness-125 contrast-105 dark:brightness-50 transition-all duration-500"
          />


          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/10 dark:bg-gradient-to-t dark:from-black/80 dark:to-black/30 transition-all duration-500">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold !text-white tracking-tight font-heading max-w-4xl text-white-force drop-shadow-lg"
            >
              {SLIDES[current].title}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg !text-gray-100 mt-3 max-w-2xl italic text-white-force drop-shadow-md font-medium"
            >
              {SLIDES[current].subtitle}
            </motion.p>

            <motion.a
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              href={SLIDES[current].link}
              className="mt-6 bg-[#a80000] hover:bg-[#7a0000] !text-white font-bold px-8 py-3.5 rounded-xl shadow-xl transition transform hover:scale-105"
            >
              {SLIDES[current].buttonText}
            </motion.a>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Navigation Buttons */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/80 text-white p-2.5 rounded-full transition z-20 backdrop-blur border border-white/10 cursor-pointer"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/80 text-white p-2.5 rounded-full transition z-20 backdrop-blur border border-white/10 cursor-pointer"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dynamic Slide Indicators (Dots) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center z-20">
        {/* Indicator Dots */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/15 shadow-xl">
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                current === idx
                  ? 'w-7 bg-[#ff7700] shadow-[0_0_10px_rgba(255,119,0,0.8)]'
                  : 'w-2.5 bg-white/40 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

