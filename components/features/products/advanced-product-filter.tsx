'use client';

import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  X, 
  Search, 
  ArrowUpDown, 
  Sparkles, 
  Flame, 
  Check, 
  RotateCcw,
  Tag,
  Star,
  ChevronDown
} from 'lucide-react';
import { ApiCategory } from '@/lib/api';

export interface FilterState {
  search: string;
  category: string;
  productType: string;
  priceRange: string; // 'all' | 'under-25' | '25-35' | '35-50' | 'over-50'
  color: string;
  size: string;
  onlySale: boolean;
  onlyInStock: boolean;
  minRating: number; // 0 for all, 4 for 4+ stars
  sortBy: 'featured' | 'newest' | 'price-low' | 'price-high' | 'rating' | 'name-az' | 'name-za';
}

export const INITIAL_FILTER_STATE: FilterState = {
  search: '',
  category: 'all',
  productType: 'all',
  priceRange: 'all',
  color: 'all',
  size: 'all',
  onlySale: false,
  onlyInStock: false,
  minRating: 0,
  sortBy: 'featured',
};

const COLOR_OPTIONS = [
  { name: 'All Colors', hex: 'transparent', value: 'all' },
  { name: 'Black', hex: '#111827', value: 'black' },
  { name: 'White', hex: '#f8fafc', value: 'white', border: true },
  { name: 'Navy', hex: '#1e3a8a', value: 'navy' },
  { name: 'Dark Heather / Grey', hex: '#4b5563', value: 'heather' },
  { name: 'Maroon / Red', hex: '#991b1b', value: 'red' },
  { name: 'Forest Green', hex: '#14532d', value: 'green' },
  { name: 'Sand / Beige', hex: '#d4b996', value: 'sand' },
];

const PRICE_RANGES = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under $25', value: 'under-25' },
  { label: '$25 – $35', value: '25-35' },
  { label: '$35 – $50', value: '35-50' },
  { label: 'Over $50', value: 'over-50' },
];

const SIZE_OPTIONS = ['all', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

const TYPE_OPTIONS = [
  { label: 'All Types 🛍️', value: 'all' },
  { label: 'T-Shirts 👕', value: 't-shirt' },
  { label: 'Hoodies 🧥', value: 'hoodie' },
  { label: 'Sweatshirts 🧶', value: 'sweatshirt' },
  { label: 'Long Sleeve 👔', value: 'long sleeve' },
  { label: 'Wall Calendars 📅', value: 'calendar' },
];

interface AdvancedProductFilterProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  categories?: ApiCategory[];
  showCategoryPills?: boolean;
  totalProductsCount: number;
  filteredCount: number;
}

