'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MOCK_BLOGS, BlogPost } from '@/lib/mock-blogs';
import { Newspaper, Clock, User, ArrowRight, ArrowLeft, Tag } from 'lucide-react';

export default function BlogListingPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Fashion & Styling', 'POD Inside Story', 'Pop Culture'];

  const featuredPost = MOCK_BLOGS[0];

  const filteredPosts = activeCategory === 'All'
    ? MOCK_BLOGS
    : MOCK_BLOGS.filter((b) => b.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#ff7700] mb-8 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        {/* Hero Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-950/60 text-[#ff7700] border border-red-800/40 text-xs font-extrabold rounded-full mb-3">
            <Newspaper className="w-3.5 h-3.5" /> Velora Journal & Style Guide
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight font-heading">
            Latest Stories & Apparel Culture
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Explore horror tee trends, country music fashion, behind-the-scenes print stories, and cotton care guides.
          </p>
        </div>

        {/* Featured Banner Post */}
        {featuredPost && (
          <Link
            href={`/blogs/news/${featuredPost.slug}`}
            className="group block relative bg-[#141414] rounded-3xl border border-[#222] overflow-hidden mb-12 shadow-2xl hover:border-[#ff7700]/50 transition duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              <div className="relative md:col-span-7 aspect-video md:aspect-auto min-h-[300px]">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="md:col-span-5 p-6 md:p-10 flex flex-col justify-between">
                <div>
                  <span className="inline-block px-3 py-1 bg-[#ff7700] text-black font-extrabold text-[10px] uppercase rounded-full mb-3">
                    Featured Story
                  </span>
                  <h2 className="text-xl md:text-2xl font-extrabold font-heading text-white group-hover:text-[#ff7700] transition leading-snug mb-3">
                    {featuredPost.title}
                  </h2>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-6">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-[#222]">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#ff7700]" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                  <span className="font-bold text-[#ff7700] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read Article <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeCategory === cat
                  ? 'bg-[#ff7700] text-black shadow'
                  : 'bg-[#141414] text-gray-400 border border-[#262626] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blogs/news/${post.slug}`}
              className="group bg-[#141414] rounded-2xl border border-[#222] overflow-hidden shadow-sm hover:border-[#ff7700]/50 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video bg-[#1a1a1a] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md text-[#ff7700] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border border-[#ff7700]/30">
                    {post.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-sm font-bold text-white group-hover:text-[#ff7700] transition line-clamp-2 mb-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-[#222] flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-[#ff7700]" /> {post.readTime}
                </span>
                <span className="text-[11px] font-semibold text-gray-400">{post.date}</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
