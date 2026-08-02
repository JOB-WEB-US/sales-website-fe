'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Filter, ArrowUpDown } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import ProductCard from '@/components/features/products/product-card';
import { ProductType } from '@/types/product';

const CATEGORY_NAMES: Record<string, { title: string; subtitle: string; icon: string }> = {
  halloween: {
    title: 'Halloween Graphic Tees & Apparel',
    subtitle: 'Spooky season graphic t-shirts, horror movie merch, and spooky costumes.',
    icon: '🎃',
  },
  horror: {
    title: 'Horror Movies & Cult Classic Collection',
    subtitle: 'Silence of the Lambs, retro slashers, and iconic 80s horror graphic tees.',
    icon: '💀',
  },
  'ella-langley': {
    title: 'Ella Langley Country Music Collection',
    subtitle: 'Official & inspired country music tour merchandise, retro graphic tees.',
    icon: '🤠',
  },
  'morgan-wallen': {
    title: 'Morgan Wallen Country Tour Merchandise',
    subtitle: 'One Thing At A Time tour tees, country music hoodies, and western graphic apparel.',
    icon: '🎸',
  },
  vintage: {
    title: 'Vintage 80s / 90s Aesthetic Collection',
    subtitle: 'Retro washed cotton tees, classic band merch, and vintage wall calendars.',
    icon: '📻',
  },
  'car-truck': {
    title: 'Car & Truck Enthusiast Apparel',
    subtitle: 'Classic muscle car graphics, vintage pickup truck tees, and mechanic gifts.',
    icon: '🛻',
  },
  trending: {
    title: 'Trending Drops & Best Sellers',
    subtitle: 'Our top selling graphic tees, hoodies, and customer favorite apparel.',
    icon: '🔥',
  },
};

export default function CategoryCollectionPage({ params }: { params: { category: string } }) {
  const router = useRouter();
  const rawCategory = params.category.toLowerCase();
  
  const categoryInfo = CATEGORY_NAMES[rawCategory] || {
    title: `${params.category.toUpperCase()} Collection`,
    subtitle: 'Explore our latest custom graphic printed apparel and merchandise.',
    icon: '✨',
  };

  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  // Filter products by category slug
  const categoryProducts = MOCK_PRODUCTS.filter((product) => {
    if (rawCategory === 'trending') return true;
    return product.category.toLowerCase() === rawCategory;
  });

  // Apply Type Filter
  const filteredProducts = categoryProducts.filter((product) => {
    if (selectedType === 'all') return true;
    return product.variants.some((v) => v.productType.toLowerCase() === selectedType.toLowerCase());
  });

  // Apply Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.basePrice - b.basePrice;
    if (sortBy === 'price-high') return b.basePrice - a.basePrice;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured default
  });

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation Stack */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="hover:text-[#ff7700] flex items-center gap-1 cursor-pointer transition font-semibold text-gray-300"
            title="Go back to previous page"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#ff7700]">Collections</Link>
          <span>/</span>
          <span className="text-[#ff7700] font-bold uppercase">{params.category}</span>
        </div>

        {/* Category Hero Header */}
        <div className="bg-[#141414] rounded-3xl border border-[#222] p-8 md:p-12 mb-10 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-4xl md:text-5xl block mb-3">{categoryInfo.icon}</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-heading tracking-tight mb-3">
              {categoryInfo.title}
            </h1>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-4">
              {categoryInfo.subtitle}
            </p>
            <span className="inline-block px-3 py-1 bg-red-950/60 text-[#ff7700] border border-red-800/40 text-xs font-bold rounded-full">
              {sortedProducts.length} Items Available
            </span>
          </div>
        </div>

        {/* Controls Bar: Type Filter & Sorting */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-[#141414] p-4 rounded-2xl border border-[#222]">
          
          {/* Apparel Type Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                selectedType === 'all' ? 'bg-[#ff7700] text-black shadow' : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#262626]'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedType('T-Shirt')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                selectedType === 'T-Shirt' ? 'bg-[#ff7700] text-black shadow' : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#262626]'
              }`}
            >
              T-Shirts
            </button>
            <button
              onClick={() => setSelectedType('Hoodie')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                selectedType === 'Hoodie' ? 'bg-[#ff7700] text-black shadow' : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#262626]'
              }`}
            >
              Hoodies
            </button>
            <button
              onClick={() => setSelectedType('Sweatshirt')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                selectedType === 'Sweatshirt' ? 'bg-[#ff7700] text-black shadow' : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#262626]'
              }`}
            >
              Sweatshirts
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs text-gray-400 self-end sm:self-auto">
            <ArrowUpDown size={14} className="text-[#ff7700]" />
            <span>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#1c1c1c] border border-[#333] text-white text-xs px-3 py-1.5 rounded-xl outline-none focus:ring-1 focus:ring-[#ff7700]"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

        </div>

        {/* Product Grid */}
        {sortedProducts.length === 0 ? (
          <div className="py-20 text-center bg-[#141414] rounded-3xl border border-[#222]">
            <p className="text-gray-400 text-sm mb-4">No items currently available in this category filter.</p>
            <button
              onClick={() => { setSelectedType('all'); setSortBy('featured'); }}
              className="px-6 py-2.5 bg-[#ff7700] text-black text-xs font-bold uppercase rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
