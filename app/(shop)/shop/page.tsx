'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/features/products/product-card';
import { Sparkles, ArrowUpDown, Search } from 'lucide-react';
import { getProducts, getCategories, mapApiProductToUI, ApiCategory } from '@/lib/api';

function ShopContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<
    'featured' | 'newest' | 'name-az' | 'name-za' | 'price-low' | 'price-high' | 'rating'
  >('featured');

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

  const rawTypeQuery = searchParams ? (searchParams.get('type') || searchParams.get('category')) : null;
  const typeQuery = rawTypeQuery ? rawTypeQuery.toLowerCase() : null;
  const isTypeFiltered = Boolean(typeQuery);

  // Filter products

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());

    if (typeQuery) {
      const matchesType = p.variants.some((v: any) => (v.productType || '').toLowerCase().includes(typeQuery)) ||
                          (p.title || '').toLowerCase().includes(typeQuery);
      if (!matchesType) return false;
    }

    const matchesCategory = category === 'all' || p.category === category || (p.slug || '').includes(category);
    return matchesSearch && matchesCategory;
  });


  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.basePrice - b.basePrice;
    if (sortBy === 'price-high') return b.basePrice - a.basePrice;
    if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
    if (sortBy === 'name-az') return a.title.localeCompare(b.title);
    if (sortBy === 'name-za') return b.title.localeCompare(a.title);
    return 0;
  });

  const getHeaderConfig = () => {
    if (typeQuery === 't-shirts') {
      return {
        title: 'PREMIUM GRAPHIC T-SHIRTS',
        subtitle: 'Shop our collection of ultra-soft graphic tees. 100% combed cotton, retail fit, and screen-printed artwork designed to stand out.',
        badge: '👕 Tees Collection',
        themeClass: 'from-[#ff7700]/10 via-[#a80000]/5 to-transparent border-[#ff7700]/20',
      };
    }
    if (typeQuery === 'hoodies') {
      return {
        title: 'HEAVYWEIGHT HOODIES & SWEATSHIRTS',
        subtitle: 'Stay warm in our premium heavy-blend fleece hoodies and classic crewneck sweatshirts. Soft-washed, pre-shrunk, and tailored for comfort.',
        badge: '🧥 Fleece & Warmwear',
        themeClass: 'from-indigo-500/10 via-purple-500/5 to-transparent border-purple-500/20',
      };
    }
    if (typeQuery === 'calendars') {
      return {
        title: 'AESTHETIC WALL CALENDARS',
        subtitle: 'Premium 12-month wall calendars featuring retro designs, high resolution vintage artwork, and heavy-stock matte paper.',
        badge: '📅 Art Calendars',
        themeClass: 'from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/20',
      };
    }
    return null;
  };

  const headerConfig = getHeaderConfig();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Dynamic Hero Header Section */}
      {headerConfig ? (
        <div className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br ${headerConfig.themeClass} p-8 md:p-12 mb-10 shadow-2xl transition duration-500`}>
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#141414] text-white border border-[#2a2a2a] text-xs font-black rounded-full mb-4 shadow">
              <Sparkles className="w-3.5 h-3.5 text-[#ff7700]" />
              {headerConfig.badge}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading leading-tight mb-4">
              {headerConfig.title}
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-1">
              {headerConfig.subtitle}
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-12 relative overflow-hidden rounded-3xl border border-[#222] bg-[#141414] p-8 md:p-12 shadow-2xl">
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/60 text-[#ff7700] border border-red-800/40 text-[10px] font-black rounded-full mb-4 uppercase tracking-widest shadow">
              🔥 Official Apparel Store
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-heading leading-tight mb-4">
              VELORA <span className="text-[#ff7700]">TEES</span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-base leading-relaxed mb-6 max-w-2xl">
              Discover unique print-on-demand graphic tees, custom hoodies, retro sweatshirts, and high-quality accessories built for ultimate comfort and durability.
            </p>
            <div className="flex flex-wrap gap-4 text-[10px] sm:text-xs text-gray-500 font-semibold border-t border-[#222] pt-6">
              <span className="flex items-center gap-1.5 text-gray-400">⚡ Premium Quality Fabric</span>
              <span className="text-[#333] hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 text-gray-400">🚚 Free Shipping Over $60</span>
              <span className="text-[#333] hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 text-gray-400">🛡️ 30-Day Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      )}

      {/* Visual Category Pills Filter Bar */}
      {!isTypeFiltered && (
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2.5 min-w-max">
            <button
              onClick={() => setCategory('all')}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition-all duration-200 cursor-pointer ${
                category === 'all'
                  ? 'bg-[#ff7700] text-black border-[#ff7700] shadow-md shadow-[#ff7700]/10 scale-[1.02]'
                  : 'bg-[#141414] text-gray-400 border-[#222] hover:text-white hover:border-[#444]'
              }`}
            >
              All Items 🛍️
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.slug)}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition-all duration-200 cursor-pointer ${
                  category === cat.slug
                    ? 'bg-[#ff7700] text-black border-[#ff7700] shadow-md shadow-[#ff7700]/10 scale-[1.02]'
                    : 'bg-[#141414] text-gray-400 border-[#222] hover:text-white hover:border-[#444]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter/Search & Sort Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-gray-100 dark:bg-[#141414] p-4 rounded-2xl border border-gray-200 dark:border-[#222] shadow">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search products by keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white text-xs px-4 py-3.5 pl-10 rounded-xl focus:outline-none focus:border-[#ff7700] transition"
          />
          <Search className="absolute left-3.5 top-3.5 text-gray-500 w-4 h-4" />
        </div>

        <div className="w-full md:w-auto flex-1 md:flex-initial min-w-[170px] flex items-center gap-2 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-800 px-3.5 py-2 rounded-xl">
          <ArrowUpDown size={14} className="text-[#ff7700]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white text-xs py-1 w-full outline-none cursor-pointer border-none font-medium"
          >
            <option value="featured">Featured</option>
            <option value="name-az">Alphabetical: A-Z</option>
            <option value="name-za">Alphabetical: Z-A</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">
          Loading products catalog...
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-[#141414] rounded-3xl border border-[#222] text-gray-400 text-sm mt-8">
          No products matched your filter criteria.
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
