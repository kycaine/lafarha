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

  // Ensure the array is large enough so that one group spans wider than any screen.
  // If there's only 1 item, it needs to be duplicated many times.
  let groupMitras = [...mitras];
  while (groupMitras.length > 0 && groupMitras.length < 24) {
    groupMitras = [...groupMitras, ...mitras];
  }

  return (
    <section id="mitra" className="relative bg-slate-50 py-16 md:py-20 overflow-hidden">
      {/* BG glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-100/60 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-8">

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

      <style>{`
        .mitra-slider-container {
          display: flex;
          width: max-content;
          animation: loop-slide 100s linear infinite;
        }

        .mitra-slider-container.reverse {
          animation-direction: reverse;
        }
        
        .mitra-slider-container:hover {
          animation-play-state: paused;
        }

        @keyframes loop-slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Mitra logo container */}
      <div className="relative z-10 w-full overflow-hidden mt-2 pb-4 flex flex-col gap-0 md:gap-1">
        {/* Row 1: Moves Left */}
        <div className="mitra-slider-container">
          {/* Group 1 */}
          <div className="flex items-center gap-4 md:gap-8 pr-4 md:pr-8 w-max flex-shrink-0">
            {groupMitras.map((m, idx) => (
              <div
                key={`g1-r1-${m.id}-${idx}`}
                className="flex-none flex items-center justify-center opacity-50 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 cursor-pointer"
              >
                {m.foto ? (
                  <div className="w-32 md:w-48 h-20 md:h-28 flex items-center justify-center">
                    <img src={m.foto} alt={m.nama} className="max-w-full max-h-full object-contain drop-shadow-sm" />
                  </div>
                ) : (
                  <div className="w-32 md:w-48 h-20 md:h-28 flex items-center justify-center">
                    <div className="text-3xl md:text-5xl font-bold text-slate-400 whitespace-nowrap">
                      {m.nama}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Group 2 */}
          <div className="flex items-center gap-4 md:gap-8 pr-4 md:pr-8 w-max flex-shrink-0">
            {groupMitras.map((m, idx) => (
              <div
                key={`g2-r1-${m.id}-${idx}`}
                className="flex-none flex items-center justify-center opacity-50 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 cursor-pointer"
              >
                {m.foto ? (
                  <div className="w-32 md:w-48 h-20 md:h-28 flex items-center justify-center">
                    <img src={m.foto} alt={m.nama} className="max-w-full max-h-full object-contain drop-shadow-sm" />
                  </div>
                ) : (
                  <div className="w-32 md:w-48 h-20 md:h-28 flex items-center justify-center">
                    <div className="text-3xl md:text-5xl font-bold text-slate-400 whitespace-nowrap">
                      {m.nama}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Moves Right */}
        <div className="mitra-slider-container reverse">
          {/* Group 1 */}
          <div className="flex items-center gap-4 md:gap-8 pr-4 md:pr-8 w-max flex-shrink-0">
            {groupMitras.map((m, idx) => (
              <div
                key={`g1-r2-${m.id}-${idx}`}
                className="flex-none flex items-center justify-center opacity-50 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 cursor-pointer"
              >
                {m.foto ? (
                  <div className="w-32 md:w-48 h-20 md:h-28 flex items-center justify-center">
                    <img src={m.foto} alt={m.nama} className="max-w-full max-h-full object-contain drop-shadow-sm" />
                  </div>
                ) : (
                  <div className="w-32 md:w-48 h-20 md:h-28 flex items-center justify-center">
                    <div className="text-3xl md:text-5xl font-bold text-slate-400 whitespace-nowrap">
                      {m.nama}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Group 2 */}
          <div className="flex items-center gap-4 md:gap-8 pr-4 md:pr-8 w-max flex-shrink-0">
            {groupMitras.map((m, idx) => (
              <div
                key={`g2-r2-${m.id}-${idx}`}
                className="flex-none flex items-center justify-center opacity-50 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 cursor-pointer"
              >
                {m.foto ? (
                  <div className="w-32 md:w-48 h-20 md:h-28 flex items-center justify-center">
                    <img src={m.foto} alt={m.nama} className="max-w-full max-h-full object-contain drop-shadow-sm" />
                  </div>
                ) : (
                  <div className="w-32 md:w-48 h-20 md:h-28 flex items-center justify-center">
                    <div className="text-3xl md:text-5xl font-bold text-slate-400 whitespace-nowrap">
                      {m.nama}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
