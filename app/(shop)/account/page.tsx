'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, MapPin, Settings, LogOut, Truck, ArrowRight, ShieldCheck, Clock, Star, X, Camera } from 'lucide-react';
import { getOrdersFromStorage, getOrderTrackingStatus } from '@/lib/mock-orders';
import { Order } from '@/types/orders';
import { formatCurrency } from '@/lib/formatters';
import { useWishlistStore } from '@/store/useWishlistStore';

export default function AccountDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Write Review Modal States
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewProductId, setReviewProductId] = useState('');
  const [reviewProductTitle, setReviewProductTitle] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Multiple Saved Addresses Type & States
  interface UserAddress {
    id: string;
    firstName: string;
    lastName: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
  }

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Address Form States
  const [addrFirstName, setAddrFirstName] = useState('');
  const [addrLastName, setAddrLastName] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrApartment, setAddrApartment] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrZip, setAddrZip] = useState('');
  const [addrCountry, setAddrCountry] = useState('United States');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  const loadAddresses = (currentUserName: string) => {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem('velora_user_addresses');
      if (data) {
        setAddresses(JSON.parse(data));
      } else {
        setAddresses([]);
      }
    } catch (e) {
      setAddresses([]);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList = [...addresses];

    const newAddr: UserAddress = {
      id: editingAddressId || `addr-${Date.now()}`,
      firstName: addrFirstName,
      lastName: addrLastName,
      street: addrStreet,
      apartment: addrApartment,
      city: addrCity,
      state: addrState,
      zip: addrZip,
      country: addrCountry,
      isDefault: addrIsDefault || addresses.length === 0,
    };

    if (newAddr.isDefault) {
      updatedList = updatedList.map(a => ({ ...a, isDefault: false }));
    }

    if (editingAddressId) {
      updatedList = updatedList.map(a => a.id === editingAddressId ? newAddr : a);
    } else {
      updatedList.push(newAddr);
    }

    if (updatedList.length > 0 && !updatedList.some(a => a.isDefault)) {
      updatedList[0].isDefault = true;
    }

    localStorage.setItem('velora_user_addresses', JSON.stringify(updatedList));
    setAddresses(updatedList);
    setIsEditingAddress(false);
    setEditingAddressId(null);
  };

  const handleSetDefaultAddress = (id: string) => {
    const updatedList = addresses.map(a => ({
      ...a,
      isDefault: a.id === id,
    }));
    localStorage.setItem('velora_user_addresses', JSON.stringify(updatedList));
    setAddresses(updatedList);
  };

  const handleDeleteAddress = (id: string) => {
    let updatedList = addresses.filter(a => a.id !== id);
    if (addresses.find(a => a.id === id)?.isDefault && updatedList.length > 0) {
      updatedList[0].isDefault = true;
    }
    localStorage.setItem('velora_user_addresses', JSON.stringify(updatedList));
    setAddresses(updatedList);
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddrFirstName(userName.split(' ')[0] || '');
    setAddrLastName(userName.split(' ').slice(1).join(' ') || '');
    setAddrStreet('');
    setAddrApartment('');
    setAddrCity('');
    setAddrState('');
    setAddrZip('');
    setAddrCountry('United States');
    setAddrIsDefault(addresses.length === 0);
    setIsEditingAddress(true);
  };

  const handleOpenEditAddress = (addr: UserAddress) => {
    setEditingAddressId(addr.id);
    setAddrFirstName(addr.firstName);
    setAddrLastName(addr.lastName);
    setAddrStreet(addr.street);
    setAddrApartment(addr.apartment || '');
    setAddrCity(addr.city);
    setAddrState(addr.state);
    setAddrZip(addr.zip);
    setAddrCountry(addr.country);
    setAddrIsDefault(addr.isDefault);
    setIsEditingAddress(true);
  };

  // Helper to count how many times a product has been reviewed by the user
  const getReviewedCount = (productId: string) => {
    if (typeof window === 'undefined') return 0;
    try {
      const data = localStorage.getItem('velora_reviewed_products');
      if (!data) return 0;
      const reviewed = JSON.parse(data);
      return reviewed[productId] || 0;
    } catch (e) {
      return 0;
    }
  };

  // Helper to count how many of a product was purchased in all orders
  const getPurchasedQty = (productId: string) => {
    if (typeof window === 'undefined') return 0;
    try {
      const data = localStorage.getItem('velora_orders');
      if (!data) return 0;
      const ordersMap = JSON.parse(data);
      
      let qty = 0;
      const currentEmail = userEmail.trim().toLowerCase();
      Object.values(ordersMap).forEach((order: any) => {
        const orderEmail = (order.shippingAddress?.email || order.userEmail || '').trim().toLowerCase();
        if (orderEmail === currentEmail && order.items && Array.isArray(order.items) && order.status === 'delivered') {
          order.items.forEach((item: any) => {
            if (item.productId === productId) {
              qty += (item.quantity || 1);
            }
          });
        }
      });
      return qty;
    } catch (e) {
      return 0;
    }
  };

  // Helper to load and sort orders (newest first) for the specific logged-in user
  const loadSortedOrders = (email?: string) => {
    const currentEmail = (email || userEmail || '').trim().toLowerCase();
    if (!currentEmail) {
      setOrders([]);
      return;
    }

    const allOrders = Object.values(getOrdersFromStorage());
    const userOrders = allOrders
      .filter((order) => {
        const orderEmail = (order.shippingAddress?.email || (order as any).userEmail || '').trim().toLowerCase();
        return orderEmail === currentEmail;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setOrders(userOrders);
  };

  const handleConfirmDelivery = (orderId: string) => {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem('velora_orders');
      if (!data) return;
      const ordersMap = JSON.parse(data);
      if (ordersMap[orderId]) {
        ordersMap[orderId].status = 'delivered';
        localStorage.setItem('velora_orders', JSON.stringify(ordersMap));
        
        // Refresh local state using sorted loader
        loadSortedOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenReviewModal = (productId: string, productTitle: string) => {
    setReviewProductId(productId);
    setReviewProductTitle(productTitle);
    setReviewRating(5);
    setReviewName(userName || '');
    setReviewTitle('');
    setReviewComment('');
    setAttachedFile(null);
    setFilePreview(null);
    setIsReviewModalOpen(true);
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim() || !reviewProductId) return;

    try {
      const { createProductReview } = await import('@/lib/api');
      await createProductReview(reviewProductId, {
        userName: reviewName,
        rating: reviewRating,
        comment: reviewComment,
      });
    } catch (e) {
      console.error('Error submitting review to backend:', e);
    }

    try {
      const reviewedData = localStorage.getItem('velora_reviewed_products');
      const reviewed = reviewedData ? JSON.parse(reviewedData) : {};
      reviewed[reviewProductId] = (reviewed[reviewProductId] || 0) + 1;
      localStorage.setItem('velora_reviewed_products', JSON.stringify(reviewed));
    } catch (e) {}

    setIsReviewModalOpen(false);
    loadSortedOrders();
  };

  useEffect(() => {
    async function initSession() {
      try {
        const { getProfile, getUserOrders } = await import('@/lib/api');
        const res = await getProfile();
        if (res && res.authenticated && res.user) {
          setUserEmail(res.user.email);
          setUserName(res.user.name);

          // Tải đơn hàng thật từ Backend Database
          const dbOrders = await getUserOrders();
          if (dbOrders && dbOrders.length > 0) {
            setOrders(dbOrders as any);
          } else {
            loadSortedOrders(res.user.email);
          }
          loadAddresses(res.user.name);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        // Fallback or unauthenticated
      }

      // Nếu không có session hợp lệ -> Chuyển về trang đăng nhập
      router.push('/account/login');
      setIsLoading(false);
    }

    initSession();
  }, [router]);

  const handleLogout = async () => {
    try {
      const { logoutUser } = await import('@/lib/api');
      await logoutUser();
    } catch {}

    if (typeof window !== 'undefined') {
      localStorage.removeItem('velora_user');
      localStorage.removeItem('velora_auth_token');
      localStorage.removeItem('velora_user_addresses');
      localStorage.removeItem('velora_orders');
      localStorage.removeItem('velora_reviewed_products');
    }
    useWishlistStore.getState().clearOnLogout();
    router.push('/account/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white py-10 md:py-16 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
          <div className="bg-white dark:bg-[#141414] rounded-3xl border border-gray-200 dark:border-[#222] p-6 sm:p-8 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-[#222]" />
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-gray-200 dark:bg-[#222] rounded w-48" />
              <div className="h-3 bg-gray-100 dark:bg-[#1e1e1e] rounded w-32" />
            </div>
          </div>
          <div className="h-12 bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222]" />
          <div className="space-y-4">
            <div className="h-32 bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222]" />
            <div className="h-32 bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white py-10 md:py-16 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-white dark:bg-[#141414] rounded-3xl border border-gray-200 dark:border-[#222] p-6 sm:p-8 mb-8 shadow-sm dark:shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#a80000] to-[#ff7700] p-0.5 shadow-md flex-shrink-0">
              <div className="w-full h-full bg-gray-100 dark:bg-[#181818] rounded-full flex items-center justify-center text-gray-900 dark:text-white font-black text-xl font-heading">
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white font-heading">{userName}</h1>
                <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-200 dark:border-emerald-800/50">
                  VIP Member
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{userEmail}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-[#222] dark:hover:bg-[#333] text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-[#222] mb-8 overflow-x-auto transition-colors">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-6 text-xs font-extrabold uppercase tracking-wider border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#ff7700] text-[#c2410c] dark:text-[#ff7700]'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Package size={16} /> Order History ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 px-6 text-xs font-extrabold uppercase tracking-wider border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'addresses'
                ? 'border-[#ff7700] text-[#c2410c] dark:text-[#ff7700]'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <MapPin size={16} /> Saved Addresses
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-6 text-xs font-extrabold uppercase tracking-wider border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'border-[#ff7700] text-[#c2410c] dark:text-[#ff7700]'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Settings size={16} /> Account Settings
          </button>
        </div>

        {/* Tab Content 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="py-16 text-center bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222] shadow-sm">
                <Package size={48} className="mx-auto mb-3 opacity-40 text-[#ff7700]" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">No Orders Found</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">You haven't placed any orders with this account yet.</p>
                <Link
                  href="/shop"
                  className="px-6 py-3 bg-[#a80000] hover:bg-[#7a0000] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-md inline-block cursor-pointer"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#222] p-6 shadow-sm">
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-[#222] pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-gray-900 dark:text-white">Order #{order.id}</span>
                        <span className="px-2.5 py-0.5 bg-orange-50 dark:bg-red-950/60 text-[#ea580c] dark:text-[#ff7700] text-[10px] font-extrabold rounded-full border border-orange-200 dark:border-red-800/40 uppercase">
                          {order.status === 'printing' ? 'In POD Production' : order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status !== 'delivered' && (() => {
                        const trackingStatus = getOrderTrackingStatus(order);
                        const isDeliveryClickable = trackingStatus === 'delivered';
                        return (
                          <button
                            onClick={() => {
                              if (isDeliveryClickable) {
                                handleConfirmDelivery(order.id);
                              }
                            }}
                            disabled={!isDeliveryClickable}
                            className={`px-3 py-2 text-xs font-bold rounded-xl transition ${
                              isDeliveryClickable 
                                ? "bg-[#ff7700] hover:bg-[#ff8822] text-black shadow-md cursor-pointer border-none"
                                : "bg-gray-100 dark:bg-[#181818] text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-800 cursor-not-allowed"
                            }`}
                            title={isDeliveryClickable ? "Confirm receipt of your order" : "Confirm receipt is only available once order status in tracking is 'Delivered'"}
                          >
                            {isDeliveryClickable ? "Confirm Delivery" : "Awaiting Delivery..."}
                          </button>
                        );
                      })()}
                      <Link
                        href={`/pages/order-tracking?orderId=${order.id}`}
                        className="px-4 py-2 bg-white hover:bg-gray-50 dark:bg-[#1e1e1e] dark:hover:bg-[#282828] text-gray-900 dark:text-white text-xs font-bold rounded-xl transition border border-gray-200 dark:border-[#2a2a2a] flex items-center gap-1.5 shadow-sm"
                      >
                        <Truck size={14} className="text-[#ff7700]" /> Track Status
                      </Link>
                    </div>
                  </div>

                  {/* Purchased Items List */}
                  <div className="space-y-3 divide-y divide-gray-100 dark:divide-[#222]">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 dark:bg-[#222] border border-gray-200 dark:border-[#333] flex-shrink-0 shadow-xs">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">{item.title}</h4>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                              {item.productType} • {item.color} • Size {item.size} • Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-xs font-bold text-[#ea580c] dark:text-[#ff7700]">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                          
                          {/* Write Review Button */}
                          {order.status === 'delivered' && (
                            getReviewedCount(item.productId) < getPurchasedQty(item.productId) ? (
                              <button
                                onClick={() => handleOpenReviewModal(item.productId, item.title)}
                                className="px-2.5 py-1 bg-[#a80000] hover:bg-[#7a0000] text-white text-[9px] font-black uppercase rounded border border-transparent transition cursor-pointer"
                              >
                                Write Review
                              </button>
                            ) : (
                              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded-full">
                                Reviewed ✓
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Total Footer */}
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-[#222] flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Total Paid (incl. shipping):</span>
                    <span className="text-sm font-extrabold text-gray-900 dark:text-white">{formatCurrency(order.totalPrice)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content 2: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="bg-[#141414] rounded-2xl border border-[#222] p-6 text-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <h3 className="text-sm font-bold text-white">Saved Addresses</h3>
              {!isEditingAddress && (
                <button
                  onClick={handleOpenAddAddress}
                  className="px-3.5 py-1.5 bg-[#ff7700] hover:bg-[#ff8822] text-black text-[11px] font-black rounded-lg transition cursor-pointer"
                >
                  + Add New Address
                </button>
              )}
            </div>
            
            {isEditingAddress ? (
              <form onSubmit={handleSaveAddress} className="space-y-4 max-w-md bg-[#1a1a1a] p-5 rounded-2xl border border-[#262626]">
                <h4 className="text-xs font-black text-[#ff7700] uppercase tracking-wider mb-2">
                  {editingAddressId ? 'Edit Address' : 'Add New Address'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1 font-semibold">First Name *</label>
                    <input
                      type="text"
                      required
                      value={addrFirstName}
                      onChange={(e) => setAddrFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#141414] border border-[#333] rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-[#ff7700]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1 font-semibold">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={addrLastName}
                      onChange={(e) => setAddrLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#141414] border border-[#333] rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-[#ff7700]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-gray-400 mb-1 font-semibold">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={addrStreet}
                      onChange={(e) => setAddrStreet(e.target.value)}
                      className="w-full px-3 py-2 bg-[#141414] border border-[#333] rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-[#ff7700]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1 font-semibold">Apartment, Suite, etc. (Optional)</label>
                    <input
                      type="text"
                      value={addrApartment}
                      onChange={(e) => setAddrApartment(e.target.value)}
                      className="w-full px-3 py-2 bg-[#141414] border border-[#333] rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-[#ff7700]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1 font-semibold">City *</label>
                    <input
                      type="text"
                      required
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      className="w-full px-3 py-2 bg-[#141414] border border-[#333] rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-[#ff7700]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1 font-semibold">State / Province *</label>
                    <input
                      type="text"
                      required
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      className="w-full px-3 py-2 bg-[#141414] border border-[#333] rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-[#ff7700]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1 font-semibold">Zip / Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={addrZip}
                      onChange={(e) => setAddrZip(e.target.value)}
                      className="w-full px-3 py-2 bg-[#141414] border border-[#333] rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-[#ff7700]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-gray-400 mb-1 font-semibold">Country *</label>
                    <input
                      type="text"
                      required
                      value={addrCountry}
                      onChange={(e) => setAddrCountry(e.target.value)}
                      className="w-full px-3 py-2 bg-[#141414] border border-[#333] rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-[#ff7700]"
                    />
                  </div>
                  <div className="sm:col-span-2 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-gray-300 font-semibold select-none">
                      <input
                        type="checkbox"
                        checked={addrIsDefault}
                        onChange={(e) => setAddrIsDefault(e.target.checked)}
                        disabled={addresses.length > 0 && !!addresses.find(a => a.id === editingAddressId)?.isDefault}
                        className="text-[#ff7700] focus:ring-[#ff7700] rounded bg-[#141414] border-[#333] w-3.5 h-3.5"
                      />
                      <span>Set as default shipping address</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#ff7700] hover:bg-[#ff8822] text-black font-extrabold rounded-xl transition cursor-pointer"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingAddress(false);
                      setEditingAddressId(null);
                    }}
                    className="px-4 py-2 bg-[#222] hover:bg-[#333] text-gray-300 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.length === 0 ? (
                  <div className="md:col-span-2 py-8 text-center text-gray-500 font-semibold">
                    No saved addresses found. Please add a shipping address.
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                        addr.isDefault 
                          ? 'border-[#ff7700]/40 bg-[#ff7700]/5 shadow-lg' 
                          : 'border-[#222] bg-[#141414] hover:border-[#333]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-extrabold text-white text-xs">{addr.firstName} {addr.lastName}</p>
                          {addr.isDefault && (
                            <span className="bg-[#ff7700]/10 text-[#ff7700] text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#ff7700]/20">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 leading-relaxed font-medium">
                          {addr.street}{addr.apartment ? `, ${addr.apartment}` : ''}<br />
                          {addr.city}, {addr.state} {addr.zip}<br />
                          {addr.country}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#222]/30 mt-auto">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEditAddress(addr)}
                            className="text-[#ff7700] hover:text-white transition font-bold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-red-500 hover:text-red-400 transition font-bold"
                          >
                            Delete
                          </button>
                        </div>
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="px-2.5 py-1 bg-[#222] hover:bg-[#333] text-gray-300 font-bold rounded-lg border border-[#2a2a2a] transition cursor-pointer text-[10px]"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab Content 3: Settings */}
        {activeTab === 'settings' && (
          <div className="bg-[#141414] rounded-2xl border border-[#222] p-6 text-xs space-y-4 max-w-md">
            <h3 className="text-sm font-bold text-white mb-4">Notification Preferences</h3>
            <label className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-xl border border-[#262626] cursor-pointer">
              <span>Email order status updates</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-[#ff7700]" />
            </label>
            <label className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-xl border border-[#262626] cursor-pointer">
              <span>Receive promotional discounts & new drops</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-[#ff7700]" />
            </label>
          </div>
        )}

        {/* WRITE REVIEW MODAL */}
        <AnimatePresence>
          {isReviewModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-lg bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 text-white shadow-2xl z-50"
              >
                <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4">
                  <div>
                    <h3 className="text-base font-bold">Write A Customer Review</h3>
                    <p className="text-[10px] text-[#ff7700] font-semibold mt-0.5">{reviewProductTitle}</p>
                  </div>
                  <button onClick={() => setIsReviewModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleAddReview} className="space-y-4">
                  {/* Rating selection */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Overall Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition cursor-pointer"
                        >
                          <Star size={24} fill={star <= reviewRating ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex M."
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1c1c1c] border border-[#333] rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-[#ff7700]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Review Headline *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Awesome quality and fast shipping!"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1c1c1c] border border-[#333] rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-[#ff7700]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Your Review *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Tell us what you liked about the fit, fabric, and print..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1c1c1c] border border-[#333] rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-[#ff7700]"
                    />
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Upload Photo (Optional)</label>
                    <div className="relative border border-dashed border-[#333] hover:border-[#ff7700]/55 rounded-xl p-3 bg-[#1c1c1c] transition flex flex-col items-center justify-center text-center">
                      {filePreview ? (
                        <div className="flex items-center gap-3 w-full">
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="w-12 h-12 object-cover rounded-lg border border-[#333]"
                          />
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-xs text-white font-semibold truncate">{attachedFile?.name}</p>
                            <p className="text-[9px] text-gray-500">
                              {attachedFile && attachedFile.size / 1024 > 1024 
                                ? `${(attachedFile.size / (1024 * 1024)).toFixed(2)} MB` 
                                : `${attachedFile ? (attachedFile.size / 1024).toFixed(0) : 0} KB`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setAttachedFile(null);
                              setFilePreview(null);
                            }}
                            className="px-2 py-1 bg-red-950 text-red-500 text-[10px] font-bold rounded-lg border border-red-800 hover:bg-red-900 transition cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center w-full py-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-[#ff7700] transition">
                            <span className="bg-[#2a2a2a] px-2.5 py-1 rounded-lg border border-[#333] text-[10px]">Add Photo</span>
                            <span className="text-gray-500 text-[10px]">or drag it here</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                setAttachedFile(file);
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFilePreview(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#a80000] hover:bg-[#7a0000] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
