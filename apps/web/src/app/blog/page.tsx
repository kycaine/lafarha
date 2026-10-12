"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import initialArticles from "@/contents/blog/articles.json";
import { fetchApi } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image?: string;
  category: string;
}

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetchApi("/articles");
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setArticles(res.data);
        }
      } catch (err) {
        console.error("Gagal mengambil data artikel:", err);
      }
    }
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0a] font-sans">
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full min-h-screen">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tight mb-4">
            Inspirasi & Edukasi Umrah
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Temukan berbagai panduan, tips, dan cerita inspiratif seputar perjalanan ibadah di Tanah Suci.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              href={`/blog/${article.id}`}
              key={article.id}
              className="group bg-white dark:bg-[#151515] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              onMouseEnter={() => setHoveredId(article.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative w-full h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ease-in-out ${
                      hoveredId === article.id ? "scale-105" : "scale-100"
                    }`}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-100/30 dark:from-slate-800 dark:to-slate-900 p-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center mb-2 shadow-sm">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">LA Farha Edukasi</span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/95 dark:bg-black/80 backdrop-blur-sm text-[#8B6914] dark:text-[#E8C96C] text-xs font-bold rounded-full shadow-sm">
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

                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3 leading-snug group-hover:text-[#C9A84C] transition-colors line-clamp-2">
                  {article.title}
                </h2>
                
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
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
      <Footer />
    </div>
  );
}
