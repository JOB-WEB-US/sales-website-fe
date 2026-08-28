'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Ruler, ShieldCheck, RefreshCw, ArrowLeft, Info, Sparkles, UserCheck, HelpCircle } from 'lucide-react';
import ApparelMeasurementDiagram from '@/components/features/products/apparel-measurement-diagram';

type UnitType = 'inches' | 'cm';
type ApparelType = 'tshirt' | 'hoodie' | 'sweatshirt';

const SIZE_DATA: Record<ApparelType, { size: string; widthIn: number; lengthIn: number; widthCm: number; lengthCm: number; weightRec: string; heightRec: string }[]> = {
  tshirt: [
    { size: 'S', widthIn: 18, lengthIn: 28, widthCm: 46, lengthCm: 71, heightRec: '155 – 165 cm', weightRec: '45 – 55 kg' },
    { size: 'M', widthIn: 20, lengthIn: 29, widthCm: 51, lengthCm: 74, heightRec: '165 – 172 cm', weightRec: '55 – 65 kg' },
    { size: 'L', widthIn: 22, lengthIn: 30, widthCm: 56, lengthCm: 76, heightRec: '170 – 178 cm', weightRec: '65 – 75 kg' },
    { size: 'XL', widthIn: 24, lengthIn: 31, widthCm: 61, lengthCm: 79, heightRec: '175 – 185 cm', weightRec: '75 – 85 kg' },
    { size: '2XL', widthIn: 26, lengthIn: 32, widthCm: 66, lengthCm: 81, heightRec: '180 – 190 cm', weightRec: '85 – 98 kg' },
    { size: '3XL', widthIn: 28, lengthIn: 33, widthCm: 71, lengthCm: 84, heightRec: '185+ cm', weightRec: '98 – 110 kg' },
  ],
  hoodie: [
    { size: 'S', widthIn: 20, lengthIn: 27, widthCm: 51, lengthCm: 69, heightRec: '155 – 165 cm', weightRec: '45 – 55 kg' },
    { size: 'M', widthIn: 22, lengthIn: 28, widthCm: 56, lengthCm: 71, heightRec: '165 – 172 cm', weightRec: '55 – 65 kg' },
    { size: 'L', widthIn: 24, lengthIn: 29, widthCm: 61, lengthCm: 74, heightRec: '170 – 178 cm', weightRec: '65 – 75 kg' },
    { size: 'XL', widthIn: 26, lengthIn: 30, widthCm: 66, lengthCm: 76, heightRec: '175 – 185 cm', weightRec: '75 – 85 kg' },
    { size: '2XL', widthIn: 28, lengthIn: 31, widthCm: 71, lengthCm: 79, heightRec: '180 – 190 cm', weightRec: '85 – 98 kg' },
    { size: '3XL', widthIn: 30, lengthIn: 32, widthCm: 76, lengthCm: 81, heightRec: '185+ cm', weightRec: '98 – 110 kg' },
  ],
  sweatshirt: [
    { size: 'S', widthIn: 20, lengthIn: 26, widthCm: 51, lengthCm: 66, heightRec: '155 – 165 cm', weightRec: '45 – 55 kg' },
    { size: 'M', widthIn: 22, lengthIn: 27, widthCm: 56, lengthCm: 69, heightRec: '165 – 172 cm', weightRec: '55 – 65 kg' },
    { size: 'L', widthIn: 24, lengthIn: 28, widthCm: 61, lengthCm: 71, heightRec: '170 – 178 cm', weightRec: '65 – 75 kg' },
    { size: 'XL', widthIn: 26, lengthIn: 29, widthCm: 66, lengthCm: 74, heightRec: '175 – 185 cm', weightRec: '75 – 85 kg' },
    { size: '2XL', widthIn: 28, lengthIn: 30, widthCm: 71, lengthCm: 76, heightRec: '180 – 190 cm', weightRec: '85 – 98 kg' },
    { size: '3XL', widthIn: 30, lengthIn: 31, widthCm: 76, lengthCm: 79, heightRec: '185+ cm', weightRec: '98 – 110 kg' },
  ],
};

