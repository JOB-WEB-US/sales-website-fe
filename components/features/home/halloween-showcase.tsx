'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../products/product-card';
import { Product } from '@/types/product';

interface HalloweenShowcaseProps {
  products: Product[];
}

export default function HalloweenShowcase({ products }: HalloweenShowcaseProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filtered = products.filter(
    (p) =>
      p.category === 'halloween' ||
      p.category === 'horror' ||
      p.slug.includes('halloween') ||
      p.slug.includes('horror') ||
      p.slug.includes('lambs') ||
      p.title.toLowerCase().includes('halloween') ||
      p.title.toLowerCase().includes('horror')
  );
  const halloweenProducts = filtered.length > 0 ? filtered : products.slice(0, 6);

  return (
    <section className="py-12 bg-[#0d0d0d] border-t border-b border-[#1e1e1e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎃</span>
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-[#ff7700] uppercase tracking-wide">
              HALLOWEEN TIME
            </h2>
            <span className="text-2xl">🎃</span>
          </div>

          <span className="text-xs text-gray-400 italic">
            Patriotic spooky designs made for Halloween night
          </span>
        </div>

        {/* Carousel Container with Flanking Buttons */}
        <div className="relative group/carousel">
          {/* Left Flank Button */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#121212]/90 hover:bg-[#ff7700] text-white hover:text-black border border-[#2a2a2a] hover:border-[#ff7700] shadow-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95"
            title="Previous Products"
            aria-label="Previous Products"
          >
            <ChevronLeft size={22} className="stroke-[2.5]" />
          </button>

          {/* Horizontal Scroll Product List */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-4 snap-x scroll-smooth px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {halloweenProducts.map((product) => (
              <div key={product.id} className="min-w-[260px] max-w-[280px] flex-shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Right Flank Button */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#121212]/90 hover:bg-[#ff7700] text-white hover:text-black border border-[#2a2a2a] hover:border-[#ff7700] shadow-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95"
            title="Next Products"
            aria-label="Next Products"
          >
            <ChevronRight size={22} className="stroke-[2.5]" />
          </button>
        </div>
      </div>
    </section>
  );
}

