'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Instagram, ShoppingBag, Heart, ArrowRight } from 'lucide-react';

const UGC_POSTS = [
  {
    id: 'ugc-1',
    user: '@jessica_wilder',
    location: 'Austin, TX',
    quote: 'The print quality on this horror tee is insane. 100% thick vintage cotton!',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    productName: 'Vintage Horror Classic Graphic Tee',
    productSlug: 'vintage-horror-classic-graphic-tee',
    likes: 412,
  },
  {
    id: 'ugc-2',
    user: '@marcus_chicago',
    location: 'Chicago, IL',
    quote: 'Heavyweight hoodie is super cozy for autumn. Fit is truly oversized and comfy.',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=600&q=80',
    productName: 'Spooky Season Heavyweight Hoodie',
    productSlug: 'spooky-season-heavyweight-hoodie',
    likes: 689,
  },
  {
    id: 'ugc-3',
    user: '@alexa_styles',
    location: 'Nashville, TN',
    quote: 'Wore this to the country concert and got compliments all night! 🔥',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    productName: 'Ella Langley Country Tour Graphic Tee',
    productSlug: 'ella-langley-country-tour-graphic-tee',
    likes: 524,
  },
  {
    id: 'ugc-4',
    user: '@devon_street',
    location: 'Los Angeles, CA',
    quote: 'Best streetwear graphic apparel brand right now. Fast delivery in 3 days!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    productName: '90s Retro Band Unisex Crewneck',
    productSlug: '90s-retro-band-unisex-crewneck',
    likes: 831,
  },
];

export default function CommunityShowcase() {
  return (
    <section className="py-16 bg-[#0e0e0e] border-t border-[#1f1f1f] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff7700]/10 border border-[#ff7700]/30 text-[#ff7700] text-xs font-black uppercase tracking-wider mb-2">
              <Instagram size={13} /> #SpottedInVelora
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Loved by 50,000+ Fans Across the US
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Real customers, real street style. Tag <strong className="text-white">@VeloraTees</strong> to be featured!
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#ff7700] hover:text-white transition group self-start md:self-auto"
          >
            Explore Customer Favorites <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* UGC Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {UGC_POSTS.map((post) => (
            <div
              key={post.id}
              className="bg-[#141414] border border-[#242424] hover:border-[#ff7700]/50 rounded-3xl overflow-hidden group transition-all duration-300 flex flex-col shadow-lg"
            >
              {/* Photo Container */}
              <div className="relative aspect-square w-full bg-[#1e1e1e] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.user}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1 border border-white/10">
                  <Instagram size={11} className="text-[#ff7700]" /> {post.user}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-pink-400 flex items-center gap-1 border border-white/10">
                  <Heart size={10} fill="currentColor" /> {post.likes}
                </div>
              </div>

              {/* Review & Product Tag */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} fill="currentColor" />
                    ))}
                    <span className="text-[10px] text-gray-400 ml-1 font-bold">Verified Buyer</span>
                  </div>
                  <p className="text-xs text-gray-300 italic line-clamp-2 leading-relaxed">
                    "{post.quote}"
                  </p>
                </div>

                <Link
                  href="/shop"
                  className="pt-2 border-t border-[#222] flex items-center justify-between text-xs font-bold text-gray-300 group-hover:text-[#ff7700] transition"
                >
                  <span className="truncate text-[11px]">{post.productName}</span>
                  <ShoppingBag size={13} className="shrink-0 ml-1 text-[#ff7700]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
