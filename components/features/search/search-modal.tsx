'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  X, 
  TrendingUp, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Flame, 
  Tag, 
  Shirt, 
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/useUIStore';
import { getProducts, getCategories, mapApiProductToUI, ApiCategory } from '@/lib/api';
import { formatCurrency } from '@/lib/formatters';

const POPULAR_TRENDS = [
  { keyword: 'Halloween Spooky', icon: '🎃', badge: 'HOT' },
  { keyword: 'Vintage Retro 90s', icon: '📻', badge: 'TRENDING' },
  { keyword: 'Horror Movie Merch', icon: '💀', badge: 'POPULAR' },
  { keyword: 'Ella Langley Country', icon: '🤠', badge: 'NEW' },
  { keyword: 'Morgan Wallen Tour', icon: '🎸', badge: 'HOT' },
  { keyword: 'Heavyweight Hoodie', icon: '🧥', badge: null },
  { keyword: 'Graphic T-Shirt', icon: '👕', badge: null },
  { keyword: 'Classic Car & Truck', icon: '🛻', badge: null },
];

const HOT_KEYWORDS = [
  'Oversized Fit',
  'Washed Cotton',
  'Tour Merch',
  'Spooky Season',
  'Retro Band Tee',
  'Fleece Hoodie',
  'Aesthetic Art',
  'Country Music',
];

