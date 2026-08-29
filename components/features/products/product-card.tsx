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
  const fallbackImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80';
  const [imgError, setImgError] = useState(false);

  const openVariantModal = useUIStore((state) => state.openVariantModal);
  
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isSaved = isInWishlist(product.id);

  // Price calculation
  const minPrice = product.basePrice;
  const maxPrice = product.variants && product.variants.length > 0
    ? Math.max(...product.variants.map((v) => v.price))
    : product.basePrice;

  const priceString = maxPrice > minPrice
    ? `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`
    : formatCurrency(minPrice);

  const displayImage = imgError
    ? fallbackImage
    : (isHovered && product.backImage ? product.backImage : (product.frontImage || fallbackImage));


  return (
    <div className="group bg-[#141414] border border-[#333] hover:border-[#ff7700] rounded-xl overflow-hidden flex flex-col justify-between transition duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#ff7700]/5">
      {/* Product Image Wrap */}
      <Link
        href={`/products/${product.slug}`}
        className="relative w-full aspect-square bg-[#1a1a1a] overflow-hidden cursor-pointer block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Dynamic SALE & Discount Badge */}
        {product.isSale && (
          <div 
            className="sale-badge absolute top-2.5 left-2.5 bg-[#a80000] font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-md z-10 flex items-center gap-1.5"
            style={{ backgroundColor: '#a80000', color: '#ffffff' }}
          >
            <span style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff', fontWeight: 900 }}>SALE</span>
            {product.discountPercent && product.discountPercent > 0 ? (
              <span 
                className="sale-discount-tag text-[10px] font-bold"
                style={{ backgroundColor: 'transparent', color: '#ffffff', WebkitTextFillColor: '#ffffff', fontWeight: 900 }}
              >
                -{product.discountPercent}%
              </span>
            ) : null}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isSaved
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105'
              : 'bg-black/40 hover:bg-black/70 text-white border border-white/10 shadow-sm'
          }`}
          title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={15} className={isSaved ? 'fill-white text-white' : 'text-white'} />
        </button>

        {/* Front & Back Images with Error Fallback */}
        <Image
          src={displayImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
          unoptimized
        />

      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex text-amber-400">
              {[...Array(Math.floor(product.rating || 5))].map((_, i) => (
                <Star key={i} size={12} fill="currentColor" />
              ))}
            </div>
            <span className="text-[11px] font-bold text-gray-300">{Number(product.rating || 5.0).toFixed(1)}</span>
            <span className="text-[11px] text-gray-500">({product.reviewCount || 0})</span>
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
            className="bg-[#a80000] hover:bg-[#7a0000] text-white p-2 rounded-lg transition flex items-center justify-center cursor-pointer"
            title="Select Size & Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>

        </div>
      </div>
    </div>
  );
}
