'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { X, Check, ShoppingBag, Star, ShieldCheck, Truck, RotateCcw, ArrowRight, Sparkles, Flame } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useCartStore } from '@/store/useCartStore';
import { ProductType } from '@/types/product';
import { formatCurrency } from '@/lib/formatters';

export default function VariantSelectorModal() {
  const { selectedProductForModal, isVariantModalOpen, closeVariantModal, openCart, openSizeGuide } = useUIStore();
  const addToCart = useCartStore((state) => state.addToCart);

  const [selectedType, setSelectedType] = useState<ProductType>('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Reset state when modal opens
  useEffect(() => {
    if (selectedProductForModal) {
      const firstVariant = selectedProductForModal.variants?.find((variant) => variant.isActive !== false);
      setSelectedType(firstVariant?.productType || '');
      setSelectedSize(firstVariant?.size || '');
      setSelectedColor(firstVariant?.color || '');
      setActiveImage(selectedProductForModal.frontImage);
      setQuantity(1);
    }
  }, [selectedProductForModal]);

  if (!isVariantModalOpen || !selectedProductForModal) return null;

  const product = selectedProductForModal;
  const activeVariants = (product.variants || []).filter((variant) => variant.isActive !== false);
  const availableTypes = Array.from(new Set(activeVariants.map((variant) => variant.productType)));
  const variantsForType = activeVariants.filter((variant) => variant.productType === selectedType);
  const availableColors = Array.from(new Set(variantsForType.map((variant) => variant.color)));
  const variantsForColor = variantsForType.filter((variant) => variant.color === selectedColor);
  const availableSizes = Array.from(new Set(variantsForColor.map((variant) => variant.size)));
  const matchedVariant = activeVariants.find(
    (variant) => variant.productType === selectedType && variant.color === selectedColor && variant.size === selectedSize
  );
  const currentPrice = matchedVariant?.price ?? product.basePrice;
  const currentStock = Number(matchedVariant?.stock ?? 0);
  const isOutOfStock = currentStock <= 0;

  // Build image list (front, back, variant images)
  const variantImages = activeVariants.map((v) => v.imageUrl).filter(Boolean) as string[];
  const imagesList = Array.from(new Set([product.frontImage, product.backImage, ...variantImages].filter(Boolean) as string[]));

  const handleAddToCart = () => {
    if (!matchedVariant || isOutOfStock) return;
    addToCart(product, matchedVariant, quantity);
    closeVariantModal();
    openCart(); // Automatically slide open cart drawer
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2a2a2a] rounded-3xl shadow-2xl overflow-hidden text-gray-900 dark:text-white flex flex-col md:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeVariantModal}
          className="absolute top-3.5 right-3.5 z-20 bg-gray-100 hover:bg-gray-200 dark:bg-[#222] dark:hover:bg-[#333] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2 rounded-full transition shadow-md cursor-pointer"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Left Column: Product Gallery & View Switcher */}
        <div className="relative w-full md:w-1/2 bg-gray-50 dark:bg-[#1a1a1a] p-4 sm:p-6 flex flex-col justify-between items-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-[#2a2a2a]">
          {/* Dynamic Sale Badge */}
          {product.isSale && (
            <div className="absolute top-3.5 left-3.5 z-10 bg-[#a80000] text-white font-black text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <span>SALE</span>
              {product.discountPercent && product.discountPercent > 0 && (
                <span>-{product.discountPercent}%</span>
              )}
            </div>
          )}

          {/* Main Image Display */}
          <div className="relative w-full aspect-square max-h-[300px] md:max-h-[340px] rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#121212] border border-gray-200 dark:border-[#262626] shadow-inner">
            <Image
              src={activeImage || product.frontImage}
              alt={product.title}
              fill
              className="object-cover transition-all duration-300"
              unoptimized
            />
          </div>

          {/* Thumbnail Strip */}
          {imagesList.length > 1 && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto w-full justify-center py-1">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImage === img
                      ? 'border-[#ff7700] ring-2 ring-[#ff7700]/30 scale-105 shadow-sm'
                      : 'border-gray-300 dark:border-[#333] opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}

          {/* Front / Back Toggle Pills */}
          {product.backImage && (
            <div className="flex items-center gap-1.5 bg-gray-200/80 dark:bg-[#222] p-1 rounded-xl mt-2 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setActiveImage(product.frontImage)}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeImage === product.frontImage
                    ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Mặt Trước
              </button>
              <button
                type="button"
                onClick={() => setActiveImage(product.backImage!)}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeImage === product.backImage
                    ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Mặt Sau
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Options Form & Purchase CTA */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-[92vh] space-y-4">
          <div className="space-y-4">
            {/* Rating & Review */}
            <div className="flex items-center gap-2.5 flex-wrap pr-10">
              <div className="flex items-center gap-1 text-amber-400 text-xs">
                <Star size={13} fill="currentColor" />
                <span className="font-extrabold text-gray-900 dark:text-white">{Number(product.rating || 5.0).toFixed(1)}</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">({product.reviewCount || 0} reviews)</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Sparkles size={12} /> In Stock
              </span>
            </div>

            {/* Product Title */}
            <h2 className="text-base sm:text-lg font-black font-heading leading-snug text-gray-900 dark:text-white pr-8">
              {product.title}
            </h2>

            {/* Price Display & Savings */}
            <div className="flex items-baseline gap-2.5 pb-2 border-b border-gray-100 dark:border-[#222]">
              <span className="text-2xl font-black text-[#ff7700] font-mono">
                {formatCurrency(currentPrice)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 dark:text-gray-500 line-through font-mono">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {product.discountPercent && product.discountPercent > 0 && (
                <span className="text-xs font-extrabold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md">
                  Save {product.discountPercent}%
                </span>
              )}
            </div>

            {/* Option 1: Style / Product Type */}
            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-600 dark:text-gray-400 mb-2">
                1. Select Style: <span className="text-gray-900 dark:text-white font-black">{selectedType || 'Unavailable'}</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {availableTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      const firstVariant = activeVariants.find((variant) => variant.productType === type);
                      setSelectedType(type);
                      if (firstVariant) {
                        setSelectedColor(firstVariant.color);
                        setSelectedSize(firstVariant.size);
                        if (firstVariant.imageUrl) setActiveImage(firstVariant.imageUrl);
                      }
                      setQuantity(1);
                    }}
                    className={`py-2 px-2.5 text-xs font-extrabold rounded-xl border transition-all cursor-pointer text-center ${
                      selectedType === type
                        ? 'border-[#ff7700] bg-[#ff7700]/10 text-[#ff7700] shadow-sm'
                        : 'border-gray-200 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Option 2: Color */}
            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-600 dark:text-gray-400 mb-2">
                2. Select Color: <span className="text-gray-900 dark:text-white font-black">{selectedColor || 'Unavailable'}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {availableColors.map((colorName) => {
                  const variant = variantsForType.find((v) => v.color === colorName);
                  const colorHex = variant?.colorHex;
                  return (
                    <button
                      key={colorName}
                      type="button"
                      onClick={() => {
                        setSelectedColor(colorName);
                        if (variant) {
                          setSelectedSize(variant.size);
                          if (variant.imageUrl) setActiveImage(variant.imageUrl);
                        }
                        setQuantity(1);
                      }}
                      className={`color-swatch-pill w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                        selectedColor === colorName
                          ? 'border-[#ff7700] ring-2 ring-[#ff7700]/40 scale-110'
                          : 'border-gray-300 dark:border-gray-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: colorHex || (colorName.toLowerCase() === 'white' ? '#ffffff' : colorName.toLowerCase() === 'black' ? '#111111' : undefined) }}
                      title={colorName}
                    >
                      {selectedColor === colorName && (
                        <Check size={14} className={colorName.toLowerCase() === 'white' ? 'text-black font-bold' : 'text-white font-bold'} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Option 3: Size & Size Guide */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold uppercase text-gray-600 dark:text-gray-400">
                  3. Select Size: <span className="text-gray-900 dark:text-white font-black">{selectedSize || 'Out of stock'}</span>
                </label>
                <button
                  type="button"
                  onClick={openSizeGuide}
                  className="text-xs font-extrabold text-[#ff7700] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Size Guide 📏
                </button>
              </div>

              <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                {availableSizes.length > 0 ? (
                  availableSizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        setSelectedSize(sz);
                        setQuantity(1);
                      }}
                      className={`py-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'border-[#a80000] bg-[#a80000] text-white shadow-md shadow-red-900/20'
                          : 'border-gray-200 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-600'
                      }`}
                    >
                      {sz}
                    </button>
                  ))
                ) : (
                  <p className="col-span-6 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-300 text-center">
                    No sizes available for this color combination.
                  </p>
                )}
              </div>
            </div>

            {/* Quantity Stepper & Stock Alarm */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-extrabold uppercase text-gray-600 dark:text-gray-400">Qty:</span>
                <div className="flex items-center bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#262626] font-bold text-sm transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-black font-mono min-w-[28px] text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    disabled={isOutOfStock || quantity >= currentStock}
                    className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#262626] font-bold text-sm transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {currentStock > 0 && currentStock <= 10 && (
                <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1 animate-pulse">
                  <Flame size={13} /> Only {currentStock} left!
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons: Add To Cart & View Details Link */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full bg-gradient-to-r from-[#a80000] to-[#8a0000] hover:from-[#ba0000] hover:to-[#9a0000] text-white font-extrabold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-red-600/20 transition-all duration-200 cursor-pointer disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:text-gray-200 disabled:cursor-not-allowed text-sm"
            >
              <ShoppingBag size={18} />
              <span>{isOutOfStock ? 'Out of Stock' : `Add To Cart • ${formatCurrency(currentPrice * quantity)}`}</span>
            </button>

            {/* View Full Product Details Link */}
            <div className="text-center">
              <Link
                href={`/products/${product.slug}`}
                onClick={closeVariantModal}
                className="text-xs font-extrabold text-gray-600 dark:text-gray-400 hover:text-[#ff7700] dark:hover:text-[#ff7700] transition inline-flex items-center gap-1.5 group"
              >
                <span>Xem Chi Tiết Đầy Đủ & Đánh Giá</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Guarantee Micro Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-[#222] text-[10px] text-gray-500 font-bold text-center">
              <div className="flex items-center justify-center gap-1">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span>300 DPI Print</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Truck size={12} className="text-blue-500" />
                <span>Fast US Ship</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <RotateCcw size={12} className="text-purple-500" />
                <span>Easy Return</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
