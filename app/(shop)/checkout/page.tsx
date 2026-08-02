'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/lib/formatters';
import { SHIPPING_METHODS, saveOrderToStorage } from '@/lib/mock-orders';
import { Order, ShippingAddress } from '@/types/orders';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ArrowLeft, 
  Tag, 
  ShoppingBag,
  HelpCircle
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotalPrice, clearCart } = useCartStore();

  // Form State
  const [address, setAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: 'CA',
    zipCode: '',
    country: 'United States',
  });

  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_METHODS[0]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'cod'>('card');
  
  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Credit Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getTotalPrice();
  const isFreeShipping = subtotal >= 75;
  const shippingFee = isFreeShipping ? 0 : selectedShipping.price;
  const tax = Math.round((subtotal - appliedDiscount) * 0.08 * 100) / 100;
  const grandTotal = Math.max(0, subtotal - appliedDiscount + shippingFee + tax);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (!couponCode.trim()) return;

    if (couponCode.trim().toUpperCase() === 'VELORA10' || couponCode.trim().toUpperCase() === 'ERIHOT10') {
      const discountVal = subtotal * 0.10;
      setAppliedDiscount(discountVal);
      setCouponSuccess('10% Discount applied successfully!');
    } else if (couponCode.trim().toUpperCase() === 'FREESHIP') {
      setAppliedDiscount(shippingFee);
      setCouponSuccess('Free Shipping coupon applied!');
    } else {
      setCouponError('Invalid promo code. Try "VELORA10"');
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `VELORA-${randomNum}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: 'placed',
      items: [...cart],
      shippingAddress: address,
      shippingMethod: isFreeShipping ? { ...selectedShipping, price: 0, name: 'Free Standard Shipping' } : selectedShipping,
      paymentMethod: paymentMethod === 'card' 
        ? `Credit Card (ending in ${cardNumber.slice(-4) || '4242'})` 
        : paymentMethod === 'paypal' ? 'PayPal Express' : 'Cash on Delivery (COD)',
      subtotal,
      discount: appliedDiscount,
      shippingFee,
      tax,
      totalPrice: grandTotal,
      estimatedDeliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }),
      trackingNumber: `US${Math.floor(10000000000 + Math.random() * 90000000000)}`,
      carrier: 'USPS Priority Mail',
    };

    saveOrderToStorage(newOrder);

    setTimeout(() => {
      clearCart();
      router.push(`/checkout/thank-you?orderId=${orderId}`);
    }, 1000);
  };

  if (cart.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-20 h-20 bg-rose-950/40 text-rose-500 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Your Cart is Empty</h1>
        <p className="text-gray-400 max-w-md mb-8 text-sm">
          You need to add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#a80000] hover:bg-[#7a0000] text-white font-medium rounded-xl transition-colors shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[#222] pb-6 mb-8">
          <div>
            <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#ff7700] mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Shop
            </Link>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Secure Checkout
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-full">
            <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Shipping & Payment Form */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Express Checkout Mock */}
            <div className="bg-[#141414] p-6 rounded-xl border border-[#222] shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center mb-3">
                Express Checkout
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  onClick={() => setPaymentMethod('paypal')}
                  className="py-3 px-4 bg-[#FFC439] hover:bg-[#F2BA31] font-bold text-gray-900 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm text-sm"
                >
                  <span className="italic font-extrabold text-blue-900">Pay</span>
                  <span className="italic font-extrabold text-sky-500">Pal</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className="py-3 px-4 bg-[#262626] hover:bg-[#333] font-medium text-white rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm text-sm"
                >
                  <span> Pay</span>
                </button>
              </div>
              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-[#262626]"></div>
                <span className="flex-shrink mx-4 text-xs font-medium text-gray-500 uppercase">Or pay with card</span>
                <div className="flex-grow border-t border-[#262626]"></div>
              </div>
            </div>

            <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-8">
              
              {/* 1. Contact Information */}
              <div className="bg-[#141414] p-6 rounded-xl border border-[#222] shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#a80000] text-white text-xs font-extrabold flex items-center justify-center">1</span>
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={address.email}
                      onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#1c1c1c] border border-[#333] rounded-lg text-sm text-white focus:ring-2 focus:ring-[#ff7700] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#1c1c1c] border border-[#333] rounded-lg text-sm text-white focus:ring-2 focus:ring-[#ff7700] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Shipping Address */}
              <div className="bg-[#141414] p-6 rounded-xl border border-[#222] shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#a80000] text-white text-xs font-extrabold flex items-center justify-center">2</span>
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="John"
                      value={address.firstName}
                      onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#1c1c1c] border border-[#333] rounded-lg text-sm text-white focus:ring-2 focus:ring-[#ff7700] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Doe"
                      value={address.lastName}
                      onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#1c1c1c] border border-[#333] rounded-lg text-sm text-white focus:ring-2 focus:ring-[#ff7700] outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="123 Main St"
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#1c1c1c] border border-[#333] rounded-lg text-sm text-white focus:ring-2 focus:ring-[#ff7700] outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="Los Angeles"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#1c1c1c] border border-[#333] rounded-lg text-sm text-white focus:ring-2 focus:ring-[#ff7700] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">State / Province *</label>
                    <input
                      type="text"
                      required
                      placeholder="CA"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#1c1c1c] border border-[#333] rounded-lg text-sm text-white focus:ring-2 focus:ring-[#ff7700] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">ZIP / Postal Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="90001"
                      value={address.zipCode}
                      onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#1c1c1c] border border-[#333] rounded-lg text-sm text-white focus:ring-2 focus:ring-[#ff7700] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Shipping Method */}
              <div className="bg-[#141414] p-6 rounded-xl border border-[#222] shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#a80000] text-white text-xs font-extrabold flex items-center justify-center">3</span>
                  Shipping Method
                </h2>

                <div className="space-y-3">
                  {SHIPPING_METHODS.map((method) => {
                    const priceDisplay = isFreeShipping && method.id === 'standard' ? 'FREE' : formatCurrency(method.price);
                    const isSelected = selectedShipping.id === method.id;

                    return (
                      <label
                        key={method.id}
                        onClick={() => setSelectedShipping(method)}
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#ff7700] bg-[#ff7700]/10 ring-1 ring-[#ff7700]'
                            : 'border-[#2a2a2a] bg-[#1c1c1c] hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={isSelected}
                            onChange={() => setSelectedShipping(method)}
                            className="w-4 h-4 text-[#ff7700] focus:ring-[#ff7700]"
                          />
                          <div>
                            <p className="text-sm font-semibold text-white">{method.name}</p>
                            <p className="text-xs text-gray-400">{method.description}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-[#ff7700]">{priceDisplay}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 4. Payment Method */}
              <div className="bg-[#141414] p-6 rounded-xl border border-[#222] shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#a80000] text-white text-xs font-extrabold flex items-center justify-center">4</span>
                  Payment Method
                </h2>

                <div className="space-y-3">
                  <div
                    className={`rounded-xl border transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#ff7700] bg-[#ff7700]/10 ring-1 ring-[#ff7700]'
                        : 'border-[#2a2a2a] bg-[#1c1c1c]'
                    }`}
                  >
                    <label
                      onClick={() => setPaymentMethod('card')}
                      className="flex items-center justify-between p-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="w-4 h-4 text-[#ff7700] focus:ring-[#ff7700]"
                        />
                        <span className="text-sm font-semibold text-white flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-400" /> Credit or Debit Card
                        </span>
                      </div>
                    </label>

                    {paymentMethod === 'card' && (
                      <div className="p-4 pt-0 border-t border-[#2a2a2a] mt-2 space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-400 mb-1">Card Number</label>
                          <input
                            type="text"
                            required={paymentMethod === 'card'}
                            placeholder="4242 •••• •••• 4242"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full px-3 py-2 bg-[#121212] border border-[#333] rounded-lg text-sm text-white focus:ring-2 focus:ring-[#ff7700] outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-400 mb-1">Expiration (MM/YY)</label>
                            <input
                              type="text"
                              required={paymentMethod === 'card'}
                              placeholder="12/28"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full px-3 py-2 bg-[#121212] border border-[#333] rounded-lg text-sm text-white focus:ring-2 focus:ring-[#ff7700] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-400 mb-1">CVC Code</label>
                            <input
                              type="text"
                              required={paymentMethod === 'card'}
                              placeholder="123"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              className="w-full px-3 py-2 bg-[#121212] border border-[#333] rounded-lg text-sm text-white focus:ring-2 focus:ring-[#ff7700] outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <label
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'paypal'
                        ? 'border-[#ff7700] bg-[#ff7700]/10 ring-1 ring-[#ff7700]'
                        : 'border-[#2a2a2a] bg-[#1c1c1c]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="w-4 h-4 text-[#ff7700] focus:ring-[#ff7700]"
                      />
                      <span className="text-sm font-semibold text-white">PayPal Express Checkout</span>
                    </div>
                    <span className="italic font-extrabold text-blue-400 text-sm">PayPal</span>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#ff7700] bg-[#ff7700]/10 ring-1 ring-[#ff7700]'
                        : 'border-[#2a2a2a] bg-[#1c1c1c]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="w-4 h-4 text-[#ff7700] focus:ring-[#ff7700]"
                      />
                      <span className="text-sm font-semibold text-white">Cash on Delivery (COD)</span>
                    </div>
                    <Truck className="w-4 h-4 text-gray-400" />
                  </label>
                </div>
              </div>

              {/* Mobile Submit Button */}
              <div className="lg:hidden">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#a80000] hover:bg-[#7a0000] text-white font-extrabold text-base rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Place Order ({formatCurrency(grandTotal)})
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#141414] p-6 rounded-xl border border-[#222] shadow-sm sticky top-24 space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-[#222] pb-3 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-semibold bg-[#222] text-gray-300 px-2.5 py-1 rounded-full">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                </span>
              </h2>

              {/* Items List */}
              <div className="max-h-80 overflow-y-auto space-y-4 pr-1 divide-y divide-[#222]">
                {cart.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#222] border border-[#333] flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute top-1 right-1 bg-[#a80000] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white line-clamp-2 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {item.productType} • {item.color} • Size {item.size}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-[#ff7700]">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      {item.originalPrice && (
                        <p className="text-[11px] text-gray-500 line-through">
                          {formatCurrency(item.originalPrice * item.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} className="pt-2 border-t border-[#222]">
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#ff7700]" /> Discount Code / Promo
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Try VELORA10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#1c1c1c] border border-[#333] rounded-lg text-xs font-medium text-white uppercase outline-none focus:ring-1 focus:ring-[#ff7700]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponSuccess && <p className="text-xs text-emerald-400 font-semibold mt-1.5">{couponSuccess}</p>}
                {couponError && <p className="text-xs text-red-500 font-medium mt-1.5">{couponError}</p>}
              </form>

              {/* Subtotal & Calculations Breakdown */}
              <div className="space-y-2.5 text-xs text-gray-400 pt-3 border-t border-[#222]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span>-{formatCurrency(appliedDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    Shipping <HelpCircle className="w-3 h-3 text-gray-500" />
                  </span>
                  <span className="font-semibold text-white">
                    {isFreeShipping ? <span className="text-emerald-400">FREE</span> : formatCurrency(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-white">{formatCurrency(tax)}</span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-white pt-3 border-t border-[#222]">
                  <span>Total Amount</span>
                  <span className="text-[#ff7700]">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Desktop Submit Button */}
              <div className="hidden lg:block pt-2">
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#a80000] hover:bg-[#7a0000] text-white font-extrabold text-base rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Place Order ({formatCurrency(grandTotal)})
                    </>
                  )}
                </button>
              </div>

              {/* Guarantees Badges */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-gray-400 border-t border-[#222]">
                <div className="flex items-[#ff7700] gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" /> 30-Day Money Back
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> POD Print Quality
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
