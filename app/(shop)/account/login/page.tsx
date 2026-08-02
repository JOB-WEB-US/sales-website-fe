'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, Mail, ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    setTimeout(() => {
      // Store user session mock
      if (typeof window !== 'undefined') {
        localStorage.setItem('velora_user', JSON.stringify({ email, name: name || 'Valued Customer' }));
      }
      router.push('/account');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white py-12 md:py-20 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        
        {/* Back Link */}
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#ff7700] mb-8 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        {/* Auth Card */}
        <div className="bg-[#141414] rounded-3xl border border-[#222] p-6 sm:p-8 shadow-2xl">
          
          {/* Header Tab Switcher */}
          <div className="flex bg-[#1e1e1e] p-1 rounded-2xl border border-[#2a2a2a] mb-8">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition ${
                mode === 'login' ? 'bg-[#ff7700] text-black shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition ${
                mode === 'register' ? 'bg-[#ff7700] text-black shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-white font-heading">
              {mode === 'login' ? 'Welcome Back!' : 'Join Velora VIP Club'}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {mode === 'login' 
                ? 'Sign in to view order history & track packages.' 
                : 'Create an account for 10% OFF your first order!'}
            </p>
          </div>

          {/* Social Sign-In Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => router.push('/account')}
              className="py-2.5 px-4 bg-[#1e1e1e] hover:bg-[#282828] border border-[#2a2a2a] rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 transition"
            >
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => router.push('/account')}
              className="py-2.5 px-4 bg-[#1e1e1e] hover:bg-[#282828] border border-[#2a2a2a] rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 transition"
            >
              <span> Apple</span>
            </button>
          </div>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-[#262626]"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-500 uppercase">Or email</span>
            <div className="flex-grow border-t border-[#262626]"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#1c1c1c] border border-[#333] rounded-xl text-xs text-white focus:ring-2 focus:ring-[#ff7700] outline-none"
                  />
                  <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#1c1c1c] border border-[#333] rounded-xl text-xs text-white focus:ring-2 focus:ring-[#ff7700] outline-none"
                />
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-300">Password *</label>
                {mode === 'login' && (
                  <button type="button" className="text-[11px] font-semibold text-[#ff7700] hover:underline">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#1c1c1c] border border-[#333] rounded-xl text-xs text-white focus:ring-2 focus:ring-[#ff7700] outline-none"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#a80000] hover:bg-[#7a0000] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg mt-2 cursor-pointer"
            >
              {isSubmitting ? 'Signing In...' : mode === 'login' ? 'Sign In To Account' : 'Create VIP Account'}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
