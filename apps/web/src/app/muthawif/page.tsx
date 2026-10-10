"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MapPin, Languages, CheckCircle2, X, UserCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function MuthawifDirectoryPage() {
  const [approvedMuthawifs, setApprovedMuthawifs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMuthawif, setSelectedMuthawif] = useState<any>(null);

  useEffect(() => {
    async function fetchMuthawifs() {
      try {
        const res = await fetch(`/api/proxy/muthawifs?t=${Date.now()}`, { cache: 'no-store' });
        const json = await res.json();
        if (json.success && json.data) {
          const approved = json.data.filter((m: any) => m.status === 'APPROVED');
          setApprovedMuthawifs(approved);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMuthawifs();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white flex flex-col">
      <Header />

      <div className="container mx-auto py-12 px-6 max-w-6xl flex-1 min-h-[100vh]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="w-8 h-8 text-[#C9A84C] fill-[#C9A84C]" />
              Direktori Muthawif
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">Daftar muthawif profesional yang telah terverifikasi dan siap mendampingi ibadah Anda.</p>
          </div>
          <Link href="/muthawif/daftar">
            <Button className="bg-gradient-to-r from-[#C9A84C] to-[#8B6914] text-white hover:opacity-90 shadow-md">
              Daftar Jadi Muthawif
            </Button>
          </Link>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-slate-500">Memuat data muthawif...</p>
        ) : approvedMuthawifs.length === 0 ? (
          <p className="text-slate-500">Belum ada muthawif yang disetujui.</p>
        ) : (
          approvedMuthawifs.map(muthawif => (
            <div key={muthawif.id} onClick={() => setSelectedMuthawif(muthawif)} className="block group cursor-pointer">
              <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800 group-hover:border-[#C9A84C]/50">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C] font-bold text-2xl border-2 border-[#C9A84C]/30 shadow-sm overflow-hidden shrink-0">
                      {muthawif.foto ? (
                        <img src={muthawif.foto} alt={muthawif.nama} className="w-full h-full object-cover" />
                      ) : (
                        muthawif.nama.charAt(0).toUpperCase()
                      )}
                    </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-1.5 text-slate-900 dark:text-white">
                      {muthawif.nama}
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </CardTitle>
                    <div className="flex items-center text-[#8B6914] text-sm font-medium mt-1">
                      <Star className="w-4 h-4 mr-1 fill-[#C9A84C] text-[#C9A84C]" />
                      {muthawif.rating || "5.0"} 
                      <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">({muthawif.experience || "Berpengalaman"})</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                  {muthawif.location || "Mekkah & Madinah"}
                </div>
                <div className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                  <Languages className="w-4 h-4 mr-2 text-slate-400 mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {(muthawif.languages ? muthawif.languages.split(',').map((l: string) => l.trim()) : ['Indonesia', 'Arab']).map((lang: string, idx: number) => (
                      <span key={idx} className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-xs font-medium">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>
      </div>
      
      {/* Modal Detail Muthawif */}
      {selectedMuthawif && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Detail Profil Muthawif</h3>
              <button 
                onClick={() => setSelectedMuthawif(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-[#C9A84C] font-bold text-3xl border-4 border-slate-50 dark:border-slate-800 shadow-md overflow-hidden shrink-0">
                  {selectedMuthawif.foto ? (
                    <img src={selectedMuthawif.foto} alt={selectedMuthawif.nama} className="w-full h-full object-cover" />
                  ) : (
                    selectedMuthawif.nama.charAt(0).toUpperCase()
                  )}
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-bold flex items-center justify-center sm:justify-start gap-2 text-slate-900 dark:text-white">
                    {selectedMuthawif.nama}
                    <span title="Verified Muthawif" className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </span>
                  </h2>
                  {selectedMuthawif.panggilan && (
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">"{selectedMuthawif.panggilan}"</p>
                  )}
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <div className="flex items-center text-[#8B6914]">
                      <Star className="w-4 h-4 mr-1.5 fill-[#C9A84C] text-[#C9A84C]" />
                      {selectedMuthawif.rating || "5.0"} Rating
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                      {selectedMuthawif.location || "Mekkah & Madinah"}
                    </div>
                    {selectedMuthawif.umur && (
                      <div className="flex items-center">
                        <UserCircle2 className="w-4 h-4 mr-1.5 text-slate-400" />
                        {selectedMuthawif.umur} Tahun
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-6">
                <div>
                  <h4 className="font-semibold text-sm text-slate-500 uppercase tracking-wider mb-2">Kemampuan Bahasa</h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedMuthawif.languages ? selectedMuthawif.languages.split(',').map((l: string) => l.trim()) : ['Indonesia', 'Arab']).map((lang: string, idx: number) => (
                      <span key={idx} className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50 px-3 py-1 rounded-lg text-sm font-medium">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-slate-500 uppercase tracking-wider mb-2">Pengalaman</h4>
                  {selectedMuthawif.experience ? (
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 whitespace-pre-wrap text-sm">
                      {selectedMuthawif.experience}
                    </p>
                  ) : (
                    <p className="text-slate-400 italic text-sm">Muthawif belum menambahkan pengalaman detail.</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-b-3xl flex justify-end">
              <Button onClick={() => setSelectedMuthawif(null)} variant="outline" className="border-slate-200 dark:border-slate-700">
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
