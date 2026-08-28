'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/lib/formatters';
import { SHIPPING_METHODS, saveOrderToStorage } from '@/lib/mock-orders';
import { Order, ShippingAddress } from '@/types/orders';
import { createOrder } from '@/lib/api';
import dynamic from 'next/dynamic';
const PayPalButton = dynamic(() => import('@/components/features/checkout/paypal-button'), { ssr: false });
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
  }, []);

  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_METHODS[0]);
  
  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

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

    if (couponCode.trim().toUpperCase() === 'VELORA10' || couponCode.trim().toUpperCase() === 'VELORATEES10') {
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
        subtotal,
        discount: appliedDiscount,
        tax,
        totalPrice: grandTotal,
      };

      const result = await createOrder(orderPayload);
      clearCart();
      const targetOrderId = result?.orderNumber || result?.invoiceNumber || details.orderId;
      router.push(`/checkout/thank-you?orderId=${encodeURIComponent(targetOrderId)}&paypalTxn=${encodeURIComponent(details.orderId)}`);
    } catch (err) {
      console.error('Error placing PayPal order:', err);
      clearCart();
      router.push(`/checkout/thank-you?orderId=${encodeURIComponent(details.orderId)}`);
    } finally {
      setIsSubmitting(false);
    }
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
            
            <form id="checkout-form" className="space-y-8">
              
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

                {savedAddresses.length > 0 && (
                  <div className="flex gap-4 p-3 bg-[#1c1c1c] rounded-xl border border-[#262626] mb-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold select-none">
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
                        className="text-[#ff7700] focus:ring-[#ff7700] bg-transparent border-[#333]"
                      />
                      <span>Use Saved Address</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold select-none">
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
                        className="text-[#ff7700] focus:ring-[#ff7700] bg-transparent border-[#333]"
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
                          <label className="block text-xs font-semibold text-gray-300 mb-1">Select Shipping Address *</label>
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
                            className="w-full px-3 py-2.5 bg-[#1c1c1c] border border-[#333] rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-[#ff7700] cursor-pointer font-bold"
                          >
                            {savedAddresses.map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.firstName} {a.lastName} - {a.street}, {a.city} {a.isDefault ? '(Default)' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="bg-[#1c1c1c] border border-[#ff7700]/30 rounded-xl p-4 text-xs space-y-1.5 shadow-md relative">
                        <div className="absolute right-3 top-3 text-[#ff7700] text-[9px] font-black uppercase bg-[#ff7700]/10 px-2 py-0.5 rounded-full border border-[#ff7700]/20">
                          {selectedAddr.isDefault ? 'Default Shipping Address' : 'Saved Shipping Address'}
                        </div>
                        <p className="font-bold text-white">{address.firstName} {address.lastName}</p>
                        <p className="text-gray-400 leading-relaxed font-semibold">
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

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Apartment, Suite, etc. (Optional)</label>
                      <input
                        type="text"
                        placeholder="Apt 4B"
                        value={address.apartment}
                        onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
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
                  </>
                )}
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

              {/* 4. Payment Method - PayPal */}
              <div className="bg-[#141414] p-6 rounded-xl border border-[#222] shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#a80000] text-white text-xs font-extrabold flex items-center justify-center">4</span>
                  Payment Method
                </h2>

                <div className="rounded-xl border border-[#ff7700] bg-[#ff7700]/10 ring-1 ring-[#ff7700]">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-[#ff7700]" />
                      <span className="text-sm font-semibold text-white">PayPal Checkout</span>
                    </div>
                    <span className="italic font-black text-blue-400 text-sm tracking-tight bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded">
                      PayPal
                    </span>
                  </div>

                  <div className="p-4 pt-1 border-t border-[#2a2a2a]">
                    <p className="text-[11px] text-gray-400 mb-3">Pay securely with your PayPal account or Credit / Debit Card via PayPal.</p>
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

              {/* Desktop PayPal hint */}
              <div className="hidden lg:block pt-2">
                <div className="w-full py-3 bg-[#1c1c1c] border border-[#2a2a2a] text-gray-400 font-semibold text-xs rounded-xl text-center">
                  ← Complete payment using the PayPal button on the left
                </div>
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
