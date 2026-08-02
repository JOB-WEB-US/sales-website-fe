'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingBag, Heart, User, Search, ChevronDown, Menu, X, Sun, Moon, Flame } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useThemeStore } from '@/store/useThemeStore';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { openCart, openSearch } = useUIStore();
  
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
  }, [theme]);

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

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#a80000] via-[#ff7700] to-amber-400 p-0.5 shadow-md group-hover:scale-105 transition duration-300">
            <div className="w-full h-full bg-[#121212] rounded-[10px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-[#ff7700] fill-[#ff7700]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white font-heading leading-none flex items-center gap-1">
              ERI<span className="text-[#ff7700]">HOT</span>
              <span className="text-[9px] bg-[#a80000] text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-widest ml-1">
                TEES
              </span>
            </span>
            <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mt-0.5">
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
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-8 py-2 text-sm font-medium">
          <Link href="/shop" className="text-gray-200 hover:text-[#ff7700] transition py-1">
            Shop All
          </Link>
          
          <Link href="/collections/halloween" className="text-[#ff7700] font-bold hover:brightness-125 transition py-1 flex items-center gap-1">
            🎃 Halloween 🎃
          </Link>

          {/* Dropdown: Products */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-gray-200 hover:text-[#ff7700] py-1">
              Products <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-[#181818] border border-gray-800 rounded-lg shadow-xl py-2 z-50">
              <Link href="/shop?category=t-shirts" className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#252525] hover:text-[#ff7700]">
                T-Shirts
              </Link>
              <Link href="/shop?category=hoodies" className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#252525] hover:text-[#ff7700]">
                Hoodies & Sweatshirts
              </Link>
              <Link href="/shop?category=calendars" className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#252525] hover:text-[#ff7700]">
                Wall Calendars
              </Link>
            </div>
          </div>

          {/* Dropdown: Collections */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-gray-200 hover:text-[#ff7700] py-1">
              All Collections <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-[#181818] border border-gray-800 rounded-lg shadow-xl py-2 z-50">
              <Link href="/collections/halloween" className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#252525] hover:text-[#ff7700]">
                🎃 Halloween Specials
              </Link>
              <Link href="/collections/horror" className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#252525] hover:text-[#ff7700]">
                💀 Horror Movies
              </Link>
              <Link href="/collections/ella-langley" className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#252525] hover:text-[#ff7700]">
                🤠 Ella Langley
              </Link>
              <Link href="/collections/vintage" className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#252525] hover:text-[#ff7700]">
                📻 Vintage 80s/90s
              </Link>
              <Link href="/collections/trending" className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#252525] hover:text-[#ff7700]">
                🔥 Trending Now
              </Link>
            </div>
          </div>

          <Link href="/contact" className="text-gray-200 hover:text-[#ff7700] transition py-1">
            Contact Us
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#121212] border-t border-gray-800 px-4 py-4 flex flex-col gap-3 text-sm">
          <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="text-gray-200 hover:text-[#ff7700] py-1">
            Shop All
          </Link>
          <Link href="/collections/halloween" onClick={() => setMobileMenuOpen(false)} className="text-[#ff7700] font-bold py-1">
            🎃 Halloween 🎃
          </Link>
          <Link href="/collections/trending" onClick={() => setMobileMenuOpen(false)} className="text-gray-200 hover:text-[#ff7700] py-1">
            Trending Now
          </Link>
          <Link href="/collections/horror" onClick={() => setMobileMenuOpen(false)} className="text-gray-200 hover:text-[#ff7700] py-1">
            Horror Movies
          </Link>
        </div>
      )}
    </header>
  );
}
