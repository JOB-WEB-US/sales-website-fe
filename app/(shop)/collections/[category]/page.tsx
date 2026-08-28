'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/features/products/product-card';
import AdvancedProductFilter, { FilterState, INITIAL_FILTER_STATE } from '@/components/features/products/advanced-product-filter';
import { getProducts, getCategories, mapApiProductToUI, ApiCategory } from '@/lib/api';

const CATEGORY_META: Record<string, { title: string; subtitle: string; icon: string }> = {
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
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    ...INITIAL_FILTER_STATE,
    category: rawCategory,
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [rawProducts, rawCats] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        const mapped = rawProducts.map(mapApiProductToUI).filter(Boolean);
        setProducts(mapped);
        setCategories(rawCats);
      } catch (err) {
        console.error('Failed to load collection products:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [rawCategory]);

  const matchedCat = categories.find((c) => c.slug.toLowerCase() === rawCategory);
  const categoryInfo = CATEGORY_META[rawCategory] || {
    title: matchedCat ? matchedCat.name : `${params.category.toUpperCase()} Collection`,
    subtitle: 'Explore our latest custom graphic printed apparel and merchandise.',
    icon: matchedCat?.icon || '✨',
  };

  // 1. Filter products belonging to this category
  const categoryProducts = products.filter((product) => {
    if (rawCategory === 'trending') return true;
    const cat = (product.category || '').toLowerCase();
    const catId = product.categoryId || '';
    const slug = (product.slug || '').toLowerCase();
    return (
      cat === rawCategory ||
      (matchedCat && catId === matchedCat.id) ||
      slug.includes(rawCategory)
    );
  });

  // 2. Apply Multi-faceted filters (Type, Price, Color, Size, Sale, Rating, Search)
  const filteredProducts = categoryProducts.filter((p) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matches = p.title.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
      if (!matches) return false;
    }

    if (filters.productType !== 'all') {
      const pt = filters.productType.toLowerCase();
      const matchesType = p.variants?.some((v: any) => (v.productType || '').toLowerCase().includes(pt)) ||
                          (p.title || '').toLowerCase().includes(pt);
      if (!matchesType) return false;
    }

    if (filters.priceRange !== 'all') {
      const price = p.basePrice;
      if (filters.priceRange === 'under-25' && price >= 25) return false;
      if (filters.priceRange === '25-35' && (price < 25 || price > 35)) return false;
      if (filters.priceRange === '35-50' && (price < 35 || price > 50)) return false;
      if (filters.priceRange === 'over-50' && price <= 50) return false;
    }

    if (filters.color !== 'all') {
      const col = filters.color.toLowerCase();
      const matchesColor = p.variants?.some((v: any) => (v.color || '').toLowerCase().includes(col));
      if (!matchesColor) return false;
    }

    if (filters.size !== 'all') {
      const sz = filters.size.toLowerCase();
      const matchesSize = p.variants?.some((v: any) => (v.size || '').toLowerCase() === sz);
      if (!matchesSize) return false;
    }

    if (filters.onlySale) {
      const isSale = p.isSale || (p.originalPrice && p.originalPrice > p.basePrice);
      if (!isSale) return false;
    }

    if (filters.minRating > 0) {
      const rating = p.rating || 5;
      if (rating < filters.minRating) return false;
    }

    return true;
  });

  // 3. Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters.sortBy === 'price-low') return a.basePrice - b.basePrice;
    if (filters.sortBy === 'price-high') return b.basePrice - a.basePrice;
    if (filters.sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
    if (filters.sortBy === 'name-az') return a.title.localeCompare(b.title);
    if (filters.sortBy === 'name-za') return b.title.localeCompare(a.title);
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#ff7700] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-400">Loading collection...</p>
        </div>
      </div>
    );
  }

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
              {categoryProducts.length} Items Available
            </span>
          </div>
        </div>

        {/* Advanced Multi-faceted Filter Bar */}
        <AdvancedProductFilter
          filters={filters}
          onFilterChange={setFilters}
          categories={categories}
          showCategoryPills={false}
          totalProductsCount={categoryProducts.length}
          filteredCount={sortedProducts.length}
        />

        {/* Product Grid */}
        {sortedProducts.length === 0 ? (
          <div className="py-20 text-center bg-[#141414] rounded-3xl border border-[#222] p-8">
            <p className="text-gray-400 text-sm mb-4">No items currently match your filter criteria in this collection.</p>
            <button
              onClick={() => setFilters({ ...INITIAL_FILTER_STATE, category: rawCategory })}
              className="px-6 py-2.5 bg-[#ff7700] text-black text-xs font-bold uppercase rounded-xl cursor-pointer"
            >
              Reset Filters ✕
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
