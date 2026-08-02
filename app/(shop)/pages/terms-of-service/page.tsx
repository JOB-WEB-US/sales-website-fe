'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, FileText, ArrowLeft, Shield } from 'lucide-react';

export default function TermsAndPrivacyPage() {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#ff7700] mb-8 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-950/60 text-[#ff7700] border border-red-800/40 text-xs font-extrabold rounded-full mb-3">
            <Shield className="w-3.5 h-3.5" /> Legal & Compliance
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service & Privacy Policy
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Please read our store terms, privacy standards, and data protection guidelines.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'terms' ? 'bg-[#ff7700] text-black shadow-lg' : 'bg-[#141414] text-gray-400 border border-[#262626]'
            }`}
          >
            <FileText size={14} /> Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'privacy' ? 'bg-[#ff7700] text-black shadow-lg' : 'bg-[#141414] text-gray-400 border border-[#262626]'
            }`}
          >
            <Lock size={14} /> Privacy Policy
          </button>
        </div>

        {/* Content Panel */}
        <div className="bg-[#141414] rounded-2xl border border-[#222] p-6 md:p-10 shadow-xl text-xs text-gray-300 space-y-6 leading-relaxed">
          {activeTab === 'terms' ? (
            <>
              <div>
                <h2 className="text-base font-bold text-white mb-2">1. Acceptance of Terms</h2>
                <p>
                  By accessing and purchasing from Velora Store, you agree to be bound by these Terms of Service. 
                  All products sold on this platform are custom printed on demand for personal, non-commercial use.
                </p>
              </div>

              <div>
                <h2 className="text-base font-bold text-white mb-2">2. Product Availability & Pricing</h2>
                <p>
                  Prices for our graphic apparel are subject to change without notice. We reserve the right to modify or discontinue any product collection at any time.
                </p>
              </div>

              <div>
                <h2 className="text-base font-bold text-white mb-2">3. Intellectual Property Rights</h2>
                <p>
                  All custom artwork, graphic designs, logos, and website assets are protected by copyright laws. 
                  Unauthorized reproduction or resale of Velora Store designs is strictly prohibited.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-base font-bold text-white mb-2">1. Data Collection & Usage</h2>
                <p>
                  We only collect personal information necessary to fulfill your orders (Name, Shipping Address, Email, Phone Number). 
                  We NEVER sell or rent your personal information to third parties.
                </p>
              </div>

              <div>
                <h2 className="text-base font-bold text-white mb-2">2. Payment Security</h2>
                <p>
                  All payments processed on Velora Store are encrypted using 256-bit SSL technology. 
                  Your full credit card details are handled directly by PCI-compliant payment gateways (Stripe / PayPal) and are never stored on our servers.
                </p>
              </div>

              <div>
                <h2 className="text-base font-bold text-white mb-2">3. Cookies Policy</h2>
                <p>
                  We use essential cookies to remember items added to your shopping cart and maintain session state across pages.
                </p>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
