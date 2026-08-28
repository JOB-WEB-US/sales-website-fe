import { create } from 'zustand';
import { CartItem } from '@/types/cart';
import { Product, ProductVariant } from '@/types/product';

interface CartState {
  cart: CartItem[];
  addToCart: (product: Product, selectedVariant: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],

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

  clearCart: () => set({ cart: [] }),

  getTotalItems: () => {
    return get().cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
}));
