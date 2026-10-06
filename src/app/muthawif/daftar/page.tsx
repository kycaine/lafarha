"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FooterSection from '@/app/components/home/FooterSection';

export default function DaftarMuthawifPage() {
  const [formData, setFormData] = useState({ nama: '', email: '', cvFileName: '' });
  const [cvBase64, setCvBase64] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.email || !cvBase64) {
      alert("Harap lengkapi semua data dan upload CV Anda.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/proxy/muthawifs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: formData.nama,
          email: formData.email,
          cv_file: cvBase64
        })
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Terjadi kesalahan');

      alert("Permohonan telah terkirim, sedang proses review.");
      router.push('/muthawif');
    } catch (error: any) {
      alert("Gagal mengirim permohonan: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-white dark:bg-black/80 border-b border-slate-200 dark:border-white/10 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src="/farha-logo-only.svg"
              alt="FARHA Logo"
              className="w-9 h-9"
            />
            <div className="leading-tight">
              <span
                className="font-bold tracking-wide block text-[15px] text-slate-900 dark:text-white"
                style={{ fontFamily: 'var(--font-cinzel), serif' }}
              >
                FARHA
              </span>
              <span className="font-medium tracking-[0.2em] uppercase block text-[10px] text-[#C9A84C]">
                Umrah Services
              </span>
            </div>
          </Link>
          <div className="text-sm font-medium">
            <Link href="/muthawif" className="hover:text-[#C9A84C] transition-colors group flex items-center">
              <svg 
                className="w-4 h-4 mr-2 transition-all duration-500 group-hover:w-8" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                preserveAspectRatio="xMaxYMid meet"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Kembali</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-12 px-4 max-w-lg flex-1 min-h-[100vh]">
        <Card className="border-t-4 border-t-[#C9A84C] shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 dark:text-white">Daftar Menjadi Muthawif</CardTitle>
            <CardDescription className="text-slate-500">
              Lengkapi form di bawah ini untuk bergabung menjadi Muthawif bersama FARHA.
            </CardDescription>
          </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input
                id="nama"
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={e => setFormData({ ...formData, nama: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email aktif"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <p className="text-xs text-amber-600 dark:text-amber-500 font-medium">
                * Email akan digunakan untuk login, pastikan memasukkan dengan benar.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Upload CV (Curriculum Vitae)</Label>
              <div
                className="flex items-center gap-4 p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors h-24"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 shrink-0">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div className="flex-1 overflow-hidden flex flex-col justify-center">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                    {formData.cvFileName || "Pilih file PDF/Word..."}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Maksimal 5MB</p>
                </div>
                {formData.cvFileName && <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0 mr-2" />}
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    setFormData({ ...formData, cvFileName: file.name });
                    
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (ev.target?.result) {
                        setCvBase64(ev.target.result.toString());
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-[#C9A84C] to-[#8B6914] text-white hover:opacity-90" disabled={isSubmitting}>
              {isSubmitting ? "Mengirim..." : "Kirim Permohonan"}
            </Button>
          </form>
        </CardContent>
      </Card>
      </div>

      <FooterSection />
    </main>
  );
}
