"use client";

import React, { useState, useEffect } from "react";
import { Zap, CheckCircle, Truck, Sparkles, Tag, ChevronDown, ChevronUp } from "lucide-react";
import { Product, ProductVariant } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { formatCurrency } from "@/lib/formatters";

interface BundleTier {
  id: string;
  quantity: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  badgeText: string;
  freeShipping: boolean;
  isPopular: boolean;
}

interface BundleConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  tiers: BundleTier[];
}

interface BundleSaveWidgetProps {
  product: Product;
  selectedVariant: ProductVariant;
  onVariantChange?: (variant: ProductVariant) => void;
}

import { API_BASE_URL } from "@/lib/api";

const DEFAULT_BUNDLE_CONFIG: BundleConfig = {
  enabled: true,
  title: "BUNDLE & SAVE MORE!",
  subtitle: "Mix and match any colors & sizes. Volume discount automatically applied!",
  tiers: [
    { id: "tier-1", quantity: 1, discountType: "percentage", discountValue: 0, badgeText: "", freeShipping: false, isPopular: false },
    { id: "tier-2", quantity: 2, discountType: "percentage", discountValue: 10, badgeText: "🔥 MOST POPULAR", freeShipping: false, isPopular: true },
    { id: "tier-3", quantity: 3, discountType: "percentage", discountValue: 20, badgeText: "🏆 BEST VALUE • FREE SHIPPING", freeShipping: true, isPopular: false },
  ],
};

