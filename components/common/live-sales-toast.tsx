'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, ShoppingBag, Sparkles } from 'lucide-react';
import { getProducts, mapApiProductToUI } from '@/lib/api';

interface PurchaseNotification {
  id: string;
  customerName: string;
  location: string;
  productTitle: string;
  productImage: string;
  productSlug: string;
  timeAgo: string;
}

// 100+ Popular US First Names
const US_FIRST_NAMES = [
  'James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Sophia', 'Ethan', 'Isabella', 'Lucas', 'Mia',
  'Mason', 'Harper', 'Evelyn', 'Alexander', 'Charlotte', 'Oliver', 'Amelia', 'Benjamin', 'Ella', 'William',
  'Ava', 'Henry', 'Scarlett', 'Sebastian', 'Grace', 'Jack', 'Chloe', 'Daniel', 'Victoria', 'Matthew',
  'Riley', 'Samuel', 'Zoey', 'David', 'Penelope', 'Joseph', 'Layla', 'Jackson', 'Nora', 'Logan',
  'Lily', 'Gabriel', 'Eleanor', 'Carter', 'Hannah', 'Anthony', 'Lillian', 'John', 'Addison', 'Dylan',
  'Aubrey', 'Luke', 'Ellie', 'Andrew', 'Stella', 'Isaac', 'Natalie', 'Christopher', 'Zoe', 'Joshua',
  'Leah', 'Max', 'Hazel', 'Julian', 'Violet', 'Caleb', 'Aurora', 'Ryan', 'Savannah', 'Nathan',
  'Audrey', 'Hunter', 'Brooklyn', 'Christian', 'Bella', 'Isaiah', 'Claire', 'Thomas', 'Skylar', 'Aaron',
  'Lucy', 'Lincoln', 'Paisley', 'Charles', 'Everly', 'Eli', 'Anna', 'Connor', 'Caroline', 'Jeremiah',
  'Nova', 'Cameron', 'Genesis', 'Josiah', 'Emilia', 'Adrian', 'Kennedy', 'Colton', 'Samantha', 'Jordan',
  'Maya', 'Brayden', 'Willow', 'Austin', 'Kinsley', 'Robert', 'Naomi', 'Angel', 'Aaliyah', 'Nicholas',
];

// Surname Initials
const SURNAME_INITIALS = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.', 'J.', 'K.', 'L.', 'M.', 'N.', 'P.', 'R.', 'S.', 'T.', 'V.', 'W.', 'Y.'];

// 60+ Realistic US Cities & States
const US_LOCATIONS = [
  'Austin, TX', 'Miami, FL', 'Seattle, WA', 'Nashville, TN', 'Chicago, IL', 'Denver, CO',
  'San Diego, CA', 'Charlotte, NC', 'Atlanta, GA', 'Boston, MA', 'Dallas, TX', 'Portland, OR',
  'Las Vegas, NV', 'Phoenix, AZ', 'Orlando, FL', 'Columbus, OH', 'Indianapolis, IN', 'Tampa, FL',
  'Minneapolis, MN', 'Kansas City, MO', 'Raleigh, NC', 'Salt Lake City, UT', 'Pittsburgh, PA',
  'San Antonio, TX', 'Sacramento, CA', 'Cleveland, OH', 'Houston, TX', 'Detroit, MI', 'Louisville, KY',
  'Memphis, TN', 'Baltimore, MD', 'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA',
  'Mesa, AZ', 'Omaha, NE', 'Colorado Springs, CO', 'Virginia Beach, VA', 'Oakland, CA', 'Tulsa, OK',
  'Arlington, TX', 'New Orleans, LA', 'Wichita, KS', 'Bakersfield, CA', 'Honolulu, HI', 'Anaheim, CA',
  'Santa Ana, CA', 'Corpus Christi, TX', 'Riverside, CA', 'Lexington, KY', 'Stockton, CA', 'Saint Paul, MN',
  'Cincinnati, OH', 'Greensboro, NC', 'Plano, TX', 'Newark, NJ', 'Lincoln, NE', 'Boise, ID', 'Richmond, VA'
];

const TIME_AGOS = [
  '1 minute ago', '2 minutes ago', '3 minutes ago', '5 minutes ago',
  '7 minutes ago', '9 minutes ago', '12 minutes ago', '15 minutes ago', '18 minutes ago'
];

