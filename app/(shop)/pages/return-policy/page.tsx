'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCw, CheckCircle2, AlertTriangle, ArrowLeft, Mail } from 'lucide-react';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#ff7700] mb-8 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-950/60 text-[#ff7700] border border-red-800/40 text-xs font-extrabold rounded-full mb-3">
            <RefreshCw className="w-3.5 h-3.5" /> Guarantee & Exchange
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            30-Day Return & Refund Policy
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Your satisfaction is 100% guaranteed. Learn how we handle replacements, returns, and refund requests.
          </p>
        </div>

        {/* Highlight Guarantee Box */}
        <div className="bg-gradient-to-r from-red-900 to-red-950 border border-red-800/50 rounded-2xl p-6 mb-10 shadow-lg text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
          <h2 className="text-xl font-extrabold text-white">100% Satisfaction Guarantee</h2>
          <p className="text-red-200 text-xs mt-1 max-w-xl mx-auto">
            If your custom printed shirt arrives damaged, misprinted, defective, or incorrect size, we will send you a FREE replacement or full refund right away!
          </p>
        </div>

        {/* Step-by-Step Return Process */}
        <div className="bg-[#141414] rounded-2xl border border-[#222] p-6 md:p-8 mb-8">
          <h2 className="text-base font-bold text-white mb-6">
            Simple 3-Step Return / Exchange Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
              <span className="w-6 h-6 rounded-full bg-[#ff7700] text-black font-extrabold flex items-center justify-center mb-3">1</span>
              <h3 className="font-bold text-white mb-1">Contact Support</h3>
              <p className="text-gray-400">Email us at support@velorastore.com within 30 days of package delivery.</p>
            </div>

            <div className="p-4 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
              <span className="w-6 h-6 rounded-full bg-[#ff7700] text-black font-extrabold flex items-center justify-center mb-3">2</span>
              <h3 className="font-bold text-white mb-1">Provide Photo Proof</h3>
              <p className="text-gray-400">Attach a clear photo showing the item flaw, tag, or measurement issue.</p>
            </div>

            <div className="p-4 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
              <span className="w-6 h-6 rounded-full bg-[#ff7700] text-black font-extrabold flex items-center justify-center mb-3">3</span>
              <h3 className="font-bold text-white mb-1">Get Free Replacement</h3>
              <p className="text-gray-400">We print & ship a brand new replacement immediately with zero extra cost to you.</p>
            </div>
          </div>
        </div>

        {/* Refund Details */}
        <div className="bg-[#141414] rounded-2xl border border-[#222] p-6 md:p-8 mb-8 text-xs text-gray-300 space-y-4">
          <h2 className="text-base font-bold text-white">Refund Processing Timeline</h2>
          <p className="leading-relaxed">
            Approved refunds are issued back to your original payment method (Credit Card / PayPal). 
            Credit card refunds typically appear on your statement within <strong>3-5 business days</strong> depending on your issuing bank.
          </p>
        </div>

        {/* Contact Support Button */}
        <div className="text-center pt-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#a80000] hover:bg-[#7a0000] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg"
          >
            <Mail className="w-4 h-4" /> Request A Return / Exchange
          </Link>
        </div>

      </div>
    </div>
  );
}
