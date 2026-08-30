'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSlide {
  id: string | number;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  image?: string;
  buttonText: string;
  linkUrl?: string;
  link?: string;
}

const DEFAULT_SLIDES: BannerSlide[] = [
  {
    id: 1,
    title: 'HALLOWEEN COLLECTION 2026',
    subtitle: 'Patriotic & Spooky Designs Made For Halloween Night',
    imageUrl: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=1600&q=80',
    buttonText: 'Shop Halloween Now',
    linkUrl: '/collections/halloween',
  },
  {
    id: 2,
    title: 'VINTAGE & RETRO MERCH',
    subtitle: 'Classic 90s & 80s Aesthetics Printed on 100% Heavy Cotton',
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1600&q=80',
    buttonText: 'Explore Vintage',
    linkUrl: '/shop',
  },
  {
    id: 3,
    title: 'TRENDING HOODIES & SWEATSHIRTS',
    subtitle: 'Cozy, Warm, and Stylized Graphic Drops for the Season',
    imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1600&q=80',
    buttonText: 'Discover Specials',
    linkUrl: '/shop',
  },
];

import { API_BASE_URL } from '@/lib/api';

export default function HeroSlider() {
  const [slides, setSlides] = useState<BannerSlide[]>(DEFAULT_SLIDES);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE_URL}/banners`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setSlides(data.data);
        }
      })
      .catch((err) => {
        console.warn('Could not load dynamic banners, using default slides');
      });
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // Mobile Touch Swipe Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <section 
      className="relative w-full h-[55vh] sm:h-[65vh] min-h-[380px] sm:min-h-[420px] max-h-[600px] overflow-hidden bg-gray-100 dark:bg-black hero-slider-section select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => {
        const isCurrent = index === current;
        const img = slide.imageUrl || slide.image || DEFAULT_SLIDES[0].imageUrl!;
        const link = slide.linkUrl || slide.link || '/shop';

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
              isCurrent ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 pointer-events-none z-0'
            }`}
          >
            <Image
              src={img}
              alt={slide.title}
              fill
              priority={index === 0}
              unoptimized
              className="object-cover brightness-110 contrast-105 dark:brightness-50 transition-all duration-500"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 py-8 sm:p-12 bg-black/25 dark:bg-gradient-to-t dark:from-black/80 dark:to-black/30 transition-all duration-500">
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold !text-white tracking-tight font-heading max-w-4xl text-white-force drop-shadow-lg uppercase transition-transform duration-500 leading-tight">
                {slide.title}
              </h1>

              {slide.subtitle && (
                <p className="text-xs sm:text-base md:text-lg !text-gray-100 mt-2 sm:mt-3 max-w-2xl italic text-white-force drop-shadow-md font-medium px-2">
                  {slide.subtitle}
                </p>
              )}

              <Link
                href={link}
                className="mt-4 sm:mt-6 bg-[#a80000] hover:bg-[#7a0000] !text-white font-bold px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-xl shadow-xl transition transform hover:scale-105 text-xs sm:text-base"
              >
                {slide.buttonText || 'Shop Now'}
              </Link>
            </div>
          </div>
        );
      })}

      {/* Slide Navigation Buttons (Hidden on mobile to avoid overlapping text, visible on sm and desktop) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="hidden sm:flex items-center justify-center absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2.5 sm:p-3 rounded-full transition z-20 backdrop-blur-md border border-white/15 cursor-pointer shadow-lg hover:scale-105"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="hidden sm:flex items-center justify-center absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2.5 sm:p-3 rounded-full transition z-20 backdrop-blur-md border border-white/15 cursor-pointer shadow-lg hover:scale-105"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Dynamic Slide Indicators (Dots) */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center z-20">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-md px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-white/15 shadow-xl">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  current === idx
                    ? 'w-6 sm:w-7 bg-[#ff7700] shadow-[0_0_10px_rgba(255,119,0,0.8)]'
                    : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

