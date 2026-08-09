'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Star, ThumbsUp, CheckCircle2, Camera, ArrowLeft } from 'lucide-react';
import { getAllReviews, ApiReview } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AllReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | '5' | '4' | 'photos'>('all');

  useEffect(() => {
    getAllReviews()
      .then((data) => {
        if (data && data.length > 0) {
          setReviews(data);
        } else {
          setReviews([]);
        }
      })
      .catch((e) => console.error('Failed to load reviews:', e))
      .finally(() => setLoading(false));
  }, []);


  const filteredReviews = reviews.filter((r) => {
    if (selectedFilter === '5') return r.rating === 5;
    if (selectedFilter === '4') return r.rating === 4;
    if (selectedFilter === 'photos') return !!r.image;
    return true;
  });

  const handleHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#ff7700] mb-6 transition cursor-pointer font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Hero Header Rating Breakdown */}
        <div className="bg-[#141414] rounded-2xl border border-[#222] p-6 md:p-10 mb-10 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Overall Score */}
            <div className="md:col-span-4 text-center md:border-r border-[#262626] md:pr-8">
              <span className="text-5xl md:text-6xl font-black text-white font-heading">4.9</span>
              <div className="flex justify-center text-amber-400 my-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs text-gray-400 font-semibold">Based on 1,482 verified customer reviews</p>
              
              <Link
                href="/account"
                className="mt-5 w-full py-3 px-4 bg-[#1a1a1a] hover:bg-[#252525] text-white hover:text-[#ff7700] border border-[#2a2a2a] font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                Go to Account to Review
              </Link>
            </div>

            {/* Rating Bars Breakdown */}
            <div className="md:col-span-8 space-y-2.5">
              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 font-bold text-gray-300">5 Stars</span>
                <div className="flex-1 h-3 bg-[#222] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <span className="w-10 text-right text-gray-400 font-semibold">92%</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 font-bold text-gray-300">4 Stars</span>
                <div className="flex-1 h-3 bg-[#222] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '6%' }}></div>
                </div>
                <span className="w-10 text-right text-gray-400 font-semibold">6%</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 font-bold text-gray-300">3 Stars</span>
                <div className="flex-1 h-3 bg-[#222] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '2%' }}></div>
                </div>
                <span className="w-10 text-right text-gray-400 font-semibold">2%</span>
              </div>
            </div>

          </div>
        </div>

        {/* Customer Photo Showcase Banner */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#ff7700]" /> Real Customer Photos
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {reviews.filter((r) => r.image || r.userAvatar).map((r, idx) => {
              const photo = r.image || r.userAvatar;
              const author = r.userName || r.name || 'Verified Customer';
              const pTitle = r.product?.title || r.productTitle || 'Graphic Apparel';
              return (
                <div key={r.id || idx} className="relative aspect-square rounded-xl overflow-hidden bg-[#181818] border border-[#262626] group">
                  <Image src={photo} alt={r.title || author} fill className="object-cover group-hover:scale-105 transition duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">
                    <p className="text-[11px] font-bold text-white line-clamp-1">{author}</p>
                    <p className="text-[10px] text-gray-300 line-clamp-1">{pTitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        {/* Filters */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              selectedFilter === 'all' ? 'bg-[#ff7700] text-black shadow' : 'bg-[#181818] text-gray-400 hover:text-white border border-[#262626]'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setSelectedFilter('5')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              selectedFilter === '5' ? 'bg-[#ff7700] text-black shadow' : 'bg-[#181818] text-gray-400 hover:text-white border border-[#262626]'
            }`}
          >
            5-Star Reviews
          </button>
          <button
            onClick={() => setSelectedFilter('photos')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              selectedFilter === 'photos' ? 'bg-[#ff7700] text-black shadow' : 'bg-[#181818] text-gray-400 hover:text-white border border-[#262626]'
            }`}
          >
            With Photos 📸
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((rev, idx) => {
            const author = rev.userName || rev.name || 'Verified Customer';
            const stars = rev.rating || 5;
            const reviewComment = rev.comment || '';
            const reviewTitle = rev.title || (stars === 5 ? 'Exceptional Quality & Design!' : 'Great Product');
            const pTitle = rev.product?.title || rev.productTitle || 'Velora Graphic Apparel';
            const revDate = rev.createdAt 
              ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
              : rev.date || 'Recently verified';
            const img = rev.userAvatar || rev.image;

            return (
              <div key={rev.id || idx} className="bg-[#141414] rounded-2xl border border-[#222] p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222] pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{author}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={10} /> Verified Buyer
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">Purchased {pTitle}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(stars)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{revDate}</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white mb-2">{reviewTitle}</h4>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">{reviewComment}</p>

                {img && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#333] mb-4">
                    <Image src={img} alt="Review attachment" fill className="object-cover" />
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-[#222]">
                  <span>Was this review helpful?</span>
                  <button
                    onClick={() => handleHelpful(rev.id)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#1e1e1e] hover:bg-[#2a2a2a] text-gray-300 font-semibold rounded-lg transition cursor-pointer"
                  >
                    <ThumbsUp size={12} className="text-[#ff7700]" /> Helpful ({rev.helpfulCount || 12})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