export default function AdvancedProductFilter({
  filters,
  onFilterChange,
  categories = [],
  showCategoryPills = true,
  totalProductsCount,
  filteredCount,
}: AdvancedProductFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const update = (partial: Partial<FilterState>) => {
    onFilterChange({ ...filters, ...partial });
  };

  const handleReset = () => {
    onFilterChange({
      ...INITIAL_FILTER_STATE,
      category: showCategoryPills ? 'all' : filters.category,
    });
  };

  // Calculate active filter count
  let activeFilterCount = 0;
  if (filters.search) activeFilterCount++;
  if (filters.category !== 'all' && showCategoryPills) activeFilterCount++;
  if (filters.productType !== 'all') activeFilterCount++;
  if (filters.priceRange !== 'all') activeFilterCount++;
  if (filters.color !== 'all') activeFilterCount++;
  if (filters.size !== 'all') activeFilterCount++;
  if (filters.onlySale) activeFilterCount++;
  if (filters.onlyInStock) activeFilterCount++;
  if (filters.minRating > 0) activeFilterCount++;

  return (
    <div className="space-y-4 mb-8">
      {/* Category Pills (Optional) */}
      {showCategoryPills && categories.length > 0 && (
        <div className="overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            <button
              onClick={() => update({ category: 'all' })}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-200 cursor-pointer ${
                filters.category === 'all'
                  ? 'bg-[#ff7700] text-black border-[#ff7700] shadow-md shadow-[#ff7700]/20 font-black'
                  : 'bg-white dark:bg-[#141414] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-[#262626] hover:border-[#ff7700]/50'
              }`}
            >
              All Collections 🔥
            </button>
            {categories.map((cat) => {
              const isSelected = filters.category === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => update({ category: cat.slug })}
                  className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#ff7700] text-black border-[#ff7700] shadow-md shadow-[#ff7700]/20 font-black'
                      : 'bg-white dark:bg-[#141414] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-[#262626] hover:border-[#ff7700]/50'
                  }`}
                >
                  {cat.icon && <span>{cat.icon}</span>}
                  <span>{cat.name}</span>
                  {cat.badgeText && (
                    <span className="bg-[#a80000] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                      {cat.badgeText}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Search & Control Bar */}
      <div className="bg-white dark:bg-[#141414] p-3 sm:p-4 rounded-2xl border border-gray-200 dark:border-[#222] shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search graphic tees, hoodies, vintage, memes..."
              value={filters.search}
              onChange={(e) => update({ search: e.target.value })}
              className="w-full bg-gray-50 dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs px-4 py-3 pl-10 pr-10 rounded-xl focus:outline-none focus:border-[#ff7700] transition font-medium"
            />
            <Search className="absolute left-3.5 top-3.5 text-gray-400 w-4 h-4" />
            {filters.search && (
              <button
                onClick={() => update({ search: '' })}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-white p-0.5 rounded-full"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Action Buttons: Filter Toggle & Sort Dropdown */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            {/* Filter Drawer / Panel Toggle Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                isExpanded || activeFilterCount > 0
                  ? 'bg-amber-500/10 dark:bg-[#ff7700]/15 text-[#c2410c] dark:text-[#ff7700] border-[#ff7700]/40 shadow-sm'
                  : 'bg-gray-50 dark:bg-[#1c1c1c] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-[#ff7700] text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Sort Dropdown */}
            <div className="flex-1 md:flex-initial min-w-[170px] flex items-center gap-2 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 px-3.5 py-2.5 rounded-xl text-xs">
              <ArrowUpDown size={14} className="text-[#ff7700] shrink-0" />
              <select
                value={filters.sortBy}
                onChange={(e) => update({ sortBy: e.target.value as any })}
                className="bg-transparent text-gray-900 dark:text-white text-xs w-full outline-none cursor-pointer border-none font-bold"
              >
                <option value="featured" className="dark:bg-[#1c1c1c] text-gray-900 dark:text-white">🔥 Featured & Best Sellers</option>
                <option value="rating" className="dark:bg-[#1c1c1c] text-gray-900 dark:text-white">⭐ Highest Rated (★ 4.8+)</option>
                <option value="newest" className="dark:bg-[#1c1c1c] text-gray-900 dark:text-white">🆕 New Arrivals</option>
                <option value="price-low" className="dark:bg-[#1c1c1c] text-gray-900 dark:text-white">💲 Price: Low to High</option>
                <option value="price-high" className="dark:bg-[#1c1c1c] text-gray-900 dark:text-white">💲 Price: High to Low</option>
                <option value="name-az" className="dark:bg-[#1c1c1c] text-gray-900 dark:text-white">🔤 Alphabetical: A-Z</option>
                <option value="name-za" className="dark:bg-[#1c1c1c] text-gray-900 dark:text-white">🔤 Alphabetical: Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* =========================================================================
            EXPANDED MULTI-FACETED FILTER PANEL
            ========================================================================= */}
        {isExpanded && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* 1. Apparel Type */}
            <div className="space-y-2">
              <label className="font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider block text-[11px]">
                👕 Product Type
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TYPE_OPTIONS.map((t) => {
                  const isSel = filters.productType === t.value;
                  return (
                    <button
                      key={t.value}
                      onClick={() => update({ productType: t.value })}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                        isSel
                          ? 'bg-[#ff7700] text-black border-[#ff7700] font-bold shadow-sm'
                          : 'bg-gray-100 dark:bg-[#1c1c1c] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-400'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Price Range */}
            <div className="space-y-2">
              <label className="font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider block text-[11px]">
                💲 Price Range
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRICE_RANGES.map((pr) => {
                  const isSel = filters.priceRange === pr.value;
                  return (
                    <button
                      key={pr.value}
                      onClick={() => update({ priceRange: pr.value })}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                        isSel
                          ? 'bg-[#ff7700] text-black border-[#ff7700] font-bold shadow-sm'
                          : 'bg-gray-100 dark:bg-[#1c1c1c] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-400'
                      }`}
                    >
                      {pr.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Color Swatches */}
            <div className="space-y-2">
              <label className="font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider block text-[11px]">
                🎨 Color Family
              </label>
              <div className="flex flex-wrap gap-2 items-center">
                {COLOR_OPTIONS.map((c) => {
                  const isSel = filters.color === c.value;
                  if (c.value === 'all') {
                    return (
                      <button
                        key="all"
                        onClick={() => update({ color: 'all' })}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                          isSel
                            ? 'bg-[#ff7700] text-black border-[#ff7700]'
                            : 'bg-gray-100 dark:bg-[#1c1c1c] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800'
                        }`}
                      >
                        All
                      </button>
                    );
                  }

                  return (
                    <button
                      key={c.value}
                      onClick={() => update({ color: isSel ? 'all' : c.value })}
                      className={`w-7 h-7 rounded-full transition-all flex items-center justify-center relative cursor-pointer ${
                        isSel
                          ? 'ring-2 ring-offset-2 ring-[#ff7700] scale-110'
                          : 'hover:scale-105 opacity-85 hover:opacity-100'
                      } ${c.border ? 'border border-gray-300 dark:border-gray-600' : ''}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {isSel && (
                        <Check
                          size={13}
                          className={c.value === 'white' ? 'text-black' : 'text-white'}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Sizes & Quick Toggles */}
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider block text-[11px]">
                  📏 Size (US Standard)
                </label>
                <div className="flex flex-wrap gap-1">
                  {SIZE_OPTIONS.map((s) => {
                    const isSel = filters.size === s;
                    return (
                      <button
                        key={s}
                        onClick={() => update({ size: s })}
                        className={`min-w-[32px] px-2 py-1 rounded border text-[11px] font-bold transition cursor-pointer text-center ${
                          isSel
                            ? 'bg-[#ff7700] text-black border-[#ff7700]'
                            : 'bg-gray-100 dark:bg-[#1c1c1c] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-400'
                        }`}
                      >
                        {s === 'all' ? 'All' : s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Toggles */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-gray-300 select-none">
                  <input
                    type="checkbox"
                    checked={filters.onlySale}
                    onChange={(e) => update({ onlySale: e.target.checked })}
                    className="w-4 h-4 accent-[#ff7700] rounded cursor-pointer"
                  />
                  <span className="flex items-center gap-1 font-bold text-red-600 dark:text-red-400">
                    <Flame size={13} /> On Sale / Clearance Only
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-gray-300 select-none">
                  <input
                    type="checkbox"
                    checked={filters.minRating === 4}
                    onChange={(e) => update({ minRating: e.target.checked ? 4 : 0 })}
                    className="w-4 h-4 accent-[#ff7700] rounded cursor-pointer"
                  />
                  <span className="flex items-center gap-1 font-semibold">
                    <Star size={13} className="fill-amber-400 text-amber-400" /> 4+ Stars & Above
                  </span>
                </label>
              </div>
            </div>

          </div>
        )}

        {/* Active Filters Chips & Result Counter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs border-t border-gray-100 dark:border-gray-800/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-500 font-medium">
              Showing <strong className="text-gray-900 dark:text-white">{filteredCount}</strong> of {totalProductsCount} products
            </span>

            {/* Active Chips */}
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold text-[11px]">
                Search: "{filters.search}"
                <button onClick={() => update({ search: '' })} className="hover:text-red-500"><X size={12} /></button>
              </span>
            )}

            {filters.category !== 'all' && showCategoryPills && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-[#c2410c] dark:text-[#ff7700] font-bold text-[11px]">
                Collection: {filters.category}
                <button onClick={() => update({ category: 'all' })} className="hover:text-red-500"><X size={12} /></button>
              </span>
            )}

            {filters.productType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[11px]">
                Type: {filters.productType}
                <button onClick={() => update({ productType: 'all' })} className="hover:text-red-500"><X size={12} /></button>
              </span>
            )}

            {filters.priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                Price: {PRICE_RANGES.find(p => p.value === filters.priceRange)?.label}
                <button onClick={() => update({ priceRange: 'all' })} className="hover:text-red-500"><X size={12} /></button>
              </span>
            )}

            {filters.color !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-[11px]">
                Color: {filters.color}
                <button onClick={() => update({ color: 'all' })} className="hover:text-red-500"><X size={12} /></button>
              </span>
            )}

            {filters.size !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold text-[11px]">
                Size: {filters.size}
                <button onClick={() => update({ size: 'all' })} className="hover:text-red-500"><X size={12} /></button>
              </span>
            )}

            {filters.onlySale && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-[11px]">
                🔥 On Sale
                <button onClick={() => update({ onlySale: false })} className="hover:text-red-500"><X size={12} /></button>
              </span>
            )}

            {filters.minRating > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                ⭐ 4+ Stars
                <button onClick={() => update({ minRating: 0 })} className="hover:text-red-500"><X size={12} /></button>
              </span>
            )}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={handleReset}
              className="text-xs font-extrabold text-[#c2410c] dark:text-[#ff7700] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} /> Clear All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
