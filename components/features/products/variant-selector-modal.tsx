'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { X, Check, ShoppingBag, Star } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useCartStore } from '@/store/useCartStore';
import { ProductVariant, ProductType } from '@/types/product';
import { formatCurrency } from '@/lib/formatters';

const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
const COLORS = [
  { name: 'Black', hex: '#111111' },
  { name: 'Navy', hex: '#0f172a' },
  { name: 'White', hex: '#f8fafc' },
  { name: 'Dark Heather', hex: '#334155' },
];
const PRODUCT_TYPES: ProductType[] = ['T-Shirt', 'Hoodie', 'Sweatshirt'];

export default function VariantSelectorModal() {
  const { selectedProductForModal, isVariantModalOpen, closeVariantModal, openCart, openSizeGuide } = useUIStore();
  const addToCart = useCartStore((state) => state.addToCart);

  const [selectedType, setSelectedType] = useState<ProductType>('T-Shirt');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [quantity, setQuantity] = useState(1);

  // Reset state when modal opens
  useEffect(() => {
    if (selectedProductForModal) {
      setSelectedType('T-Shirt');
      setSelectedSize('M');
      setSelectedColor('Black');
      setQuantity(1);
    }
  }, [selectedProductForModal]);

  if (!isVariantModalOpen || !selectedProductForModal) return null;

  const product = selectedProductForModal;

  // Find matching variant or create a dynamic variant
  const currentPrice = selectedType === 'Hoodie'
    ? 39.99
    : selectedType === 'Sweatshirt'
    ? 34.99
    : product.basePrice;

  const handleAddToCart = () => {
    const matchedVariant: ProductVariant = {
      id: `${product.id}-${selectedType}-${selectedColor}-${selectedSize}`,
      sku: `${product.id}-${selectedType.substring(0, 3)}-${selectedColor.substring(0, 3)}-${selectedSize}`,
      size: selectedSize,
      color: selectedColor,
      productType: selectedType,
      price: currentPrice,
      originalPrice: product.originalPrice,
      stock: 50,
    };

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
                1. Select Style: <span className="text-white font-bold">{selectedType}</span>
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {PRODUCT_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
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
                2. Select Color: <span className="text-white font-bold">{selectedColor}</span>
              </label>
              <div className="flex gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition ${
                      selectedColor === c.name ? 'border-[#ff7700] scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor === c.name && (
                      <Check size={14} className={c.name === 'White' ? 'text-black' : 'text-white'} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Option 3: Size */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase text-gray-400">
                  3. Select Size: <span className="text-white font-bold">{selectedSize}</span>
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
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
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
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-gray-300 hover:text-white"
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
            className="w-full bg-[#a80000] hover:bg-[#7a0000] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition duration-200"
          >
            <ShoppingBag size={18} />
            <span>Add To Cart • {formatCurrency(currentPrice * quantity)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
