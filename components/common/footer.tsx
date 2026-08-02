'use client';

import Link from 'next/link';
import { useUIStore } from '@/store/useUIStore';

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-[#1e1e1e] text-gray-400 text-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
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
              className="bg-[#a80000] hover:bg-[#7a0000] text-white font-semibold text-xs px-4 py-2.5 rounded transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-[#181818] py-6 px-4 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>&copy; 2026 ERIHOT TEES. All rights reserved. Premium POD Graphic Apparel & Merchandise.</p>

        {/* Seasonal Falling Particles Controls */}
        <ParticlesControlWidget />
      </div>
    </footer>
  );
}

function ParticlesControlWidget() {
  const { particlesEnabled, particlesTheme, toggleParticles, setParticlesTheme } = useUIStore();

  return (
    <div className="flex items-center gap-2 bg-[#141414] border border-[#2a2a2a] p-1.5 rounded-xl">
      <button
        onClick={toggleParticles}
        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
          particlesEnabled ? 'bg-[#ff7700] text-black' : 'bg-[#222] text-gray-400'
        }`}
        title="Toggle Floating Effects"
      >
        {particlesEnabled ? '✨ Particles ON' : 'Particles OFF'}
      </button>

      {particlesEnabled && (
        <select
          value={particlesTheme}
          onChange={(e) => setParticlesTheme(e.target.value as any)}
          className="bg-[#1c1c1c] border border-[#333] text-white text-[11px] px-2 py-1 rounded-lg outline-none cursor-pointer"
        >
          <option value="halloween">🎃 Halloween</option>
          <option value="sports">🏈 Sports</option>
          <option value="sparkles">✨ Sparkles</option>
          <option value="vintage">📻 Vintage</option>
          <option value="autumn">🍂 Autumn</option>
        </select>
      )}
    </div>
  );
}
