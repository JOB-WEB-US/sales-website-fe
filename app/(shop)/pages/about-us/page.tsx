'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Printer, Heart, Users, Truck, ArrowLeft, Star } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#ff7700] mb-8 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        {/* Hero Banner Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-950/60 text-[#ff7700] border border-red-800/40 text-xs font-extrabold rounded-full mb-4">
            <Sparkles className="w-4 h-4" /> About Velora Tees
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-heading leading-tight mb-4">
            Crafting Premium Graphic Apparel & Pop-Culture Art
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Velora Tees is an independent Print-On-Demand studio dedicated to horror fans, country music lovers, vintage aesthetic enthusiasts, and custom apparel collectors worldwide.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="bg-[#141414] border border-[#222] p-6 rounded-2xl text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#ff7700] font-heading">100K+</span>
            <p className="text-xs text-gray-400 font-semibold mt-1">Tees Delivered</p>
          </div>
          <div className="bg-[#141414] border border-[#222] p-6 rounded-2xl text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#ff7700] font-heading">4.9★</span>
            <p className="text-xs text-gray-400 font-semibold mt-1">Customer Rating</p>
          </div>
          <div className="bg-[#141414] border border-[#222] p-6 rounded-2xl text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#ff7700] font-heading">50+</span>
            <p className="text-xs text-gray-400 font-semibold mt-1">Niche Collections</p>
          </div>
          <div className="bg-[#141414] border border-[#222] p-6 rounded-2xl text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#ff7700] font-heading">100%</span>
            <p className="text-xs text-gray-400 font-semibold mt-1">Cotton Quality</p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="bg-[#141414] rounded-3xl border border-[#222] p-8 md:p-12 mb-16 shadow-xl">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-8 text-center font-heading">
            Why Thousands Choose Velora Tees
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800/40 text-[#ff7700] flex items-center justify-center mx-auto md:mx-0">
                <Printer className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Direct-To-Garment Printing</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                We use industry-leading DTG printing technology for razor-sharp artwork, rich colors, and prints that withstand dozens of washes without cracking.
              </p>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800/40 text-[#ff7700] flex items-center justify-center mx-auto md:mx-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Premium Ring-Spun Cotton</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Every shirt is printed on ultra-soft, pre-shrunk cotton fabric designed for supreme comfort, breathable wear, and retail-fit silhouette.
              </p>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800/40 text-[#ff7700] flex items-center justify-center mx-auto md:mx-0">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Fast & Trackable Shipping</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                All items are printed and dispatched within 1-3 business days with real-time tracking numbers sent straight to your email inbox.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-red-900 to-red-950 border border-red-800/50 rounded-3xl p-8 text-center text-white shadow-2xl">
          <h2 className="text-2xl font-extrabold mb-3">Ready to Discover Unique Graphic Art?</h2>
          <p className="text-red-200 text-xs md:text-sm max-w-lg mx-auto mb-6">
            Browse our latest drops in horror, country music, vintage 80s/90s, and seasonal collections.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-gray-100 text-red-950 font-black text-sm rounded-xl transition shadow-lg"
          >
            Explore Full Catalog
          </Link>
        </div>

      </div>
    </div>
  );
}
