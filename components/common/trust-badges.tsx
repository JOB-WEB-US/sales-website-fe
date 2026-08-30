'use client';

import React from 'react';
import { ShieldCheck, Lock, RotateCcw, Truck, CheckCircle2 } from 'lucide-react';

export const PaymentIcons = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-1.5 ${className}`}>
      {/* Visa */}
      <div className="bg-white rounded-md px-2 py-1 flex items-center justify-center shadow-sm border border-slate-200 h-7 min-w-[44px] shrink-0" title="Visa">
        <svg viewBox="0 0 48 16" className="h-3.5 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.4 0.8L12.7 15.2H8.4L5.1 3.3C4.9 2.5 4.7 2.2 4.1 1.9C3.1 1.4 1.5 0.9 0 0.6L0.1 0.2H7.1C8 0.2 8.8 0.8 9 1.9L10.7 10.7L15 0.8H19.4ZM36.5 10.3C36.5 6.4 31.1 6.2 31.1 4.4C31.1 3.8 31.7 3.2 32.9 3C33.5 2.9 35.1 2.8 36.6 3.5L37.3 0.6C36.4 0.2 35.1 0 33.6 0C29.5 0 26.6 2.2 26.6 5.3C26.6 7.6 28.7 8.9 30.2 9.7C31.8 10.5 32.3 11 32.3 11.7C32.3 12.8 31 13.3 29.8 13.3C27.7 13.3 26.5 13 25.1 12.4L24.4 15.4C25.4 15.8 27.4 16.2 29.4 16.2C33.8 16.2 36.5 14 36.5 10.3ZM47.4 15.2H51.2L47.9 0.2H44.4C43.6 0.2 42.9 0.7 42.6 1.4L36.4 15.2H40.7L41.6 12.8H46.8L47.4 15.2ZM42.7 9.8L44.8 4.1L46 9.8H42.7ZM25.4 0.2L22 15.2H17.9L21.3 0.2H25.4Z" fill="#1A1F71"/>
        </svg>
      </div>

      {/* Mastercard */}
      <div className="bg-white rounded-md px-2 py-1 flex items-center justify-center shadow-sm border border-slate-200 h-7 min-w-[44px] shrink-0" title="Mastercard">
        <svg viewBox="0 0 32 20" className="h-4 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="10" r="10" fill="#EB001B"/>
          <circle cx="21" cy="10" r="10" fill="#F79E1B"/>
          <path d="M16 3.7A9.9 9.9 0 0 1 19.8 10 9.9 9.9 0 0 1 16 16.3 9.9 9.9 0 0 1 12.2 10 9.9 9.9 0 0 1 16 3.7Z" fill="#FF5F00"/>
        </svg>
      </div>

      {/* PayPal */}
      <div className="bg-white rounded-md px-2 py-1 flex items-center justify-center shadow-sm border border-slate-200 h-7 min-w-[44px] shrink-0" title="PayPal">
        <div className="flex items-center gap-1">
          <svg viewBox="0 0 24 24" className="h-3.5 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 3h6.5c3 0 5 1.7 4.5 4.5-.5 3-2.7 4.5-5.5 4.5h-2l-1.2 7H5.5L7 3z" fill="#003087"/>
            <path d="M9.5 7.5h6.5c3 0 4.5 1.5 4 4.5-.5 3-2.7 4.5-5.5 4.5h-2l-1.2 7H7.5l2-16z" fill="#0079C1" opacity="0.85"/>
          </svg>
          <span className="text-[10px] font-black text-[#003087] tracking-tight">Pay</span>
        </div>
      </div>

      {/* Apple Pay - Always crisp white text on black background */}
      <div 
        className="bg-black rounded-md px-2.5 py-1 flex items-center justify-center shadow-sm border border-neutral-800 h-7 min-w-[44px] shrink-0" 
        title="Apple Pay"
        style={{ backgroundColor: '#000000', borderColor: '#262626' }}
      >
        <div className="flex items-center gap-1">
          <svg viewBox="0 0 170 170" className="h-3 w-auto fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-5.77-8.91-10.27-18.9-13.5-29.96-3.23-11.06-4.85-21.75-4.85-32.08 0-14.07 3.59-25.75 10.77-35.03 7.18-9.29 16.27-13.99 27.27-14.12 5.01 0 10.42 1.29 16.23 3.86 5.8 2.58 9.4 3.93 10.79 4.06 1.63-.26 5.56-1.74 11.78-4.43 6.23-2.69 11.77-3.9 16.64-3.63 12.63.65 22.51 5.37 29.62 14.16-10.99 6.64-16.36 15.68-16.1 27.13.25 9.01 3.73 16.51 10.44 22.49 6.71 5.98 14.54 9.29 23.49 9.94-2.18 6.65-4.9 13.5-8.16 20.54zm-37.16-115.6c0 6.65-2.5 12.92-7.51 17.81-5.01 4.89-11.01 7.79-18.01 8.68-.87-6.52 1.49-12.83 7.07-17.72 5.58-4.89 12.06-7.89 18.45-8.77z"/>
          </svg>
          <span 
            className="text-[10.5px] font-bold tracking-tight"
            style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
          >
            Pay
          </span>
        </div>
      </div>

      {/* Google Pay */}
      <div className="bg-white rounded-md px-2 py-1 flex items-center justify-center shadow-sm border border-slate-200 h-7 min-w-[44px] shrink-0" title="Google Pay">
        <span className="text-[10.5px] font-bold text-gray-800 tracking-tight flex items-center gap-0.5">
          <span className="text-blue-500 font-black">G</span>Pay
        </span>
      </div>

      {/* American Express */}
      <div 
        className="bg-[#006FCF] rounded-md px-2 py-1 flex items-center justify-center shadow-sm h-7 min-w-[44px] shrink-0" 
        title="American Express"
        style={{ backgroundColor: '#006FCF' }}
      >
        <span 
          className="text-[9px] font-black tracking-tighter"
          style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
        >
          AMEX
        </span>
      </div>

      {/* Discover */}
      <div 
        className="bg-[#FF6000] rounded-md px-2 py-1 flex items-center justify-center shadow-sm h-7 min-w-[44px] shrink-0" 
        title="Discover"
        style={{ backgroundColor: '#FF6000' }}
      >
        <span 
          className="text-[8.5px] font-black tracking-tighter"
          style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
        >
          DISCOVER
        </span>
      </div>
    </div>
  );
};

export interface TrustBadgesProps {
  variant?: 'product' | 'cart' | 'checkout' | 'footer';
  className?: string;
}

export default function TrustBadges({ variant = 'product', className = '' }: TrustBadgesProps) {
  if (variant === 'product') {
    return (
      <div className={`mt-5 pt-5 border-t border-[#262626] dark:border-[#262626] light:border-slate-200 space-y-4 ${className}`}>
        {/* Payment Methods header */}
        <div className="text-center space-y-2.5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-300">
            <Lock size={14} className="text-emerald-500 shrink-0" />
            <span>Guaranteed Safe & Secure Checkout</span>
          </div>
          <PaymentIcons />
        </div>

        {/* 3 Trust Feature Pills */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#222] dark:border-[#222] light:border-slate-200 text-center">
          <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#181818] dark:bg-[#181818] light:bg-slate-50 border border-[#262626] dark:border-[#262626] light:border-slate-200">
            <Lock size={16} className="text-emerald-500 mb-1" />
            <span className="text-[11px] font-extrabold text-white dark:text-white light:text-slate-900 leading-tight">256-Bit SSL</span>
            <span className="text-[9px] text-gray-400 dark:text-gray-400 light:text-slate-500">Encrypted</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#181818] dark:bg-[#181818] light:bg-slate-50 border border-[#262626] dark:border-[#262626] light:border-slate-200">
            <RotateCcw size={16} className="text-[#ff7700] mb-1" />
            <span className="text-[11px] font-extrabold text-white dark:text-white light:text-slate-900 leading-tight">30-Day</span>
            <span className="text-[9px] text-gray-400 dark:text-gray-400 light:text-slate-500">Money Back</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#181818] dark:bg-[#181818] light:bg-slate-50 border border-[#262626] dark:border-[#262626] light:border-slate-200">
            <Truck size={16} className="text-blue-400 mb-1" />
            <span className="text-[11px] font-extrabold text-white dark:text-white light:text-slate-900 leading-tight">Fast US</span>
            <span className="text-[9px] text-gray-400 dark:text-gray-400 light:text-slate-500">Tracked Delivery</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'cart') {
    return (
      <div className={`pt-3 border-t border-gray-200 dark:border-[#262626] space-y-2 text-center ${className}`}>
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span>Guaranteed Safe & Secure Checkout</span>
        </div>
        <PaymentIcons />
      </div>
    );
  }

  if (variant === 'checkout') {
    return (
      <div className={`p-4 bg-[#181818] dark:bg-[#181818] light:bg-slate-50 border border-[#262626] dark:border-[#262626] light:border-slate-200 rounded-2xl space-y-3 shadow-md ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-500" />
            <span className="text-xs font-bold text-white dark:text-white light:text-slate-900 uppercase tracking-wider">VELORA Buyer Protection</span>
          </div>
          <span className="text-[10px] bg-emerald-950/80 text-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 light:bg-emerald-100 light:text-emerald-800 border border-emerald-800/60 light:border-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
            100% Guaranteed
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-300 dark:text-gray-300 light:text-slate-700">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            <span>30-Day Money Back</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            <span>Premium DTG Print Quality</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            <span>USPS Tracked Shipping</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#262626] dark:border-[#262626] light:border-slate-200">
          <PaymentIcons />
        </div>
      </div>
    );
  }

  // Footer variant
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 ${className}`}>
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-gray-400 dark:text-gray-400 light:text-slate-600">
        <span className="flex items-center gap-1 font-semibold text-gray-300 dark:text-gray-300 light:text-slate-700">
          <Lock size={13} className="text-emerald-500" /> 256-Bit SSL Secure Checkout
        </span>
        <span className="hidden sm:inline">•</span>
        <span className="flex items-center gap-1 font-semibold text-gray-300 dark:text-gray-300 light:text-slate-700">
          <RotateCcw size={13} className="text-[#ff7700]" /> 30-Day Money-Back Guarantee
        </span>
        <span className="hidden sm:inline">•</span>
        <span className="flex items-center gap-1 font-semibold text-gray-300 dark:text-gray-300 light:text-slate-700">
          <Truck size={13} className="text-blue-400" /> USPS Tracked Shipping
        </span>
      </div>
      <PaymentIcons />
    </div>
  );
}
