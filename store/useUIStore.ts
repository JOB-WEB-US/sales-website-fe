import { create } from 'zustand';
import { Product } from '@/types/product';
import { ParticleTheme } from '@/components/common/floating-particles';

interface UIState {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  selectedProductForModal: Product | null;
  isVariantModalOpen: boolean;
  openVariantModal: (product: Product) => void;
  closeVariantModal: () => void;

  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  isSizeGuideOpen: boolean;
  openSizeGuide: () => void;
  closeSizeGuide: () => void;

  particlesEnabled: boolean;
  particlesTheme: ParticleTheme;
  toggleParticles: () => void;
  setParticlesTheme: (theme: ParticleTheme) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  selectedProductForModal: null,
  isVariantModalOpen: false,
  openVariantModal: (product) =>
    set({ selectedProductForModal: product, isVariantModalOpen: true }),
  closeVariantModal: () =>
    set({ selectedProductForModal: null, isVariantModalOpen: false }),

  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  isSizeGuideOpen: false,
  openSizeGuide: () => set({ isSizeGuideOpen: true }),
  closeSizeGuide: () => set({ isSizeGuideOpen: false }),

  particlesEnabled: true,
  particlesTheme: 'halloween',
  toggleParticles: () => set((state) => ({ particlesEnabled: !state.particlesEnabled })),
  setParticlesTheme: (theme) => set({ particlesTheme: theme }),
}));
