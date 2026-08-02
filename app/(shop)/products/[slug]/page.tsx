'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Star, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Flame, 
  Clock, 
  Check, 
  Ruler, 
  Lock, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/formatters';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { ProductType, ProductVariant } from '@/types/product';
import ProductCard from '@/components/features/products/product-card';

const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
const COLORS = [
  { name: 'Black', hex: '#111111' },
  { name: 'Navy', hex: '#0f172a' },
  { name: 'White', hex: '#f8fafc' },
  { name: 'Dark Heather', hex: '#334155' },
];
const PRODUCT_TYPES: ProductType[] = ['T-Shirt', 'Hoodie', 'Sweatshirt'];

const COLOR_MOCK_IMAGES: Record<string, { front: string; back: string }> = {
  Black: {
    front: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    back: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
  },
  Navy: {
    front: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
    back: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
  },
  White: {
    front: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
    back: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
  },
  'Dark Heather': {
    front: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
    back: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
  },
};

const STYLE_MOCK_IMAGES: Partial<Record<ProductType, { front: string; back: string }>> = {
  'T-Shirt': {
    front: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    back: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
  },
  Hoodie: {
    front: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    back: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
  },
  Sweatshirt: {
    front: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80',
    back: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
  },
};

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const product = MOCK_PRODUCTS.find((p) => p.slug === params.slug) || MOCK_PRODUCTS[0];

  const addToCart = useCartStore((state) => state.addToCart);
  const { openCart, openSizeGuide } = useUIStore();

  // Gallery state for Front & Back
  const [currentFront, setCurrentFront] = useState(product.frontImage);
  const [currentBack, setCurrentBack] = useState(product.backImage || product.frontImage);
  const [activeImage, setActiveImage] = useState(product.frontImage);

  // Variant selection state
  const [selectedType, setSelectedType] = useState<ProductType>('T-Shirt');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  const handleSelectType = (type: ProductType) => {
    setSelectedType(type);
    const images = STYLE_MOCK_IMAGES[type];
    if (images) {
      setCurrentFront(images.front);
      setCurrentBack(images.back);
      setActiveImage(images.front);
    }
  };

  const handleSelectColor = (colorName: string) => {
    setSelectedColor(colorName);
    const images = COLOR_MOCK_IMAGES[colorName];
    if (images) {
      setCurrentFront(images.front);
      setCurrentBack(images.back);
      setActiveImage(images.front);
    }
  };

  // Accordion state
  const [openTab, setOpenTab] = useState<'desc' | 'shipping' | 'returns'>('desc');

  // Carousel states for Reviews and Related Products
  const [reviewPage, setReviewPage] = useState(0);
  const [relatedOffset, setRelatedOffset] = useState(0);

  const mockReviews = [
    {
      name: 'Marcus Vance',
      verified: true,
      rating: 5,
      title: 'Print quality is insane! Got tons of compliments.',
      text: 'The graphic print on this shirt is super crisp and vibrant. Wore it out last weekend and everyone asked where I got it. Fast shipping too!',
    },
    {
      name: 'Sarah Jenkins',
      verified: true,
      rating: 5,
      title: 'Fits true to size and ultra soft cotton!',
      text: 'Super soft 100% cotton fabric. Washed it twice already and zero shrinkage or fading on the print. Ordering another one for my brother!',
    },
    {
      name: 'David K.',
      verified: true,
      rating: 5,
      title: 'Must have for horror movie fans!',
      text: 'Great vintage wash aesthetic. Looks like an authentic 90s tour shirt. Will definitely buy more from Velora Store.',
    },
    {
      name: 'Amanda Perez',
      verified: true,
      rating: 4,
      title: 'Great quality hoodie, fast delivery!',
      text: 'Ordered the hoodie version and it is super thick and warm. Only taking 1 star off because USPS delayed delivery by 1 day, but product is 10/10.',
    },
  ];

  const otherProducts = MOCK_PRODUCTS.filter((p) => p.id !== product.id);

  // Dynamic price
  const currentPrice = selectedType === 'Hoodie'
    ? 39.99
    : selectedType === 'Sweatshirt'
    ? 34.99
    : product.basePrice;

  const currentVariant: ProductVariant = {
    id: `${product.id}-${selectedType}-${selectedColor}-${selectedSize}`,
    sku: `${product.id}-${selectedType.substring(0, 3)}-${selectedColor.substring(0, 3)}-${selectedSize}`,
    size: selectedSize,
    color: selectedColor,
    productType: selectedType,
    price: currentPrice,
    originalPrice: product.originalPrice,
    imageUrl: activeImage,
    stock: 50,
  };

  const handleAddToCart = () => {
    addToCart(product, currentVariant, quantity);
    openCart();
  };

  const handleBuyNow = () => {
    addToCart(product, currentVariant, quantity);
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Navigation Stack */}
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
          <Link href="/shop" className="text-[#ff7700] uppercase font-bold hover:underline">
            {product.categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-gray-300 truncate max-w-xs">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Preview */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-[#181818] border border-[#262626] shadow-2xl">
              <Image
                src={activeImage}
                alt={product.title}
                fill
                priority
                className="object-cover"
              />
              {product.isSale && (
                <span className="absolute top-4 left-4 bg-[#a80000] text-white font-extrabold text-xs uppercase px-3 py-1 rounded-md shadow-md">
                  SALE
                </span>
              )}
            </div>

            {/* Thumbnails (Front & Back View) */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setActiveImage(currentFront)}
                className={`relative aspect-square rounded-2xl overflow-hidden bg-[#181818] border-2 transition ${
                  activeImage === currentFront ? 'border-[#ff7700] ring-2 ring-[#ff7700]/30' : 'border-[#262626] opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={currentFront} alt="Front View" fill className="object-cover" />
                <span className="absolute bottom-2 left-2 bg-black/80 text-[10px] font-bold px-2 py-0.5 rounded text-white">
                  Front View
                </span>
              </button>

              <button
                onClick={() => setActiveImage(currentBack)}
                className={`relative aspect-square rounded-2xl overflow-hidden bg-[#181818] border-2 transition ${
                  activeImage === currentBack ? 'border-[#ff7700] ring-2 ring-[#ff7700]/30' : 'border-[#262626] opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={currentBack} alt="Back View" fill className="object-cover" />
                <span className="absolute bottom-2 left-2 bg-black/80 text-[10px] font-bold px-2 py-0.5 rounded text-white">
                  Back View
                </span>
              </button>
            </div>
          </div>

          {/* RIGHT: Product Info & Order Controls */}
          <div className="lg:col-span-6 space-y-6">
            
            <div>
              <span className="inline-block bg-red-950/60 text-[#ff7700] border border-red-800/40 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
                {product.categoryLabel}
              </span>

              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white leading-tight mb-3">
                {product.title}
              </h1>

              {/* Rating & Reviews Link */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs font-bold text-white">{product.rating}</span>
                <Link href="/pages/all-reviews" className="text-xs text-gray-400 hover:text-[#ff7700] underline">
                  ({product.reviewCount} customer reviews)
                </Link>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-extrabold text-[#ff7700]">
                  {formatCurrency(currentPrice)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
                <span className="text-xs bg-[#a80000] text-white px-2.5 py-1 rounded font-bold uppercase">
                  Save 33%
                </span>
              </div>
            </div>

            {/* Urgency Stock & Countdown Banner */}
            <div className="p-4 bg-gradient-to-r from-red-950/80 to-[#181818] border border-red-900/50 rounded-2xl space-y-2 urgency-banner">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                <Flame className="w-4 h-4 animate-bounce text-red-500" />
                <span>🔥 Only 12 items left in stock - 28 people have this in their cart!</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                <Clock className="w-3.5 h-3.5 text-[#ff7700]" />
                <span>Sale ends in: <strong className="text-white font-bold">04h 23m 12s</strong></span>
              </div>
            </div>

            {/* VARIANT CONTROLS FORM */}
            <div className="space-y-7 bg-[#141414] p-6 sm:p-8 rounded-2xl border border-[#222]">
              
              {/* Option 1: Style */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-3">
                  1. Select Style: <span className="text-white font-extrabold">{selectedType}</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {PRODUCT_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleSelectType(type)}
                      className={`py-3 text-xs font-bold rounded-xl border transition ${
                        selectedType === type
                          ? 'border-[#ff7700] bg-[#ff7700]/10 text-[#ff7700] ring-1 ring-[#ff7700]'
                          : 'border-[#2a2a2a] bg-[#1e1e1e] text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 2: Color */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-3">
                  2. Select Color: <span className="text-white font-extrabold">{selectedColor}</span>
                </label>
                <div className="flex gap-3.5">
                  {COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => handleSelectColor(c.name)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition ${
                        selectedColor === c.name ? 'border-[#ff7700] scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {selectedColor === c.name && (
                        <Check size={16} className={c.name === 'White' ? 'text-black' : 'text-white'} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Size */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase text-gray-400">
                    3. Select Size: <span className="text-white font-extrabold">{selectedSize}</span>
                  </label>
                  <button
                    type="button"
                    onClick={openSizeGuide}
                    className="text-xs font-bold text-[#ff7700] hover:underline flex items-center gap-1"
                  >
                    Size Guide 📏
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2.5">
                  {SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2.5 text-xs font-bold rounded-xl border transition ${
                        selectedSize === sz
                          ? 'border-[#a80000] bg-[#a80000] text-white'
                          : 'border-[#2a2a2a] bg-[#1e1e1e] text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase text-gray-400">Quantity:</span>
                <div className="flex items-center bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 text-gray-300 hover:text-white font-bold"
                  >
                    -
                  </button>
                  <span className="px-3.5 py-1.5 text-xs font-extrabold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-1.5 text-gray-300 hover:text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* DUAL CTA BUTTONS */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-[#a80000] hover:bg-[#7a0000] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag size={18} /> Add To Cart • {formatCurrency(currentPrice * quantity)}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-4 bg-[#ff7700] hover:bg-[#e06800] text-black font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock size={18} /> Buy It Now (Fast Checkout)
                </button>
              </div>

            </div>

            {/* EXPANDABLE ACCORDIONS */}
            <div className="space-y-3 pt-2">
              
              {/* Tab 1: Description */}
              <div className="bg-[#141414] border border-[#222] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenTab(openTab === 'desc' ? ('' as any) : 'desc')}
                  className="w-full p-4 text-left font-bold text-xs uppercase tracking-wider text-white flex items-center justify-between"
                >
                  <span>Description & Fabric Specs</span>
                  {openTab === 'desc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openTab === 'desc' && (
                  <div className="p-4 pt-0 text-xs text-gray-300 leading-relaxed border-t border-[#222]">
                    <p className="mb-2">{product.description}</p>
                    <ul className="list-disc pl-4 space-y-1 text-gray-400">
                      <li>100% Ring-Spun Cotton (Pre-shrunk fabric).</li>
                      <li>High definition DTG artwork printing.</li>
                      <li>Standard retail fit (true to size).</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Tab 2: Shipping */}
              <div className="bg-[#141414] border border-[#222] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenTab(openTab === 'shipping' ? ('' as any) : 'shipping')}
                  className="w-full p-4 text-left font-bold text-xs uppercase tracking-wider text-white flex items-center justify-between"
                >
                  <span>Shipping & Delivery Schedule</span>
                  {openTab === 'shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openTab === 'shipping' && (
                  <div className="p-4 pt-0 text-xs text-gray-300 leading-relaxed border-t border-[#222]">
                    <p>Fulfillment: 1 - 3 Business Days POD Printing.</p>
                    <p className="mt-1">Standard Shipping: 3 - 5 Business Days via USPS.</p>
                  </div>
                )}
              </div>

              {/* Tab 3: Returns */}
              <div className="bg-[#141414] border border-[#222] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenTab(openTab === 'returns' ? ('' as any) : 'returns')}
                  className="w-full p-4 text-left font-bold text-xs uppercase tracking-wider text-white flex items-center justify-between"
                >
                  <span>30-Day Guarantee & Returns</span>
                  {openTab === 'returns' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openTab === 'returns' && (
                  <div className="p-4 pt-0 text-xs text-gray-300 leading-relaxed border-t border-[#222]">
                    <p>100% Money-Back Guarantee if misprinted, defective, or damaged upon delivery!</p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* SECTION: CUSTOMER REVIEWS FOR THIS PRODUCT */}
        <div className="mt-16 pt-12 border-t border-[#222]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold font-heading text-white">Customer Reviews</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="text-sm font-bold text-white">4.9 out of 5.0</span>
                <span className="text-xs text-gray-400">({product.reviewCount} total reviews)</span>
              </div>
            </div>

            {/* Controls: Next & Back Buttons + View All */}
            <div className="flex items-center gap-3 self-start md:self-auto">
              <div className="flex items-center gap-1.5 bg-[#181818] p-1 rounded-xl border border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => setReviewPage((prev) => Math.max(0, prev - 1))}
                  disabled={reviewPage === 0}
                  className="p-2 rounded-lg bg-[#222] hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed text-white transition"
                  title="Previous Reviews"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setReviewPage((prev) => Math.min(Math.floor((mockReviews.length - 1) / 2), prev + 1))}
                  disabled={reviewPage >= Math.floor((mockReviews.length - 1) / 2)}
                  className="p-2 rounded-lg bg-[#222] hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed text-white transition"
                  title="Next Reviews"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <Link
                href="/pages/all-reviews"
                className="px-4 py-2 bg-[#1c1c1c] hover:bg-[#282828] text-white text-xs font-bold rounded-xl border border-[#333] transition"
              >
                View All →
              </Link>
            </div>
          </div>

          {/* Review List Carousel (2 per page) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {mockReviews.slice(reviewPage * 2, reviewPage * 2 + 2).map((rev, idx) => (
              <div key={idx} className="bg-[#141414] rounded-2xl border border-[#222] p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{rev.name}</span>
                    {rev.verified && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                        ✓ Verified Buyer
                      </span>
                    )}
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <h4 className="text-xs font-bold text-white">{rev.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed">{rev.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: RELATED / SIMILAR PRODUCTS */}
        <div className="mt-12 pt-12 border-t border-[#222]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#ff7700]">You May Also Like</span>
              <h2 className="text-2xl font-bold font-heading text-white mt-0.5">Similar Trending Apparel</h2>
            </div>

            {/* Controls: Next & Back Buttons */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-[#181818] p-1 rounded-xl border border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => setRelatedOffset((prev) => Math.max(0, prev - 1))}
                  disabled={relatedOffset === 0}
                  className="p-2 rounded-lg bg-[#222] hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed text-white transition"
                  title="Previous Products"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setRelatedOffset((prev) => Math.min(Math.max(0, otherProducts.length - 4), prev + 1))}
                  disabled={relatedOffset >= Math.max(0, otherProducts.length - 4)}
                  className="p-2 rounded-lg bg-[#222] hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed text-white transition"
                  title="Next Products"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <Link href="/shop" className="text-xs font-bold text-gray-400 hover:text-white transition hidden sm:inline">
                View All →
              </Link>
            </div>
          </div>

          {/* Related Products Carousel */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {otherProducts.slice(relatedOffset, relatedOffset + 4).map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
