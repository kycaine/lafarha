"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Building2, Bus, Plane, Ticket, Star, Map } from "lucide-react";
import servicesData from "../../../contents/service/service.json";

const iconMap: Record<string, React.FC<any>> = {
  Building2,
  Bus,
  Plane,
  Ticket,
  Star,
  Map,
};

const SERVICES = servicesData.map((service) => ({
  ...service,
  Icon: iconMap[service.icon] || Star,
}));

export default function ServiceSection() {
  const [currentIndex, setCurrentIndex] = useState(SERVICES.length);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (currentIndex <= 0) {
      setIsTransitioning(false);
      setCurrentIndex(SERVICES.length);
    } else if (currentIndex >= SERVICES.length * 2) {
      setIsTransitioning(false);
      setCurrentIndex(SERVICES.length);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsTransitioning(true));
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  const displayServices = [...SERVICES, ...SERVICES, ...SERVICES];

  return (
    <section id="layanan" className="relative bg-white pt-10 pb-32 overflow-hidden">
      {/* Subtle bg glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-50/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">

          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-5">
            Kebutuhan Umrah{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8C96C]">
              Dalam Satu Platform
            </span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Layanan Land Arrangement komprehensif — hotel, transportasi, penerbangan, visa, hingga pembimbing ibadah.
          </p>
        </div>

        {/* Grid */}
        <style>{`
          .slider-track {
            display: flex;
            transition: var(--transition, transform 0.5s ease-in-out);
            transform: translateX(calc(var(--current-index) * -100%));
          }
          .slider-item {
            width: 100%;
            flex-shrink: 0;
            padding: 0 10px;
          }
          @media (min-width: 768px) {
            .slider-track { transform: translateX(calc(var(--current-index) * -50%)); }
            .slider-item { width: 50%; }
          }
          @media (min-width: 1024px) {
            .slider-track { transform: translateX(calc(var(--current-index) * -33.333333%)); }
            .slider-item { width: 33.333333%; }
          }
          @keyframes bounce-x {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(4px); }
          }
          @keyframes bounce-x-reverse {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-4px); }
          }
        `}</style>

        <div className="relative w-full px-4 sm:px-12">
          {/* Controls */}
          <button onClick={prevSlide} className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-transparent text-[#C9A84C] hidden sm:flex">
            <div className="flex items-center -space-x-1.5" style={{ animation: 'bounce-x-reverse 1s infinite' }}>
              <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
              <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 opacity-70" />
              <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 opacity-40" />
            </div>
          </button>
          <button onClick={nextSlide} className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-transparent text-[#C9A84C] hidden sm:flex">
            <div className="flex items-center -space-x-1.5" style={{ animation: 'bounce-x 1s infinite' }}>
              <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 opacity-40" />
              <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 opacity-70" />
              <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
          </button>

          <div className="overflow-hidden relative w-full" style={{
            '--current-index': currentIndex,
            '--transition': isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
          } as any}>
            <div className="slider-track" onTransitionEnd={handleTransitionEnd}>
              {displayServices.map((p, i) => (
                <div key={p.id + '-' + i} className="slider-item">
                  <div className="group relative rounded-2xl border-2 border-[#C9A84C] bg-white overflow-hidden cursor-default h-full transition-colors">
                    {/* Inner content — this scales up on hover, clipped by card overflow-hidden */}
                    <div className="transition-transform duration-300 ease-out group-hover:scale-[1.03] p-6 h-full">

                      {/* Top row */}
                      <div className="flex items-start justify-between mb-5">
                        {/* Icon box */}
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center"
                          style={{
                            backgroundColor: `${p.accent}12`,
                            border: `1px solid ${p.accent}25`,
                            color: p.accent,
                          }}
                        >
                          <p.Icon />
                        </div>
                        {/* Tag */}
                        <span
                          className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                          style={{
                            color: p.accent,
                            backgroundColor: `${p.accent}10`,
                            border: `1px solid ${p.accent}25`,
                          }}
                        >
                          {p.tag}
                        </span>
                      </div>

                      {/* Title & desc */}
                      <h3 className="text-slate-800 font-bold text-base mb-1.5">{p.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-5">{p.desc}</p>

                      {/* Features */}
                      <ul className="space-y-1.5">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-slate-500 text-sm">
                            <span
                              className="w-1 h-1 rounded-full flex-shrink-0"
                              style={{ backgroundColor: p.accent }}
                            />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom gold accent line — appears on hover */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[2px] translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                      style={{ background: `linear-gradient(to right, transparent, ${p.accent}60, transparent)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center text-center mt-14">
          <h3 className="text-xl sm:text-2xl font-normal text-slate-800 mb-6 tracking-tight">
            Dapatkan penawaran terbaik sekarang !
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
            <a href="#" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-slate-500 bg-white border-2 border-slate-400 hover:border-slate-500 hover:bg-slate-50 transition-all duration-300 text-base tracking-tight">
                Tanya Admin
              </button>
            </a>
            <a href="/products" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#C9A84C] to-[#E8C96C] hover:from-[#E8C96C] hover:to-[#C9A84C] transition-all duration-300 shadow-lg shadow-[#C9A84C]/20 hover:shadow-[#C9A84C]/35 text-base tracking-tight">
                Ambil Sekarang
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
