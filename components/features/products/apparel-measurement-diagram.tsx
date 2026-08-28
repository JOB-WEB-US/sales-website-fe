'use client';

import React from 'react';

interface ApparelMeasurementDiagramProps {
  type: 'tshirt' | 'hoodie' | 'sweatshirt';
  width: string;
  length: string;
  selectedSize?: string;
}

export default function ApparelMeasurementDiagram({
  type,
  width,
  length,
  selectedSize = 'M',
}: ApparelMeasurementDiagramProps) {
  return (
    <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Badge */}
      <div className="absolute top-3 left-3 bg-[#ff7700]/10 border border-[#ff7700]/30 text-[#ff7700] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
        Size {selectedSize} Diagram
      </div>

      {/* SVG Garment Illustration with Measurement Lines */}
      <div className="relative w-56 h-60 my-2 flex items-center justify-center">
        <svg
          viewBox="0 0 200 220"
          className="w-full h-full text-slate-700 dark:text-[#252525] drop-shadow-md"
          fill="currentColor"
          stroke="#444"
          strokeWidth="2"
        >
          {type === 'tshirt' && (
            <path
              d="M 65 25 Q 100 45 135 25 L 180 65 L 155 95 L 140 85 L 140 195 L 60 195 L 60 85 L 45 95 L 20 65 Z"
              fill="#202020"
              stroke="#ff7700"
              strokeWidth="2.5"
            />
          )}

          {type === 'hoodie' && (
            <>
              {/* Hood */}
              <path
                d="M 70 35 C 70 5, 130 5, 130 35 Z"
                fill="#2a2a2a"
                stroke="#ff7700"
                strokeWidth="2"
              />
              {/* Body */}
              <path
                d="M 65 35 Q 100 50 135 35 L 185 80 L 160 115 L 145 100 L 145 200 L 55 200 L 55 100 L 40 115 L 15 80 Z"
                fill="#202020"
                stroke="#ff7700"
                strokeWidth="2.5"
              />
              {/* Pocket */}
              <path
                d="M 75 140 L 125 140 L 135 175 L 65 175 Z"
                fill="#181818"
                stroke="#555"
                strokeWidth="1.5"
              />
            </>
          )}

          {type === 'sweatshirt' && (
            <path
              d="M 65 25 Q 100 40 135 25 L 185 75 L 160 110 L 145 95 L 145 200 L 55 200 L 55 95 L 40 110 L 15 75 Z"
              fill="#202020"
              stroke="#ff7700"
              strokeWidth="2.5"
            />
          )}

          {/* Collar detail */}
          <path
            d="M 75 25 Q 100 40 125 25"
            fill="none"
            stroke="#ff7700"
            strokeWidth="2"
          />

          {/* Width Arrow (A) */}
          <line
            x1="62"
            y1="110"
            x2="138"
            y2="110"
            stroke="#00e5ff"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />
          {/* Arrow heads */}
          <polygon points="62,110 68,106 68,114" fill="#00e5ff" />
          <polygon points="138,110 132,106 132,114" fill="#00e5ff" />

          {/* Length Arrow (B) */}
          <line
            x1="100"
            y1="35"
            x2="100"
            y2="195"
            stroke="#ff0055"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />
          {/* Arrow heads */}
          <polygon points="100,35 96,41 104,41" fill="#ff0055" />
          <polygon points="100,195 96,189 104,189" fill="#ff0055" />
        </svg>

        {/* Width Measurement Label (A) */}
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 bg-[#00e5ff] text-black font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap border border-cyan-300">
          A: {width} (Chest Width)
        </div>

        {/* Length Measurement Label (B) */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff0055] text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap border border-pink-400">
          B: {length} (Length)
        </div>
      </div>

      {/* Legend & Summary */}
      <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-[#262626] text-[11px]">
        <div className="flex items-center gap-1.5 justify-center font-bold text-cyan-400">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff]"></span>
          <span>A: Rộng ngực ({width})</span>
        </div>
        <div className="flex items-center gap-1.5 justify-center font-bold text-pink-400">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff0055]"></span>
          <span>B: Dài áo ({length})</span>
        </div>
      </div>
    </div>
  );
}
