import HeroSlider from '@/components/features/home/hero-slider';
import HalloweenShowcase from '@/components/features/home/halloween-showcase';
import TrendingTabs from '@/components/features/home/trending-tabs';
import CommunityShowcase from '@/components/features/home/community-showcase';
import ProductCard from '@/components/features/products/product-card';
import { getProducts, getCategories, mapApiProductToUI } from '@/lib/api';

export const revalidate = 0; // Dynamic data

export default async function HomePage() {
  const [apiProducts, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const products = apiProducts.map(mapApiProductToUI).filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen bg-[#0b0b0b]">
      {/* Hero Banner Slider */}
      <HeroSlider />

      {/* Seasonal Halloween Showcase */}
      <HalloweenShowcase products={products} />

      {/* Trending Tabs Filter Section */}
      <TrendingTabs products={products} categories={categories} />

      {/* Community Social Proof Wall */}
      <CommunityShowcase />

      {/* All Products Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white uppercase tracking-wider">
            ALL PRODUCTS
          </h2>
          <div className="w-16 h-1 bg-[#a80000] mx-auto mt-2 rounded"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
