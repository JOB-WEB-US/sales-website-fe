"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { getOrderById } from "@/lib/mock-orders";
import { Order } from "@/types/orders";
import { formatCurrency } from "@/lib/formatters";
import {
  CheckCircle2,
  Package,
  Printer,
  Truck,
  ShoppingBag,
  ArrowRight,
  Clock,
  MapPin,
  CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId") || "VELORA-84920";
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchedOrder = getOrderById(orderId);
    setOrder(fetchedOrder);
  }, [orderId]);

  const displayOrder = order || {
    id: orderId,
    createdAt: new Date().toISOString(),
    status: "printing" as const,
    items: [
      {
        id: "mock-1",
        productId: "prod-1",
        variantId: "v1-1",
        title: "Precious Dog Horror Movie, Silence Lambs, Halloween T-Shirt",
        size: "M",
        color: "Black",
        productType: "T-Shirt",
        price: 19.99,
        image:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80",
        quantity: 1,
      },
    ],
    shippingAddress: {
      firstName: "Customer",
      lastName: "",
      email: "customer@example.com",
      phone: "+1 (555) 000-0000",
      address: "742 Evergreen Terrace",
      city: "Springfield",
      state: "IL",
      zipCode: "62704",
      country: "United States",
    },
    shippingMethod: {
      id: "standard",
      name: "Standard Ground Shipping",
      description: "3-5 Business Days",
      price: 4.99,
      estimatedDays: "3-5 days",
    },
    paymentMethod: "Credit Card",
    subtotal: 19.99,
    discount: 0,
    shippingFee: 4.99,
    tax: 1.6,
    totalPrice: 26.58,
    estimatedDeliveryDate: new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 4,
    ).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    }),
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 className="w-12 h-12" />
          </motion.div>

          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-2">
            Order Confirmed #{displayOrder.id}
          </span>

          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Thank You For Your Order!
          </h1>
          <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">
            We have received your order and sent a confirmation email to{" "}
            <strong className="text-gray-900 font-semibold">
              {displayOrder.shippingAddress.email}
            </strong>
            .
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href={`/pages/order-tracking?orderId=${displayOrder.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-all"
            >
              <Truck className="w-4 h-4" /> Track Order Status
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm rounded-xl transition-all"
            >
              <ShoppingBag className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </motion.div>

        {/* POD Fulfillment Timeline Stepper */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-600" /> Print-On-Demand
            Fulfillment Timeline
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {/* Step 1: Order Placed */}
            <div className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                ✓
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">
                  1. Order Received
                </p>
                <p className="text-[11px] text-gray-500">Payment Verified</p>
              </div>
            </div>

            {/* Step 2: POD Printing */}
            <div className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2">
              <div className="w-10 h-10 rounded-full bg-red-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 ring-4 ring-red-100 animate-pulse">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-red-700">
                  2. POD Production
                </p>
                <p className="text-[11px] text-red-600 font-medium">
                  Artwork Printing in Progress
                </p>
              </div>
            </div>

            {/* Step 3: Quality Control */}
            <div className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2 opacity-60">
              <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">
                  3. Packaging
                </p>
                <p className="text-[11px] text-gray-400">Quality Check</p>
              </div>
            </div>

            {/* Step 4: Shipped */}
            <div className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2 opacity-60">
              <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">
                  4. Out for Delivery
                </p>
                <p className="text-[11px] text-gray-400">
                  Est. {displayOrder.estimatedDeliveryDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Purchased Items List */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
              Items Ordered ({displayOrder.items.length})
            </h3>

            <div className="space-y-4 divide-y divide-gray-100">
              {displayOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="pt-3 first:pt-0 flex gap-4 items-center"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {item.productType} • {item.color} • Size {item.size} •
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(displayOrder.subtotal)}
                </span>
              </div>
              {displayOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-{formatCurrency(displayOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({displayOrder.shippingMethod.name})</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(displayOrder.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total Paid</span>
                <span className="text-red-700">
                  {formatCurrency(displayOrder.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Details */}
          <div className="space-y-6">
            {/* Delivery Address Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-600" /> Shipping Address
              </h3>
              <p className="text-xs font-bold text-gray-900">
                {displayOrder.shippingAddress.firstName}{" "}
                {displayOrder.shippingAddress.lastName}
              </p>
              <p className="text-xs text-gray-600 leading-relaxed mt-1">
                {displayOrder.shippingAddress.address}
                <br />
                {displayOrder.shippingAddress.city},{" "}
                {displayOrder.shippingAddress.state}{" "}
                {displayOrder.shippingAddress.zipCode}
                <br />
                {displayOrder.shippingAddress.country}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {displayOrder.shippingAddress.phone}
              </p>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-red-600" /> Payment Info
              </h3>
              <p className="text-xs font-semibold text-gray-900">
                {displayOrder.paymentMethod}
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">
                Status: Paid & Verified
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
        <div className="min-h-screen flex items-center justify-center">
          Loading confirmation...
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
