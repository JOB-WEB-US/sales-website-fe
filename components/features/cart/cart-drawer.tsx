"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { formatCurrency } from "@/lib/formatters";

export default function CartDrawer() {
  const router = useRouter();
  const { isCartOpen, closeCart } = useUIStore();
  const { cart, removeFromCart, updateQuantity, getTotalPrice } =
    useCartStore();

  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    closeCart();
    if (typeof window !== 'undefined') {
      const userProfile = localStorage.getItem('velora_user');
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
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Side Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[#141414] border-l border-[#262626] text-white shadow-2xl flex flex-col justify-between"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#222] flex items-center justify-between bg-[#0f0f0f]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-[#ff7700]" size={20} />
                <h3 className="font-heading font-bold text-base uppercase tracking-wider">
                  Your Shopping Cart ({cart.length})
                </h3>
              </div>
              <button
                onClick={closeCart}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 text-gray-500">
                  <ShoppingBag
                    size={48}
                    className="mb-3 opacity-30 text-[#ff7700]"
                  />
                  <p className="text-sm font-medium">
                    Your shopping cart is currently empty.
                  </p>
                  <button
                    onClick={() => {
                      closeCart();
                      router.push('/');
                    }}
                    className="mt-4 text-xs font-bold text-[#ff7700] hover:underline cursor-pointer"
                  >
                    Start Shopping Now
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-[#1c1c1c] border border-[#2a2a2a] p-3 rounded-xl relative group"
                  >
                    {/* Item Image */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#242424] flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-semibold line-clamp-1 pr-6 text-gray-200">
                          {item.title}
                        </h4>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          <span>{item.productType}</span> •{" "}
                          <span>Size: {item.size}</span> •{" "}
                          <span>Color: {item.color}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-[#121212] border border-[#333] rounded">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-2 py-0.5 text-xs text-gray-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-2 py-0.5 text-xs text-gray-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-sm font-bold text-[#ff7700]">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-[#a80000] p-1 transition"
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer (Subtotal & Checkout) */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-[#222] bg-[#0f0f0f] space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 font-medium">Subtotal:</span>
                  <span className="text-lg font-extrabold text-white">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>

                <p className="text-[11px] text-gray-500">
                  Taxes and shipping calculated at checkout. Free shipping over
                  $60!
                </p>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#a80000] hover:bg-[#7a0000] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition duration-200 cursor-pointer"
                >
                  <span>Checkout Now</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
