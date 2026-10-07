"use client";

import { PackageBuilder } from "@/modules/catalog/components/PackageBuilder";
import Link from "next/link";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useEffect, useState } from "react";
import { CheckCircle2, Wallet, Sparkles, MoonStar } from "lucide-react";
import packagesData from "@/contents/packages/packages.json";


const PagodaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2L12 4" />
    <path d="M10 4L14 4" />
    <path d="M11 4L11 8" />
    <path d="M13 4L13 8" />
    <path d="M7 8L17 8" />
    <path d="M9 8L9 13" />
    <path d="M15 8L15 13" />
    <path d="M4 13L20 13" />
    <path d="M7 13L7 21" />
    <path d="M17 13L17 21" />
    <path d="M3 21L21 21" />
  </svg>
);

export default function PackagesPage() {
  const [detailModal, setDetailModal] = useState<string | null>(null);

  const selectedPackage = packagesData.readyPackages.find((p: any) => p.id === detailModal);

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white">
      <Header />

      <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-6 xl:px-8 pt-6 pb-12 min-h-screen">
        {/* Pre-made Packages Section */}
        <div className="mb-12">
          <header className="mb-10 text-center">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">
              Paket Umrah Siap Berangkat
            </h3>
            <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Pilih dari paket yang sudah kami rancang khusus untuk kenyamanan dan kekhusyukan ibadah Anda.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mx-auto">
            {packagesData.readyPackages.map((pkg: any) => {
              const theme = pkg.theme === 'amber' ? {
                border: "border-amber-500",
                hoverBorder: "hover:border-amber-500",
                shadow: "hover:shadow-amber-500/20",
                textPrimary: "text-amber-600 dark:text-amber-400",
                textCheck: "text-amber-500",
                bgButton: "bg-amber-600",
                hoverBgButton: "hover:bg-amber-700",
              } : {
                border: "border-emerald-500",
                hoverBorder: "hover:border-emerald-500",
                shadow: "hover:shadow-emerald-500/10",
                textPrimary: "text-emerald-600 dark:text-emerald-400",
                textCheck: "text-emerald-500",
                bgButton: "bg-emerald-600",
                hoverBgButton: "hover:bg-emerald-700",
              };

              const iconTheme = pkg.iconColor === 'amber' ? "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"
                : pkg.iconColor === 'orange' ? "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400"
                : pkg.iconColor === 'red' ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400";

              return (
                <div key={pkg.id} className={`bg-white dark:bg-black/40 border-2 ${theme.border} rounded-3xl p-6 flex flex-col ${theme.shadow} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}>
                  {pkg.isFavorite && (
                    <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider z-10 shadow-sm">
                      TERFAVORIT
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconTheme}`}>
                      {pkg.icon === 'Wallet' && <Wallet className="w-6 h-6" />}
                      {pkg.icon === 'Sparkles' && <Sparkles className="w-6 h-6" />}
                      {pkg.icon === 'MoonStar' && <MoonStar className="w-6 h-6" />}
                      {pkg.icon === 'Pagoda' && <PagodaIcon className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">{pkg.name}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{pkg.desc}</p>
                    </div>
                  </div>
                  <div className="mb-6 relative z-10">
                    <span className={`text-2xl xl:text-3xl font-black ${theme.textPrimary} tracking-tight`}>{pkg.priceString}</span>
                    <span className="text-slate-500 text-sm ml-1">/ pax</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1 relative z-10">
                    {pkg.features.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs xl:text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className={`w-4 h-4 xl:w-5 xl:h-5 ${theme.textCheck} shrink-0`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-2 mt-auto relative z-10">
                    <a href={`https://wa.me/6281234567890?text=Halo%20FARHA%2C%20saya%20tertarik%20dengan%20${pkg.name}%20seharga%20${pkg.priceString}.`} target="_blank" rel="noreferrer" className={`w-full py-3 rounded-xl ${theme.bgButton} ${theme.hoverBgButton} text-white font-bold text-sm text-center transition-colors shadow-md hover:shadow-lg`}>
                      Pilih Paket
                    </a>
                    <button onClick={() => setDetailModal(pkg.id as any)} className={`w-full py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 ${theme.hoverBorder} text-slate-700 dark:text-slate-300 font-bold text-sm text-center transition-colors`}>
                      Detail Paket
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent mb-10 mt-6"></div>

        {/* Custom Package Builder Section */}
        <header className="mb-8 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">
            Buat Paket Sesuai Kebutuhan
          </h3>
          <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Pilih kriteria yang Anda butuhkan untuk membuat paket Umrah yang sesuai.
          </p>
        </header>

        <PackageBuilder />
      </div>

      {/* Detail Modal */}
      {detailModal && selectedPackage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={(e) => { if (e.target === e.currentTarget) setDetailModal(null); }}>
          <div className="bg-white dark:bg-[#111] w-full max-w-md rounded-3xl p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setDetailModal(null)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white">
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
              Detail {selectedPackage.name}
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Termasuk
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                  {selectedPackage.includes.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-red-500 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-red-500 text-xs">✕</span> Tidak Termasuk
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                  <li>Hotel Domestik</li>
                  <li>Tiket Pesawat Domestik</li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <a href={`https://wa.me/6281234567890?text=Halo%20FARHA%2C%20saya%20tertarik%20dengan%20${selectedPackage.name}.`} target="_blank" rel="noreferrer" className="block w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center transition-colors">
                Pilih Paket Ini
              </a>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
}