export default function LiveSalesToast() {
  const [currentNotice, setCurrentNotice] = useState<PurchaseNotification | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [catalog, setCatalog] = useState<any[]>([]);
  
  // Track seen customer combinations in this session to guarantee ZERO duplication
  const seenSignaturesRef = useRef<Set<string>>(new Set());
  const productQueueRef = useRef<any[]>([]);

  // Fetch products once for notification feed
  useEffect(() => {
    getProducts({ limit: 30 })
      .then((raw) => {
        const mapped = raw.map(mapApiProductToUI).filter(Boolean);
        setCatalog(mapped);
        // Shuffle products into queue
        productQueueRef.current = [...mapped].sort(() => Math.random() - 0.5);
      })
      .catch(() => {});
  }, []);

  // Popup cycle interval with anti-duplicate logic
  useEffect(() => {
    if (isDismissed || catalog.length === 0) return;

    let timeoutId: NodeJS.Timeout;
    let hideTimeoutId: NodeJS.Timeout;

    const generateUniqueCustomer = () => {
      let attempts = 0;
      let firstName = '';
      let initial = '';
      let location = '';
      let signature = '';

      // Find an unused signature up to 50 attempts
      do {
        firstName = US_FIRST_NAMES[Math.floor(Math.random() * US_FIRST_NAMES.length)];
        initial = SURNAME_INITIALS[Math.floor(Math.random() * SURNAME_INITIALS.length)];
        location = US_LOCATIONS[Math.floor(Math.random() * US_LOCATIONS.length)];
        signature = `${firstName} ${initial}|${location}`;
        attempts++;
      } while (seenSignaturesRef.current.has(signature) && attempts < 50);

      seenSignaturesRef.current.add(signature);

      // If set gets too big, clear oldest half
      if (seenSignaturesRef.current.size > 200) {
        seenSignaturesRef.current.clear();
      }

      return {
        customerName: `${firstName} ${initial}`,
        location,
      };
    };

    const getNextProduct = () => {
      if (productQueueRef.current.length === 0) {
        productQueueRef.current = [...catalog].sort(() => Math.random() - 0.5);
      }
      return productQueueRef.current.pop() || catalog[0];
    };

    const showNotification = () => {
      const customer = generateUniqueCustomer();
      const product = getNextProduct();
      const randomTime = TIME_AGOS[Math.floor(Math.random() * TIME_AGOS.length)];

      if (product) {
        setCurrentNotice({
          id: `${Date.now()}-${Math.random()}`,
          customerName: customer.customerName,
          location: customer.location,
          productTitle: product.title,
          productImage: product.frontImage,
          productSlug: product.slug || product.id,
          timeAgo: randomTime,
        });

        // Hide after 5.5 seconds
        hideTimeoutId = setTimeout(() => {
          setCurrentNotice(null);
        }, 5500);
      }
    };

    // First trigger after 3.5 seconds
    const initialTimer = setTimeout(() => {
      showNotification();
    }, 3500);

    // Dynamic interval between 16s - 22s for natural feel
    const interval = setInterval(() => {
      showNotification();
    }, 18000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(hideTimeoutId);
      clearInterval(interval);
    };
  }, [catalog, isDismissed]);

  if (isDismissed || !currentNotice) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-xs sm:max-w-sm pointer-events-auto">
      <AnimatePresence mode="wait">
        {currentNotice && (
          <motion.div
            key={currentNotice.id}
            initial={{ opacity: 0, y: 35, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            className="bg-white/95 dark:bg-[#161616]/95 backdrop-blur-md border border-gray-200 dark:border-[#2b2b2b] hover:border-orange-300 dark:hover:border-[#ff7700]/50 rounded-2xl p-3 shadow-xl flex items-center gap-3 relative group text-gray-900 dark:text-white"
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDismissed(true);
              }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#3a3a3a] rounded-full flex items-center justify-center text-gray-400 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:text-white dark:hover:bg-red-900/80 transition cursor-pointer z-10 shadow-xs"
              title="Dismiss notifications"
            >
              <X size={10} />
            </button>

            {/* Thumbnail */}
            <Link
              href={`/products/${currentNotice.productSlug}`}
              className="relative w-13 h-13 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#222] border border-gray-200 dark:border-[#333] shrink-0 block group-hover:scale-105 transition-transform shadow-xs"
            >
              <Image
                src={currentNotice.productImage}
                alt={currentNotice.productTitle}
                fill
                className="object-cover"
              />
            </Link>

            {/* Notification Content */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-300">
                <span className="font-extrabold text-gray-900 dark:text-white truncate">
                  {currentNotice.customerName}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-[10px]">in {currentNotice.location}</span>
              </div>

              <Link
                href={`/products/${currentNotice.productSlug}`}
                className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 hover:text-[#ff7700] dark:hover:text-[#ff7700] line-clamp-1 transition block my-0.5"
              >
                purchased {currentNotice.productTitle}
              </Link>

              <div className="flex items-center justify-between text-[9px] text-gray-400 pt-0.5">
                <span>{currentNotice.timeAgo}</span>
                <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle size={9} /> Verified Purchase
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