export default function SearchModal() {
  const router = useRouter();
  const { isSearchOpen, closeSearch, openVariantModal } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('velora_recent_searches');
        if (saved) setRecentSearches(JSON.parse(saved));
      } catch {}
    }
  }, [isSearchOpen]);

  // Load categories for trending links
  useEffect(() => {
    if (isSearchOpen) {
      getCategories()
        .then((cats) => setCategories(cats))
        .catch(() => {});
    }
  }, [isSearchOpen]);

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

  // Live product search
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

  const handleSelectKeyword = (keyword: string) => {
    setSearchTerm(keyword);
    saveRecentSearch(keyword);
  };

  const saveRecentSearch = (keyword: string) => {
    if (!keyword.trim()) return;
    const updated = [keyword, ...recentSearches.filter((k) => k.toLowerCase() !== keyword.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('velora_recent_searches', JSON.stringify(updated));
    }
  };

  const handleRemoveRecent = (e: React.MouseEvent, keyword: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((k) => k !== keyword);
    setRecentSearches(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('velora_recent_searches', JSON.stringify(updated));
    }
  };

  const handleClearAllRecent = () => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('velora_recent_searches');
    }
  };

  const handleViewAllResults = () => {
    if (searchTerm) {
      saveRecentSearch(searchTerm);
    }
    closeSearch();
    router.push(`/shop?search=${encodeURIComponent(searchTerm)}`);
  };

  if (!isSearchOpen) return null;

  const filteredProducts = products.slice(0, 6);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-14 px-3 sm:px-6 overflow-y-auto">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSearch}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Search Container */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2a2a2a] rounded-3xl shadow-2xl overflow-hidden text-gray-900 dark:text-white z-10 my-4 max-h-[90vh] flex flex-col"
        >
          {/* Search Header Input */}
          <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-[#262626] flex items-center gap-3 bg-gray-50 dark:bg-[#181818]">
            <Search className="w-5 h-5 text-[#ff7700] flex-shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search graphic tees, hoodies, vintage, horror, tours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTerm) {
                  handleViewAllResults();
                }
              }}
              className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base font-semibold outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 text-xs font-bold uppercase transition"
              >
                Clear
              </button>
            )}
            <button
              onClick={closeSearch}
              className="p-2 rounded-xl bg-white dark:bg-[#222] hover:bg-gray-100 dark:hover:bg-[#333] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition ml-1 cursor-pointer border border-gray-200 dark:border-transparent shadow-sm"
            >
              <X size={18} />
            </button>
          </div>

          {/* =========================================================================
              TRENDING SUGGESTIONS & RECENT SEARCHES PANEL
              ========================================================================= */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* 1. Recent Searches (If Available) */}
            {recentSearches.length > 0 && !searchTerm && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={13} className="text-blue-500 dark:text-blue-400" /> Recent Searches
                  </span>
                  <button
                    onClick={handleClearAllRecent}
                    className="text-[11px] text-gray-400 hover:text-red-500 transition font-medium"
                  >
                    Clear History
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((rec) => (
                    <button
                      key={rec}
                      onClick={() => handleSelectKeyword(rec)}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-[#1e1e1e] hover:bg-gray-200 dark:hover:bg-[#282828] border border-gray-200 dark:border-[#2a2a2a] text-gray-800 dark:text-gray-200 text-xs font-semibold rounded-xl transition flex items-center gap-2 group cursor-pointer shadow-sm"
                    >
                      <Clock size={11} className="text-gray-400 dark:text-gray-500 group-hover:text-blue-500" />
                      <span>{rec}</span>
                      <span
                        onClick={(e) => handleRemoveRecent(e, rec)}
                        className="text-gray-400 hover:text-red-500 p-0.5 rounded-full"
                        title="Remove"
                      >
                        <X size={11} />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Trending Topics & Seasonal Collections */}
            {!searchTerm && (
              <div className="space-y-2.5">
                <span className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={13} className="text-[#ff7700]" /> Trending Topics & Hot Collections
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {POPULAR_TRENDS.map((t) => (
                    <button
                      key={t.keyword}
                      onClick={() => handleSelectKeyword(t.keyword)}
                      className="p-2.5 bg-gray-50 dark:bg-[#1a1a1a] hover:bg-orange-50/70 dark:hover:bg-[#ff7700]/10 border border-gray-200 dark:border-[#282828] hover:border-orange-300 dark:hover:border-[#ff7700]/40 rounded-xl transition text-left flex items-center justify-between group cursor-pointer shadow-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base shrink-0">{t.icon}</span>
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-[#c2410c] dark:group-hover:text-[#ff7700] truncate">
                          {t.keyword}
                        </span>
                      </div>
                      {t.badge && (
                        <span className="bg-[#a80000] text-white text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase scale-90 shrink-0">
                          {t.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Popular Keyword Tags Pills */}
            {!searchTerm && (
              <div className="space-y-2.5">
                <span className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag size={13} className="text-emerald-500 dark:text-emerald-400" /> Popular Keywords
                </span>
                <div className="flex flex-wrap gap-2">
                  {HOT_KEYWORDS.map((kw) => (
                    <button
                      key={kw}
                      onClick={() => handleSelectKeyword(kw)}
                      className="px-3.5 py-1.5 bg-gray-100 hover:bg-[#ff7700] hover:text-black dark:bg-[#1c1c1c] dark:hover:bg-[#ff7700] dark:hover:text-black border border-gray-200 dark:border-[#282828] hover:border-[#ff7700] text-gray-800 dark:text-gray-300 text-xs font-bold rounded-xl transition cursor-pointer shadow-sm"
                    >
                      #{kw}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================================
                SEARCH RESULTS GRID / PRODUCT RECOMMENDATIONS
                ========================================================================= */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-500 dark:text-amber-400" />
                  {searchTerm ? `Matching Products (${products.length})` : 'Featured Products For You'}
                </span>
                {searchTerm && products.length > 6 && (
                  <button
                    onClick={handleViewAllResults}
                    className="text-xs font-bold text-[#ff7700] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    See all {products.length} items <ArrowRight size={12} />
                  </button>
                )}
              </div>

              {loading ? (
                <div className="py-12 text-center text-gray-400 text-xs flex flex-col items-center gap-2">
                  <div className="w-7 h-7 border-2 border-[#ff7700] border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching catalog...</span>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-10 text-center bg-gray-50 dark:bg-[#181818] rounded-2xl border border-gray-200 dark:border-[#262626] p-6">
                  <Search size={36} className="mx-auto mb-2 opacity-30 text-[#ff7700]" />
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-300">No products found for "{searchTerm}"</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Try searching for "Halloween", "Vintage", "Hoodie" or explore trending tags above.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        saveRecentSearch(product.title);
                        closeSearch();
                        openVariantModal(product);
                      }}
                      className="flex gap-3 bg-white dark:bg-[#1a1a1a] hover:bg-orange-50/40 dark:hover:bg-[#202020] border border-gray-200 dark:border-[#282828] hover:border-orange-300 dark:hover:border-[#ff7700] p-3 rounded-2xl cursor-pointer transition group shadow-sm"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#242424] flex-shrink-0">
                        <Image
                          src={product.frontImage}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-black text-[#ff7700] uppercase tracking-wider block">
                            {product.categoryLabel || product.category}
                          </span>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#ff7700] transition">
                            {product.title}
                          </h4>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-gray-900 dark:text-white">
                              {formatCurrency(product.basePrice)}
                            </span>
                            {product.originalPrice && product.originalPrice > product.basePrice && (
                              <span className="text-[10px] text-gray-400 line-through">
                                {formatCurrency(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-amber-500 text-[10px] bg-gray-100 dark:bg-[#242424] px-1.5 py-0.5 rounded font-bold">
                            <Star size={10} fill="currentColor" />
                            <span className="ml-1 text-gray-700 dark:text-gray-200">{product.rating || 5}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Footer View All Link */}
          <div className="p-3.5 sm:p-4 border-t border-gray-200 dark:border-[#262626] bg-gray-50 dark:bg-[#121212] flex items-center justify-between text-xs">
            <span className="text-gray-500">Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#222] border border-gray-200 dark:border-[#333] rounded font-mono text-[10px] text-gray-700 dark:text-gray-300 shadow-xs">ESC</kbd> to close</span>
            <button
              onClick={handleViewAllResults}
              className="font-bold text-[#ff7700] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Browse Full Catalog <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
