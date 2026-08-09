'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Search, X, TrendingUp, Star, ArrowRight, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/useUIStore';
import { getProducts, mapApiProductToUI } from '@/lib/api';
import { formatCurrency } from '@/lib/formatters';

const TRENDING_TAGS = [
  'Halloween',
  'Silence of the Lambs',
  'Horror',
  'Ella Langley',
  'Morgan Wallen',
  'Vintage',
];

export default function SearchModal() {
  const { isSearchOpen, closeSearch, openVariantModal } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    if (isSearchOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  useEffect(() => {
    if (!isSearchOpen) return;
    let active = true;
    setLoading(true);

    getProducts({ search: searchTerm || undefined })
      .then((raw) => {
        if (active) {
          const mapped = raw.map(mapApiProductToUI).filter(Boolean);
          setProducts(mapped);
        }
      })
      .catch((err) => console.error('Search API error:', err))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [searchTerm, isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = products.slice(0, 6);


  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 sm:px-6">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSearch}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Search Container */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-[#141414] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden text-white z-10"
        >
          {/* Search Header Input */}
          <div className="p-4 sm:p-6 border-b border-[#262626] flex items-center gap-3">
            <Search className="w-5 h-5 text-[#ff7700] flex-shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search graphic tees, hoodies, horror apparel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-500 text-base sm:text-lg font-medium outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-white p-1 text-xs font-semibold uppercase"
              >
                Clear
              </button>
            )}
            <button
              onClick={closeSearch}
              className="p-1.5 rounded-lg bg-[#222] hover:bg-[#333] text-gray-300 hover:text-white transition ml-2"
            >
              <X size={18} />
            </button>
          </div>

          {/* Trending Search Tags */}
          <div className="px-4 sm:px-6 py-3 bg-[#191919] border-b border-[#262626] flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
              <TrendingUp size={12} className="text-[#ff7700]" /> Trending:
            </span>
            {TRENDING_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchTerm(tag)}
                className="px-3 py-1 bg-[#242424] hover:bg-[#ff7700] hover:text-black text-gray-300 text-xs font-medium rounded-full transition-all flex-shrink-0"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {searchTerm ? `Search Results (${filteredProducts.length})` : 'Popular Recommendations'}
            </p>

            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <Search size={40} className="mx-auto mb-3 opacity-30 text-[#ff7700]" />
                <p className="text-sm font-semibold text-gray-300">No products found for "{searchTerm}"</p>
                <p className="text-xs text-gray-500 mt-1">Try searching for "Halloween", "Horror" or "Tees".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      closeSearch();
                      openVariantModal(product);
                    }}
                    className="flex gap-3 bg-[#1c1c1c] border border-[#2a2a2a] hover:border-[#ff7700] p-3 rounded-xl cursor-pointer transition group"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#242424] flex-shrink-0">
                      <Image
                        src={product.frontImage}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#ff7700] uppercase">
                          {product.categoryLabel}
                        </span>
                        <h4 className="text-xs font-semibold text-white line-clamp-1 group-hover:text-[#ff7700] transition">
                          {product.title}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          {formatCurrency(product.basePrice)}
                        </span>
                        <div className="flex items-center text-amber-400 text-[10px]">
                          <Star size={10} fill="currentColor" />
                          <span className="ml-0.5 font-bold text-gray-300">{product.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer View All Link */}
          <div className="p-4 border-t border-[#262626] bg-[#121212] flex items-center justify-between">
            <span className="text-xs text-gray-500">Press ESC to close</span>
            <Link
              href="/shop"
              onClick={closeSearch}
              className="text-xs font-bold text-[#ff7700] hover:underline flex items-center gap-1"
            >
              View All Catalog <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
