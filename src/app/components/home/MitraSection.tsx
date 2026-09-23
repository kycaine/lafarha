"use client";

import { useEffect, useState } from "react";
import { getMitra } from "@/modules/catalog/mitra-actions";

export default function MitraSection() {
  const [mitras, setMitras] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getMitra();
      if (data && data.length > 0) {
        setMitras(data);
      }
    }
    load();
  }, []);

  return (
    <section id="mitra" className="relative bg-slate-50 py-32 overflow-hidden">
      {/* BG glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-100/60 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A84C]/25 bg-[#C9A84C]/8 mb-6">
            <span className="text-[#8B6914] text-xs font-semibold tracking-widest uppercase">Mitra Resmi</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
            Didukung Oleh{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8C96C]">
              Mitra Terpercaya
            </span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Kami bermitra dengan institusi dan perusahaan terkemuka untuk menjamin kualitas layanan terbaik.
          </p>
        </div>
      </div>

      {/* Mitra logo container */}
      <div className="relative z-10 w-[90vw] mx-auto mt-8">
        <div className="flex items-center justify-center flex-wrap gap-8 md:gap-16 py-8">
          {mitras.map((m, idx) => (
            <div
              key={`${m.id}-${idx}`}
              className="flex-none flex items-center justify-center opacity-50 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 cursor-pointer"
            >
              {m.foto ? (
                <img src={m.foto} alt={m.nama} className="h-32 md:h-48 w-auto object-contain drop-shadow-sm" />
              ) : (
                <div className="text-3xl md:text-5xl font-bold text-slate-400 whitespace-nowrap">
                  {m.nama}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
