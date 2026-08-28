'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Flame, ShoppingCart, Sparkles, Clock, ShieldCheck, Zap } from 'lucide-react';

interface ProductLiveActivityProps {
  productId?: string;
}

export default function ProductLiveActivity({ productId }: ProductLiveActivityProps) {
  const [viewersCount, setViewersCount] = useState(14);
  const [cartCount, setCartCount] = useState(5);
  const [sold24h, setSold24h] = useState(38);

  // Slight natural fluctuation in live viewers every 8 seconds
  useEffect(() => {
    // Generate deterministic baseline from productId if present
    const base = productId ? (productId.charCodeAt(0) % 8) + 12 : 14;
    setViewersCount(base);
    setCartCount(Math.max(3, Math.floor(base / 3)));
    setSold24h(base * 2 + 10);

    const interval = setInterval(() => {
      setViewersCount((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
        return Math.min(28, Math.max(8, prev + delta));
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [productId]);

  return (
    <div className="bg-[#181818] border border-[#282828] rounded-2xl p-3.5 space-y-2.5 my-4">
      {/* Top row: Live Viewers with animated pulse */}
      <div className="flex items-center justify-between text-xs font-bold text-gray-200">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <Eye size={13} /> {viewersCount} people
          </span>
          <span className="text-gray-400 font-medium">are viewing this item right now</span>
        </div>

        <span className="text-[10px] bg-[#ff7700]/15 text-[#ff7700] border border-[#ff7700]/30 px-2 py-0.5 rounded-full font-black uppercase tracking-wider hidden sm:inline-block">
          High Demand
        </span>
      </div>

      {/* Second row: Cart additions and 24h sales velocity */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#222] text-[11px]">
        <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
          <Zap size={12} className="text-amber-400 shrink-0" />
          <span><strong>{cartCount}</strong> people have this in cart</span>
        </div>

        <div className="flex items-center gap-1.5 text-gray-300 font-semibold justify-end">
          <Flame size={12} className="text-[#ff7700] shrink-0" />
          <span><strong>{sold24h} sold</strong> in last 24h</span>
        </div>
      </div>
    </div>
  );
}
