'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, ShoppingBag } from 'lucide-react';
import { getProducts, mapApiProductToUI } from '@/lib/api';

interface PurchaseNotification {
  customerName: string;
  location: string;
  productTitle: string;
  productImage: string;
  productSlug: string;
  timeAgo: string;
}

const SAMPLE_CUSTOMERS = [
  { name: 'Sarah M.', location: 'Austin, TX' },
  { name: 'Marcus B.', location: 'Miami, FL' },
  { name: 'Emily R.', location: 'Seattle, WA' },
  { name: 'Jason T.', location: 'Chicago, IL' },
  { name: 'Chloe D.', location: 'New York, NY' },
  { name: 'Tyler K.', location: 'Denver, CO' },
  { name: 'Hannah P.', location: 'Nashville, TN' },
  { name: 'David L.', location: 'San Diego, CA' },
];

const TIME_AGOS = ['2 minutes ago', '4 minutes ago', '6 minutes ago', '11 minutes ago', '18 minutes ago'];

export default function LiveSalesToast() {
  const [currentNotice, setCurrentNotice] = useState<PurchaseNotification | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [catalog, setCatalog] = useState<any[]>([]);

  // Fetch products once for notification feed
  useEffect(() => {
    getProducts({ limit: 15 })
      .then((raw) => {
        const mapped = raw.map(mapApiProductToUI).filter(Boolean);
        setCatalog(mapped);
      })
      .catch(() => {});
  }, []);

  // Popup cycle interval
  useEffect(() => {
    if (isDismissed || catalog.length === 0) return;

    let timeoutId: NodeJS.Timeout;
    let hideTimeoutId: NodeJS.Timeout;

    const showRandomNotification = () => {
      const randomCustomer = SAMPLE_CUSTOMERS[Math.floor(Math.random() * SAMPLE_CUSTOMERS.length)];
      const randomProduct = catalog[Math.floor(Math.random() * catalog.length)];
      const randomTime = TIME_AGOS[Math.floor(Math.random() * TIME_AGOS.length)];

      if (randomProduct) {
        setCurrentNotice({
          customerName: randomCustomer.name,
          location: randomCustomer.location,
          productTitle: randomProduct.title,
          productImage: randomProduct.frontImage,
          productSlug: randomProduct.slug || randomProduct.id,
          timeAgo: randomTime,
        });

        // Hide after 5.5 seconds
        hideTimeoutId = setTimeout(() => {
          setCurrentNotice(null);
        }, 5500);
      }
    };

    // First trigger after 4 seconds
    const initialTimer = setTimeout(() => {
      showRandomNotification();
    }, 4000);

    // Repeat every 18 seconds
    const interval = setInterval(() => {
      showRandomNotification();
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
      <AnimatePresence>
        {currentNotice && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className="bg-[#181818]/95 backdrop-blur-md border border-[#2a2a2a] hover:border-[#ff7700]/50 rounded-2xl p-3 shadow-2xl flex items-center gap-3 relative group"
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDismissed(true);
              }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#252525] border border-[#3a3a3a] rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-900/60 transition cursor-pointer"
              title="Dismiss notifications"
            >
              <X size={10} />
            </button>

            {/* Thumbnail */}
            <Link
              href={`/products/${currentNotice.productSlug}`}
              className="relative w-13 h-13 rounded-xl overflow-hidden bg-[#242424] border border-[#333] shrink-0 block group-hover:scale-105 transition-transform"
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
              <div className="flex items-center gap-1.5 text-[11px] text-gray-300">
                <span className="font-bold text-white truncate">
                  {currentNotice.customerName}
                </span>
                <span className="text-gray-400 text-[10px]">in {currentNotice.location}</span>
              </div>

              <Link
                href={`/products/${currentNotice.productSlug}`}
                className="text-[11px] font-semibold text-gray-200 hover:text-[#ff7700] line-clamp-1 transition block my-0.5"
              >
                purchased {currentNotice.productTitle}
              </Link>

              <div className="flex items-center justify-between text-[9px] text-gray-400 pt-0.5">
                <span>{currentNotice.timeAgo}</span>
                <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold">
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
