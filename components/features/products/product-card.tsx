'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types/product';
import { useUIStore } from '@/store/useUIStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatCurrency } from '@/lib/formatters';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const openVariantModal = useUIStore((state) => state.openVariantModal);
  
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isSaved = isInWishlist(product.id);

  // Price calculation
  const minPrice = product.basePrice;
  const maxPrice = product.variants.length > 0
    ? Math.max(...product.variants.map((v) => v.price))
    : product.basePrice;

  const priceString = maxPrice > minPrice
    ? `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`
    : formatCurrency(minPrice);

  return (
    <div className="group bg-[#141414] border border-[#222] rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#ff7700]/50 transition duration-300 shadow-lg">
      {/* Product Image Wrap */}
      <Link
        href={`/products/${product.slug}`}
        className="relative w-full aspect-square bg-[#1a1a1a] overflow-hidden cursor-pointer block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* SALE Badge */}
        {product.isSale && (
          <span className="absolute top-2.5 left-2.5 bg-[#a80000] text-white font-extrabold text-[10px] uppercase px-2 py-0.5 rounded shadow z-10">
            SALE
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full transition z-10 ${
            isSaved
              ? 'bg-red-950 text-red-500 border border-red-800'
              : 'bg-[#000]/60 hover:bg-[#000] text-white'
          }`}
          title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={16} className={isSaved ? 'fill-red-500 text-red-500' : ''} />
        </button>

        {/* Front & Back Images */}
        <Image
          src={isHovered && product.backImage ? product.backImage : product.frontImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="currentColor" />
              ))}
            </div>
            <span className="text-[11px] text-gray-400">({product.reviewCount})</span>
          </div>

          {/* Title */}
          <Link
            href={`/products/${product.slug}`}
            className="text-sm font-semibold text-white line-clamp-2 hover:text-[#ff7700] transition cursor-pointer mb-2 block"
          >
            {product.title}
          </Link>
        </div>

        {/* Price & Add To Cart Action */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#222]">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#ff7700]">{priceString}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={() => openVariantModal(product)}
            className="bg-[#a80000] hover:bg-[#7a0000] text-white p-2 rounded-lg transition flex items-center justify-center"
            title="Select Size & Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
