'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Ruler, ShieldCheck, RefreshCw, ArrowLeft, Info, Sparkles } from 'lucide-react';

type UnitType = 'inches' | 'cm';
type ApparelType = 'tshirt' | 'hoodie' | 'sweatshirt';

const SIZE_DATA: Record<ApparelType, { size: string; widthIn: number; lengthIn: number; widthCm: number; lengthCm: number }[]> = {
  tshirt: [
    { size: 'S', widthIn: 18, lengthIn: 28, widthCm: 46, lengthCm: 71 },
    { size: 'M', widthIn: 20, lengthIn: 29, widthCm: 51, lengthCm: 74 },
    { size: 'L', widthIn: 22, lengthIn: 30, widthCm: 56, lengthCm: 76 },
    { size: 'XL', widthIn: 24, lengthIn: 31, widthCm: 61, lengthCm: 79 },
    { size: '2XL', widthIn: 26, lengthIn: 32, widthCm: 66, lengthCm: 81 },
    { size: '3XL', widthIn: 28, lengthIn: 33, widthCm: 71, lengthCm: 84 },
  ],
  hoodie: [
    { size: 'S', widthIn: 20, lengthIn: 27, widthCm: 51, lengthCm: 69 },
    { size: 'M', widthIn: 22, lengthIn: 28, widthCm: 56, lengthCm: 71 },
    { size: 'L', widthIn: 24, lengthIn: 29, widthCm: 61, lengthCm: 74 },
    { size: 'XL', widthIn: 26, lengthIn: 30, widthCm: 66, lengthCm: 76 },
    { size: '2XL', widthIn: 28, lengthIn: 31, widthCm: 71, lengthCm: 79 },
    { size: '3XL', widthIn: 30, lengthIn: 32, widthCm: 76, lengthCm: 81 },
  ],
  sweatshirt: [
    { size: 'S', widthIn: 20, lengthIn: 26, widthCm: 51, lengthCm: 66 },
    { size: 'M', widthIn: 22, lengthIn: 27, widthCm: 56, lengthCm: 69 },
    { size: 'L', widthIn: 24, lengthIn: 28, widthCm: 61, lengthCm: 71 },
    { size: 'XL', widthIn: 26, lengthIn: 29, widthCm: 66, lengthCm: 74 },
    { size: '2XL', widthIn: 28, lengthIn: 30, widthCm: 71, lengthCm: 76 },
    { size: '3XL', widthIn: 30, lengthIn: 31, widthCm: 76, lengthCm: 79 },
  ],
};

export default function ProductDetailsSizingPage() {
  const router = useRouter();
  const [unit, setUnit] = useState<UnitType>('inches');
  const [activeType, setActiveType] = useState<ApparelType>('tshirt');

  const currentData = SIZE_DATA[activeType];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#ff7700] mb-6 transition cursor-pointer font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-red-950/60 text-[#ff7700] border border-red-800/40 text-xs font-extrabold rounded-full mb-3">
            <Ruler className="w-3.5 h-3.5" /> Size & Fabric Specification
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Product Details & Sizing Guide
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Find your perfect fit across all our custom printed apparel. All garments are standard unisex retail fit.
          </p>
        </div>

        {/* Size Chart Card */}
        <div className="bg-[#141414] rounded-2xl border border-[#222] p-6 md:p-8 mb-10 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* Tabs */}
            <div className="flex bg-[#1e1e1e] p-1 rounded-xl border border-[#2a2a2a]">
              <button
                onClick={() => setActiveType('tshirt')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  activeType === 'tshirt' ? 'bg-[#ff7700] text-black shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Unisex T-Shirt
              </button>
              <button
                onClick={() => setActiveType('hoodie')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  activeType === 'hoodie' ? 'bg-[#ff7700] text-black shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Heavyweight Hoodie
              </button>
              <button
                onClick={() => setActiveType('sweatshirt')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  activeType === 'sweatshirt' ? 'bg-[#ff7700] text-black shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Crewneck Sweatshirt
              </button>
            </div>

            {/* Unit Selector */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
              <span>Unit:</span>
              <div className="flex bg-[#1e1e1e] p-0.5 rounded-lg border border-[#2a2a2a]">
                <button
                  onClick={() => setUnit('inches')}
                  className={`px-3 py-1 rounded text-xs font-bold transition ${
                    unit === 'inches' ? 'bg-[#a80000] text-white' : 'text-gray-400'
                  }`}
                >
                  Inches (in)
                </button>
                <button
                  onClick={() => setUnit('cm')}
                  className={`px-3 py-1 rounded text-xs font-bold transition ${
                    unit === 'cm' ? 'bg-[#a80000] text-white' : 'text-gray-400'
                  }`}
                >
                  CM
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-[#262626] mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c] text-gray-400 uppercase text-[11px] font-bold border-b border-[#262626]">
                <tr>
                  <th className="py-3.5 px-5">Size</th>
                  <th className="py-3.5 px-5">Chest Width ({unit === 'inches' ? 'in' : 'cm'})</th>
                  <th className="py-3.5 px-5">Body Length ({unit === 'inches' ? 'in' : 'cm'})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {currentData.map((row) => (
                  <tr key={row.size} className="hover:bg-[#1a1a1a] transition">
                    <td className="py-3 px-5 font-black text-base text-[#ff7700]">{row.size}</td>
                    <td className="py-3 px-5 text-gray-200 font-semibold text-sm">
                      {unit === 'inches' ? `${row.widthIn}″` : `${row.widthCm} cm`}
                    </td>
                    <td className="py-3 px-5 text-gray-200 font-semibold text-sm">
                      {unit === 'inches' ? `${row.lengthIn}″` : `${row.lengthCm} cm`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Care Instructions & Fabric Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#141414] rounded-2xl border border-[#222] p-6">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff7700]" /> Fabric & Printing Quality
            </h3>
            <ul className="space-y-2 text-xs text-gray-300 list-disc pl-4 leading-relaxed">
              <li>100% Premium Ring-Spun Cotton (Heather colors contain polyester blend).</li>
              <li>Pre-shrunk fabric to minimize shrinkage after washing.</li>
              <li>Direct-To-Garment (DTG) high definition vibrant printing ink.</li>
            </ul>
          </div>

          <div className="bg-[#141414] rounded-2xl border border-[#222] p-6">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-400" /> Garment Care Instructions
            </h3>
            <ul className="space-y-2 text-xs text-gray-300 list-disc pl-4 leading-relaxed">
              <li>Machine wash cold inside-out with like colors.</li>
              <li>Tumble dry on low heat or hang dry for best graphic longevity.</li>
              <li>Do NOT iron directly over printed graphic artwork.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
