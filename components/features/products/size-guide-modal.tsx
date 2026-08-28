'use client';

import React, { useState } from 'react';
import { X, Ruler, Check, Info, Sparkles, UserCheck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/useUIStore';
import ApparelMeasurementDiagram from './apparel-measurement-diagram';

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
    { size: '4XL', widthIn: 30, lengthIn: 34, widthCm: 76, lengthCm: 86, heightRec: '185+ cm', weightRec: '110 – 125 kg' },
    { size: '5XL', widthIn: 32, lengthIn: 35, widthCm: 81, lengthCm: 89, heightRec: '185+ cm', weightRec: '125+ kg' },
  ],
  hoodie: [
    { size: 'S', widthIn: 20, lengthIn: 27, widthCm: 51, lengthCm: 69, heightRec: '155 – 165 cm', weightRec: '45 – 55 kg' },
    { size: 'M', widthIn: 22, lengthIn: 28, widthCm: 56, lengthCm: 71, heightRec: '165 – 172 cm', weightRec: '55 – 65 kg' },
    { size: 'L', widthIn: 24, lengthIn: 29, widthCm: 61, lengthCm: 74, heightRec: '170 – 178 cm', weightRec: '65 – 75 kg' },
    { size: 'XL', widthIn: 26, lengthIn: 30, widthCm: 66, lengthCm: 76, heightRec: '175 – 185 cm', weightRec: '75 – 85 kg' },
    { size: '2XL', widthIn: 28, lengthIn: 31, widthCm: 71, lengthCm: 79, heightRec: '180 – 190 cm', weightRec: '85 – 98 kg' },
    { size: '3XL', widthIn: 30, lengthIn: 32, widthCm: 76, lengthCm: 81, heightRec: '185+ cm', weightRec: '98 – 110 kg' },
    { size: '4XL', widthIn: 32, lengthIn: 33, widthCm: 81, lengthCm: 84, heightRec: '185+ cm', weightRec: '110 – 125 kg' },
    { size: '5XL', widthIn: 34, lengthIn: 34, widthCm: 86, lengthCm: 86, heightRec: '185+ cm', weightRec: '125+ kg' },
  ],
  sweatshirt: [
    { size: 'S', widthIn: 20, lengthIn: 26, widthCm: 51, lengthCm: 66, heightRec: '155 – 165 cm', weightRec: '45 – 55 kg' },
    { size: 'M', widthIn: 22, lengthIn: 27, widthCm: 56, lengthCm: 69, heightRec: '165 – 172 cm', weightRec: '55 – 65 kg' },
    { size: 'L', widthIn: 24, lengthIn: 28, widthCm: 61, lengthCm: 71, heightRec: '170 – 178 cm', weightRec: '65 – 75 kg' },
    { size: 'XL', widthIn: 26, lengthIn: 29, widthCm: 66, lengthCm: 74, heightRec: '175 – 185 cm', weightRec: '75 – 85 kg' },
    { size: '2XL', widthIn: 28, lengthIn: 30, widthCm: 71, lengthCm: 76, heightRec: '180 – 190 cm', weightRec: '85 – 98 kg' },
    { size: '3XL', widthIn: 30, lengthIn: 31, widthCm: 76, lengthCm: 79, heightRec: '185+ cm', weightRec: '98 – 110 kg' },
    { size: '4XL', widthIn: 32, lengthIn: 32, widthCm: 81, lengthCm: 81, heightRec: '185+ cm', weightRec: '110 – 125 kg' },
    { size: '5XL', widthIn: 34, lengthIn: 33, widthCm: 86, lengthCm: 84, heightRec: '185+ cm', weightRec: '125+ kg' },
  ],
};

export default function SizeGuideModal() {
  const { isSizeGuideOpen, closeSizeGuide } = useUIStore();
  const [unit, setUnit] = useState<UnitType>('inches');
  const [activeType, setActiveType] = useState<ApparelType>('tshirt');
  const [selectedSize, setSelectedSize] = useState<string>('L');

  if (!isSizeGuideOpen) return null;

  const currentData = SIZE_DATA[activeType];
  const activeRow = currentData.find((r) => r.size === selectedSize) || currentData[2];

  const currentWidthStr = unit === 'inches' ? `${activeRow.widthIn}″` : `${activeRow.widthCm} cm`;
  const currentLengthStr = unit === 'inches' ? `${activeRow.lengthIn}″` : `${activeRow.lengthCm} cm`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-[#141414] border border-[#2a2a2a] rounded-3xl shadow-2xl overflow-hidden text-white p-5 sm:p-8 my-6 max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#262626] pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#ff7700]/10 text-[#ff7700] border border-[#ff7700]/30">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black font-heading uppercase tracking-wider text-white">
                  Bảng Thông Số Size & Hình Ảnh Minh Họa Đo
                </h3>
                <p className="text-xs text-gray-400 font-medium">Standard US Unisex Retail Fit Guide</p>
              </div>
            </div>
            <button
              onClick={closeSizeGuide}
              className="p-2 rounded-xl bg-[#222] hover:bg-[#333] text-gray-300 hover:text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Top Controls: Apparel Type Tabs & Unit Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* Apparel Tabs */}
            <div className="flex bg-[#1e1e1e] p-1 rounded-xl border border-[#2a2a2a] w-full sm:w-auto">
              <button
                onClick={() => setActiveType('tshirt')}
                className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                  activeType === 'tshirt' ? 'bg-[#ff7700] text-black shadow font-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                👕 Unisex Tee
              </button>
              <button
                onClick={() => setActiveType('hoodie')}
                className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                  activeType === 'hoodie' ? 'bg-[#ff7700] text-black shadow font-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                🧥 Hoodie
              </button>
              <button
                onClick={() => setActiveType('sweatshirt')}
                className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                  activeType === 'sweatshirt' ? 'bg-[#ff7700] text-black shadow font-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                🧶 Sweatshirt
              </button>
            </div>

            {/* Unit Toggle */}
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
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">A: Rộng ngực ({unit === 'inches' ? 'in' : 'cm'})</th>
                      <th className="py-2.5 px-3">B: Dài áo ({unit === 'inches' ? 'in' : 'cm'})</th>
                      <th className="py-2.5 px-3">Gợi ý Chiều cao / Cân nặng</th>
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
                          <td className="py-2.5 px-3 font-black text-sm">
                            <span className={isRowSelected ? 'text-[#ff7700]' : 'text-gray-200'}>
                              {row.size}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold">
                            {unit === 'inches' ? `${row.widthIn}″` : `${row.widthCm} cm`}
                          </td>
                          <td className="py-2.5 px-3 font-semibold">
                            {unit === 'inches' ? `${row.lengthIn}″` : `${row.lengthCm} cm`}
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-gray-400">
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
