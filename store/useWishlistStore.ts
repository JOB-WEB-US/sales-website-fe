'use client';

import { create } from 'zustand';
import { Product } from '@/types/product';

interface WishlistState {
  items: Product[];
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  syncUserWishlist: () => void;
  clearOnLogout: () => void;
}

const getLoggedInEmail = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const userStr = localStorage.getItem('velora_user');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user?.email ? user.email.trim().toLowerCase() : null;
  } catch {
    return null;
  }
};

const getActiveStorageKey = (): string => {
  const email = getLoggedInEmail();
  return email ? `velora_wishlist_${email}` : 'velora_guest_wishlist';
};

const loadInitialItems = (): Product[] => {
  if (typeof window === 'undefined') return [];
  try {
    // Clean up legacy single storage key if it exists
    if (localStorage.getItem('velora_wishlist')) {
      localStorage.removeItem('velora_wishlist');
    }

    const email = getLoggedInEmail();
    if (email) {
      const userKey = `velora_wishlist_${email}`;
      const savedUserItems = localStorage.getItem(userKey);
      let userList: Product[] = savedUserItems ? JSON.parse(savedUserItems) : [];

      // Smart Merge: check if guest wishlist had items to merge
      const guestItemsStr = localStorage.getItem('velora_guest_wishlist');
      if (guestItemsStr) {
        try {
          const guestList: Product[] = JSON.parse(guestItemsStr);
          if (Array.isArray(guestList) && guestList.length > 0) {
            const existingIds = new Set(userList.map((p) => p.id));
            const newMerged = [...userList];
            for (const item of guestList) {
              if (!existingIds.has(item.id)) {
                newMerged.push(item);
                existingIds.add(item.id);
              }
            }
            userList = newMerged;
            localStorage.setItem(userKey, JSON.stringify(userList));
          }
        } catch (e) {
          console.warn('Error merging guest wishlist:', e);
        }
        localStorage.removeItem('velora_guest_wishlist');
      }
      return Array.isArray(userList) ? userList : [];
    }

    // Guest Mode: load guest wishlist if any
    const guestItems = localStorage.getItem('velora_guest_wishlist');
    return guestItems ? JSON.parse(guestItems) : [];
  } catch {
    return [];
  }
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isWishlistOpen: false,

  openWishlist: () => set({ isWishlistOpen: true }),
  closeWishlist: () => set({ isWishlistOpen: false }),

  syncUserWishlist: () => {
    const updatedItems = loadInitialItems();
    set({ items: updatedItems });
  },

  clearOnLogout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('velora_guest_wishlist');
    }
    set({ items: [] });
  },

  toggleWishlist: (product: Product) => {
    const { items } = get();
    const exists = items.some((item) => item.id === product.id);
    let newItems: Product[];

    if (exists) {
      newItems = items.filter((item) => item.id !== product.id);
    } else {
      newItems = [...items, product];
    }

    set({ items: newItems });

    if (typeof window !== 'undefined') {
      const key = getActiveStorageKey();
      localStorage.setItem(key, JSON.stringify(newItems));
    }
  },

  removeFromWishlist: (productId: string) => {
    const { items } = get();
    const newItems = items.filter((item) => item.id !== productId);
    set({ items: newItems });

    if (typeof window !== 'undefined') {
      const key = getActiveStorageKey();
      localStorage.setItem(key, JSON.stringify(newItems));
    }
  },

  isInWishlist: (productId: string) => {
    return get().items.some((item) => item.id === productId);
  },
}));
