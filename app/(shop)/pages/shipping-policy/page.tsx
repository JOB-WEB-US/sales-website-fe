'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, Clock, Globe, ShieldCheck, ArrowLeft, PackageCheck } from 'lucide-react';

export default function ShippingPolicyPage() {
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
            <Truck className="w-3.5 h-3.5" /> Logistics & Fulfillment
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Transparent information regarding Print-On-Demand production times, shipping costs, and global delivery schedules.
          </p>
        </div>

        {/* Section 1: POD Production Time */}
        <div className="bg-[#141414] rounded-2xl border border-[#222] p-6 md:p-8 mb-8 shadow-sm">
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#ff7700]" /> 1. Print-On-Demand Production Time
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed mb-4">
            All our graphic tees, hoodies, and merchandise are custom printed on demand after your order is placed. 
            This print-on-demand model ensures brand new fabric quality and zero deadstock waste.
          </p>
          <div className="p-4 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] text-xs text-gray-300">
            <strong className="text-white">Fulfillment Timeframe:</strong> 1 - 3 Business Days (excluding weekends and US holidays).
          </div>
        </div>

        {/* Section 2: US Shipping Rates Table */}
        <div className="bg-[#141414] rounded-2xl border border-[#222] p-6 md:p-8 mb-8 shadow-sm">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-[#ff7700]" /> 2. Domestic US Shipping Rates & Delivery
          </h2>

          <div className="overflow-x-auto rounded-xl border border-[#262626] mb-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c] text-gray-400 uppercase text-[11px] font-bold border-b border-[#262626]">
                <tr>
                  <th className="py-3 px-4">Shipping Method</th>
                  <th className="py-3 px-4">Estimated Transit Time</th>
                  <th className="py-3 px-4">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                <tr className="hover:bg-[#1a1a1a] transition">
                  <td className="py-3 px-4 font-bold text-white">Standard Ground Shipping</td>
                  <td className="py-3 px-4 text-gray-300">3 - 5 Business Days</td>
                  <td className="py-3 px-4 text-gray-300">$4.99 (FREE over $75)</td>
                </tr>
                <tr className="hover:bg-[#1a1a1a] transition">
                  <td className="py-3 px-4 font-bold text-[#ff7700]">Express Expedited Shipping</td>
                  <td className="py-3 px-4 text-gray-300">1 - 2 Business Days</td>
                  <td className="py-3 px-4 text-[#ff7700] font-bold">$12.99</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: International Shipping */}
        <div className="bg-[#141414] rounded-2xl border border-[#222] p-6 md:p-8 mb-8 shadow-sm">
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#ff7700]" /> 3. International Shipping
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed mb-3">
            We ship to Canada, the UK, Australia, Europe, and over 100+ countries worldwide via DHL / USPS International.
          </p>
          <ul className="list-disc pl-5 text-xs text-gray-300 space-y-1.5">
            <li>International Transit Time: <strong>7 - 14 Business Days</strong>.</li>
            <li>International Flat Rate Shipping: <strong>$9.99 USD</strong>.</li>
            <li>Customs & Duties: Import taxes/duties may apply depending on local customs regulations.</li>
          </ul>
        </div>

        {/* Section 4: Order Tracking */}
        <div className="bg-[#141414] rounded-2xl border border-[#222] p-6 md:p-8 shadow-sm">
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> 4. Tracking & Guarantee
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            As soon as your package is scanned by USPS / FedEx / DHL, a shipping confirmation email with your unique tracking number will be sent. 
            You can track your package 24/7 on our <Link href="/pages/order-tracking" className="text-[#ff7700] font-bold hover:underline">Order Tracking Page</Link>.
          </p>
        </div>

      </div>
    </div>
  );
}
