'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { X, Check, ShoppingBag, Star } from 'lucide-react';
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
  const [quantity, setQuantity] = useState(1);

  // Reset state when modal opens
  useEffect(() => {
    if (selectedProductForModal) {
      const firstVariant = selectedProductForModal.variants?.find((variant) => variant.isActive !== false);
      setSelectedType(firstVariant?.productType || '');
      setSelectedSize(firstVariant?.size || '');
      setSelectedColor(firstVariant?.color || '');
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

  const handleAddToCart = () => {
    if (!matchedVariant || isOutOfStock) return;
    addToCart(product, matchedVariant, quantity);
    closeVariantModal();
    openCart(); // Automatically slide open cart drawer
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#141414] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={closeVariantModal}
          className="absolute top-3 right-3 z-10 bg-[#222] hover:bg-[#333] text-gray-300 hover:text-white p-2 rounded-full transition"
        >
          <X size={18} />
        </button>

        {/* Left Column: Product Image */}
        <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto bg-[#1e1e1e] p-6 flex items-center justify-center">
          <Image
            src={product.frontImage}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Right Column: Options Form */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto max-h-[70vh] md:max-h-[90vh]">
          <div>
            <div className="flex items-center gap-1 text-amber-400 text-xs mb-1">
              <Star size={12} fill="currentColor" />
              <span className="font-semibold text-white">{product.rating}</span>
              <span className="text-gray-400">({product.reviewCount} reviews)</span>
            </div>

            <h2 className="text-base font-bold font-heading mb-2 leading-snug">
              {product.title}
            </h2>

            {/* Price Display */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-xl font-extrabold text-[#ff7700]">
                {formatCurrency(currentPrice)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Option 1: Style */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-3">
                1. Select Style: <span className="text-white font-bold">{selectedType || 'Unavailable'}</span>
              </label>
              <div className="grid grid-cols-3 gap-2.5">
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
                      }
                      setQuantity(1);
                    }}
                    className={`py-2.5 text-xs font-bold rounded-xl border transition ${
                      selectedType === type
                        ? 'border-[#ff7700] bg-[#ff7700]/10 text-[#ff7700]'
                        : 'border-[#2a2a2a] bg-[#1e1e1e] text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Option 2: Color */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-3">
                2. Select Color: <span className="text-white font-bold">{selectedColor || 'Unavailable'}</span>
              </label>
              <div className="flex gap-3">
                {availableColors.map((colorName) => {
                  const colorHex = variantsForType.find((variant) => variant.color === colorName)?.colorHex;
                  return (
                    <button
                      key={colorName}
                      type="button"
                      onClick={() => {
                        const firstVariant = variantsForType.find((variant) => variant.color === colorName);
                        setSelectedColor(colorName);
                        if (firstVariant) setSelectedSize(firstVariant.size);
                        setQuantity(1);
                      }}
                      className={`color-swatch-pill w-9 h-9 rounded-full border-2 flex items-center justify-center transition ${
                        selectedColor === colorName ? 'border-[#ff7700] scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: colorHex || undefined }}
                      title={colorName}
                    >
                      {selectedColor === colorName && (
                        <Check size={14} className={colorName === 'White' ? 'text-black' : 'text-white'} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Option 3: Size */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase text-gray-400">
                  3. Select Size: <span className="text-white font-bold">{selectedSize || 'Out of stock'}</span>
                </label>
                <button
                  type="button"
                  onClick={openSizeGuide}
                  className="text-xs font-bold text-[#ff7700] hover:underline"
                >
                  Size Guide 📏
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {availableSizes.length > 0 ? availableSizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => {
                      setSelectedSize(sz);
                      setQuantity(1);
                    }}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      selectedSize === sz
                        ? 'border-[#a80000] bg-[#a80000] text-white'
                        : 'border-[#2a2a2a] bg-[#1e1e1e] text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    {sz}
                  </button>
                )) : (
                  <p className="col-span-6 rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs font-semibold text-red-300">
                    No sizes available — this item is currently out of stock.
                  </p>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-semibold uppercase text-gray-400">Qty:</span>
              <div className="flex items-center bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-gray-300 hover:text-white"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  disabled={isOutOfStock || quantity >= currentStock}
                  className="px-3 py-1 text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart Submit Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full bg-[#a80000] hover:bg-[#7a0000] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition duration-200 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={18} />
            <span>{isOutOfStock ? 'Out of Stock' : `Add To Cart • ${formatCurrency(currentPrice * quantity)}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