export default function BundleSaveWidget({
  product,
  selectedVariant,
}: BundleSaveWidgetProps) {
  const [config, setConfig] = useState<BundleConfig | null>(DEFAULT_BUNDLE_CONFIG);
  const [selectedQty, setSelectedQty] = useState(2);
  const [bundleItems, setBundleItems] = useState<{ size: string; color: string; productType: string }[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const { addToCart, setAppliedCoupon } = useCartStore();
  const { openCart } = useUIStore();

  const availableSizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const availableColors = Array.from(new Set(product.variants.map((v) => v.color)));
  const availableTypes = Array.from(new Set(product.variants.map((v) => v.productType)));

  // Fetch bundle settings from backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/settings/bundles`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.enabled) {
          setConfig(data.data);
          const pop = data.data.tiers.find((t: BundleTier) => t.isPopular);
          if (pop) {
            setSelectedQty(pop.quantity);
          }
        }
      })
      .catch((err) => {
        // Fallback to default bundle config if backend is offline
        setConfig(DEFAULT_BUNDLE_CONFIG);
      });
  }, []);

  // Sync bundle item configurations when quantity changes
  useEffect(() => {
    setBundleItems((prev) => {
      const items = [];
      for (let i = 0; i < selectedQty; i++) {
        items.push(
          prev[i] || {
            size: selectedVariant.size,
            color: selectedVariant.color,
            productType: selectedVariant.productType,
          }
        );
      }
      return items;
    });
  }, [selectedQty, selectedVariant]);

  if (!config || !config.enabled || !config.tiers || config.tiers.length === 0) {
    return null;
  }

  const currentTier = config.tiers.find((t) => t.quantity === selectedQty) || config.tiers[0];
  const unitPrice = selectedVariant.price;
  const rawSubtotal = unitPrice * selectedQty;

  let discountedSubtotal = rawSubtotal;
  if (currentTier.discountType === "percentage") {
    discountedSubtotal = rawSubtotal * (1 - currentTier.discountValue / 100);
  } else {
    discountedSubtotal = Math.max(0, rawSubtotal - currentTier.discountValue);
  }

  const pricePerItem = discountedSubtotal / selectedQty;
  const totalSavings = rawSubtotal - discountedSubtotal;

  const handleUpdateItem = (index: number, field: "size" | "color" | "productType", value: string) => {
    const updated = [...bundleItems];
    updated[index] = { ...updated[index], [field]: value };
    setBundleItems(updated);
  };

  const handleAddBundleToCart = () => {
    // Add each chosen variant to the cart
    bundleItems.forEach((item) => {
      const matchedVariant = product.variants.find(
        (v) => v.size === item.size && v.color === item.color && v.productType === item.productType
      ) || selectedVariant;

      addToCart(product, matchedVariant, 1);
    });

    // If tier offers a volume discount, automatically apply a virtual bundle coupon
    if (currentTier.discountValue > 0) {
      setAppliedCoupon({
        code: `BUNDLE${currentTier.discountValue}`,
        description: `Bundle & Save: ${currentTier.discountValue}% OFF`,
        discountType: currentTier.discountType,
        discountValue: currentTier.discountValue,
        discountAmount: totalSavings,
      });
    }

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      openCart();
    }, 600);
  };

  return (
    <div className="bg-[#161616] border-2 border-[#2b2b2b] rounded-3xl p-5 sm:p-6 space-y-5 text-white shadow-xl">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-black text-sm sm:text-base uppercase tracking-wider text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#ff7700] fill-[#ff7700]" /> {config.title}
          </h3>
          <span className="bundle-instant-savings text-[10px] font-black tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-700/50 px-2.5 py-1 rounded-full uppercase">
            ⚡ Instant Savings
          </span>
        </div>
        {config.subtitle && (
          <p className="text-xs text-gray-400 mt-1">{config.subtitle}</p>
        )}
      </div>

      {/* Tier Selection Cards */}
      <div className="space-y-3">
        {config.tiers.map((tier) => {
          const isSelected = selectedQty === tier.quantity;
          
          const rawPrice = unitPrice * tier.quantity;
          let tierPrice = rawPrice;
          if (tier.discountType === "percentage") {
            tierPrice = rawPrice * (1 - tier.discountValue / 100);
          } else {
            tierPrice = Math.max(0, rawPrice - tier.discountValue);
          }
          const perItemPrice = tierPrice / tier.quantity;

          return (
            <div
              key={tier.id}
              onClick={() => setSelectedQty(tier.quantity)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                isSelected
                  ? "border-[#ff7700] bg-[#ff7700]/10 shadow-lg shadow-[#ff7700]/10"
                  : "border-[#262626] bg-[#1c1c1c] hover:border-[#3a3a3a]"
              }`}
            >
              {/* Badge Pill */}
              {tier.badgeText && (
                <span className="absolute -top-2.5 right-4 bg-[#a80000] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                  {tier.badgeText}
                </span>
              )}

              <div className="flex items-center justify-between gap-3">
                {/* Left: Radio + Quantity + Discount Highlights */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                      isSelected ? "border-[#ff7700] bg-[#ff7700]" : "border-gray-500"
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                  </div>

                  <div>
                    <div className="text-sm font-extrabold text-white flex items-center gap-2">
                      <span>Buy {tier.quantity} {tier.quantity > 1 ? "Items" : "Item"}</span>
                      {tier.discountValue > 0 && (
                        <span className="bundle-save-pill text-[10px] font-black text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                          Save {tier.discountType === "percentage" ? `${tier.discountValue}%` : `$${tier.discountValue}`}
                        </span>
                      )}
                    </div>
                    {tier.freeShipping && (
                      <div className="text-[11px] text-blue-400 font-bold flex items-center gap-1 mt-0.5">
                        <Truck size={12} /> Free Express US Shipping
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Calculated Price */}
                <div className="text-right">
                  <div className="text-base font-black text-[#ff7700]">
                    {formatCurrency(tierPrice)}
                  </div>
                  {tier.quantity > 1 && (
                    <div className="text-[11px] text-gray-400">
                      ({formatCurrency(perItemPrice)}/each)
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Individual Customizer (When buying 2 or more items) */}
      {selectedQty > 1 && (
        <div className="p-4 bg-[#1a1a1a] border border-[#2b2b2b] rounded-2xl space-y-3">
          <button
            type="button"
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="w-full flex items-center justify-between text-xs font-bold text-gray-300 hover:text-white cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#ff7700]" /> Customize Sizes & Colors for Each Item ({selectedQty})
            </span>
            {isCustomizing ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {isCustomizing ? (
            <div className="space-y-3 pt-2 border-t border-[#262626]">
              {bundleItems.map((item, idx) => (
                <div key={idx} className="p-3 bg-[#141414] border border-[#262626] rounded-xl space-y-2">
                  <div className="text-xs font-bold text-[#ff7700]">Item #{idx + 1} Selection:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Size</label>
                      <select
                        value={item.size}
                        onChange={(e) => handleUpdateItem(idx, "size", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#202020] border border-[#333] rounded-lg text-xs font-bold text-white outline-none focus:border-[#ff7700]"
                      >
                        {availableSizes.map((s) => (
                          <option key={s} value={s}>Size {s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Color</label>
                      <select
                        value={item.color}
                        onChange={(e) => handleUpdateItem(idx, "color", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#202020] border border-[#333] rounded-lg text-xs font-bold text-white outline-none focus:border-[#ff7700]"
                      >
                        {availableColors.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-gray-400">
              Selected: {bundleItems.map((b, i) => `#${i + 1} (${b.color} - ${b.size})`).join(", ")}
            </p>
          )}
        </div>
      )}

      {/* Summary & Add to Cart Button */}
      <div className="pt-2 border-t border-[#262626] space-y-3">
        {totalSavings > 0 && (
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-gray-400">Your Volume Savings:</span>
            <span className="bundle-savings-total text-emerald-400 font-extrabold">-{formatCurrency(totalSavings)} (Auto-Discount)</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleAddBundleToCart}
          className="w-full bg-[#ff7700] hover:bg-[#e66c00] text-black font-black py-4 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#ff7700]/25 transition duration-200 cursor-pointer uppercase tracking-wider text-sm"
        >
          {addedSuccess ? (
            <span className="flex items-center gap-1.5 text-black">
              <CheckCircle size={18} /> Added {selectedQty} Items to Cart!
            </span>
          ) : (
            <span>
              Claim Bundle & Save ({formatCurrency(discountedSubtotal)})
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
