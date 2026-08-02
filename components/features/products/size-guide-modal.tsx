'use client';

import React, { useState } from 'react';
import { X, Ruler, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/useUIStore';

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

export default function SizeGuideModal() {
  const { isSizeGuideOpen, closeSizeGuide } = useUIStore();
  const [unit, setUnit] = useState<UnitType>('inches');
  const [activeType, setActiveType] = useState<ApparelType>('tshirt');

  if (!isSizeGuideOpen) return null;

  const currentData = SIZE_DATA[activeType];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-[#141414] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden text-white p-6 md:p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#262626] pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <Ruler className="w-5 h-5 text-[#ff7700]" />
              <h3 className="text-lg font-bold font-heading uppercase tracking-wider">
                Official Size & Fitting Guide
              </h3>
            </div>
            <button
              onClick={closeSizeGuide}
              className="p-1.5 rounded-lg bg-[#222] hover:bg-[#333] text-gray-300 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Controls: Apparel Type Tabs & Unit Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* Apparel Tabs */}
            <div className="flex bg-[#1e1e1e] p-1 rounded-xl border border-[#2a2a2a]">
              <button
                onClick={() => setActiveType('tshirt')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                  activeType === 'tshirt' ? 'bg-[#ff7700] text-black shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Unisex Tee
              </button>
              <button
                onClick={() => setActiveType('hoodie')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                  activeType === 'hoodie' ? 'bg-[#ff7700] text-black shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Hoodie
              </button>
              <button
                onClick={() => setActiveType('sweatshirt')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                  activeType === 'sweatshirt' ? 'bg-[#ff7700] text-black shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Sweatshirt
              </button>
            </div>

            {/* Unit Toggle */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
              <span>Unit:</span>
              <div className="flex bg-[#1e1e1e] p-0.5 rounded-lg border border-[#2a2a2a]">
                <button
                  onClick={() => setUnit('inches')}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                    unit === 'inches' ? 'bg-[#a80000] text-white' : 'text-gray-400'
                  }`}
                >
                  Inches (in)
                </button>
                <button
                  onClick={() => setUnit('cm')}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                    unit === 'cm' ? 'bg-[#a80000] text-white' : 'text-gray-400'
                  }`}
                >
                  CM
                </button>
              </div>
            </div>
          </div>

          {/* Measurements Table */}
          <div className="overflow-x-auto rounded-xl border border-[#262626] mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c] text-gray-400 uppercase text-[11px] font-bold border-b border-[#262626]">
                <tr>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Chest Width ({unit === 'inches' ? 'in' : 'cm'})</th>
                  <th className="py-3 px-4">Body Length ({unit === 'inches' ? 'in' : 'cm'})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {currentData.map((row) => (
                  <tr key={row.size} className="hover:bg-[#1a1a1a] transition">
                    <td className="py-2.5 px-4 font-extrabold text-[#ff7700]">{row.size}</td>
                    <td className="py-2.5 px-4 text-gray-300 font-medium">
                      {unit === 'inches' ? `${row.widthIn}″` : `${row.widthCm} cm`}
                    </td>
                    <td className="py-2.5 px-4 text-gray-300 font-medium">
                      {unit === 'inches' ? `${row.lengthIn}″` : `${row.lengthCm} cm`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fit Tips */}
          <div className="p-3.5 bg-[#191919] border border-[#262626] rounded-xl flex items-start gap-3 text-xs text-gray-400">
            <Info className="w-4 h-4 text-[#ff7700] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-semibold block mb-0.5">Fit Recommendation:</strong>
              All tees are standard unisex retail fit. For an oversized streetwear look, we recommend ordering 1 size up!
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
