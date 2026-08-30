"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Ticket, 
  Tag, 
  CheckCircle, 
  AlertCircle, 
  Truck, 
  Sparkles 
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { formatCurrency } from "@/lib/formatters";
import TrustBadges from "@/components/common/trust-badges";
import { API_BASE_URL } from "@/lib/api";

interface PublicCoupon {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed" | "shipping";
  discountValue: number;
  minOrderAmount: number;
}

const FREE_SHIPPING_THRESHOLD = 75;

export default function CartDrawer() {
  const router = useRouter();
  const { isCartOpen, closeCart } = useUIStore();
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    getTotalPrice, 
    appliedCoupon, 
    setAppliedCoupon, 
    removeCoupon,
    getDiscountAmount,
    getFinalTotal
  } = useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [validating, setValidating] = useState(false);
  const [publicCoupons, setPublicCoupons] = useState<PublicCoupon[]>([]);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(75);
  const [shippingBarEnabled, setShippingBarEnabled] = useState(true);

  const subtotal = getTotalPrice();
  const discountAmount = getDiscountAmount();
  const finalTotal = getFinalTotal();
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountToFreeShip = Math.max(0, freeShippingThreshold - subtotal);

  // Fetch available public coupons & shipping settings
  useEffect(() => {
    if (isCartOpen) {
      // 1. Fetch coupons
      fetch(`${API_BASE_URL}/coupons`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setPublicCoupons(data.data);
          }
        })
        .catch(() => {
          setPublicCoupons([
            { id: "1", code: "VELORA10", description: "10% OFF", discountType: "percentage", discountValue: 10, minOrderAmount: 0 },
            { id: "2", code: "FREESHIP", description: "Free Ship", discountType: "shipping", discountValue: 100, minOrderAmount: 35 },
            { id: "3", code: "HALLOWEEN15", description: "15% OFF ($50+)", discountType: "percentage", discountValue: 15, minOrderAmount: 50 },
          ]);
        });

      // 2. Fetch shipping config
      fetch(`${API_BASE_URL}/settings/shipping`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            if (data.data.freeShippingThreshold) setFreeShippingThreshold(Number(data.data.freeShippingThreshold));
            if (data.data.enabled !== undefined) setShippingBarEnabled(Boolean(data.data.enabled));
          }
        })
        .catch((err) => console.warn("Could not load shipping config"));
    }
  }, [isCartOpen]);

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) return;

    setCouponError("");
    setCouponSuccess("");
    setValidating(true);

    try {
      const res = await fetch(`${API_BASE_URL}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal, shippingFee: 4.99 }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || `Promo code "${code}" is invalid.`);
      }

      setAppliedCoupon(data.data);
      setCouponSuccess(`Applied: ${data.data.code} (-${data.data.discountType === 'percentage' ? `${data.data.discountValue}%` : `$${data.data.discountAmount}`})`);
      setCouponInput("");
      setTimeout(() => setCouponSuccess(""), 3000);
    } catch (err: any) {
      setCouponError(err.message);
      setTimeout(() => setCouponError(""), 4000);
    } finally {
      setValidating(false);
    }
  };

  const handleCheckout = () => {
    closeCart();
    if (typeof window !== "undefined") {
      const userProfile = localStorage.getItem("velora_user");
      if (!userProfile) {
        router.push("/account/login?redirect=/checkout");
        return;
      }
    }
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
          />

          {/* Side Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white dark:bg-[#131313] border-l border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white shadow-2xl flex flex-col justify-between transition-colors duration-200"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-200 dark:border-[#222] flex items-center justify-between bg-gray-50/90 dark:bg-[#181818] transition-colors">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-[#ff7700]" size={20} />
                <h3 className="font-heading font-extrabold text-base uppercase tracking-wider text-gray-900 dark:text-white">
                  Your Shopping Cart ({cart.length})
                </h3>
              </div>
              <button
                onClick={closeCart}
                className="text-gray-400 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-1.5 rounded-xl hover:bg-gray-200 dark:hover:bg-[#252525] transition cursor-pointer"
                title="Close Cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            {shippingBarEnabled && cart.length > 0 && (
              <div className="bg-orange-50/60 dark:bg-[#181818] px-4 py-2.5 border-b border-gray-200 dark:border-[#222] transition-colors">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1 font-bold text-gray-800 dark:text-gray-300">
                    <Truck size={13} className="text-[#ff7700]" />
                    {amountToFreeShip === 0 ? (
                      <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">🎉 You unlocked FREE US SHIPPING!</strong>
                    ) : (
                      <span>
                        Add <strong className="text-[#c2410c] dark:text-[#ff7700]">{formatCurrency(amountToFreeShip)}</strong> more for <strong>FREE SHIPPING</strong>
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{freeShippingProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-[#262626] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      freeShippingProgress >= 100 ? "bg-emerald-500" : "bg-gradient-to-r from-[#ff7700] to-[#ff0055]"
                    }`}
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-[#131313] transition-colors">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                  <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-[#1c1c1c] border border-orange-200/60 dark:border-[#282828] flex items-center justify-center mb-4 shadow-sm">
                    <ShoppingBag
                      size={32}
                      className="text-[#ff7700]"
                    />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                    Your cart is currently empty
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mb-6">
                    Looks like you haven't added any graphic apparel or merch to your cart yet.
                  </p>
                  <button
                    onClick={() => {
                      closeCart();
                      router.push("/shop");
                    }}
                    className="px-6 py-2.5 bg-[#ff7700] hover:bg-[#e06900] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer"
                  >
                    Start Shopping Now
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#262626] p-3 rounded-2xl relative group shadow-sm transition hover:border-gray-300 dark:hover:border-[#383838]"
                  >
                    {/* Item Image */}
                    <div className="relative w-18 h-18 rounded-xl overflow-hidden bg-gray-200 dark:bg-[#222] flex-shrink-0 border border-gray-200 dark:border-[#333]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h4 className="text-xs font-bold line-clamp-1 pr-6 text-gray-900 dark:text-gray-100">
                          {item.title}
                        </h4>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                          <span>{item.productType}</span> • <span>Size: {item.size}</span> • <span>{item.color}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-white dark:bg-[#141414] border border-gray-300 dark:border-[#333] rounded-lg shadow-xs">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-black text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-xs sm:text-sm font-black text-[#c2410c] dark:text-[#ff7700]">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-2.5 right-2.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 p-1 transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* =========================================================================
                DRAWER FOOTER: COUPON SECTION + TOTALS + CHECKOUT BUTTON
                ========================================================================= */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-[#242424] bg-gray-50/90 dark:bg-[#161616] space-y-3 transition-colors">
                
                {/* 1. Coupon Input & Applied Badge */}
                <div className="space-y-2">
                  {appliedCoupon ? (
                    <div className="p-2.5 bg-orange-50 dark:bg-[#ff7700]/10 border border-orange-200 dark:border-[#ff7700]/30 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-[#c2410c] dark:text-[#ff7700]" />
                        <div>
                          <strong className="text-gray-900 dark:text-white font-mono">{appliedCoupon.code}</strong>
                          <span className="text-[11px] text-gray-600 dark:text-gray-300 ml-1.5 font-medium">
                            ({appliedCoupon.description})
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 text-xs font-bold underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <input
                          type="text"
                          placeholder="Enter Promo Code (e.g. VELORA10)"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#1f1f1f] border border-gray-300 dark:border-[#2e2e2e] focus:border-[#ff7700] rounded-xl text-xs font-mono font-bold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none shadow-xs"
                        />
                      </div>
                      <button
                        onClick={() => handleApplyCoupon()}
                        disabled={validating || !couponInput.trim()}
                        className="px-3.5 py-2 bg-gray-900 hover:bg-[#ff7700] hover:text-black dark:bg-[#282828] text-white text-xs font-black rounded-xl transition disabled:opacity-50 cursor-pointer shadow-xs"
                      >
                        {validating ? "..." : "Apply"}
                      </button>
                    </div>
                  )}

                  {/* Feedback messages */}
                  {couponSuccess && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle size={12} /> {couponSuccess}
                    </p>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                      <AlertCircle size={12} /> {couponError}
                    </p>
                  )}

                  {/* Available 1-Click Coupon Chips */}
                  {!appliedCoupon && publicCoupons.length > 0 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider shrink-0">
                        Offers:
                      </span>
                      {publicCoupons.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => handleApplyCoupon(c.code)}
                          className="px-2 py-0.5 bg-gray-200 hover:bg-[#ff7700] hover:text-black dark:bg-[#202020] border border-gray-300 dark:border-[#303030] text-gray-800 dark:text-gray-300 text-[10px] font-mono font-bold rounded-lg transition shrink-0 cursor-pointer flex items-center gap-1"
                        >
                          <Tag size={9} />
                          <span>{c.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Price Breakdown */}
                <div className="pt-2 border-t border-gray-200 dark:border-[#262626] space-y-1 text-xs">
                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal:</span>
                    <span className="font-bold text-gray-900 dark:text-gray-200">{formatCurrency(subtotal)}</span>
                  </div>

                  {appliedCoupon && discountAmount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Discount ({appliedCoupon.code}):</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm pt-1 border-t border-gray-200 dark:border-[#222]">
                    <span className="font-bold text-gray-900 dark:text-white">Estimated Total:</span>
                    <span className="text-lg font-black text-[#c2410c] dark:text-[#ff7700]">
                      {formatCurrency(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* 3. Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#ff7700] hover:bg-[#e66c00] text-black font-black py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#ff7700]/20 transition duration-200 cursor-pointer text-sm uppercase tracking-wider"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </button>

                {/* Trust Badges */}
                <TrustBadges variant="cart" />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
