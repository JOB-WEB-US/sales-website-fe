"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Zap, CheckCircle2, Lock } from "lucide-react";
import { Product, ProductVariant } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { formatCurrency } from "@/lib/formatters";

interface StickyMobileBuyBarProps {
  product: Product;
  currentVariant: ProductVariant;
  quantity?: number;
  isOutOfStock?: boolean;
}

export default function StickyMobileBuyBar({
  product,
  currentVariant,
  quantity = 1,
  isOutOfStock = false,
}: StickyMobileBuyBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCartStore();
  const { openCart } = useUIStore();

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when scrolled past 500px on mobile
      if (window.scrollY > 480) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleQuickAdd = () => {
    if (isOutOfStock) return;
    addToCart(product, currentVariant, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openCart();
    }, 400);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#121212]/95 backdrop-blur-xl border-t border-[#2a2a2a] px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]"
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-center justify-between gap-3">
            {/* Left: Thumbnail & Short Info */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-[#202020] border border-[#333] shrink-0">
                <Image
                  src={currentVariant.imageUrl || product.frontImage}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate leading-tight">
                  {product.title}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-black text-[#ff7700]">
                    {formatCurrency(currentVariant.price * quantity)}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium truncate">
                    • {currentVariant.size} / {currentVariant.color}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Add to Cart Action */}
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-lg cursor-pointer ${
                isOutOfStock
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : added
                  ? "bg-emerald-500 text-white shadow-emerald-500/30 scale-95"
                  : "bg-[#ff7700] hover:bg-[#e06800] text-black shadow-[#ff7700]/25 active:scale-95"
              }`}
            >
              {added ? (
                <>
                  <CheckCircle2 size={15} />
                  <span>Added!</span>
                </>
              ) : isOutOfStock ? (
                <span>Sold Out</span>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  <span>Add To Cart</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
