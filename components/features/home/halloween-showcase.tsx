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

  const halloweenProducts = products.filter((p) => p.category === 'halloween' || p.category === 'horror');

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

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-gray-400 italic mr-2">
              Patriotic spooky designs made for Halloween night
            </span>
            <button
              onClick={() => scroll('left')}
              className="bg-[#1e1e1e] hover:bg-[#ff7700] hover:text-black text-white p-2 rounded-lg transition border border-gray-800"
              title="Scroll Left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="bg-[#1e1e1e] hover:bg-[#ff7700] hover:text-black text-white p-2 rounded-lg transition border border-gray-800"
              title="Scroll Right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Product List */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-none pb-4 snap-x scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {halloweenProducts.map((product) => (
            <div key={product.id} className="min-w-[260px] max-w-[280px] flex-shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
