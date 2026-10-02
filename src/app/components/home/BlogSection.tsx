"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import articles from "@/contents/blog/articles.json";

export default function BlogSection() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // We want to show 3 cards at a time.
  const displayArticles = [
    articles[articles.length - 1],
    ...articles,
    articles[0],
    articles[1],
    articles[2]
  ];

  const totalOriginal = articles.length;

  const nextSlide = () => {
    if (currentIndex > totalOriginal) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (currentIndex <= 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex === 0) {
      setCurrentIndex(totalOriginal);
    } else if (currentIndex > totalOriginal) {
      setCurrentIndex(1);
    }
  };

  return (
    <section id="blog" className="w-full bg-slate-50 py-16 sm:py-24 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl text-left">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-4 flex items-center gap-3">
              Jendela <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8C96C]">Edukasi</span>
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Temukan berbagai panduan, tips, dan cerita inspiratif seputar perjalanan ibadah di Tanah Suci.
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={prevSlide}
              className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-400 hover:bg-slate-100 transition-all shadow-sm"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-400 hover:bg-slate-100 transition-all shadow-sm"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <style>{`
          .blog-slider-track {
            display: flex;
            transition: var(--transition, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1));
            transform: translateX(calc(var(--current-index) * -100%));
          }
          .blog-slider-item {
            width: 100%;
            flex-shrink: 0;
            padding: 0 10px;
          }
          @media (min-width: 768px) {
            .blog-slider-track { transform: translateX(calc(var(--current-index) * -50%)); }
            .blog-slider-item { width: 50%; }
          }
          @media (min-width: 1024px) {
            .blog-slider-track { transform: translateX(calc(var(--current-index) * -33.333333%)); }
            .blog-slider-item { width: 33.333333%; }
          }
        `}</style>

        <div className="overflow-hidden relative w-full" style={{
          '--current-index': currentIndex,
          '--transition': isTransitioning ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
        } as any}>
          <div className="blog-slider-track" onTransitionEnd={handleTransitionEnd}>
            {displayArticles.map((article, i) => (
              <div key={article.id + '-' + i} className="blog-slider-item">
                <Link
                  href={`/blog/${article.id}`}
                  className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-[#C9A84C] flex flex-col h-full"
                >
                  <div className="relative w-full h-48 overflow-hidden bg-slate-100">
                    <img
                      src={`https://picsum.photos/800/600?random=${article.id}`}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#8B6914] text-xs font-bold rounded-full shadow-sm">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{article.date}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mb-2 leading-snug group-hover:text-[#C9A84C] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center gap-2 text-[#C9A84C] font-semibold text-sm mt-auto">
                      <span>Selengkapnya</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/blog" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-[#C9A84C] text-[#8B6914] font-bold rounded-xl hover:bg-[#C9A84C] hover:text-white transition-colors shadow-sm group">
            Lihat Semua Artikel
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
