'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MOCK_BLOGS } from '@/lib/mock-blogs';
import { Clock, User, ArrowLeft, Tag, Share2, ShoppingBag } from 'lucide-react';

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const post = MOCK_BLOGS.find((b) => b.slug === params.slug) || MOCK_BLOGS[0];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white py-12 md:py-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#ff7700] mb-8 transition cursor-pointer font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Category & Title */}
        <span className="inline-block px-3.5 py-1 bg-red-950/60 text-[#ff7700] border border-red-800/40 text-xs font-extrabold rounded-full mb-4 uppercase tracking-wider">
          {post.category}
        </span>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-heading leading-tight mb-6">
          {post.title}
        </h1>

        {/* Author Meta Bar */}
        <div className="flex items-center justify-between border-b border-[#222] pb-6 mb-8 text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#333]">
              <Image src={post.authorAvatar} alt={post.author} fill className="object-cover" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{post.author}</p>
              <p className="text-gray-500">{post.date} • {post.readTime}</p>
            </div>
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181818] hover:bg-[#252525] text-gray-300 rounded-lg border border-[#2a2a2a] transition">
            <Share2 size={14} /> Share
          </button>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-video rounded-3xl overflow-hidden border border-[#222] mb-10 shadow-2xl">
          <Image src={post.image} alt={post.title} fill priority className="object-cover" />
        </div>

        {/* Article Body */}
        <div className="prose prose-invert max-w-none space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
          {post.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-[#222]">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Tag size={12} className="text-[#ff7700]" /> Tags:
          </span>
          {post.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-[#181818] border border-[#2a2a2a] text-gray-300 text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* Related Products CTA Banner */}
        <div className="mt-12 p-8 bg-gradient-to-r from-red-950 to-[#141414] rounded-3xl border border-red-900/50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white">Inspired By This Article?</h3>
            <p className="text-xs text-gray-300 mt-1">Shop our latest graphic tees and horror merchandise with 10% off code: VELORA10</p>
          </div>
          <Link
            href="/shop"
            className="px-6 py-3 bg-[#ff7700] hover:bg-[#e06800] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center gap-2 flex-shrink-0"
          >
            <ShoppingBag size={16} /> Shop Related Collection
          </Link>
        </div>

      </article>
    </div>
  );
}
