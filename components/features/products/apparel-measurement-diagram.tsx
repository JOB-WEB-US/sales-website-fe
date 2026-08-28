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
    <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Badge */}
      <div className="absolute top-3 left-3 bg-[#ff7700]/10 border border-[#ff7700]/30 text-[#ff7700] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
        Size {selectedSize} Diagram
      </div>

      {/* SVG Garment Illustration with Measurement Lines */}
      <div className="relative w-64 h-64 my-1 flex items-center justify-center">
        <svg
          viewBox="0 0 250 230"
          className="w-full h-full text-slate-700 dark:text-[#252525] drop-shadow-md"
          fill="currentColor"
        >
          {/* Garment Shapes (Centered around X = 95) */}
          {type === 'tshirt' && (
            <path
              d="M 60 30 Q 95 48 130 30 L 170 68 L 148 95 L 135 85 L 135 195 L 55 195 L 55 85 L 42 95 L 20 68 Z"
              fill="#202020"
              stroke="#ff7700"
              strokeWidth="2.5"
            />
          )}

          {type === 'hoodie' && (
            <>
              {/* Hood */}
              <path
                d="M 65 38 C 65 10, 125 10, 125 38 Z"
                fill="#2a2a2a"
                stroke="#ff7700"
                strokeWidth="2"
              />
              {/* Body */}
              <path
                d="M 60 38 Q 95 52 130 38 L 175 80 L 152 110 L 138 98 L 138 198 L 52 198 L 52 98 L 38 110 L 15 80 Z"
                fill="#202020"
                stroke="#ff7700"
                strokeWidth="2.5"
              />
              {/* Kangaroo Pocket */}
              <path
                d="M 68 145 L 122 145 L 130 178 L 60 178 Z"
                fill="#181818"
                stroke="#555"
                strokeWidth="1.5"
              />
            </>
          )}

          {type === 'sweatshirt' && (
            <path
              d="M 60 30 Q 95 44 130 30 L 175 75 L 152 105 L 138 92 L 138 198 L 52 198 L 52 92 L 38 105 L 15 75 Z"
              fill="#202020"
              stroke="#ff7700"
              strokeWidth="2.5"
            />
          )}

          {/* Collar Detail */}
          <path
            d="M 70 30 Q 95 44 120 30"
            fill="none"
            stroke="#ff7700"
            strokeWidth="2"
          />

          {/* ============================================================
              1. WIDTH (A) MEASUREMENT - CHEST LINE
             ============================================================ */}
          <line
            x1="55"
            y1="108"
            x2="135"
            y2="108"
            stroke="#00e5ff"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          {/* Arrow Heads */}
          <polygon points="55,108 61,104 61,112" fill="#00e5ff" />
          <polygon points="135,108 129,104 129,112" fill="#00e5ff" />

          {/* ============================================================
              2. LENGTH (B) MEASUREMENT - EXTERIOR RIGHT RULER
             ============================================================ */}
          {/* Top Extension Guide Line (From Shoulder Level Y=30 to Ruler X=195) */}
          <line
            x1="125"
            y1="30"
            x2="210"
            y2="30"
            stroke="#ff0055"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.6"
          />

          {/* Bottom Extension Guide Line (From Hem Level Y=195 to Ruler X=195) */}
          <line
            x1="135"
            y1="195"
            x2="210"
            y2="195"
            stroke="#ff0055"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.6"
          />

          {/* Vertical Measurement Line on Right Side */}
          <line
            x1="200"
            y1="30"
            x2="200"
            y2="195"
            stroke="#ff0055"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          {/* Vertical Arrow Heads */}
          <polygon points="200,30 196,36 204,36" fill="#ff0055" />
          <polygon points="200,195 196,189 204,189" fill="#ff0055" />
        </svg>

        {/* Width Measurement Label (A) - Placed cleanly inside chest */}
        <div className="absolute top-[43%] left-[38%] -translate-x-1/2 bg-[#00e5ff] text-black font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap border border-cyan-200">
          A: {width} (Chest Width)
        </div>

        {/* Length Measurement Label (B) - Placed clearly along the right exterior ruler */}
        <div className="absolute right-0 top-[49%] -translate-y-1/2 bg-[#ff0055] text-white font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap border border-pink-300">
          B: {length} (Length)
        </div>
      </div>

      {/* Legend & Summary */}
      <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-[#262626] text-[11px]">
        <div className="flex items-center gap-1.5 justify-center font-bold text-cyan-400">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff]"></span>
          <span>A: Chest Width ({width})</span>
        </div>
        <div className="flex items-center gap-1.5 justify-center font-bold text-pink-400">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff0055]"></span>
          <span>B: Body Length ({length})</span>
        </div>
      </div>
    </div>
  );
}
