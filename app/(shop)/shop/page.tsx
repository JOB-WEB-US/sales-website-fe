'use client';

import { useState } from 'react';
import ProductCard from '@/components/features/products/product-card';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

export default function ShopPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-heading text-white uppercase tracking-wider">
          SHOP ALL APPAREL & GIFTS
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Explore our complete collection of custom graphic tees, hoodies, and vintage items.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-[#141414] p-4 rounded-xl border border-[#222]">
        {/* Search */}
        <input
          type="text"
          placeholder="Filter by keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-[#1e1e1e] border border-gray-800 text-white text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#ff7700]"
        />

        {/* Category Select */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-[#1e1e1e] border border-gray-800 text-white text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#ff7700]"
        >
          <option value="all">All Categories</option>
          <option value="halloween">Halloween</option>
          <option value="horror">Horror Movie</option>
          <option value="ella-langley">Ella Langley</option>
          <option value="car-truck">Car & Truck</option>
          <option value="morgan-wallen">Morgan Wallen</option>
          <option value="vintage">Vintage 80s/90s</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          No products matched your filter criteria.
        </div>
      )}
    </div>
  );
}