export default function ProductDetailsSizingPage() {
  const router = useRouter();
  const [unit, setUnit] = useState<UnitType>('inches');
  const [activeType, setActiveType] = useState<ApparelType>('tshirt');
  const [selectedSize, setSelectedSize] = useState<string>('L');

  const currentData = SIZE_DATA[activeType];
  const activeRow = currentData.find((r) => r.size === selectedSize) || currentData[2];

  const currentWidthStr = unit === 'inches' ? `${activeRow.widthIn}″` : `${activeRow.widthCm} cm`;
  const currentLengthStr = unit === 'inches' ? `${activeRow.lengthIn}″` : `${activeRow.lengthCm} cm`;

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
            Find your perfect fit across all our custom printed apparel with interactive measurement diagrams.
          </p>
        </div>

        {/* Size Chart Card */}
        <div className="bg-[#141414] rounded-3xl border border-[#222] p-6 md:p-8 mb-10 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* Tabs */}
            <div className="flex bg-[#1e1e1e] p-1 rounded-xl border border-[#2a2a2a] w-full sm:w-auto">
              <button
                onClick={() => setActiveType('tshirt')}
                className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                  activeType === 'tshirt' ? 'bg-[#ff7700] text-black shadow font-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                👕 Unisex T-Shirt
              </button>
              <button
                onClick={() => setActiveType('hoodie')}
                className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                  activeType === 'hoodie' ? 'bg-[#ff7700] text-black shadow font-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                🧥 Heavyweight Hoodie
              </button>
              <button
                onClick={() => setActiveType('sweatshirt')}
                className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                  activeType === 'sweatshirt' ? 'bg-[#ff7700] text-black shadow font-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                🧶 Crewneck Sweatshirt
              </button>
            </div>

            {/* Unit Selector */}
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 self-end sm:self-auto">
              <span>Đơn vị:</span>
              <div className="flex bg-[#1e1e1e] p-0.5 rounded-lg border border-[#2a2a2a]">
                <button
                  onClick={() => setUnit('inches')}
                  className={`px-3 py-1 rounded text-xs font-black transition cursor-pointer ${
                    unit === 'inches' ? 'bg-[#ff7700] text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Inches (in)
                </button>
                <button
                  onClick={() => setUnit('cm')}
                  className={`px-3 py-1 rounded text-xs font-black transition cursor-pointer ${
                    unit === 'cm' ? 'bg-[#ff7700] text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Centimet (cm)
                </button>
              </div>
            </div>
          </div>

          {/* Quick Size Select Bar */}
          <div className="mb-6 p-3 bg-[#191919] rounded-2xl border border-[#262626] flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#ff7700]" />
              Chọn Size để xem kích thước minh họa:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {currentData.map((row) => (
                <button
                  key={row.size}
                  onClick={() => setSelectedSize(row.size)}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                    selectedSize === row.size
                      ? 'bg-[#ff7700] text-black scale-105 shadow-md shadow-[#ff7700]/20'
                      : 'bg-[#222] text-gray-300 hover:bg-[#333]'
                  }`}
                >
                  {row.size}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Section: Diagram & Table Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6 items-start">
            {/* Left Col: Visual SVG Garment Measurement Diagram */}
            <div className="md:col-span-5">
              <ApparelMeasurementDiagram
                type={activeType}
                width={currentWidthStr}
                length={currentLengthStr}
                selectedSize={selectedSize}
              />
            </div>

            {/* Right Col: Detailed Size Measurements Table */}
            <div className="md:col-span-7 space-y-3">
              <div className="overflow-x-auto rounded-2xl border border-[#262626]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1c1c1c] text-gray-400 uppercase text-[10px] font-black border-b border-[#262626]">
                    <tr>
                      <th className="py-3 px-3">Size</th>
                      <th className="py-3 px-3">A: Rộng ngực ({unit === 'inches' ? 'in' : 'cm'})</th>
                      <th className="py-3 px-3">B: Dài áo ({unit === 'inches' ? 'in' : 'cm'})</th>
                      <th className="py-3 px-3">Gợi ý Chiều cao / Cân nặng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {currentData.map((row) => {
                      const isRowSelected = selectedSize === row.size;
                      return (
                        <tr
                          key={row.size}
                          onClick={() => setSelectedSize(row.size)}
                          className={`transition cursor-pointer ${
                            isRowSelected
                              ? 'bg-[#ff7700]/15 text-white font-bold'
                              : 'hover:bg-[#1a1a1a] text-gray-300'
                          }`}
                        >
                          <td className="py-3 px-3 font-black text-sm">
                            <span className={isRowSelected ? 'text-[#ff7700]' : 'text-gray-200'}>
                              {row.size}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-semibold">
                            {unit === 'inches' ? `${row.widthIn}″` : `${row.widthCm} cm`}
                          </td>
                          <td className="py-3 px-3 font-semibold">
                            {unit === 'inches' ? `${row.lengthIn}″` : `${row.lengthCm} cm`}
                          </td>
                          <td className="py-3 px-3 text-[11px] text-gray-400">
                            {row.heightRec} • {row.weightRec}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* How to Measure Step-by-Step */}
              <div className="p-3.5 bg-[#181818] border border-[#262626] rounded-xl text-xs space-y-1.5 text-gray-300">
                <div className="font-extrabold text-white flex items-center gap-1.5 text-xs">
                  <HelpCircle size={14} className="text-[#ff7700]" /> Hướng dẫn tự đo tại nhà (2 bước đơn giản):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-400 pt-1">
                  <div>
                    <strong className="text-cyan-400">1. Rộng ngực (A):</strong> Trải phẳng áo bạn đang mặc vừa lên bàn, đo khoảng cách ngang từ nách trái sang nách phải.
                  </div>
                  <div>
                    <strong className="text-pink-400">2. Chiều dài (B):</strong> Đo thẳng từ điểm cao nhất cạnh cổ áo xuống hết mép gấu dưới của áo.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fit Tips & Recommendations */}
          <div className="p-4 bg-[#191919] border border-[#262626] rounded-2xl flex items-start gap-3 text-xs text-gray-400">
            <UserCheck className="w-5 h-5 text-[#ff7700] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-white font-bold block">💡 Lời khuyên chọn form dáng:</strong>
              <p className="leading-relaxed">
                Áo được may theo form <strong>US Unisex Classic Fit</strong> tiêu chuẩn Mỹ. Nếu bạn thích mặc vừa vặn thoải mái hãy chọn đúng size theo bảng gợi ý. Nếu bạn theo đuổi phong cách <strong>Oversized / Streetwear rộng rãi</strong>, hãy tăng lên 1 size!
              </p>
            </div>
          </div>
        </div>

        {/* Care Instructions & Fabric Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#141414] rounded-2xl border border-[#222] p-6 shadow-md">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff7700]" /> Fabric & Printing Quality
            </h3>
            <ul className="space-y-2 text-xs text-gray-300 list-disc pl-4 leading-relaxed">
              <li>100% Premium Ring-Spun Cotton (Heather colors contain polyester blend).</li>
              <li>Pre-shrunk fabric to minimize shrinkage after washing.</li>
              <li>Direct-To-Garment (DTG) high definition vibrant printing ink.</li>
            </ul>
          </div>

          <div className="bg-[#141414] rounded-2xl border border-[#222] p-6 shadow-md">
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
