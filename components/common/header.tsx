'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingBag, Heart, User, Search, ChevronDown, Menu, X, Sun, Moon, Flame, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useThemeStore } from '@/store/useThemeStore';
import { getCategories, getAttributes, ApiCategory } from '@/lib/api';

const headerDropdownClass = 'absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:block w-72 bg-[#141414] border border-[#2a2a2a] rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150';
const headerDropdownListClass = 'py-1 space-y-1 max-h-80 overflow-y-auto';
const headerDropdownItemClass = 'flex items-center gap-2.5 whitespace-nowrap px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-200 hover:bg-[#202020] hover:text-[#ff7700] transition';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [productTypes, setProductTypes] = useState<any[]>([]);
  
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { openCart, openSearch, particlesEnabled, toggleParticles } = useUIStore();
  
  const { items: wishlistItems, openWishlist } = useWishlistStore();
  const wishlistCount = wishlistItems.length;

  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    setMounted(true);
    if (typeof document !== 'undefined') {
      if (theme === 'light') {
        document.documentElement.classList.add('light-mode');
      } else {
        document.documentElement.classList.remove('light-mode');
      }
    }
    getCategories().then((cats) => {
      if (cats && cats.length > 0) {
        setCategories(cats);
      }
    });
    getAttributes().then((attrs) => {
      if (attrs && attrs.types && attrs.types.length > 0) {
        setProductTypes(attrs.types);
      }
    });
  }, [theme]);

  const getTypeIcon = (name: string) => {
    const n = (name || '').toLowerCase();
    if (n.includes('t-shirt') || n.includes('tee')) return '👕';
    if (n.includes('zip') || n.includes('hoodie')) return '🧥';
    if (n.includes('sweatshirt')) return '🧶';
    if (n.includes('sleeve')) return '🥋';
    if (n.includes('tank')) return '🎽';
    if (n.includes('calendar')) return '📅';
    if (n.includes('case') || n.includes('phone')) return '📱';
    if (n.includes('cap') || n.includes('hat')) return '🧢';
    return '🏷️';
  };

  const getCategoryDisplay = (name: string, slug?: string, icon?: string | null) => {
    // 1. Clean corrupted leading question marks or junk
    const cleanName = (name || '')
      .replace(/^(\?\?|\?)\s*/, '')
      .replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\s*/u, '')
      .trim();

    // 2. Explicit icon if valid
    if (icon && !icon.includes('?')) {
      return { icon, label: cleanName || name };
    }

    // 3. Fallback icons by slug
    const s = (slug || '').toLowerCase();
    if (s === 'halloween') return { icon: '🎃', label: cleanName || 'Halloween & Spooky' };
    if (s === 'christmas' || s.includes('xmas')) return { icon: '🎄', label: cleanName || 'Christmas Deals' };
    if (s === 'horror') return { icon: '💀', label: cleanName || 'Horror Classics' };
    if (s === 'vintage') return { icon: '📻', label: cleanName || 'Vintage & Retro' };
    if (s === 'trending') return { icon: '🔥', label: cleanName || 'Trending Streetwear' };
    if (s === 'country-music') return { icon: '🤠', label: cleanName || 'Country Music' };

    return { icon: '🏷️', label: cleanName || name };
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#121212]/95 backdrop-blur border-b border-[#222]">
      {/* 1. Top Announcement Marquee Bar */}
      <div className="bg-[#a80000] text-white py-1.5 text-xs font-semibold overflow-hidden" style={{ color: '#ffffff' }}>
        <div className="flex whitespace-nowrap animate-marquee" style={{ color: '#ffffff' }}>
          <span className="mx-6 text-white font-bold text-white-force" style={{ color: '#ffffff' }}>🔥 10% OFF ON ALL PRODUCTS WITH CODE: DBZFCBDX43</span>
          <span className="mx-6 text-white font-bold text-white-force" style={{ color: '#ffffff' }}>⭐ HIGH QUALITY APPAREL & GRAPHIC TEES</span>
          <span className="mx-6 text-white font-bold text-white-force" style={{ color: '#ffffff' }}>🚚 FREE SHIPPING ON ORDERS OVER $60</span>
          <span className="mx-6 text-white font-bold text-white-force" style={{ color: '#ffffff' }}>🔥 10% OFF ON ALL PRODUCTS WITH CODE: DBZFCBDX43</span>
          <span className="mx-6 text-white font-bold text-white-force" style={{ color: '#ffffff' }}>⭐ HIGH QUALITY APPAREL & GRAPHIC TEES</span>
          <span className="mx-6 text-white font-bold text-white-force" style={{ color: '#ffffff' }}>🚚 FREE SHIPPING ON ORDERS OVER $60</span>
        </div>
      </div>

      {/* 2. Header Main Content (Layer 1) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-gray-300 hover:text-white p-1"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Official Logo (Transparent, Black in Light Mode, White in Dark Mode) */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative h-12 w-auto flex items-center transition-all duration-300 group-hover:scale-105">
            <Image
              src="/images/velora-logo.png"
              alt="VELORA TEES Official Logo"
              width={140}
              height={48}
              priority
              unoptimized
              className="brand-logo-img object-contain h-11 w-auto"
            />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] font-black text-[#ff7700] tracking-widest uppercase leading-tight">
              OFFICIAL STORE
            </span>
            <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">
              Trending Graphic Apparel
            </span>
          </div>
        </Link>



        {/* Search Bar Click Trigger */}
        <div 
          onClick={openSearch}
          className="hidden md:flex flex-1 max-w-md relative mx-4 cursor-pointer group"
        >
          <input
            type="text"
            readOnly
            placeholder="Search graphic tees, horror, trending..."
            className="w-full bg-[#1e1e1e] text-sm text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-full border border-gray-800 group-hover:border-[#ff7700] transition cursor-pointer"
          />
          <Search className="absolute left-3.5 top-2.5 text-gray-400 group-hover:text-[#ff7700] transition" size={16} />
        </div>

        {/* Actions (Search Mobile, Wishlist, User, Cart) */}
        <div className="flex items-center gap-4">
          <button 
            onClick={openSearch}
            className="md:hidden text-gray-300 hover:text-[#ff7700] transition p-1.5" 
            title="Search"
          >
            <Search size={20} />
          </button>
          <button
            onClick={openWishlist}
            className="text-gray-300 hover:text-[#ff7700] transition relative p-1.5"
            title="Wishlist"
          >
            <Heart size={20} className={wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          <Link href="/account" className="text-gray-300 hover:text-[#ff7700] transition p-1.5" title="Account Dashboard">
            <User size={20} />
          </Link>

          {/* Dark / Light Theme Toggle Switch */}
          <button
            onClick={toggleTheme}
            className="text-gray-300 hover:text-[#ff7700] transition p-1.5 rounded-full hover:bg-[#222]"
            title={mounted && theme === 'light' ? 'Light Mode (Click to switch to Dark Mode 🌙)' : 'Dark Mode (Click to switch to Light Mode ☀️)'}
          >
            {mounted && theme === 'light' ? (
              <Sun size={20} className="text-amber-500" />
            ) : (
              <Moon size={20} className="text-indigo-400" />
            )}
          </button>

          {/* Seasonal Particle Animation Toggle Button */}
          <button
            onClick={toggleParticles}
            className={`p-1.5 rounded-full transition relative flex items-center justify-center ${
              particlesEnabled
                ? 'text-[#ff7700] hover:bg-[#ff7700]/15'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#222] opacity-60'
            }`}
            title={
              particlesEnabled
                ? '✨ Hiệu ứng hạt theo mùa: ĐANG BẬT (Bấm để Tắt)'
                : '✨ Hiệu ứng hạt theo mùa: ĐÃ TẮT (Bấm để Bật)'
            }
          >
            <Sparkles size={20} className={particlesEnabled ? 'animate-pulse text-[#ff7700]' : ''} />
            {particlesEnabled && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#ff7700] rounded-full animate-ping" />
            )}
          </button>

          {/* Cart Icon Button */}
          <button
            onClick={openCart}
            className="flex items-center gap-2 bg-[#1e1e1e] hover:bg-[#2a2a2a] text-white px-3.5 py-1.5 rounded-full border border-gray-800 transition"
            title="Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag size={20} className="text-[#ff7700]" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#a80000] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-xs font-medium hidden sm:inline">Cart</span>
          </button>
        </div>
      </div>

      {/* 3. Header Navigation Menu (Layer 2) */}
      <nav className="hidden lg:block border-t border-[#1e1e1e] bg-[#0c0c0c]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-9 py-3 text-[14px] sm:text-[15px] font-bold tracking-wide">
          <Link href="/shop" className="text-gray-200 hover:text-[#ff7700] transition py-1">
            Shop All
          </Link>
          
          {/* Dynamic Trending / Featured Menus configured by Admin */}
          {(() => {
            const trendingCategories = categories
              .filter((c) => c.isTrendingMenu && !c.isHidden)
              .sort((a, b) => (a.menuOrder || 0) - (b.menuOrder || 0));
            const displayTrending = trendingCategories.length > 0
              ? trendingCategories
              : categories.filter((c) => c.slug === 'halloween');

            return displayTrending.map((trendCat) => {
              const { icon, label } = getCategoryDisplay(trendCat.name, trendCat.slug, trendCat.icon);

              return (
                <Link
                  key={trendCat.id}
                  href={`/collections/${trendCat.slug}`}
                  className="trend-nav-link text-[#ff7700] hover:brightness-125 transition py-1 px-3 flex items-center gap-1.5 font-extrabold whitespace-nowrap group/trend"
                >
                  <span className="text-base">{icon}</span>
                  <span className="trend-text">{label}</span>
                  {trendCat.badgeText && (
                    <span className="bg-[#a80000] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">
                      {trendCat.badgeText}
                    </span>
                  )}
                </Link>
              );
            });
          })()}

          {/* Dropdown: Curated Collections */}
          <div className="relative group shrink-0">
            <button className="inline-flex items-center gap-1.5 whitespace-nowrap text-gray-200 group-hover:text-[#ff7700] py-1 transition cursor-pointer font-bold">
              <span>Collections</span>
              <ChevronDown size={15} className="shrink-0 group-hover:rotate-180 transition-transform duration-200" />
            </button>
            <div className={headerDropdownClass}>
              <div className={headerDropdownListClass}>
                {categories.map((cat) => {
                  const { icon, label } = getCategoryDisplay(cat.name, cat.slug, cat.icon);

                  return (
                    <Link
                      key={cat.id}
                      href={`/collections/${cat.slug}`}
                      className={headerDropdownItemClass}
                    >
                      <span className="w-5 shrink-0 text-center text-base">{icon}</span>
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dropdown: Product Types */}
          <div className="relative group shrink-0">
            <button className="inline-flex items-center gap-1.5 whitespace-nowrap text-gray-200 group-hover:text-[#ff7700] py-1 transition cursor-pointer font-bold">
              <span>Product Types</span>
              <ChevronDown size={15} className="shrink-0 group-hover:rotate-180 transition-transform duration-200" />
            </button>
            <div className={headerDropdownClass}>
              <div className={headerDropdownListClass}>
                {productTypes.length > 0 ? (
                  productTypes.map((pt) => (
                    <Link
                      key={pt.id}
                      href={`/shop?type=${encodeURIComponent(pt.name)}`}
                      className={headerDropdownItemClass}
                    >
                      <span className="w-5 shrink-0 text-center text-base">{getTypeIcon(pt.name)}</span>
                      <span>{pt.name}</span>
                    </Link>
                  ))
                ) : (
                  <>
                    <Link href="/shop?type=T-Shirt" className={headerDropdownItemClass}>
                      <span className="w-5 shrink-0 text-center text-base">👕</span> <span>T-Shirt</span>
                    </Link>
                    <Link href="/shop?type=Hoodie" className={headerDropdownItemClass}>
                      <span className="w-5 shrink-0 text-center text-base">🧥</span> <span>Hoodie</span>
                    </Link>
                    <Link href="/shop?type=Sweatshirt" className={headerDropdownItemClass}>
                      <span className="w-5 shrink-0 text-center text-base">🧶</span> <span>Sweatshirt</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <Link href="/pages/order-tracking" className="text-gray-200 hover:text-[#ff7700] transition py-1">
            Track Order
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#121212] border-t border-gray-800 px-5 py-5 flex flex-col gap-3 text-base">
          <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="text-gray-100 hover:text-[#ff7700] py-2 font-bold text-base">
            Shop All
          </Link>
          {/* Dynamic Trending Menus in Mobile Drawer */}
          {(() => {
            const trendingCategories = categories
              .filter((c) => c.isTrendingMenu && !c.isHidden)
              .sort((a, b) => (a.menuOrder || 0) - (b.menuOrder || 0));
            const displayTrending = trendingCategories.length > 0
              ? trendingCategories
              : categories.filter((c) => c.slug === 'halloween');

            return displayTrending.map((trendCat) => {
              const { icon, label } = getCategoryDisplay(trendCat.name, trendCat.slug, trendCat.icon);

              return (
                <Link
                  key={trendCat.id}
                  href={`/collections/${trendCat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="trend-nav-link text-[#ff7700] font-extrabold py-2 px-3 text-base flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{icon}</span>
                    <span className="trend-text">{label}</span>
                  </span>
                  {trendCat.badgeText && (
                    <span className="bg-[#a80000] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {trendCat.badgeText}
                    </span>
                  )}
                </Link>
              );
            });
          })()}

          <div className="pt-3 border-t border-gray-800">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider block mb-2">Collections</span>
            <div className="space-y-1">
              {categories.map((cat) => {
                const { icon, label } = getCategoryDisplay(cat.name, cat.slug, cat.icon);
                return (
                  <Link
                    key={cat.id}
                    href={`/collections/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-gray-200 hover:text-[#ff7700] py-2 text-sm font-semibold"
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-800">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider block mb-2">Product Types</span>
            <div className="space-y-1">
              {productTypes.map((pt) => (
                <Link
                  key={pt.id}
                  href={`/shop?type=${encodeURIComponent(pt.name)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-200 hover:text-[#ff7700] py-2 text-sm font-semibold"
                >
                  <span className="text-base">{getTypeIcon(pt.name)}</span>
                  <span>{pt.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-800 flex flex-col gap-2 text-sm font-semibold">
            <Link href="/pages/order-tracking" onClick={() => setMobileMenuOpen(false)} className="text-gray-200 hover:text-[#ff7700] py-1.5">
              Track Order
            </Link>
          </div>
        </div>
      )}





    </header>
  );
}
