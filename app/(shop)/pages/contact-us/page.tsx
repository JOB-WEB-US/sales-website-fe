'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearFile = () => {
    setAttachedFile(null);
    setFilePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#ff7700] mb-8 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-950/60 text-[#ff7700] border border-red-800/40 text-xs font-extrabold rounded-full mb-3">
            <Mail className="w-3.5 h-3.5" /> Customer Support
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Contact Our Support Team
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Have a question about your order, sizing, or shipping? We are here to help 24/7!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-[#141414] border border-[#222] p-6 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 text-[#ff7700] flex items-center justify-center flex-shrink-0 border border-red-800/40">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Us</h3>
                <p className="text-sm font-bold text-white mt-0.5">support@veloratees.com</p>
                <p className="text-xs text-gray-500 mt-1">Guaranteed response within 24 hours.</p>
              </div>
            </div>

            <div className="bg-[#141414] border border-[#222] p-6 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 text-[#ff7700] flex items-center justify-center flex-shrink-0 border border-red-800/40">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Business Hours</h3>
                <p className="text-sm font-bold text-white mt-0.5">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                <p className="text-xs text-gray-500 mt-1">Weekend tickets processed next business day.</p>
              </div>
            </div>

            <div className="bg-[#141414] border border-[#222] p-6 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 text-[#ff7700] flex items-center justify-center flex-shrink-0 border border-red-800/40">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">POD Printing Facility</h3>
                <p className="text-sm font-bold text-white mt-0.5">Velora Tees Fulfillment Center</p>
                <p className="text-xs text-gray-500 mt-1">742 Evergreen Terrace, Springfield, IL 62704</p>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#141414] border border-[#222] rounded-2xl p-6 md:p-8 shadow-xl">
              
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-800">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Received!</h3>
                  <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
                    Thank you for contacting us. A support representative will get back to you at{' '}
                    <strong className="text-white">{formData.email}</strong> within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setFormData({
                        name: '',
                        email: '',
                        orderNumber: '',
                        subject: 'General Inquiry',
                        message: '',
                      });
                      setAttachedFile(null);
                      setFilePreview(null);
                      setSubmitted(false);
                    }}
                    className="px-6 py-2.5 bg-[#222] hover:bg-[#333] text-white text-xs font-bold rounded-xl transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-4">Send Us A Direct Message</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#1c1c1c] border border-[#333] rounded-xl text-sm text-white focus:ring-2 focus:ring-[#ff7700] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#1c1c1c] border border-[#333] rounded-xl text-sm text-white focus:ring-2 focus:ring-[#ff7700] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Order Number (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. VELORA-84920"
                        value={formData.orderNumber}
                        onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#1c1c1c] border border-[#333] rounded-xl text-sm text-white focus:ring-2 focus:ring-[#ff7700] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Subject *</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#1c1c1c] border border-[#333] rounded-xl text-sm text-white focus:ring-2 focus:ring-[#ff7700] outline-none"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Order Status & Tracking">Order Status & Tracking</option>
                        <option value="Size & Fit Questions">Size & Fit Questions</option>
                        <option value="Return / Exchange Request">Return / Exchange Request</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Your Message *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please describe how we can assist you..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#1c1c1c] border border-[#333] rounded-xl text-sm text-white focus:ring-2 focus:ring-[#ff7700] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Attachments (Optional)</label>
                    <div className="relative border border-dashed border-[#333] hover:border-[#ff7700]/55 rounded-xl p-4 bg-[#1c1c1c] transition flex flex-col items-center justify-center text-center">
                      {filePreview ? (
                        <div className="flex items-center gap-4 w-full">
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-lg border border-[#333]"
                          />
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-xs text-white font-semibold truncate">{attachedFile?.name}</p>
                            <p className="text-[10px] text-gray-500">
                              {attachedFile && attachedFile.size / 1024 > 1024 
                                ? `${(attachedFile.size / (1024 * 1024)).toFixed(2)} MB` 
                                : `${attachedFile ? (attachedFile.size / 1024).toFixed(0) : 0} KB`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleClearFile}
                            className="px-2.5 py-1.5 bg-red-950 text-red-500 text-[10px] font-bold rounded-lg border border-red-800 hover:bg-red-900 transition cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center w-full py-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-[#ff7700] transition">
                            <span className="bg-[#2a2a2a] px-3 py-1.5 rounded-lg border border-[#333]">Choose File</span>
                            <span className="text-gray-500">or drag it here</span>
                          </div>
                          <span className="text-[10px] text-gray-500 mt-1.5">Supports PNG, JPG, JPEG (Max 5MB)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#a80000] hover:bg-[#7a0000] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
