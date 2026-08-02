'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, Settings, LogOut, Truck, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { getOrdersFromStorage } from '@/lib/mock-orders';
import { Order } from '@/types/orders';
import { formatCurrency } from '@/lib/formatters';

export default function AccountDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [userName, setUserName] = useState('Alex Vance');
  const [userEmail, setUserEmail] = useState('alex.vance@example.com');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('velora_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.email) setUserEmail(parsed.email);
          if (parsed.name) setUserName(parsed.name);
        } catch (e) {}
      }
    }
    const allOrders = Object.values(getOrdersFromStorage());
    setOrders(allOrders);
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('velora_user');
    }
    router.push('/account/login');
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-[#141414] rounded-3xl border border-[#222] p-6 sm:p-8 mb-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#a80000] to-[#ff7700] p-0.5 shadow-lg flex-shrink-0">
              <div className="w-full h-full bg-[#181818] rounded-full flex items-center justify-center text-white font-black text-xl font-heading">
                {userName.charAt(0)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">{userName}</h1>
                <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-800/50">
                  VIP Member
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{userEmail}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#222] hover:bg-[#333] text-gray-300 hover:text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#222] mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-6 text-xs font-extrabold uppercase tracking-wider border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#ff7700] text-[#ff7700]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Package size={16} /> Order History ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 px-6 text-xs font-extrabold uppercase tracking-wider border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'border-[#ff7700] text-[#ff7700]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <MapPin size={16} /> Saved Addresses
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-6 text-xs font-extrabold uppercase tracking-wider border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-[#ff7700] text-[#ff7700]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Settings size={16} /> Account Settings
          </button>
        </div>

        {/* Tab Content 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="py-16 text-center bg-[#141414] rounded-2xl border border-[#222]">
                <Package size={48} className="mx-auto mb-3 opacity-30 text-[#ff7700]" />
                <h3 className="text-base font-bold text-white mb-1">No Orders Found</h3>
                <p className="text-xs text-gray-400 mb-6">You haven't placed any orders with this account yet.</p>
                <Link
                  href="/shop"
                  className="px-6 py-3 bg-[#a80000] hover:bg-[#7a0000] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-md"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-[#141414] rounded-2xl border border-[#222] p-6 shadow-sm">
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#222] pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white">Order #{order.id}</span>
                        <span className="px-2.5 py-0.5 bg-red-950/60 text-[#ff7700] text-[10px] font-bold rounded-full border border-red-800/40 uppercase">
                          {order.status === 'printing' ? 'In POD Production' : order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    <Link
                      href={`/pages/order-tracking?orderId=${order.id}`}
                      className="px-4 py-2 bg-[#1e1e1e] hover:bg-[#282828] text-white text-xs font-bold rounded-xl transition border border-[#2a2a2a] flex items-center gap-1.5"
                    >
                      <Truck size={14} className="text-[#ff7700]" /> Track Status
                    </Link>
                  </div>

                  {/* Purchased Items List */}
                  <div className="space-y-3 divide-y divide-[#222]">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#222] border border-[#333] flex-shrink-0">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                            <p className="text-[11px] text-gray-400">
                              {item.productType} • {item.color} • Size {item.size} • Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#ff7700]">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Total Footer */}
                  <div className="mt-4 pt-3 border-t border-[#222] flex items-center justify-between text-xs">
                    <span className="text-gray-400">Total Paid (incl. shipping):</span>
                    <span className="text-sm font-extrabold text-white">{formatCurrency(order.totalPrice)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content 2: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="bg-[#141414] rounded-2xl border border-[#222] p-6 text-xs space-y-4">
            <h3 className="text-sm font-bold text-white mb-2">Default Shipping Address</h3>
            <p className="font-semibold text-white">{userName}</p>
            <p className="text-gray-400 leading-relaxed">
              742 Evergreen Terrace, Apt 4B<br />
              Springfield, IL 62704<br />
              United States
            </p>
            <button className="px-4 py-2 bg-[#1e1e1e] hover:bg-[#282828] text-white font-bold rounded-xl border border-[#2a2a2a] transition">
              Edit Address
            </button>
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

      </div>
    </div>
  );
}
