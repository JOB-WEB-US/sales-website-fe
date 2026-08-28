import { create } from 'zustand';
import { CartItem } from '@/types/cart';
import { Product, ProductVariant } from '@/types/product';

export interface AppliedCoupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'shipping';
  discountValue: number;
  discountAmount: number;
}

interface CartState {
  cart: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  addToCart: (product: Product, selectedVariant: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  setAppliedCoupon: (coupon: AppliedCoupon | null) => void;
  removeCoupon: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getDiscountAmount: () => number;
  getFinalTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  appliedCoupon: null,

  addToCart: (product, selectedVariant, quantity = 1) => {
    set((state) => {
      const cartItemId = `${product.id}-${selectedVariant.id}`;
      const existingIndex = state.cart.findIndex((item) => item.id === cartItemId);

      if (existingIndex > -1) {
        const updatedCart = [...state.cart];
        updatedCart[existingIndex].quantity += quantity;
        return { cart: updatedCart };
      }

      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        variantId: selectedVariant.id,
        title: product.title,
        size: selectedVariant.size,
        color: selectedVariant.color,
        productType: selectedVariant.productType,
        price: selectedVariant.price,
        originalPrice: selectedVariant.originalPrice ?? undefined,
        image: selectedVariant.imageUrl || product.frontImage,
        quantity,
      };

      return { cart: [...state.cart, newItem] };
    });
  },

  removeFromCart: (cartItemId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== cartItemId),
    }));
  },

  updateQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(cartItemId);
      return;
    }
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => set({ cart: [], appliedCoupon: null }),

  setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),
  removeCoupon: () => set({ appliedCoupon: null }),

  getTotalItems: () => {
    return get().cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getDiscountAmount: () => {
    const subtotal = get().getTotalPrice();
    const coupon = get().appliedCoupon;
    if (!coupon) return 0;

    if (coupon.discountType === 'percentage') {
      return Math.round(((subtotal * coupon.discountValue) / 100) * 100) / 100;
    }
    if (coupon.discountType === 'fixed') {
      return Math.min(coupon.discountValue, subtotal);
    }
    return 0;
  },

  getFinalTotal: () => {
    const subtotal = get().getTotalPrice();
    const discount = get().getDiscountAmount();
    return Math.max(0, subtotal - discount);
  },
}));
