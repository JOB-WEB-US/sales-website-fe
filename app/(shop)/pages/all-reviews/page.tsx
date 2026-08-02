'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ThumbsUp, CheckCircle2, Camera, Filter, Plus, ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  productTitle: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
  image?: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Marcus Vance',
    location: 'Austin, TX',
    rating: 5,
    date: '2 days ago',
    productTitle: 'Precious Dog Horror Movie, Silence Lambs T-Shirt',
    title: 'Print quality is insane! Got tons of compliments.',
    comment: 'The print on this tee is super crisp and vibrant. Wore it to a movie night and everyone asked where I got it. Fast shipping too!',
    verified: true,
    helpfulCount: 24,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80',
  },
  {
    id: 'rev-2',
    name: 'Sarah Jenkins',
    location: 'Seattle, WA',
    rating: 5,
    date: '4 days ago',
    productTitle: 'Ella Langley Country Music Retro Graphic Tee',
    title: 'Fits true to size and ultra soft cotton!',
    comment: 'Super soft 100% cotton fabric. Washed it twice already and zero shrinkage or fading on the graphic. Ordering another for my sister.',
    verified: true,
    helpfulCount: 18,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80',
  },
  {
    id: 'rev-3',
    name: 'David K.',
    location: 'Chicago, IL',
    rating: 5,
    date: '1 week ago',
    productTitle: 'Vintage Silence of the Lambs Shirt, Buffalo Bill',
    title: 'Must have for horror movie fans!',
    comment: 'Great vintage wash aesthetic. Looks like an authentic 90s tour shirt.',
    verified: true,
    helpfulCount: 12,
  },
  {
    id: 'rev-4',
    name: 'Amanda Perez',
    location: 'Miami, FL',
    rating: 4,
    date: '2 weeks ago',
    productTitle: 'Morgan Wallen One Thing At A Time Country Tour Tee',
    title: 'Great quality hoodie, fast delivery!',
    comment: 'Ordered the hoodie version and it is super thick and warm. Only taking 1 star off because USPS delayed delivery by 1 day, but product is 10/10.',
    verified: true,
    helpfulCount: 9,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80',
  },
];

import { useRouter } from 'next/navigation';

export default function AllReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [selectedFilter, setSelectedFilter] = useState<'all' | '5' | '4' | 'photos'>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Form State
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newProductTitle, setNewProductTitle] = useState('Custom Graphic Tee');

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

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      name: newName,
      location: 'Verified Buyer',
      rating: newRating,
      date: 'Just now',
      productTitle: newProductTitle,
      title: newTitle || 'Great Product!',
      comment: newComment,
      verified: true,
      helpfulCount: 0,
    };

    setReviews([newRev, ...reviews]);
    setIsWriteModalOpen(false);
    setNewName('');
    setNewTitle('');
    setNewComment('');
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
              
              <button
                onClick={() => setIsWriteModalOpen(true)}
                className="mt-5 w-full py-3 px-4 bg-[#a80000] hover:bg-[#7a0000] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-md"
              >
                <Plus size={16} /> Write A Review
              </button>
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
            {INITIAL_REVIEWS.filter((r) => r.image).map((r) => (
              <div key={r.id} className="relative aspect-square rounded-xl overflow-hidden bg-[#181818] border border-[#262626] group">
                <Image src={r.image!} alt={r.title} fill className="object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">
                  <p className="text-[11px] font-bold text-white line-clamp-1">{r.name}</p>
                  <p className="text-[10px] text-gray-300 line-clamp-1">{r.productTitle}</p>
                </div>
              </div>
            ))}
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
          {filteredReviews.map((rev) => (
            <div key={rev.id} className="bg-[#141414] rounded-2xl border border-[#222] p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222] pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{rev.name}</span>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={10} /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{rev.location} • Purchased {rev.productTitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{rev.date}</span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white mb-2">{rev.title}</h4>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">{rev.comment}</p>

              {rev.image && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#333] mb-4">
                  <Image src={rev.image} alt="Review attachment" fill className="object-cover" />
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-[#222]">
                <span>Was this review helpful?</span>
                <button
                  onClick={() => handleHelpful(rev.id)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#1e1e1e] hover:bg-[#2a2a2a] text-gray-300 font-semibold rounded-lg transition"
                >
                  <ThumbsUp size={12} className="text-[#ff7700]" /> Helpful ({rev.helpfulCount})
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* WRITE REVIEW MODAL */}
        <AnimatePresence>
          {isWriteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-lg bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 text-white shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4">
                  <h3 className="text-base font-bold">Write A Customer Review</h3>
                  <button onClick={() => setIsWriteModalOpen(false)} className="text-gray-400 hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleAddReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Overall Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition"
                        >
                          <Star size={24} fill={star <= newRating ? 'currentColor' : 'none'} />
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
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1c1c1c] border border-[#333] rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-[#ff7700]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Review Headline *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Awesome quality and fast shipping!"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1c1c1c] border border-[#333] rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-[#ff7700]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Your Review *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Tell us what you liked about the fit, fabric, and print..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1c1c1c] border border-[#333] rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-[#ff7700]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#a80000] hover:bg-[#7a0000] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg"
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
