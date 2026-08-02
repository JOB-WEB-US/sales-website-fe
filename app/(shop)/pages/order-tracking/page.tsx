'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getOrderById } from '@/lib/mock-orders';
import { Order } from '@/types/orders';
import { formatCurrency } from '@/lib/formatters';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Printer, 
  Clock, 
  MapPin, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams?.get('orderId') || 'VELORA-84920';

  const [inputOrderId, setInputOrderId] = useState(initialOrderId);
  const [inputEmail, setInputEmail] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Open FAQ Accordion items
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    if (initialOrderId) {
      const order = getOrderById(initialOrderId);
      if (order) {
        setActiveOrder(order);
        setHasSearched(true);
      }
    }
  }, [initialOrderId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!inputOrderId.trim()) {
      setErrorMsg('Please enter a valid Order ID (e.g. VELORA-84920)');
      return;
    }

    const order = getOrderById(inputOrderId.trim());
    if (order) {
      setActiveOrder(order);
      setHasSearched(true);
    } else {
      setActiveOrder(null);
      setHasSearched(true);
      setErrorMsg(`No order found matching "${inputOrderId}". Please check your order confirmation email.`);
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
    <div className="min-h-screen bg-gray-50/50 py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-red-100 text-red-700 text-xs font-extrabold rounded-full mb-3">
            <Truck className="w-3.5 h-3.5" /> Order Status Lookup
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Track Your Package
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Enter your order number and email address to view real-time POD printing progress and tracking details.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-10">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <label className="block text-xs font-bold text-gray-700 mb-1">Order Number *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. VELORA-84920"
                  value={inputOrderId}
                  onChange={(e) => setInputOrderId(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold uppercase focus:bg-white focus:ring-2 focus:ring-red-600 outline-none"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-red-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                Track
              </button>
            </div>
          </form>

          {errorMsg && (
            <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errorMsg}
            </div>
          )}
        </div>

        {/* ORDER DETAILS & TIMELINE (If Found) */}
        {activeOrder && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 mb-12"
          >
            {/* Status Summary Banner */}
            <div className="bg-gradient-to-r from-red-800 to-red-900 text-white rounded-2xl p-6 md:p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-2 uppercase">
                  Order Status: {activeOrder.status === 'printing' ? 'In POD Production' : activeOrder.status}
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold">
                  Order #{activeOrder.id}
                </h2>
                <p className="text-red-100 text-xs mt-1">
                  Placed on {new Date(activeOrder.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-xl border border-white/20 text-right md:text-right">
                <p className="text-[11px] text-red-200 uppercase font-semibold">Estimated Delivery</p>
                <p className="text-lg font-black text-white">{activeOrder.estimatedDeliveryDate}</p>
              </div>
            </div>

            {/* Visual Stepper */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h3 className="text-sm font-bold text-gray-900 mb-6">
                Fulfillment Process
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                
                {/* Step 1 */}
                <div className="flex md:flex-col items-center md:text-center gap-4 md:gap-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">1. Order Placed</p>
                    <p className="text-[11px] text-gray-500">Confirmed & Verified</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex md:flex-col items-center md:text-center gap-4 md:gap-2">
                  <div className="w-10 h-10 rounded-full bg-red-700 text-white flex items-center justify-center font-bold text-sm ring-4 ring-red-100 animate-pulse">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-red-700">2. POD Printing</p>
                    <p className="text-[11px] text-red-600 font-medium">Custom Art Production</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex md:flex-col items-center md:text-center gap-4 md:gap-2 opacity-50">
                  <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">3. In Transit</p>
                    <p className="text-[11px] text-gray-400">Carrier Handover</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex md:flex-col items-center md:text-center gap-4 md:gap-2 opacity-50">
                  <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">4. Delivered</p>
                    <p className="text-[11px] text-gray-400">Destination Arrival</p>
                  </div>
                </div>

              </div>

              {/* Carrier Tracking Badge */}
              {activeOrder.trackingNumber && (
                <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-red-600" />
                    <span className="text-gray-600">Carrier Info:</span>
                    <strong className="text-gray-900">{activeOrder.carrier} ({activeOrder.trackingNumber})</strong>
                  </div>
                  <a
                    href="https://tools.usps.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-red-700 hover:text-red-800 font-bold"
                  >
                    Track on Carrier Site <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Order Items Breakdown */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                Items in Package ({activeOrder.items.length})
              </h3>
              
              <div className="space-y-4 divide-y divide-gray-100">
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {item.productType} • {item.color} • Size {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* FREQUENTLY ASKED QUESTIONS */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-red-600" /> Tracking FAQ & Production Info
          </h3>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-semibold text-xs md:text-sm text-gray-900 flex items-center justify-between bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 pt-0 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-white"
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading tracker...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
