"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Calendar, User, ArrowRight } from "lucide-react";
import articles from "@/contents/blog/articles.json";

export default function BlogPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
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

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">
            Inspirasi & Edukasi Umrah
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Temukan berbagai panduan, tips, dan cerita inspiratif seputar perjalanan ibadah di Tanah Suci.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              href={`/blog/${article.id}`}
              key={article.id}
              className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              onMouseEnter={() => setHoveredId(article.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative w-full h-56 overflow-hidden bg-slate-100">
                <img
                  src={`https://picsum.photos/800/600?random=${article.id}`}
                  alt={article.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ease-in-out ${
                    hoveredId === article.id ? "scale-105" : "scale-100"
                  }`}
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#8B6914] text-xs font-bold rounded-full shadow-sm">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{article.author}</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-800 mb-3 leading-snug group-hover:text-[#C9A84C] transition-colors line-clamp-2">
                  {article.title}
                </h2>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                  {article.excerpt}
                </p>

                <div className="flex items-center gap-2 text-[#C9A84C] font-semibold text-sm mt-auto">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${hoveredId === article.id ? "translate-x-1" : ""}`} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
