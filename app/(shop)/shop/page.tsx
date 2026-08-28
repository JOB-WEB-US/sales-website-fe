'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/features/products/product-card';
import AdvancedProductFilter, { FilterState, INITIAL_FILTER_STATE } from '@/components/features/products/advanced-product-filter';
import { Sparkles } from 'lucide-react';
import { getProducts, getCategories, mapApiProductToUI, ApiCategory } from '@/lib/api';

function ShopContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [rawProducts, rawCategories] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        const mapped = rawProducts.map(mapApiProductToUI).filter(Boolean);
        setProducts(mapped);
        setCategories(rawCategories);
      } catch (err) {
        console.error('Failed to load shop catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Sync URL query params if any
  useEffect(() => {
    if (!searchParams) return;
    const typeParam = searchParams.get('type');
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search') || searchParams.get('q');

    if (typeParam || categoryParam || searchParam) {
      setFilters((prev) => ({
        ...prev,
        productType: typeParam ? typeParam.toLowerCase() : prev.productType,
        category: categoryParam ? categoryParam.toLowerCase() : prev.category,
        search: searchParam || prev.search,
      }));
    }
  }, [searchParams]);

  // Comprehensive Multi-faceted Filtering
  const filteredProducts = products.filter((p) => {
    // 1. Search Query
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matches = p.title.toLowerCase().includes(q) || 
                      (p.category || '').toLowerCase().includes(q) ||
                      (p.description || '').toLowerCase().includes(q);
      if (!matches) return false;
    }

    // 2. Category
    if (filters.category !== 'all') {
      const matchesCat = p.category === filters.category || 
                         (p.slug || '').includes(filters.category) ||
                         (p.categoryId && categories.find(c => c.slug === filters.category)?.id === p.categoryId);
      if (!matchesCat) return false;
    }

    // 3. Product Type
    if (filters.productType !== 'all') {
      const pt = filters.productType.toLowerCase();
      const matchesType = p.variants?.some((v: any) => (v.productType || '').toLowerCase().includes(pt)) ||
                          (p.title || '').toLowerCase().includes(pt);
      if (!matchesType) return false;
    }

    // 4. Price Range
    if (filters.priceRange !== 'all') {
      const price = p.basePrice;
      if (filters.priceRange === 'under-25' && price >= 25) return false;
      if (filters.priceRange === '25-35' && (price < 25 || price > 35)) return false;
      if (filters.priceRange === '35-50' && (price < 35 || price > 50)) return false;
      if (filters.priceRange === 'over-50' && price <= 50) return false;
    }

    // 5. Color Family
    if (filters.color !== 'all') {
      const col = filters.color.toLowerCase();
      const matchesColor = p.variants?.some((v: any) => (v.color || '').toLowerCase().includes(col));
      if (!matchesColor) return false;
    }

    // 6. Size
    if (filters.size !== 'all') {
      const sz = filters.size.toLowerCase();
      const matchesSize = p.variants?.some((v: any) => (v.size || '').toLowerCase() === sz);
      if (!matchesSize) return false;
    }

    // 7. On Sale Only
    if (filters.onlySale) {
      const isSale = p.isSale || (p.originalPrice && p.originalPrice > p.basePrice);
      if (!isSale) return false;
    }

    // 8. Minimum Rating
    if (filters.minRating > 0) {
      const rating = p.rating || 5;
      if (rating < filters.minRating) return false;
    }

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters.sortBy === 'price-low') return a.basePrice - b.basePrice;
    if (filters.sortBy === 'price-high') return b.basePrice - a.basePrice;
    if (filters.sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
    if (filters.sortBy === 'name-az') return a.title.localeCompare(b.title);
    if (filters.sortBy === 'name-za') return b.title.localeCompare(a.title);
    return 0; // 'featured' or default
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Visual Shop Hero Banner */}
      <div className="mb-10 relative overflow-hidden rounded-3xl border border-gray-200 dark:border-[#222] bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent dark:bg-[#141414] p-8 md:p-12 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ff7700]/10 text-[#c2410c] dark:text-[#ff7700] border border-[#ff7700]/30 text-[10px] font-black rounded-full mb-4 uppercase tracking-widest shadow-sm">
            <Sparkles size={13} /> Official POD Apparel Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight font-heading leading-tight mb-4">
            DISCOVER ALL <span className="text-[#ff7700]">APPAREL & MERCH</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 max-w-2xl">
            Explore hundreds of premium graphic t-shirts, cozy heavyweight hoodies, vintage sweatshirts, and trending collections tailored for comfort and durability.
          </p>
          <div className="flex flex-wrap gap-4 text-[10px] sm:text-xs text-gray-500 font-semibold border-t border-gray-200 dark:border-[#222] pt-4">
            <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">⚡ 100% Combed Ring-Spun Cotton</span>
            <span className="text-gray-300 dark:text-[#333] hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">🚚 Free Shipping On Orders $60+</span>
            <span className="text-gray-300 dark:text-[#333] hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">🛡️ 30-Day Hassle-Free Exchange</span>
          </div>
        </div>
      </div>

      {/* Advanced Multi-faceted Filter Bar */}
      <AdvancedProductFilter
        filters={filters}
        onFilterChange={setFilters}
        categories={categories}
        showCategoryPills={true}
        totalProductsCount={products.length}
        filteredCount={sortedProducts.length}
      />

      {/* Product Grid / Empty State */}
      {loading ? (
        <div className="py-24 text-center text-gray-400 text-sm flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#ff7700] border-t-transparent rounded-full animate-spin"></div>
          <span>Loading apparel catalog...</span>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#141414] rounded-3xl border border-gray-200 dark:border-[#222] p-8 shadow-sm">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">No matching products found</h3>
          <p className="text-gray-500 text-xs max-w-md mx-auto mb-6">
            We couldn't find any items matching your selected filter criteria. Try resetting or adjusting some filters.
          </p>
          <button
            onClick={() => setFilters(INITIAL_FILTER_STATE)}
            className="px-6 py-2.5 bg-[#ff7700] hover:bg-[#e06900] text-black font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            Reset All Filters ✕
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
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        Loading shop apparel...
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
