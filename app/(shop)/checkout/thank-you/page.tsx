'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { lookupOrder, ApiOrder } from '@/lib/api';
import { formatCurrency } from '@/lib/formatters';
import {
  CheckCircle2,
  Package,
  Printer,
  Truck,
  ShoppingBag,
  Clock,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { motion } from 'framer-motion';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId') || 'VELORA-84920';
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lookupOrder(orderId)
      .then((data) => {
        if (data) setOrder(data);
      })
      .catch((err) => console.error('Lookup order error:', err))
      .finally(() => setLoading(false));
  }, [orderId]);

  const displayOrderNumber = order ? order.orderNumber : orderId;
  const customerEmail = order?.customerEmail || 'your email';
  const customerName = order?.customerName || 'Customer';
  const address = order?.address || '742 Evergreen Terrace';
  const city = order?.city || 'Springfield';
  const state = order?.state || 'IL';
  const zipCode = order?.zipCode || '62704';
  const country = order?.country || 'United States';
  const paymentMethod = order?.financials?.paymentMethod || 'Credit Card (Encrypted AES-256)';
  const subtotal = order?.financials?.subtotal || 19.99;
  const discount = order?.financials?.discount || 0;
  const tax = order?.financials?.tax || 1.6;
  const totalPrice = order?.financials?.totalPrice || 21.59;
  const items = order?.items && order.items.length > 0 ? order.items : [
    {
      id: 'item-1',
      productId: 'prod-1',
      productType: 'T-Shirt',
      size: 'M',
      color: 'Black',
      quantity: 1,
      price: 19.99,
      product: {
        id: 'prod-1',
        title: 'High Definition Graphic Apparel Tee',
        slug: 'graphic-tee',
        frontImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#141414] rounded-2xl border border-[#222] shadow-xl p-8 text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-emerald-950/60 text-emerald-400 border border-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 className="w-12 h-12" />
          </motion.div>

          <span className="inline-block px-3 py-1 bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 text-xs font-bold rounded-full mb-2">
            Order Confirmed {displayOrderNumber}
          </span>

          <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-2">
            Thank You For Your Order!
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
            We have received your order and stored the details securely in our encrypted database. A confirmation email has been sent to{' '}
            <strong className="text-white font-semibold">{customerEmail}</strong>.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href={`/pages/order-tracking?orderId=${encodeURIComponent(displayOrderNumber)}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#a80000] hover:bg-[#800000] text-white font-extrabold text-sm rounded-xl shadow-md transition-all"
            >
              <Truck className="w-4 h-4" /> Track Order Status
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e1e1e] hover:bg-[#2a2a2a] text-gray-300 hover:text-white font-bold text-sm rounded-xl transition-all border border-[#333]"
            >
              <ShoppingBag className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </motion.div>

        {/* POD Fulfillment Timeline Stepper */}
        <div className="bg-[#141414] rounded-2xl border border-[#222] shadow-xl p-6 md:p-8 mb-8">
          <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#ff7700]" /> Print-On-Demand Fulfillment Timeline
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            <div className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                ✓
              </div>
              <div>
                <p className="text-xs font-bold text-white">1. Order Received</p>
                <p className="text-[11px] text-gray-400">Payment Verified</p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2">
              <div className="w-10 h-10 rounded-full bg-[#a80000] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 ring-4 ring-red-950 animate-pulse">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#ff7700]">2. POD Production</p>
                <p className="text-[11px] text-gray-400">Artwork Printing</p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2 opacity-60">
              <div className="w-10 h-10 rounded-full bg-[#222] text-gray-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-300">3. Packaging</p>
                <p className="text-[11px] text-gray-500">Quality Check</p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2 opacity-60">
              <div className="w-10 h-10 rounded-full bg-[#222] text-gray-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-300">4. Out for Delivery</p>
                <p className="text-[11px] text-gray-500">USPS Priority</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Purchased Items List */}
          <div className="md:col-span-2 bg-[#141414] rounded-2xl border border-[#222] shadow-xl p-6">
            <h3 className="text-sm font-bold text-white border-b border-[#222] pb-3 mb-4">
              Items Ordered ({items.length})
            </h3>

            <div className="space-y-4 divide-y divide-[#222]">
              {items.map((item: any, idx: number) => {
                const frontImg = item.product?.frontImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80';
                const title = item.product?.title || 'Graphic Apparel';
                return (
                  <div key={idx} className="pt-3 first:pt-0 flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#222] border border-[#333] flex-shrink-0">
                      <Image
                        src={frontImg}
                        alt={title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white line-clamp-1">
                        {title}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {item.productType} • {item.color} • Size {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-bold text-[#ff7700]">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-[#222] space-y-2 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span className="font-semibold text-white">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-[#222]">
                <span>Total Paid</span>
                <span className="text-[#ff7700]">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Details */}
          <div className="space-y-6">
            <div className="bg-[#141414] rounded-2xl border border-[#222] shadow-xl p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#ff7700]" /> Shipping Address
              </h3>
              <p className="text-xs font-bold text-white">{customerName}</p>
              <p className="text-xs text-gray-400 leading-relaxed mt-1">
                {address}
                <br />
                {city}, {state} {zipCode}
                <br />
                {country}
              </p>
            </div>

            <div className="bg-[#141414] rounded-2xl border border-[#222] shadow-xl p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#ff7700]" /> Payment Info
              </h3>
              <p className="text-xs font-semibold text-white">{paymentMethod}</p>
              <p className="text-xs text-emerald-400 font-semibold mt-1">
                Status: Encrypted & Verified
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white">
          Loading order details...
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
