'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { lookupOrder, confirmOrderDelivery, ApiOrder } from '@/lib/api';
import { formatCurrency } from '@/lib/formatters';
import { 
  Search, 
  Truck, 
  CheckCircle2, 
  Printer, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams?.get('orderId') || '';
  const initialEmail = searchParams?.get('email') || '';

  const [inputOrderId, setInputOrderId] = useState(initialOrderId);
  const [inputEmail, setInputEmail] = useState(initialEmail);
  const [activeOrder, setActiveOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmSuccess, setConfirmSuccess] = useState(false);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const fetchOrder = async (id: string, email?: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const order = await lookupOrder(id.trim(), email?.trim());
      if (order) {
        setActiveOrder(order);
      } else {
        setActiveOrder(null);
        setErrorMsg(`Order "${id}" was not found or verification email does not match. Please verify your order confirmation email.`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Order lookup failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      fetchOrder(initialOrderId, initialEmail);
    }
  }, [initialOrderId, initialEmail]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputOrderId.trim()) {
      setErrorMsg('Please enter your order number.');
      return;
    }
    fetchOrder(inputOrderId, inputEmail);
  };

  const handleConfirmDelivery = async () => {
    if (!activeOrder) return;
    const ok = await confirmOrderDelivery(activeOrder.id);
    if (ok) {
      setConfirmSuccess(true);
      setActiveOrder({ ...activeOrder, status: 'DELIVERED' });
    } else {
      setErrorMsg('Please sign in with the ordering account to confirm delivery receipt.');
    }
  };

  const FAQS = [
    {
      question: 'How long does Print-On-Demand (POD) production take?',
      answer: 'Each graphic tee or hoodie is custom printed on demand after your order is placed! Production typically takes 1 to 3 business days before package dispatch.',
    },
    {
      question: 'Where can I find my Tracking Number?',
      answer: 'Once your order completes production and is handed over to USPS / FedEx, a tracking link with shipping notification will be automatically emailed to you.',
    },
    {
      question: 'Can I change my shipping address after placing an order?',
      answer: 'Address changes can be requested within 12 hours of placing your order by contacting our support team at support@velorastore.com.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0d0d] text-slate-900 dark:text-white py-10 md:py-16 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-red-100 dark:bg-red-950/60 text-[#a80000] dark:text-[#ff7700] border border-red-200 dark:border-red-800/40 text-xs font-extrabold rounded-full mb-3 shadow-xs">
            <Truck className="w-3.5 h-3.5" /> Live Order Status Lookup
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Track Your Package
          </h1>
          <p className="text-slate-600 dark:text-gray-400 text-sm mt-2">
            Enter your order number and billing email to track your order progress.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-[#222] shadow-sm dark:shadow-xl p-6 md:p-8 mb-10">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-5">
              <label className="block text-xs font-bold text-slate-700 dark:text-gray-400 mb-1">Order Number *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. #VEL-123456"
                  value={inputOrderId}
                  onChange={(e) => setInputOrderId(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-[#1c1c1c] border border-slate-200 dark:border-[#333] rounded-xl text-sm font-semibold uppercase text-slate-900 dark:text-white focus:ring-2 focus:ring-[#a80000] dark:focus:ring-[#ff7700] outline-none transition"
                />
                <Search className="w-4 h-4 text-slate-400 dark:text-gray-500 absolute left-3 top-3" />
              </div>
            </div>

            <div className="sm:col-span-5">
              <label className="block text-xs font-bold text-slate-700 dark:text-gray-400 mb-1">Order Email *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  className="w-full pl-3.5 pr-3.5 py-2.5 bg-slate-50 dark:bg-[#1c1c1c] border border-slate-200 dark:border-[#333] rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#a80000] dark:focus:ring-[#ff7700] outline-none transition"
                />
              </div>
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#a80000] hover:bg-[#800000] text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Tracking...' : 'Track Order'}
              </button>
            </div>
          </form>

          {errorMsg && (
            <div className="mt-4 p-3.5 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" /> {errorMsg}
            </div>
          )}
        </div>

        {/* ORDER DETAILS & TIMELINE */}
        {activeOrder && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 mb-12"
          >
            {/* Status Summary Banner */}
            <div className="bg-white dark:bg-gradient-to-r dark:from-[#181818] dark:via-[#141414] dark:to-red-950/60 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-[#222] shadow-sm dark:shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-[#a80000] text-white text-xs font-bold rounded-full mb-2 uppercase">
                  STATUS: {activeOrder.status}
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Order {activeOrder.orderNumber}
                </h2>
                <p className="text-slate-600 dark:text-gray-400 text-xs mt-1">
                  Recipient: <span className="font-bold text-slate-900 dark:text-gray-200">{activeOrder.customerName}</span> ({activeOrder.customerEmail})
                </p>
                {activeOrder.trackingNumber && (
                  <p className="text-xs text-purple-700 dark:text-purple-400 font-mono font-bold mt-1.5 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" /> Tracking: {activeOrder.trackingNumber} ({activeOrder.carrier || 'USPS'})
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {activeOrder.status !== 'DELIVERED' && (
                  <button
                    onClick={handleConfirmDelivery}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    <Check size={16} /> Confirm Delivery
                  </button>
                )}
                {confirmSuccess && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 self-center">
                    Delivery confirmed!
                  </span>
                )}
              </div>
            </div>

            {/* Visual Stepper */}
            <div className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-[#222] shadow-sm dark:shadow-xl p-6 md:p-8">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6">
                Fulfillment Process
              </h3>

              {(() => {
                const status = activeOrder.status;
                const stepIndex = status === 'PLACED' ? 1 
                                : status === 'PRINTING' ? 2 
                                : status === 'SHIPPED' ? 3 
                                : 4;
                return (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                    <div className="flex md:flex-col items-center md:text-center gap-4 md:gap-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        ✓
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">1. Order Placed</p>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400">Verified</p>
                      </div>
                    </div>

                    <div className={`flex md:flex-col items-center md:text-center gap-4 md:gap-2 ${stepIndex < 2 ? 'opacity-50' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                        stepIndex > 2 
                          ? "bg-emerald-600 text-white" 
                          : stepIndex === 2 
                            ? "bg-[#a80000] text-white ring-4 ring-red-100 dark:ring-red-950 animate-pulse" 
                            : "bg-slate-100 dark:bg-[#222] text-slate-400 dark:text-gray-400 border border-slate-200 dark:border-transparent"
                      }`}>
                        {stepIndex > 2 ? "✓" : <Printer className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${stepIndex === 2 ? 'text-[#a80000] dark:text-[#ff7700]' : 'text-slate-900 dark:text-white'}`}>2. POD Printing</p>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400">Artwork Production</p>
                      </div>
                    </div>

                    <div className={`flex md:flex-col items-center md:text-center gap-4 md:gap-2 ${stepIndex < 3 ? 'opacity-50' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                        stepIndex > 3 
                          ? "bg-emerald-600 text-white" 
                          : stepIndex === 3 
                            ? "bg-[#a80000] text-white ring-4 ring-red-100 dark:ring-red-950 animate-pulse" 
                            : "bg-slate-100 dark:bg-[#222] text-slate-400 dark:text-gray-400 border border-slate-200 dark:border-transparent"
                      }`}>
                        {stepIndex > 3 ? "✓" : <Truck className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${stepIndex === 3 ? 'text-[#a80000] dark:text-[#ff7700]' : 'text-slate-900 dark:text-white'}`}>3. In Transit</p>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400">Carrier Handover</p>
                      </div>
                    </div>

                    <div className={`flex md:flex-col items-center md:text-center gap-4 md:gap-2 ${stepIndex < 4 ? 'opacity-50' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                        stepIndex === 4 
                          ? "bg-emerald-600 text-white" 
                          : "bg-slate-100 dark:bg-[#222] text-slate-400 dark:text-gray-400 border border-slate-200 dark:border-transparent"
                      }`}>
                        {stepIndex === 4 ? "✓" : <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${stepIndex === 4 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>4. Delivered</p>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400">Destination Arrival</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Order Items Breakdown */}
            <div className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-[#222] shadow-sm dark:shadow-xl p-6 md:p-8">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-[#222] pb-3 mb-4">
                Items in Package ({activeOrder.items.length})
              </h3>
              
              <div className="space-y-4 divide-y divide-slate-100 dark:divide-[#222]">
                {activeOrder.items.map((item, idx) => {
                  const frontImg = item.product?.frontImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80';
                  const title = item.product?.title || `Graphic Product (${item.productType})`;
                  return (
                    <div key={idx} className="pt-3 first:pt-0 flex gap-4 items-center">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-[#222] border border-slate-200 dark:border-[#333] flex-shrink-0">
                        <Image src={frontImg} alt={title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{title}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                          {item.productType} • {item.color} • Size {item.size} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-extrabold text-[#c2410c] dark:text-[#ff7700]">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}

        {/* FREQUENTLY ASKED QUESTIONS */}
        <div className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-[#222] shadow-sm dark:shadow-xl p-6 md:p-8">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#a80000] dark:text-[#ff7700]" /> Tracking FAQ & Production Info
          </h3>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="border border-slate-200 dark:border-[#222] rounded-xl overflow-hidden bg-slate-50 dark:bg-[#181818] transition">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs md:text-sm text-slate-900 dark:text-white flex items-center justify-between hover:bg-slate-100 dark:hover:bg-[#202020] transition-colors cursor-pointer"
                  >
                    <span className="text-slate-900 dark:text-white">{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500 dark:text-gray-400" /> : <ChevronDown className="w-4 h-4 text-slate-500 dark:text-gray-400" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 pt-0 text-xs text-slate-600 dark:text-gray-300 leading-relaxed border-t border-slate-200 dark:border-[#262626] bg-slate-50 dark:bg-[#181818]"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-[#0d0d0d] flex items-center justify-center text-slate-900 dark:text-white">Loading tracker...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
