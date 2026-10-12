"use client";

import React, { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Camera, Image as ImageIcon } from "lucide-react";

interface GalleryItem {
  id: string;
  image: string;
  caption?: string;
  created_at: number;
}

export default function GallerySection() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetchApi("/gallery");
        if (res.success && Array.isArray(res.data)) {
          setGallery(res.data);
        }
      } catch (err) {
        console.error("Gagal memuat galeri:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  return (
    <section id="galeri" className="py-20 bg-white dark:bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-left">
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-4">
          Momen <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8C96C]">Perjalanan</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed max-w-xl">
          Setiap langkah di Tanah Suci adalah cerita. Berikut adalah beberapa momen indah bersama para jamaah.
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .expandable-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }

        .grid-item {
          position: relative;
          overflow: hidden;
          border-radius: 1.25rem;
          aspect-ratio: 4/3;
          background-color: #f1f5f9;
        }

        .grid-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .grid-item:hover img {
          transform: scale(1.05);
        }

        .grid-item::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .grid-item:hover::after {
          opacity: 1;
        }

        .grid-item .caption-overlay {
          position: absolute;
          bottom: 12px;
          left: 14px;
          right: 14px;
          color: white;
          font-size: 13px;
          font-weight: 600;
          z-index: 10;
          opacity: 0;
          transform: translateY(6px);
          transition: all 0.3s ease;
        }

        .grid-item:hover .caption-overlay {
          opacity: 1;
          transform: translateY(0);
        }
      `}} />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-slate-100 dark:bg-slate-900 rounded-2xl" />
            ))}
          </div>
        ) : gallery.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-[#C9A84C] flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">Dokumentasi Sedang Diperbarui</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Foto-foto dokumentasi resmi perjalanan dan kebersamaan jamaah di Makkah & Madinah akan segera kami perbarui.
            </p>
          </div>
        ) : (
          <div className="expandable-grid">
            {gallery.map((item, index) => (
              <div key={item.id || index} className="grid-item">
                <img src={item.image} alt={item.caption || `Momen ${index + 1}`} loading="lazy" />
                {item.caption && (
                  <div className="caption-overlay">
                    <p className="line-clamp-2">{item.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
