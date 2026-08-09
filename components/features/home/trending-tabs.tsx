'use client';

import { useState } from 'react';
import ProductCard from '../products/product-card';
import { Product } from '@/types/product';
import { ApiCategory } from '@/lib/api';

interface TrendingTabsProps {
  products: Product[];
  categories?: ApiCategory[];
}

export default function TrendingTabs({ products, categories = [] }: TrendingTabsProps) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredProducts = activeTab === 'all'
    ? products
    : products.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        const slug = (p.slug || '').toLowerCase();
        const tab = activeTab.toLowerCase();
        return cat === tab || cat.includes(tab) || slug.includes(tab);
      });

  return (
    <section className="py-16 bg-[#111111] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#ff7700] uppercase tracking-wider">
            🔥 TRENDING NOW 🔥
          </h2>
          <p className="text-sm text-gray-400 mt-1">Discover What&apos;s Hot Right Now!</p>
        </div>

        {/* Dynamic Tab Buttons from Database */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-xs font-bold rounded-full transition duration-200 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#a80000] text-white shadow-lg scale-105'
                : 'bg-[#1e1e1e] text-gray-300 hover:bg-[#2a2a2a] hover:text-white border border-[#2a2a2a]'
            }`}
          >
            🔥 All Trending
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.slug)}
              className={`px-4 py-2 text-xs font-bold rounded-full transition duration-200 cursor-pointer ${
                activeTab === cat.slug
                  ? 'bg-[#a80000] text-white shadow-lg scale-105'
                  : 'bg-[#1e1e1e] text-gray-300 hover:bg-[#2a2a2a] hover:text-white border border-[#2a2a2a]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">
            No products found for this category yet.
          </div>
        )}
      </div>
    </section>
  );
}

