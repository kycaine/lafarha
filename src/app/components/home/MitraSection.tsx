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

        {/* Mitra logo grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {mitras.map((m) => {
            const abbr = m.nama.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
            return (
              <div
                key={m.id}
                className="group relative rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-[#C9A84C]/30 transition-all duration-300 p-6 flex flex-col items-center gap-3 hover:-translate-y-1 shadow-sm hover:shadow-md"
              >
                {/* Monogram avatar / Photo */}
                {m.foto ? (
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                    <img src={m.foto} alt={m.nama} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg bg-amber-50 border border-amber-200/60 text-[#8B6914] shadow-sm">
                    {abbr}
                  </div>
                )}
                <div className="text-center">
                  <p className="text-slate-800 font-semibold text-sm leading-tight">{m.nama}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">{m.kategori}</p>
                </div>

                {/* Hover gold underline */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 rounded-full bg-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
