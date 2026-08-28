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
  particlesCustomIcons: string[] | null;
  particlesCount: number;
  toggleParticles: () => void;
  setParticlesTheme: (theme: ParticleTheme) => void;
  fetchParticleConfig: () => Promise<void>;
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
  particlesCustomIcons: null as string[] | null,
  particlesCount: 16,
  toggleParticles: () =>
    set((state) => {
      const next = !state.particlesEnabled;
      if (typeof window !== 'undefined') {
        localStorage.setItem('velora_user_particles_enabled', JSON.stringify(next));
      }
      return { particlesEnabled: next };
    }),
  setParticlesTheme: (theme: ParticleTheme) => set({ particlesTheme: theme }),
  fetchParticleConfig: async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const res = await fetch(`${API_URL}/settings/particles`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const { activeTheme, customIcons, defaultEnabled, count } = json.data;
          
          let isEnabled = defaultEnabled;
          if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('velora_user_particles_enabled');
            if (saved !== null) {
              try {
                isEnabled = JSON.parse(saved);
              } catch {}
            }
          }

          set({
            particlesTheme: activeTheme || 'halloween',
            particlesCustomIcons: customIcons || null,
            particlesCount: count || 16,
            particlesEnabled: isEnabled,
          });
        }
      }
    } catch (err) {
      console.warn('Could not fetch seasonal particle settings:', err);
    }
  },
}));
