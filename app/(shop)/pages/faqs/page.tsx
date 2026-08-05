'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, HelpCircle, ChevronDown, ChevronUp, ArrowLeft, Printer, Truck, RefreshCw, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  category: 'printing' | 'shipping' | 'returns' | 'payment';
  question: string;
  answer: string;
}

const ALL_FAQS: FAQItem[] = [
  // Printing & Orders
  {
    category: 'printing',
    question: 'How long does Print-On-Demand (POD) production take?',
    answer: 'Each order is printed on demand using high definition Direct-To-Garment (DTG) technology. Printing and quality inspection typically takes 1 to 3 business days before package dispatch.',
  },
  {
    category: 'printing',
    question: 'What t-shirt brand/fabric do you use?',
    answer: 'We use premium 100% Ring-Spun Cotton tees (soft-style retail fit). They are pre-shrunk to minimize shrinkage and feature ultra-soft fabric for maximum comfort.',
  },
  {
    category: 'printing',
    question: 'Can I cancel or change my order after placing it?',
    answer: 'Order modifications or cancellations can be requested within 12 hours of order placement. Once an item has entered the POD printing queue, changes can no longer be made.',
  },

  // Shipping
  {
    category: 'shipping',
    question: 'How long does shipping take within the US?',
    answer: 'Standard shipping takes 3 to 5 business days after fulfillment. Express shipping takes 1 to 2 business days. Orders over $75 qualify for Free Standard Shipping!',
  },
  {
    category: 'shipping',
    question: 'Where can I track my package?',
    answer: 'Once your order is handed over to USPS or FedEx, a tracking link will be sent to your email. You can also track your status anytime on our Order Tracking page (/pages/order-tracking).',
  },
  {
    category: 'shipping',
    question: 'Do you ship internationally?',
    answer: 'Yes! We ship worldwide. International delivery typically takes 7 to 14 business days depending on customs processing in your destination country.',
  },

  // Returns & Refund
  {
    category: 'returns',
    question: 'What is your return policy?',
    answer: 'We offer a 30-Day Money-Back Guarantee! If your shirt arrives misprinted, damaged, or defective, simply send us a photo and we will send a free replacement or full refund immediately.',
  },
  {
    category: 'returns',
    question: 'What if I ordered the wrong size?',
    answer: 'We recommend checking our Sizing Guide (/pages/product-details-sizing) before ordering. If you receive the wrong size, contact support@veloratees.com within 30 days for exchange options.',
  },

  // Payments
  {
    category: 'payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept Visa, MasterCard, American Express, PayPal, Apple Pay, and Cash on Delivery (COD). All transactions are encrypted via 256-bit SSL security.',
  },
  {
    category: 'payment',
    question: 'How do I use a discount promo code?',
    answer: 'During checkout, enter your promo code (e.g. VELORA10) into the "Discount Code" field on the Order Summary sidebar and click Apply.',
  },
];

export default function FAQsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'printing' | 'shipping' | 'returns' | 'payment'>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = ALL_FAQS.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#ff7700] mb-8 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-950/60 text-[#ff7700] border border-red-800/40 text-xs font-extrabold rounded-full mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            How Can We Help You?
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Find answers to common questions about print production, shipping times, returns, and payment options.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-10">
          <input
            type="text"
            placeholder="Search FAQs (e.g., shipping, size, return)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#141414] border border-[#262626] rounded-2xl text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff7700] outline-none shadow-lg"
          />
          <Search className="w-5 h-5 text-gray-500 absolute left-4 top-3.5" />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeCategory === 'all' ? 'bg-[#ff7700] text-black shadow' : 'bg-[#141414] text-gray-400 border border-[#262626] hover:text-white'
            }`}
          >
            All FAQs
          </button>
          <button
            onClick={() => setActiveCategory('printing')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
              activeCategory === 'printing' ? 'bg-[#ff7700] text-black shadow' : 'bg-[#141414] text-gray-400 border border-[#262626] hover:text-white'
            }`}
          >
            <Printer size={14} /> Orders & POD
          </button>
          <button
            onClick={() => setActiveCategory('shipping')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
              activeCategory === 'shipping' ? 'bg-[#ff7700] text-black shadow' : 'bg-[#141414] text-gray-400 border border-[#262626] hover:text-white'
            }`}
          >
            <Truck size={14} /> Shipping
          </button>
          <button
            onClick={() => setActiveCategory('returns')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
              activeCategory === 'returns' ? 'bg-[#ff7700] text-black shadow' : 'bg-[#141414] text-gray-400 border border-[#262626] hover:text-white'
            }`}
          >
            <RefreshCw size={14} /> Returns
          </button>
          <button
            onClick={() => setActiveCategory('payment')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
              activeCategory === 'payment' ? 'bg-[#ff7700] text-black shadow' : 'bg-[#141414] text-gray-400 border border-[#262626] hover:text-white'
            }`}
          >
            <CreditCard size={14} /> Payments
          </button>
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-3 mb-12">
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center text-gray-500 bg-[#141414] rounded-2xl border border-[#262626]">
              <p className="text-sm font-semibold">No questions found matching "{searchTerm}"</p>
              <button onClick={() => setSearchTerm('')} className="mt-2 text-xs text-[#ff7700] hover:underline font-bold">
                Clear search filter
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-sm text-white flex items-center justify-between bg-[#141414] hover:bg-[#1a1a1a] transition"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#ff7700]" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 pb-5 text-xs text-gray-300 leading-relaxed border-t border-[#222] pt-3"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Contact Support Prompt Banner */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 text-center">
          <p className="text-sm font-bold text-white mb-1">Still have questions?</p>
          <p className="text-xs text-gray-400 mb-4">Our support team is available 24/7 to assist you with your orders.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#a80000] hover:bg-[#7a0000] text-white text-xs font-bold rounded-xl transition"
          >
            Contact Customer Support
          </Link>
        </div>

      </div>
    </div>
  );
}
