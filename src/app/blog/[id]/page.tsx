"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Calendar, User, ArrowLeft } from "lucide-react";
import articles from "@/contents/blog/articles.json";

export const runtime = 'edge';

export default function BlogDetailPage() {
  const params = useParams();
  const id = params?.id ? parseInt(params.id as string) : null;
  
  const article = articles.find(a => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Artikel Tidak Ditemukan</h1>
        <Link href="/blog" className="text-[#C9A84C] font-semibold flex items-center gap-2 hover:opacity-80">
          <ArrowLeft className="w-5 h-5" /> Kembali ke Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold text-sm">Kembali</span>
          </Link>
          <div className="flex-1 flex justify-center">
            <span
              className="font-bold tracking-widest text-slate-800"
              style={{ fontFamily: 'var(--font-cinzel), serif' }}
            >
              FARHA
            </span>
          </div>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Article Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-[#C9A84C]/10 text-[#8B6914] text-xs font-bold rounded-full mb-4">
            {article.category}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
            {article.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
          </div>
        </div>

        <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-10 shadow-lg bg-slate-200">
          <img
            src={`https://picsum.photos/800/600?random=${article.id}`}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-lg prose-slate max-w-none text-slate-700 leading-loose">
          <p className="text-xl text-slate-600 leading-relaxed font-medium mb-8">
            {article.excerpt}
          </p>
          
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100">
            <p className="whitespace-pre-line text-base sm:text-lg">
              {article.content}
            </p>
          </div>
        </div>

        {/* Share / Bottom actions */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-semibold text-slate-800">Bagikan artikel ini</p>
          <div className="flex gap-3">
            {['Facebook', 'Twitter', 'WhatsApp'].map(social => (
              <button key={social} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors shadow-sm">
                {social}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
