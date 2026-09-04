'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/lib/formatters';
import { SHIPPING_METHODS } from '@/lib/mock-orders';
import { Order, ShippingAddress } from '@/types/orders';
import { createOrder, API_BASE_URL } from '@/lib/api';
import dynamic from 'next/dynamic';
const PayPalButton = dynamic(() => import('@/components/features/checkout/paypal-button'), { ssr: false });
import TrustBadges from '@/components/common/trust-badges';
import { 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  ArrowLeft, 
  Tag, 
  ShoppingBag,
  HelpCircle,
  Lock
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

  // Load saved addresses
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [useSavedAddress, setUseSavedAddress] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const userProfile = localStorage.getItem('velora_user');
      if (!userProfile) {
        router.push('/account/login?redirect=/checkout');
        return;
      }

      const data = localStorage.getItem('velora_user_addresses');
      let parsedList: any[] = [];
      if (data) {
        try {
          parsedList = JSON.parse(data);
        } catch (e) {}
      }

      if (parsedList && Array.isArray(parsedList) && parsedList.length > 0) {
        setSavedAddresses(parsedList);
        setUseSavedAddress(true);
        
        const defaultAddr = parsedList.find((a: any) => a.isDefault) || parsedList[0];
        setSelectedAddressId(defaultAddr.id);
        
        setAddress(prev => ({
          ...prev,
          firstName: defaultAddr.firstName || prev.firstName,
          lastName: defaultAddr.lastName || prev.lastName,
          address: defaultAddr.street || '',
          apartment: defaultAddr.apartment || '',
          city: defaultAddr.city || '',
          state: defaultAddr.state || 'IL',
          zipCode: defaultAddr.zip || '',
          country: defaultAddr.country || 'United States',
        }));
      } else {
        setSavedAddresses([]);
        setUseSavedAddress(false);
      }
      
      if (userProfile) {
        try {
          const parsed = JSON.parse(userProfile);
          if (parsed.name) {
            const nameParts = parsed.name.trim().split(/\s+/);
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            setAddress(prev => ({
              ...prev,
              firstName: firstName || prev.firstName,
              lastName: lastName || prev.lastName,
              email: parsed.email || prev.email,
            }));
          }
        } catch (e) {}
      }
    }

    // Fetch dynamic shipping threshold
    fetch(`${API_BASE_URL}/settings/shipping`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.freeShippingThreshold) {
          setFreeShippingThreshold(Number(data.data.freeShippingThreshold));
        }
      })
      .catch((err) => console.warn("Checkout shipping threshold load error:", err));
  }, []);

  const { appliedCoupon, setAppliedCoupon, removeCoupon } = useCartStore();
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_METHODS[0]);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(75);
  
  // Coupon State
  const [couponCode, setCouponCode] = useState(appliedCoupon ? appliedCoupon.code : '');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(appliedCoupon ? `Applied: ${appliedCoupon.code} (${appliedCoupon.description})` : '');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getTotalPrice();
  const isFreeShipping = subtotal >= freeShippingThreshold || appliedCoupon?.discountType === 'shipping';
  const shippingFee = isFreeShipping ? 0 : selectedShipping.price;

  // Calculate applied discount amount
  const appliedDiscount = (() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      return Math.round(((subtotal * appliedCoupon.discountValue) / 100) * 100) / 100;
    }
    if (appliedCoupon.discountType === 'fixed') {
      return Math.min(appliedCoupon.discountValue, subtotal);
    }
    if (appliedCoupon.discountType === 'shipping') {
      return selectedShipping.price;
    }
    return 0;
  })();

  const tax = Math.round((subtotal - (appliedCoupon?.discountType !== 'shipping' ? appliedDiscount : 0)) * 0.08 * 100) / 100;
  const grandTotal = Math.max(0, subtotal - (appliedCoupon?.discountType !== 'shipping' ? appliedDiscount : 0) + shippingFee + tax);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    setValidatingCoupon(true);

    try {
      const res = await fetch(`${API_BASE_URL}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal, shippingFee: selectedShipping.price }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || `Promo code "${code}" is invalid.`);
      }

      setAppliedCoupon(data.data);
      setCouponSuccess(`Coupon "${data.data.code}" applied successfully!`);
    } catch (err: any) {
      setCouponError(err.message || 'Invalid promo code. Try "VELORA10"');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode('');
    setCouponSuccess('');
    setCouponError('');
  };

  const handlePayPalSuccess = async (details: { orderId: string; payerName?: string; payerEmail?: string }) => {
    if (cart.length === 0) return;
    setIsSubmitting(true);

    try {
      let loggedUser: any = null;
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('velora_user');
        if (stored) {
          try {
            loggedUser = JSON.parse(stored);
          } catch (e) {}
        }
      }

      const orderPayload = {
        userId: loggedUser?.id || undefined,
        items: cart.map((item) => ({
          productId: item.productId || item.id,
          variantId: item.variantId || undefined,
          productType: item.productType || 'T-Shirt',
          size: item.size || 'M',
          color: item.color || 'Black',
          quantity: item.quantity || 1,
          price: item.price || 0,
        })),
        shippingAddress: {
          firstName: address.firstName || (details.payerName ? details.payerName.split(' ')[0] : 'Valued'),
          lastName: address.lastName || (details.payerName ? details.payerName.split(' ').slice(1).join(' ') : 'Customer'),
          email: address.email || details.payerEmail || 'customer@example.com',
          phone: address.phone || '555-0199',
          address: address.address || '123 Order Delivery Way',
          apartment: address.apartment,
          city: address.city || 'Los Angeles',
          state: address.state || 'CA',
          zipCode: address.zipCode || '90001',
          country: address.country || 'United States',
        },
        paymentMethod: `PayPal Express (Txn: ${details.orderId})`,
        paypalOrderId: details.orderId,
        couponCode: appliedCoupon?.code || undefined,
        shippingMethod: selectedShipping.id,
      };

      const result = await createOrder(orderPayload);
      clearCart();
      const targetOrderId = result?.orderNumber || result?.invoiceNumber || details.orderId;
      router.push(`/checkout/thank-you?orderId=${encodeURIComponent(targetOrderId)}&paypalTxn=${encodeURIComponent(details.orderId)}`);
    } catch (err) {
      console.error('Error placing PayPal order:', err);
      alert(err instanceof Error ? err.message : 'Unable to verify and create order. Please contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };




  if (cart.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-gray-50 dark:bg-[#0d0d0d] transition-colors">
        <div className="w-20 h-20 bg-orange-50 dark:bg-rose-950/40 text-[#ff7700] dark:text-rose-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-orange-200 dark:border-transparent">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Your Cart is Empty</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8 text-sm">
          You need to add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#a80000] hover:bg-[#7a0000] text-white font-bold rounded-xl transition-colors shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white py-8 md:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#222] pb-6 mb-8">
          <div>
            <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-[#ff7700] mb-2 transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Shop
            </Link>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Secure Checkout
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 px-3 py-1.5 rounded-full shadow-xs">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> 256-Bit SSL Encrypted
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Shipping & Payment Form */}
          <div className="lg:col-span-7 space-y-8">
            
            <form id="checkout-form" className="space-y-8">
              
              {/* 1. Contact Information */}
              <div className="bg-white dark:bg-[#141414] p-6 rounded-2xl border border-gray-200 dark:border-[#222] shadow-sm space-y-4 transition-colors">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#a80000] text-white text-xs font-extrabold flex items-center justify-center">1</span>
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={address.email}
                      onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-300 dark:border-[#333] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff7700] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-300 dark:border-[#333] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff7700] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Shipping Address */}
              <div className="bg-white dark:bg-[#141414] p-6 rounded-2xl border border-gray-200 dark:border-[#222] shadow-sm space-y-4 transition-colors">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#a80000] text-white text-xs font-extrabold flex items-center justify-center">2</span>
                  Shipping Address
                </h2>

                {savedAddresses.length > 0 && (
                  <div className="flex gap-4 p-3 bg-gray-50 dark:bg-[#1c1c1c] rounded-xl border border-gray-200 dark:border-[#262626] mb-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold select-none text-gray-800 dark:text-gray-200">
                      <input
                        type="radio"
                        name="addressMode"
                        checked={useSavedAddress}
                        onChange={() => {
                          setUseSavedAddress(true);
                          const defaultAddr = savedAddresses.find((a: any) => a.isDefault) || savedAddresses[0];
                          setSelectedAddressId(defaultAddr.id);
                          setAddress(prev => ({
                            ...prev,
                            firstName: defaultAddr.firstName || prev.firstName,
                            lastName: defaultAddr.lastName || prev.lastName,
                            address: defaultAddr.street || '',
                            apartment: defaultAddr.apartment || '',
                            city: defaultAddr.city || '',
                            state: defaultAddr.state || 'IL',
                            zipCode: defaultAddr.zip || '',
                            country: defaultAddr.country || 'United States',
                          }));
                        }}
                        className="text-[#ff7700] focus:ring-[#ff7700] bg-transparent border-gray-300 dark:border-[#333]"
                      />
                      <span>Use Saved Address</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold select-none text-gray-800 dark:text-gray-200">
                      <input
                        type="radio"
                        name="addressMode"
                        checked={!useSavedAddress}
                        onChange={() => {
                          setUseSavedAddress(false);
                          setAddress(prev => ({
                            ...prev,
                            address: '',
                            apartment: '',
                            city: '',
                            state: 'CA',
                            zipCode: '',
                            country: 'United States',
                          }));
                        }}
                        className="text-[#ff7700] focus:ring-[#ff7700] bg-transparent border-gray-300 dark:border-[#333]"
                      />
                      <span>Enter New Address</span>
                    </label>
                  </div>
                )}

                {useSavedAddress && savedAddresses.length > 0 ? (() => {
                  const selectedAddr = savedAddresses.find(a => a.id === selectedAddressId) || savedAddresses[0];
                  return (
                    <div className="space-y-4">
                      {savedAddresses.length > 1 && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Select Shipping Address *</label>
                          <select
                            value={selectedAddressId}
                            onChange={(e) => {
                              const id = e.target.value;
                              setSelectedAddressId(id);
                              const targetAddr = savedAddresses.find(a => a.id === id);
                              if (targetAddr) {
                                setAddress(prev => ({
                                  ...prev,
                                  firstName: targetAddr.firstName || prev.firstName,
                                  lastName: targetAddr.lastName || prev.lastName,
                                  address: targetAddr.street || '',
                                  apartment: targetAddr.apartment || '',
                                  city: targetAddr.city || '',
                                  state: targetAddr.state || 'IL',
                                  zipCode: targetAddr.zip || '',
                                  country: targetAddr.country || 'United States',
                                }));
                              }
                            }}
                            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-300 dark:border-[#333] rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-[#ff7700] cursor-pointer font-bold"
                          >
                            {savedAddresses.map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.firstName} {a.lastName} - {a.street}, {a.city} {a.isDefault ? '(Default)' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="bg-gray-50 dark:bg-[#1c1c1c] border border-orange-200 dark:border-[#ff7700]/30 rounded-2xl p-4 text-xs space-y-1.5 shadow-sm relative">
                        <div className="absolute right-3 top-3 text-[#c2410c] dark:text-[#ff7700] text-[9px] font-black uppercase bg-orange-100 dark:bg-[#ff7700]/10 px-2 py-0.5 rounded-full border border-orange-200 dark:border-[#ff7700]/20">
                          {selectedAddr.isDefault ? 'Default Shipping Address' : 'Saved Shipping Address'}
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">{address.firstName} {address.lastName}</p>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                          {address.address}{address.apartment ? `, ${address.apartment}` : ''}<br />
                          {address.city}, {address.state} {address.zipCode}<br />
                          {address.country}
                        </p>
                      </div>
                    </div>
                  );
                })() : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="John"
                          value={address.firstName}
                          onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-300 dark:border-[#333] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff7700] outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Last Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Doe"
                          value={address.lastName}
                          onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-300 dark:border-[#333] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff7700] outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Street Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="123 Main St"
                        value={address.address}
                        onChange={(e) => setAddress({ ...address, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-300 dark:border-[#333] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff7700] outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Apartment, Suite, etc. (Optional)</label>
                      <input
                        type="text"
                        placeholder="Apt 4B"
                        value={address.apartment}
                        onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-300 dark:border-[#333] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff7700] outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">City *</label>
                        <input
                          type="text"
                          required
                          placeholder="Los Angeles"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-300 dark:border-[#333] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff7700] outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">State / Province *</label>
                        <input
                          type="text"
                          required
                          placeholder="CA"
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-300 dark:border-[#333] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff7700] outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">ZIP / Postal Code *</label>
                        <input
                          type="text"
                          required
                          placeholder="90001"
                          value={address.zipCode}
                          onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-300 dark:border-[#333] rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff7700] outline-none transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 3. Shipping Method */}
              <div className="bg-white dark:bg-[#141414] p-6 rounded-2xl border border-gray-200 dark:border-[#222] shadow-sm space-y-4 transition-colors">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
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
                            ? 'border-[#ff7700] bg-orange-50/80 dark:bg-[#ff7700]/10 ring-1 ring-[#ff7700]'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100/80 hover:border-gray-300 dark:border-[#2a2a2a] dark:bg-[#1c1c1c] dark:hover:border-gray-600'
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
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{method.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{method.description}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-[#c2410c] dark:text-[#ff7700]">{priceDisplay}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 4. Payment Method - PayPal */}
              <div className="bg-white dark:bg-[#141414] p-6 rounded-2xl border border-gray-200 dark:border-[#222] shadow-sm space-y-4 transition-colors">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#a80000] text-white text-xs font-extrabold flex items-center justify-center">4</span>
                  Payment Method
                </h2>

                <div className="rounded-2xl border border-orange-200 dark:border-[#ff7700] bg-orange-50/40 dark:bg-[#ff7700]/10 ring-1 ring-[#ff7700]/40">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-[#ff7700]" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">PayPal Checkout</span>
                    </div>
                    <span className="italic font-black text-blue-600 dark:text-blue-400 text-sm tracking-tight bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 px-2 py-0.5 rounded">
                      PayPal
                    </span>
                  </div>

                  <div className="p-4 pt-1 border-t border-orange-100 dark:border-[#2a2a2a]">
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-3 font-medium">Pay securely with your PayPal account or Credit / Debit Card via PayPal.</p>
                    <PayPalButton
                      amount={grandTotal}
                      currency="USD"
                      disabled={isSubmitting}
                      onSuccess={handlePayPalSuccess}
                      onError={(err) => console.error('PayPal Checkout error:', err)}
                    />
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[#141414] p-6 rounded-2xl border border-gray-200 dark:border-[#222] shadow-sm sticky top-24 space-y-6 transition-colors">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-[#222] pb-3 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-bold bg-gray-100 dark:bg-[#222] text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full border border-gray-200 dark:border-transparent">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                </span>
              </h2>

              {/* Items List */}
              <div className="max-h-80 overflow-y-auto space-y-4 pr-1 divide-y divide-gray-100 dark:divide-[#222]">
                {cart.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#222] border border-gray-200 dark:border-[#333] flex-shrink-0">
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
                      <h4 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium">
                        {item.productType} • {item.color} • Size {item.size}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-[#c2410c] dark:text-[#ff7700]">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      {item.originalPrice && (
                        <p className="text-[11px] text-gray-400 line-through">
                          {formatCurrency(item.originalPrice * item.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} className="pt-2 border-t border-gray-200 dark:border-[#222]">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-[#ff7700]" /> Discount Code / Promo
                  </span>
                  {appliedCoupon && (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[11px] text-gray-500 hover:text-red-500 font-bold underline cursor-pointer"
                    >
                      Remove Code
                    </button>
                  )}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. VELORA10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-300 dark:border-[#333] rounded-xl text-xs font-mono font-bold text-gray-900 dark:text-white uppercase outline-none focus:ring-1 focus:ring-[#ff7700]"
                  />
                  <button
                    type="submit"
                    disabled={validatingCoupon || !couponCode.trim()}
                    className="px-4 py-2 bg-gray-900 hover:bg-[#ff7700] hover:text-black dark:bg-[#2a2a2a] text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {validatingCoupon ? "..." : "Apply"}
                  </button>
                </div>
                {couponSuccess && <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5">{couponSuccess}</p>}
                {couponError && <p className="text-xs text-red-600 dark:text-red-500 font-medium mt-1.5">{couponError}</p>}
              </form>

              {/* Subtotal & Calculations Breakdown */}
              <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-[#222]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span>-{formatCurrency(appliedDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    Shipping <HelpCircle className="w-3 h-3 text-gray-400" />
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {isFreeShipping ? <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span> : formatCurrency(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(tax)}</span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-[#222]">
                  <span>Total Amount</span>
                  <span className="text-[#c2410c] dark:text-[#ff7700]">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Desktop PayPal hint */}
              <div className="hidden lg:block pt-2">
                <div className="w-full py-3 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2a2a2a] text-gray-600 dark:text-gray-400 font-medium text-xs rounded-xl text-center">
                  ← Complete payment using the PayPal button on the left
                </div>
              </div>

              {/* Guarantees & Trust Badges */}
              <TrustBadges variant="checkout" />

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
