'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Star, 
  ShoppingBag, 
  Flame, 
  Clock, 
  Check, 
  Lock, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
  Send,
  Camera,
  UploadCloud,
  ImageIcon
} from 'lucide-react';

import { formatCurrency } from '@/lib/formatters';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { ProductVariant } from '@/types/product';
import ProductCard from '@/components/features/products/product-card';
import { getProductBySlug, getProducts, createProductReview, mapApiProductToUI, ApiProduct } from '@/lib/api';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery state
  const [activeImage, setActiveImage] = useState<string>('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [isModalImageZoomed, setIsModalImageZoomed] = useState(false);
  const [modalZoomPosition, setModalZoomPosition] = useState({ x: 50, y: 50 });

  // Selection states
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Accordion state
  const [openTab, setOpenTab] = useState<'desc' | 'shipping' | 'returns'>('desc');

  // Review & Carousel states
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewPage, setReviewPage] = useState(0);
  const [relatedOffset, setRelatedOffset] = useState(0);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImage, setReviewImage] = useState<string | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleReviewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large. Please select an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveReviewImage = () => {
    setReviewImage(null);
  };

  const addToCart = useCartStore((state) => state.addToCart);
  const { openCart, openSizeGuide } = useUIStore();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const slug = decodeURIComponent(params.slug);
        const rawProduct = await getProductBySlug(slug);
        if (rawProduct) {
          const uiProduct = mapApiProductToUI(rawProduct);
          setProduct(uiProduct);
          setActiveImage(uiProduct.frontImage);
          setReviews(uiProduct.reviews || []);

          if (uiProduct.variants && uiProduct.variants.length > 0) {
            const firstActiveVariant = uiProduct.variants.find((variant: any) => variant.isActive !== false);
            setSelectedType(firstActiveVariant?.productType || '');
            setSelectedColor(firstActiveVariant?.color || '');
            setSelectedSize(firstActiveVariant?.size || '');
          }
        }

        const allRaw = await getProducts();
        const uiList = allRaw.map(mapApiProductToUI).filter((p) => p.slug !== params.slug);
        setRelatedProducts(uiList);
      } catch (e) {
        console.error('Error fetching product details:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.slug]);



  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#ff7700] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center text-white px-4">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link href="/shop" className="px-6 py-2.5 bg-[#a80000] text-white font-bold rounded-xl">
          Back to Shop
        </Link>
      </div>
    );
  }

  const imagesList = Array.from(new Set([product.frontImage, product.backImage].filter(Boolean)));

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    const currentIndex = imagesList.indexOf(activeImage);
    const prevIndex = (currentIndex - 1 + imagesList.length) % imagesList.length;
    setActiveImage(imagesList[prevIndex]);
    setIsModalImageZoomed(false);
    setModalZoomPosition({ x: 50, y: 50 });
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    const currentIndex = imagesList.indexOf(activeImage);
    const nextIndex = (currentIndex + 1) % imagesList.length;
    setActiveImage(imagesList[nextIndex]);
    setIsModalImageZoomed(false);
    setModalZoomPosition({ x: 50, y: 50 });
  };

  const updateModalZoomPosition = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setModalZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const openImageModal = () => {
    setIsModalImageZoomed(false);
    setModalZoomPosition({ x: 50, y: 50 });
    setIsZoomed(true);
  };

  const closeImageModal = () => {
    setIsZoomed(false);
    setIsModalImageZoomed(false);
    setModalZoomPosition({ x: 50, y: 50 });
  };

  // Only expose real, active combinations supplied by the API.
  const activeVariants = (product.variants || []).filter((variant: any) => variant.isActive !== false);
  const availableTypes: string[] = Array.from(new Set(activeVariants.map((variant: any) => variant.productType)));
  const variantsForType = activeVariants.filter((variant: any) => variant.productType === selectedType);
  const availableColors = Array.from(
    new Map(
      variantsForType.map((variant: any) => [
        variant.color,
        { name: variant.color, hex: variant.colorHex || undefined },
      ])
    ).values()
  ) as { name: string; hex?: string }[];
  const variantsForColor = variantsForType.filter((variant: any) => variant.color === selectedColor);
  const availableSizes: string[] = Array.from(new Set(variantsForColor.map((variant: any) => variant.size)));

  const matchedVariant = activeVariants.find(
    (v: any) => v.productType === selectedType && v.color === selectedColor && v.size === selectedSize
  );

  const currentPrice = matchedVariant ? matchedVariant.price : product.basePrice;
  const currentStock = matchedVariant ? Number(matchedVariant.stock ?? 0) : 0;
  const isOutOfStock = currentStock <= 0;
  const displayedReviewCount = reviews.length || product.reviewCount || 0;
  const displayedRating = reviews.length > 0
    ? reviews.reduce((sum: number, review: any) => sum + Number(review.rating || 0), 0) / reviews.length
    : Number(product.rating ?? 0);

  const currentVariant: ProductVariant = {
    id: matchedVariant?.id || `${product.id}-${selectedType}-${selectedColor}-${selectedSize}`,
    sku: matchedVariant?.sku || `${product.id}-${selectedType.substring(0, 3)}-${selectedColor.substring(0, 3)}-${selectedSize}`,
    size: selectedSize,
    color: selectedColor,
    productType: selectedType as any,
    price: currentPrice,
    originalPrice: matchedVariant?.originalPrice || product.originalPrice,
    imageUrl: activeImage,
    stock: currentStock,
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, currentVariant, quantity);
    openCart();
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, currentVariant, quantity);
    router.push('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    setSubmittingReview(true);
    try {
      const created = await createProductReview(product.id, {
        userName: reviewName,
        rating: reviewRating,
        comment: reviewComment,
        userAvatar: reviewImage || undefined,
      });
      setReviews([created, ...reviews]);
      setReviewSuccess(true);
      setReviewName('');
      setReviewComment('');
      setReviewImage(null);
      setTimeout(() => {
        setReviewSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="hover:text-[#ff7700] flex items-center gap-1 cursor-pointer transition font-semibold text-gray-300"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <span>/</span>
          <Link href={`/collections/${product.category}`} className="text-[#ff7700] uppercase font-bold hover:underline">
            {product.categoryLabel || product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-300 truncate max-w-xs">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-6">
            <div className="flex gap-4 items-start">
              {/* Vertical Column of Thumbnails */}
              <div className="flex flex-col gap-2.5 w-16 sm:w-20 flex-shrink-0">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square w-full rounded-xl overflow-hidden bg-[#181818] border-2 transition cursor-pointer ${
                      activeImage === img ? 'border-[#ff7700] ring-2 ring-[#ff7700]/30' : 'border-[#262626] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>

              {/* Main Preview with Navigation Arrows */}
              <div 
                onClick={openImageModal}
                className="flex-1 relative aspect-square rounded-3xl overflow-hidden bg-[#181818] border border-[#262626] shadow-2xl group/main cursor-zoom-in"
              >
                <Image
                  src={activeImage || product.frontImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80'}
                  alt={product.title}
                  fill
                  priority
                  unoptimized
                  className="object-cover"
                />

                
                {product.isSale && (
                  <span className="absolute top-4 left-4 bg-[#a80000] text-white font-extrabold text-xs uppercase px-3 py-1 rounded-md shadow-md z-10">
                    SALE
                  </span>
                )}

                {imagesList.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-[#ff7700] text-white hover:text-black flex items-center justify-center border border-gray-800 hover:border-[#ff7700] transition opacity-0 group-hover/main:opacity-100 cursor-pointer z-10"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-[#ff7700] text-white hover:text-black flex items-center justify-center border border-gray-800 hover:border-[#ff7700] transition opacity-0 group-hover/main:opacity-100 cursor-pointer z-10"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}

                <div className="absolute bottom-4 right-4 bg-black/60 p-2 rounded-full border border-gray-800 text-white opacity-0 group-hover/main:opacity-100 transition z-10">
                  <ZoomIn size={14} />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Info & Order Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="inline-block bg-red-950/60 text-[#ff7700] border border-red-800/40 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
                {product.categoryLabel || product.category}
              </span>

              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white leading-tight mb-3">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.round(displayedRating) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span className="text-xs font-bold text-white">{displayedRating.toFixed(1)}</span>
                <a href="#reviews" className="text-xs text-gray-400 hover:text-[#ff7700] underline">
                  ({displayedReviewCount} customer reviews)
                </a>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-extrabold text-[#ff7700]">
                  {formatCurrency(currentPrice)}
                </span>
                {(matchedVariant?.originalPrice || product.originalPrice) && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(matchedVariant?.originalPrice || product.originalPrice)}
                  </span>
                )}
                {(() => {
                  const activeOrig = matchedVariant?.originalPrice || product.originalPrice;
                  const discount = (activeOrig && activeOrig > currentPrice)
                    ? Math.round(((activeOrig - currentPrice) / activeOrig) * 100)
                    : (product.discountPercent || 0);
                  return discount > 0 ? (
                    <span className="text-xs bg-[#a80000] text-white px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
                      SAVE {discount}%
                    </span>
                  ) : null;
                })()}
              </div>

            </div>

            {/* Urgency Stock Banner */}
            <div className={`p-4 bg-gradient-to-r from-red-950/80 to-[#181818] border rounded-2xl space-y-2 ${isOutOfStock ? 'border-gray-700' : 'border-red-900/50'}`}>
              <div className={`flex items-center gap-2 text-xs font-bold ${isOutOfStock ? 'text-gray-300' : 'text-red-400'}`}>
                <Flame className={`w-4 h-4 ${isOutOfStock ? 'text-gray-500' : 'animate-bounce text-red-500'}`} />
                <span>
                  {isOutOfStock
                    ? 'Out of Stock — Please select another available variant.'
                    : `🔥 Only ${currentStock} items left in stock - In high demand!`}
                </span>
              </div>
              {!isOutOfStock && <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                <Clock className="w-3.5 h-3.5 text-[#ff7700]" />
                <span>Fast dispatch in 24 hours</span>
              </div>}
            </div>

            {/* VARIANT CONTROLS FORM */}
            <div className="space-y-7 bg-[#141414] p-6 sm:p-8 rounded-2xl border border-[#222]">
              
              {/* 1. Select Style */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-3">
                  1. Select Style: <span className="text-white font-extrabold">{selectedType || 'Unavailable'}</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {availableTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        const firstVariant = activeVariants.find((variant: any) => variant.productType === type);
                        setSelectedType(type);
                        setSelectedColor(firstVariant?.color || '');
                        setSelectedSize(firstVariant?.size || '');
                        setQuantity(1);
                      }}
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

              {/* 2. Select Color */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-3">
                  2. Select Color: <span className="text-white font-extrabold">{selectedColor || 'Unavailable'}</span>
                </label>
                <div className="flex flex-wrap gap-3.5">
                  {availableColors.map((colorOption) => {
                    const colorName = colorOption.name;
                    return (
                      <button
                        key={colorName}
                        type="button"
                        onClick={() => {
                          const firstVariant = variantsForType.find((variant: any) => variant.color === colorName);
                          setSelectedColor(colorName);
                          setSelectedSize(firstVariant?.size || '');
                          setQuantity(1);
                        }}
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition shadow-sm ${
                          selectedColor === colorName 
                            ? 'border-[#ff7700] ring-2 ring-[#ff7700]/30 scale-110' 
                            : 'border-gray-700 hover:scale-105'
                        }`}
                        style={{ backgroundColor: colorOption.hex }}
                        title={colorName}
                      >
                        {selectedColor === colorName && (
                          <Check size={16} className={colorName === 'White' ? 'text-black' : 'text-white'} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Select Size */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase text-gray-400">
                    3. Select Size: <span className="text-white font-extrabold">{selectedSize || 'Out of stock'}</span>
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
                  {availableSizes.length > 0 ? availableSizes.map((sz) => (
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
                  )) : (
                    <p className="col-span-6 rounded-xl border border-red-900/50 bg-red-950/30 px-3 py-2.5 text-xs font-semibold text-red-300">
                      No sizes available — this item is currently out of stock.
                    </p>
                  )}
                </div>
              </div>

              {/* Quantity */}
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
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    disabled={isOutOfStock || quantity >= currentStock}
                    className="px-3.5 py-1.5 text-gray-300 hover:text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed"
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
                  disabled={isOutOfStock}
                  className="w-full py-4 bg-[#a80000] hover:bg-[#7a0000] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={18} /> {isOutOfStock ? 'Out of Stock' : `Add To Cart • ${formatCurrency(currentPrice * quantity)}`}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full py-4 bg-[#ff7700] hover:bg-[#e06800] text-black font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  <Lock size={18} /> Buy It Now (Fast Checkout)
                </button>
              </div>

            </div>

            {/* EXPANDABLE ACCORDIONS */}
            <div className="space-y-3 pt-2">
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
                    <p className="mb-2">{product.description || 'High definition DTG print on 100% premium ring-spun cotton.'}</p>
                    <ul className="list-disc pl-4 space-y-1 text-gray-400">
                      <li>100% Ring-Spun Cotton (Pre-shrunk fabric).</li>
                      <li>High definition DTG artwork printing with long-lasting inks.</li>
                      <li>Standard retail fit (true to size).</li>
                    </ul>
                  </div>
                )}
              </div>

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

        {/* SECTION: CUSTOMER REVIEWS */}
        <div id="reviews" className="mt-16 pt-12 border-t border-[#222]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold font-heading text-white">Customer Reviews</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.round(displayedRating) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span className="text-sm font-bold text-white">{displayedRating.toFixed(1)} out of 5.0</span>
                <span className="text-xs text-gray-400">({displayedReviewCount} reviews)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-[#181818] p-1 rounded-xl border border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => setReviewPage((prev) => Math.max(0, prev - 1))}
                  disabled={reviewPage === 0}
                  className="p-2 rounded-lg bg-[#222] hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed text-white transition"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setReviewPage((prev) => Math.min(Math.floor((reviews.length - 1) / 2), prev + 1))}
                  disabled={reviewPage >= Math.floor((reviews.length - 1) / 2)}
                  className="p-2 rounded-lg bg-[#222] hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed text-white transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <Link
                href="/pages/all-reviews"
                className="px-4 py-2 bg-[#1c1c1c] hover:bg-[#282828] text-white text-xs font-bold rounded-xl border border-[#333] transition"
              >
                All Reviews →
              </Link>
            </div>
          </div>

          {/* Review form is always visible for direct submission */}
            <form onSubmit={handleReviewSubmit} className="w-full bg-[#141414] p-6 rounded-2xl border border-[#333] mb-8 space-y-4">
              <h3 className="font-bold text-sm text-white">Write a Review for {product.title}</h3>
              {reviewSuccess && (
                <div className="p-3 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl text-xs">
                  ✅ Thank you! Your review has been submitted.
                </div>
              )}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Your Name</label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#ff7700] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-400"
                    >
                      <Star size={20} fill={star <= reviewRating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Your Review</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  placeholder="Tell us what you think about the print quality, cotton fabric, and fit..."
                  required
                  className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#ff7700] outline-none"
                ></textarea>
              </div>

              {/* Photo Upload Attachment */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 flex items-center gap-1.5 font-bold">
                  <Camera size={14} className="text-[#ff7700]" /> Attach Product Photo (Optional)
                </label>

                {!reviewImage ? (
                  <label className="border-2 border-dashed border-[#333] hover:border-[#ff7700] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#181818]/60 hover:bg-[#181818] transition group">
                    <div className="w-10 h-10 rounded-full bg-[#222] group-hover:bg-[#ff7700]/20 flex items-center justify-center text-gray-400 group-hover:text-[#ff7700] transition">
                      <Camera size={20} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-gray-200">
                        Click or drag to upload customer photo
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReviewImageUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#181818] border-2 border-[#ff7700] group">
                    <Image
                      src={reviewImage}
                      alt="Customer review preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveReviewImage}
                      className="absolute top-1 right-1 p-1 bg-black/80 hover:bg-red-600 text-white rounded-full transition cursor-pointer"
                      title="Remove image"
                    >
                      <X size={12} />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/80 py-0.5 text-center text-[8px] font-bold text-emerald-400">
                      ✓ Attached
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2.5 bg-[#a80000] hover:bg-[#800000] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Send size={14} /> {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>

          {/* Review List Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {reviews.length > 0 ? (
              reviews.slice(reviewPage * 2, reviewPage * 2 + 2).map((rev, idx) => (
                <div key={idx} className="bg-[#141414] rounded-2xl border border-[#222] p-5 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{rev.userName || rev.name}</span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                        ✓ Verified Buyer
                      </span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{rev.comment}</p>

                  {/* Review Photo Attachment */}
                  {(rev.userAvatar || rev.image) && (
                    <div className="pt-2">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#1c1c1c] border border-[#2a2a2a] group cursor-pointer hover:border-[#ff7700] transition">
                        <Image
                          src={rev.userAvatar || rev.image}
                          alt={`${rev.userName || 'Customer'} review photo`}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <ZoomIn size={16} className="text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-2 py-8 text-center text-gray-500 text-xs">
                No reviews yet. Be the first to review this product!
              </div>
            )}
          </div>
        </div>


        {/* SECTION: RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 pt-12 border-t border-[#222]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#ff7700]">You May Also Like</span>
                <h2 className="text-2xl font-bold font-heading text-white mt-0.5">Similar Trending Apparel</h2>
              </div>

              <Link href="/shop" className="text-xs font-bold text-gray-400 hover:text-white transition hidden sm:inline">
                View All →
              </Link>
            </div>

            {/* Products Container with Flanking 2-Sided Buttons */}
            <div className="relative group/related">
              {/* Left Flank Button */}
              <button
                type="button"
                onClick={() => setRelatedOffset((prev) => Math.max(0, prev - 1))}
                disabled={relatedOffset === 0}
                className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#121212]/90 hover:bg-[#ff7700] text-white hover:text-black border border-[#2a2a2a] hover:border-[#ff7700] shadow-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-[#121212]/90 disabled:hover:text-white"
                title="Previous Products"
                aria-label="Previous Products"
              >
                <ChevronLeft size={22} className="stroke-[2.5]" />
              </button>

              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.slice(relatedOffset, relatedOffset + 4).map((relProduct) => (
                  <ProductCard key={relProduct.id} product={relProduct} />
                ))}
              </div>

              {/* Right Flank Button */}
              <button
                type="button"
                onClick={() => setRelatedOffset((prev) => Math.min(Math.max(0, relatedProducts.length - 4), prev + 1))}
                disabled={relatedOffset >= Math.max(0, relatedProducts.length - 4)}
                className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#121212]/90 hover:bg-[#ff7700] text-white hover:text-black border border-[#2a2a2a] hover:border-[#ff7700] shadow-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-[#121212]/90 disabled:hover:text-white"
                title="Next Products"
                aria-label="Next Products"
              >
                <ChevronRight size={22} className="stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}


      </div>

      {/* Fullscreen Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 sm:p-8 animate-fade-in"
          onClick={closeImageModal}
        >
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-white bg-[#1a1a1a]/60 hover:bg-[#1a1a1a] p-2.5 rounded-full border border-gray-800 transition z-10 cursor-pointer"
          >
            <X size={20} />
          </button>

          <div className="hidden sm:block h-6" />

          <div className="relative flex-1 w-full max-w-4xl flex items-center justify-center">
            {imagesList.length > 1 && (
              <button
                onClick={handlePrevImage}
                className="absolute left-2 sm:left-4 p-3 rounded-full bg-[#1a1a1a]/60 hover:bg-[#ff7700] text-white border border-gray-800 hover:border-[#ff7700] hover:text-black transition z-10 cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div
              className={`relative max-h-[70vh] aspect-square w-full max-w-2xl overflow-hidden rounded-xl bg-black ${isModalImageZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              onMouseMove={(event) => {
                if (isModalImageZoomed) updateModalZoomPosition(event);
              }}
              onClick={(event) => {
                event.stopPropagation();
                updateModalZoomPosition(event);
                setIsModalImageZoomed((current) => !current);
              }}
              title={isModalImageZoomed ? 'Click to zoom out' : 'Click to zoom in'}
            >
              <Image
                src={activeImage}
                alt={product.title}
                fill
                className="object-contain transition-transform duration-200 ease-out"
                style={{
                  transformOrigin: `${modalZoomPosition.x}% ${modalZoomPosition.y}%`,
                  transform: isModalImageZoomed ? 'scale(2.2)' : 'scale(1)',
                }}
              />
            </div>

            {imagesList.length > 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-2 sm:right-4 p-3 rounded-full bg-[#1a1a1a]/60 hover:bg-[#ff7700] text-white border border-gray-800 hover:border-[#ff7700] hover:text-black transition z-10 cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          <div 
            className="flex items-center gap-3 mt-6 pb-2"
            onClick={(e) => e.stopPropagation()}
          >
            {imagesList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveImage(img);
                  setIsModalImageZoomed(false);
                  setModalZoomPosition({ x: 50, y: 50 });
                }}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-[#181818] border-2 transition cursor-pointer ${
                  activeImage === img ? 'border-[#ff7700] ring-2 ring-[#ff7700]/30' : 'border-[#262626] opacity-60 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`Zoom Thumbnail ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
