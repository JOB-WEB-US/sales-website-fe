'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useUIStore } from '@/store/useUIStore';
import { formatCurrency } from '@/lib/formatters';

export default function WishlistDrawer() {
  const { items, isWishlistOpen, closeWishlist, removeFromWishlist } = useWishlistStore();
  const openVariantModal = useUIStore((state) => state.openVariantModal);

  if (!isWishlistOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeWishlist}
          className="absolute inset-0"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-white dark:bg-[#141414] border-l border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white h-full flex flex-col shadow-2xl z-10 transition-colors"
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-gray-200 dark:border-[#262626] flex items-center justify-between bg-gray-50/90 dark:bg-[#181818] transition-colors">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <h2 className="text-base font-extrabold font-heading uppercase tracking-wider text-gray-900 dark:text-white">
                My Saved Wishlist ({items.length})
              </h2>
            </div>
            <button
              onClick={closeWishlist}
              className="p-1.5 rounded-lg bg-gray-200 dark:bg-[#222] hover:bg-gray-300 dark:hover:bg-[#333] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-white dark:bg-[#141414] transition-colors">
            {items.length === 0 ? (
              <div className="py-20 text-center text-gray-500 dark:text-gray-400">
                <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-[#1c1c1c] border border-red-200/60 dark:border-[#282828] flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Heart size={32} className="text-red-500 fill-red-500/20" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Your wishlist is empty</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Save items you love by clicking the heart icon on any product!</p>
                <button
                  onClick={closeWishlist}
                  className="px-6 py-2.5 bg-[#a80000] hover:bg-[#7a0000] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2a2a2a] rounded-2xl relative group shadow-sm transition"
                >
                  {/* Image */}
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={closeWishlist}
                    className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-200 dark:bg-[#222] flex-shrink-0 border border-gray-200 dark:border-[#333]"
                  >
                    <Image src={product.frontImage} alt={product.title} fill className="object-cover" />
                  </Link>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={closeWishlist}
                        className="text-xs font-bold text-gray-900 dark:text-white hover:text-[#ff7700] transition line-clamp-1 block"
                      >
                        {product.title}
                      </Link>
                      <span className="text-xs font-extrabold text-[#c2410c] dark:text-[#ff7700] mt-0.5 block">
                        {formatCurrency(product.basePrice)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          closeWishlist();
                          openVariantModal(product);
                        }}
                        className="px-3 py-1.5 bg-[#a80000] hover:bg-[#7a0000] text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <ShoppingBag size={12} /> Select Size
                      </button>

                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-200 dark:hover:bg-[#252525] transition cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-gray-200 dark:border-[#262626] bg-gray-50/90 dark:bg-[#181818] transition-colors">
              <Link
                href="/shop"
                onClick={closeWishlist}
                className="w-full py-3 bg-gray-900 hover:bg-[#ff7700] hover:text-black dark:bg-[#1e1e1e] dark:hover:bg-[#282828] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition border border-gray-300 dark:border-[#2a2a2a] flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                Continue Shopping <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
