'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useUIStore } from '@/store/useUIStore';
import TrustBadges from '@/components/common/trust-badges';

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-[#1e1e1e] text-gray-400 text-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Brand Header */}
        <div className="mb-10 pb-8 border-b border-[#181818] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-auto flex items-center transition-all duration-300 group-hover:scale-105">
              <Image
                src="/images/velora-logo.png"
                alt="VELORA TEES"
                width={130}
                height={40}
                unoptimized
                className="brand-logo-img object-contain h-9 w-auto"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-[#ff7700] uppercase tracking-wider">Official POD Merch Store</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">High Quality Graphic Tees & Apparel</span>
            </div>
          </Link>

          <span className="text-xs text-gray-400 italic">
            Printed & Distributed with Premium DTG Inks in the USA 🇺🇸
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1: Support */}
          <div>
            <h4 className="text-white font-heading font-bold text-base mb-4 uppercase tracking-wider">
              Customer Support
            </h4>
            <ul className="space-y-2.5">
              <li><Link href="/contact" className="hover:text-[#ff7700] transition">Contact Us</Link></li>
              <li><Link href="/pages/order-tracking" className="hover:text-[#ff7700] transition">Order Tracking</Link></li>
              <li><Link href="/pages/product-details-sizing" className="hover:text-[#ff7700] transition">Product Details & Sizing Guide</Link></li>
              <li><Link href="/pages/all-reviews" className="hover:text-[#ff7700] transition">Customer Reviews (★ 4.9/5)</Link></li>
            </ul>
          </div>

          {/* Col 2: Policies */}
          <div>
            <h4 className="text-white font-heading font-bold text-base mb-4 uppercase tracking-wider">
              Store Policies
            </h4>
            <ul className="space-y-2.5">
              <li><Link href="/pages/privacy-policy" className="hover:text-[#ff7700] transition">Privacy Policy</Link></li>
              <li><Link href="/pages/terms-of-service" className="hover:text-[#ff7700] transition">Terms of Service</Link></li>
              <li><Link href="/pages/shipping-policy" className="hover:text-[#ff7700] transition">Shipping & Delivery Policy</Link></li>
              <li><Link href="/pages/return-policy" className="hover:text-[#ff7700] transition">Returns & Exchanges Policy</Link></li>
            </ul>
          </div>

          {/* Col 3: Newsletter */}
          <div>
            <h4 className="text-white font-heading font-bold text-base mb-4 uppercase tracking-wider">
              Join Our VIP Club
            </h4>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Subscribe to receive exclusive deals, early access to new horror & pop-culture drops!
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); }} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email address..."
                required
                className="bg-[#181818] border border-gray-800 text-white text-xs px-3 py-2.5 rounded focus:outline-none focus:border-[#ff7700] flex-1"
              />
              <button
                type="submit"
                className="bg-[#a80000] hover:bg-[#7a0000] text-white font-semibold text-xs px-4 py-2.5 rounded transition cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Payment & Security Trust Badges */}
        <div className="mt-10 pt-6 border-t border-[#181818]">
          <TrustBadges variant="footer" />
        </div>
      </div>

      <div className="border-t border-[#181818] py-6 px-4 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>&copy; 2026 VELORA TEES. All rights reserved. Premium POD Graphic Apparel & Merchandise.</p>
        <p className="text-gray-600 dark:text-gray-500">Designed with ❤️ for fans of trending pop-culture apparel.</p>
      </div>
    </footer>
  );
}
