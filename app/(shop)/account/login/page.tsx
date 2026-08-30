'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, ArrowLeft, Eye, EyeOff, AlertCircle, KeyRound, CheckCircle2, RefreshCw, X, ShieldCheck } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const redirectUrl = searchParams.get('redirect') || '/account';

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isGoogleReady, setIsGoogleReady] = useState(false);

  // OTP Verification Modal States (Registration)
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Forgot Password Modal States
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1); // 1 = Enter Email, 2 = Enter OTP & New Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtpDigits, setForgotOtpDigits] = useState(['', '', '', '', '', '']);
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [isSendingForgotOtp, setIsSendingForgotOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [forgotResendCountdown, setForgotResendCountdown] = useState(60);
  const [isResendingForgotOtp, setIsResendingForgotOtp] = useState(false);
  const forgotOtpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for Registration OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOtpModalOpen && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpModalOpen, resendCountdown]);

  // Countdown timer for Forgot Password OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isForgotModalOpen && forgotStep === 2 && forgotResendCountdown > 0) {
      timer = setInterval(() => {
        setForgotResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isForgotModalOpen, forgotStep, forgotResendCountdown]);

  useEffect(() => {
    if (pathname?.includes('/register')) {
      setMode('register');
    }

    // Load Google Identity Services (GSI) Client
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '572627391251-1k7avu5t0nn8ttepfrsg0b35dn6c61af.apps.googleusercontent.com';
    
    const initializeGoogle = () => {
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          setIsGoogleReady(true);
        } catch (e) {
          console.warn('Google GSI init error:', e);
        }
      }
    };

    if (typeof window !== 'undefined') {
      if ((window as any).google?.accounts?.id) {
        initializeGoogle();
      } else {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogle;
        document.body.appendChild(script);
      }
    }
  }, [pathname]);

  const handleGoogleCredentialResponse = async (response: any) => {
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      const credential = response.credential;
      if (!credential) {
        throw new Error('Không nhận được token xác thực từ Google.');
      }

      // Gửi Google ID token đã ký lên backend xác thực an toàn
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const res = await fetch(`${backendUrl}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Xác thực Google thất bại trên máy chủ.');
      }

      // Smart Wishlist Sync
      useWishlistStore.getState().syncUserWishlist();

      router.push(redirectUrl);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setErrorMsg(err.message || 'Đăng nhập Google thất bại. Vui lòng thử lại.');
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    setErrorMsg('');

    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setIsSubmitting(false);
          }
        });
        return;
      } catch (err) {
        console.warn('Google prompt error:', err);
        setIsSubmitting(false);
      }
    }
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!cleanEmail) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setErrorMsg('Invalid email format (e.g. yourname@gmail.com).');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim() || name.trim().length < 2) {
        setErrorMsg('Please enter a valid full name (at least 2 characters).');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
    }

    setIsSubmitting(true);
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    try {
      if (mode === 'register') {
        // Step 1: Send OTP to user's real email
        const res = await fetch(`${backendUrl}/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name: name.trim(), email: cleanEmail, password }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setErrorMsg(data.message || 'Failed to send verification code. Please check your email.');
          setIsSubmitting(false);
          return;
        }

        // Open OTP verification modal
        setIsSubmitting(false);
        setOtpDigits(['', '', '', '', '', '']);
        setOtpError('');
        setResendCountdown(60);
        setIsOtpModalOpen(true);

        // Focus first OTP input
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 300);
        return;
      }

      // Login Flow
      const res = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Nhận HttpOnly cookies an toàn
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Account does not exist or incorrect password.');
        setIsSubmitting(false);
        return;
      }

      // Smart Wishlist Sync
      useWishlistStore.getState().syncUserWishlist();

      router.push(redirectUrl);
    } catch (err: any) {
      console.error('Auth request error:', err);
      setErrorMsg('Unable to reach authentication server. Please check your internet connection.');
      setIsSubmitting(false);
    }
  };

  // OTP Input Change Handler
  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric digit
    if (value && !/^\d+$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1); // Take last char if multiple
    setOtpDigits(newDigits);
    setOtpError('');

    // Auto-advance to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 digits are filled
    const fullCode = newDigits.join('');
    if (fullCode.length === 6 && !newDigits.includes('')) {
      handleVerifyOtpSubmit(fullCode);
    }
  };

  // OTP Keydown (Backspace navigation)
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // OTP Paste Handler
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpDigits(digits);
      setOtpError('');
      otpInputRefs.current[5]?.focus();
      handleVerifyOtpSubmit(pastedData);
    }
  };

  // Submit OTP Verification
  const handleVerifyOtpSubmit = async (codeToVerify?: string) => {
    const fullOtp = codeToVerify || otpDigits.join('');
    if (fullOtp.length !== 6) {
      setOtpError('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    try {
      const res = await fetch(`${backendUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Nhận HttpOnly cookies an toàn
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: fullOtp }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setOtpError(data.message || 'Invalid or expired verification code.');
        setIsVerifyingOtp(false);
        return;
      }

      // Smart Wishlist Sync
      useWishlistStore.getState().syncUserWishlist();

      setIsOtpModalOpen(false);
      router.push(redirectUrl);
    } catch (err: any) {
      setOtpError('Network error verifying code. Please try again.');
      setIsVerifyingOtp(false);
    }
  };

  // Resend OTP Handler
  const handleResendOtp = async () => {
    if (resendCountdown > 0 || isResendingOtp) return;

    setIsResendingOtp(true);
    setOtpError('');
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    try {
      const res = await fetch(`${backendUrl}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setOtpError(data.message || 'Failed to resend code.');
        setIsResendingOtp(false);
        return;
      }

      setResendCountdown(60);
      setOtpDigits(['', '', '', '', '', '']);
      setIsResendingOtp(false);
      otpInputRefs.current[0]?.focus();
    } catch (err) {
      setOtpError('Failed to resend code. Please try again.');
      setIsResendingOtp(false);
    }
  };

  // 1. Send Forgot Password OTP
  const handleSendForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    const cleanEmail = forgotEmail.trim().toLowerCase();
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      setForgotError('Please enter a valid email address.');
      return;
    }

    setIsSendingForgotOtp(true);
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    try {
      const res = await fetch(`${backendUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setForgotError(data.message || 'No account found with this email address.');
        setIsSendingForgotOtp(false);
        return;
      }

      setIsSendingForgotOtp(false);
      setForgotStep(2);
      setForgotOtpDigits(['', '', '', '', '', '']);
      setForgotNewPassword('');
      setForgotConfirmPassword('');
      setForgotResendCountdown(60);

      setTimeout(() => {
        forgotOtpInputRefs.current[0]?.focus();
      }, 300);
    } catch (err) {
      setForgotError('Unable to connect to server. Please try again.');
      setIsSendingForgotOtp(false);
    }
  };

  // Forgot OTP Input Change
  const handleForgotOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newDigits = [...forgotOtpDigits];
    newDigits[index] = value.slice(-1);
    setForgotOtpDigits(newDigits);
    setForgotError('');

    if (value && index < 5) {
      forgotOtpInputRefs.current[index + 1]?.focus();
    }
  };

  // Forgot OTP Keydown (Backspace)
  const handleForgotOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !forgotOtpDigits[index] && index > 0) {
      forgotOtpInputRefs.current[index - 1]?.focus();
    }
  };

  // Forgot OTP Paste
  const handleForgotOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setForgotOtpDigits(digits);
      setForgotError('');
      forgotOtpInputRefs.current[5]?.focus();
    }
  };

  // 2. Submit Reset Password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    const fullOtp = forgotOtpDigits.join('');
    if (fullOtp.length !== 6) {
      setForgotError('Please enter all 6 digits of your verification code.');
      return;
    }

    if (!forgotNewPassword || forgotNewPassword.length < 8) {
      setForgotError('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Passwords do not match. Please check and try again.');
      return;
    }

    setIsResettingPassword(true);
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    try {
      const res = await fetch(`${backendUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Nhận HttpOnly cookies an toàn
        body: JSON.stringify({
          email: forgotEmail.trim().toLowerCase(),
          otp: fullOtp,
          newPassword: forgotNewPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setForgotError(data.message || 'Invalid or expired code.');
        setIsResettingPassword(false);
        return;
      }

      // Smart Wishlist Sync
      useWishlistStore.getState().syncUserWishlist();

      setIsForgotModalOpen(false);
      router.push(redirectUrl);
    } catch (err) {
      setForgotError('Failed to reset password. Please try again.');
      setIsResettingPassword(false);
    }
  };

  // Resend Forgot Password OTP
  const handleResendForgotOtp = async () => {
    if (forgotResendCountdown > 0 || isResendingForgotOtp) return;

    setIsResendingForgotOtp(true);
    setForgotError('');
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    try {
      const res = await fetch(`${backendUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setForgotError(data.message || 'Failed to resend code.');
        setIsResendingForgotOtp(false);
        return;
      }

      setForgotResendCountdown(60);
      setForgotOtpDigits(['', '', '', '', '', '']);
      setIsResendingForgotOtp(false);
      forgotOtpInputRefs.current[0]?.focus();
    } catch (err) {
      setForgotError('Failed to resend code. Please try again.');
      setIsResendingForgotOtp(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white py-12 md:py-20 flex items-center justify-center transition-colors">
      <div className="w-full max-w-md mx-auto px-4">
        
        {/* Back Link */}
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-[#ff7700] mb-8 transition font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        {/* Auth Card */}
        <div className="bg-white dark:bg-[#141414] rounded-3xl border border-gray-200 dark:border-[#222] p-6 sm:p-8 shadow-2xl transition-colors">
          
          {/* Header Tab Switcher */}
          <div className="flex bg-gray-100 dark:bg-[#1e1e1e] p-1 rounded-2xl border border-gray-200 dark:border-[#2a2a2a] mb-8">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition cursor-pointer ${
                mode === 'login' ? 'bg-[#ff7700] text-black shadow-md' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition cursor-pointer ${
                mode === 'register' ? 'bg-[#ff7700] text-black shadow-md' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white font-heading">
              {mode === 'login' ? 'Welcome Back!' : 'Join Velora VIP Club'}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {mode === 'login' 
                ? 'Sign in to view order history & track packages.' 
                : 'Create an account for 10% OFF your first order!'}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 rounded-xl text-red-600 dark:text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Custom Google Sign-In Button */}
          <div className="mb-6">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#242424] border border-gray-200 dark:border-[#333] rounded-2xl text-xs font-bold text-gray-800 dark:text-white flex items-center justify-center gap-3 transition-all duration-200 shadow-sm hover:shadow hover:border-gray-300 dark:hover:border-[#444] cursor-pointer disabled:opacity-50 active:scale-[0.99]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-gray-200 dark:border-[#262626]"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Or email</span>
            <div className="flex-grow border-t border-gray-200 dark:border-[#262626]"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-300 dark:border-[#333] rounded-xl text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff7700] outline-none"
                  />
                  <User className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3.5 top-3" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-300 dark:border-[#333] rounded-xl text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff7700] outline-none"
                />
                <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Password *</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email || '');
                      setForgotStep(1);
                      setForgotError('');
                      setForgotSuccess('');
                      setIsForgotModalOpen(true);
                    }}
                    className="text-[11px] font-semibold text-[#ff7700] hover:underline cursor-pointer"
                  >
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
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-300 dark:border-[#333] rounded-xl text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff7700] outline-none"
                />
                <Lock className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#a80000] hover:bg-[#7a0000] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg mt-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting
                ? mode === 'login' ? 'Signing In...' : 'Sending Code...'
                : mode === 'login' ? 'Sign In To Account' : 'Create VIP Account'}
            </button>
          </form>

        </div>

        {/* REGISTRATION OTP MODAL */}
        <AnimatePresence>
          {isOtpModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-md bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-3xl p-6 sm:p-8 shadow-2xl text-center transition-colors"
              >
                {/* Close Modal */}
                <button
                  onClick={() => setIsOtpModalOpen(false)}
                  className="absolute top-5 right-5 p-1.5 rounded-full bg-gray-100 dark:bg-[#222] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition cursor-pointer"
                >
                  <X size={16} />
                </button>

                {/* Badge Icon */}
                <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff7700] mx-auto flex items-center justify-center mb-4 border border-orange-200 dark:border-orange-800/40 shadow-sm">
                  <ShieldCheck size={32} />
                </div>

                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white font-heading">
                  Verify Your Email
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-1">
                  We've sent a 6-digit security verification code to:
                </p>
                <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2a2a2a] rounded-lg text-xs font-bold text-[#c2410c] dark:text-[#ff7700] mb-6">
                  {email}
                </div>

                {/* OTP Error Message */}
                {otpError && (
                  <div className="mb-5 p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 rounded-xl text-red-600 dark:text-red-200 text-xs flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{otpError}</span>
                  </div>
                )}

                {/* 6 Digit Inputs */}
                <div className="flex justify-center gap-2 sm:gap-2.5 mb-6" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { otpInputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black font-mono rounded-xl bg-gray-50 dark:bg-[#1c1c1c] border border-gray-300 dark:border-[#333] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff7700] focus:border-[#ff7700] outline-none transition shadow-sm"
                    />
                  ))}
                </div>

                {/* Submit Verify Button */}
                <button
                  type="button"
                  disabled={isVerifyingOtp || otpDigits.includes('')}
                  onClick={() => handleVerifyOtpSubmit()}
                  className="w-full py-3.5 bg-[#a80000] hover:bg-[#7a0000] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg cursor-pointer disabled:opacity-50 mb-4"
                >
                  {isVerifyingOtp ? 'Verifying Code...' : 'Verify & Activate VIP Account'}
                </button>

                {/* Resend Actions */}
                <div className="flex flex-col items-center gap-2 text-xs">
                  {resendCountdown > 0 ? (
                    <span className="text-gray-400 font-medium flex items-center gap-1.5">
                      <RefreshCw size={12} className="animate-spin text-[#ff7700]" /> Resend code in <strong className="text-gray-700 dark:text-gray-300">{resendCountdown}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={isResendingOtp}
                      onClick={handleResendOtp}
                      className="text-[#c2410c] dark:text-[#ff7700] hover:underline font-bold cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw size={13} /> {isResendingOtp ? 'Sending new code...' : 'Resend Verification Code'}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsOtpModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-[11px] underline mt-1 cursor-pointer"
                  >
                    Entered wrong email? Edit information
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* FORGOT PASSWORD MODAL */}
        <AnimatePresence>
          {isForgotModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-md bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-3xl p-6 sm:p-8 shadow-2xl text-center transition-colors"
              >
                {/* Close Modal */}
                <button
                  onClick={() => setIsForgotModalOpen(false)}
                  className="absolute top-5 right-5 p-1.5 rounded-full bg-gray-100 dark:bg-[#222] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition cursor-pointer"
                >
                  <X size={16} />
                </button>

                {/* Badge Icon */}
                <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 mx-auto flex items-center justify-center mb-4 border border-amber-200 dark:border-amber-800/40 shadow-sm">
                  <KeyRound size={32} />
                </div>

                {/* STEP 1: ENTER EMAIL */}
                {forgotStep === 1 && (
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white font-heading">
                      Forgot Password?
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-6">
                      Enter your account email below. We'll send a 6-digit security code to reset your password.
                    </p>

                    {forgotError && (
                      <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 rounded-xl text-red-600 dark:text-red-200 text-xs flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                        <span>{forgotError}</span>
                      </div>
                    )}

                    <form onSubmit={handleSendForgotOtp} className="space-y-4">
                      <div className="text-left">
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Account Email Address *
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-300 dark:border-[#333] rounded-xl text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff7700] outline-none"
                          />
                          <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3.5 top-3" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingForgotOtp}
                        className="w-full py-3.5 bg-[#a80000] hover:bg-[#7a0000] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg cursor-pointer disabled:opacity-50"
                      >
                        {isSendingForgotOtp ? 'Sending Reset Code...' : 'Send Reset Code'}
                      </button>
                    </form>

                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs underline mt-4 cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </div>
                )}

                {/* STEP 2: ENTER OTP & NEW PASSWORD */}
                {forgotStep === 2 && (
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white font-heading">
                      Reset Your Password
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-1">
                      Enter the 6-digit code sent to:
                    </p>
                    <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2a2a2a] rounded-lg text-xs font-bold text-[#c2410c] dark:text-[#ff7700] mb-5">
                      {forgotEmail}
                    </div>

                    {forgotError && (
                      <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 rounded-xl text-red-600 dark:text-red-200 text-xs flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                        <span>{forgotError}</span>
                      </div>
                    )}

                    <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-left">
                      {/* 6 Digit Inputs */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">
                          6-Digit Verification Code *
                        </label>
                        <div className="flex justify-center gap-2 sm:gap-2.5 mb-2" onPaste={handleForgotOtpPaste}>
                          {forgotOtpDigits.map((digit, index) => (
                            <input
                              key={index}
                              ref={(el) => { forgotOtpInputRefs.current[index] = el; }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleForgotOtpChange(index, e.target.value)}
                              onKeyDown={(e) => handleForgotOtpKeyDown(index, e)}
                              className="w-10 h-11 sm:w-11 sm:h-12 text-center text-lg sm:text-xl font-black font-mono rounded-xl bg-gray-50 dark:bg-[#1c1c1c] border border-gray-300 dark:border-[#333] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff7700] focus:border-[#ff7700] outline-none transition shadow-sm"
                            />
                          ))}
                        </div>
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          New Password * (min. 6 characters)
                        </label>
                        <div className="relative">
                          <input
                            type={showForgotNewPassword ? 'text' : 'password'}
                            required
                            placeholder="••••••••"
                            value={forgotNewPassword}
                            onChange={(e) => setForgotNewPassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-300 dark:border-[#333] rounded-xl text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff7700] outline-none"
                          />
                          <Lock className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3.5 top-3" />
                          <button
                            type="button"
                            onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                            className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
                          >
                            {showForgotNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm New Password */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Confirm New Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showForgotNewPassword ? 'text' : 'password'}
                            required
                            placeholder="••••••••"
                            value={forgotConfirmPassword}
                            onChange={(e) => setForgotConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 dark:bg-[#1c1c1c] border border-gray-300 dark:border-[#333] rounded-xl text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff7700] outline-none"
                          />
                          <Lock className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3.5 top-3" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isResettingPassword || forgotOtpDigits.includes('')}
                        className="w-full py-3.5 bg-[#a80000] hover:bg-[#7a0000] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg cursor-pointer disabled:opacity-50 mt-2"
                      >
                        {isResettingPassword ? 'Updating Password...' : 'Save New Password & Sign In'}
                      </button>
                    </form>

                    {/* Resend Actions */}
                    <div className="flex flex-col items-center gap-2 text-xs mt-4">
                      {forgotResendCountdown > 0 ? (
                        <span className="text-gray-400 font-medium flex items-center gap-1.5">
                          <RefreshCw size={12} className="animate-spin text-[#ff7700]" /> Resend code in <strong className="text-gray-700 dark:text-gray-300">{forgotResendCountdown}s</strong>
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={isResendingForgotOtp}
                          onClick={handleResendForgotOtp}
                          className="text-[#c2410c] dark:text-[#ff7700] hover:underline font-bold cursor-pointer flex items-center gap-1"
                        >
                          <RefreshCw size={13} /> {isResendingForgotOtp ? 'Sending code...' : 'Resend Code'}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => { setForgotStep(1); setForgotError(''); }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-[11px] underline cursor-pointer"
                      >
                        Wrong email? Change Email Address
                      </button>
                    </div>
                  </div>
                )}

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white text-sm">
        Loading...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

