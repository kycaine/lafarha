"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, User, ArrowLeft, BookOpen } from "lucide-react";
import initialArticles from "@/contents/blog/articles.json";
import { fetchApi } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const runtime = 'edge';

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

export default function BlogDetailPage() {
  const params = useParams();
  const id = params?.id ? parseInt(params.id as string) : null;
  
  const [article, setArticle] = useState<Article | null>(() => {
    return initialArticles.find(a => a.id === id) || null;
  });

  useEffect(() => {
    if (!id) return;
    async function fetchDetail() {
      try {
        const res = await fetchApi(`/articles/${id}`);
        if (res.success && res.data) {
          setArticle(res.data);
        }
      } catch (err) {
        console.error("Gagal mengambil detail artikel:", err);
      }
    }
    fetchDetail();
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex flex-col items-center justify-center font-sans">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Artikel Tidak Ditemukan</h1>
        <Link href="/blog" className="text-[#C9A84C] font-semibold flex items-center gap-2 hover:opacity-80">
          <ArrowLeft className="w-5 h-5" /> Kembali ke Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0a] font-sans pb-20">
      <Header />

      {/* Article Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 w-full min-h-screen">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-[#C9A84C]/10 text-[#8B6914] dark:text-[#E8C96C] text-xs font-bold rounded-full mb-4">
            {article.category}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-6">
            {article.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
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

        {article.image ? (
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-10 shadow-lg bg-slate-200 dark:bg-slate-800">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-48 sm:h-64 rounded-3xl overflow-hidden mb-10 shadow-sm bg-gradient-to-br from-amber-50 via-white to-amber-100/40 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center p-6">
            <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/15 text-[#C9A84C] flex items-center justify-center mb-3">
              <BookOpen className="w-7 h-7" />
            </div>
            <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">LA Farha — Inspirasi & Edukasi Umrah</p>
          </div>
        )}

        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-loose">
          <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-8">
            {article.excerpt}
          </p>
          
          <div className="bg-white dark:bg-[#151515] p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <p className="whitespace-pre-line text-base sm:text-lg">
              {article.content}
            </p>
          </div>
        </div>

        {/* Share / Bottom actions */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-semibold text-slate-800 dark:text-white">Bagikan artikel ini</p>
          <div className="flex gap-3">
            {['Facebook', 'Twitter', 'WhatsApp'].map(social => (
              <button key={social} className="px-4 py-2 bg-white dark:bg-[#151515] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors shadow-sm">
                {social}
              </button>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
