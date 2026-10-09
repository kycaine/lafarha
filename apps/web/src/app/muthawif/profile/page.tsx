"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/shared/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, CheckCircle2, UserCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MuthawifProfilePage() {
  const { userProfile, loading } = useAuth();
  const router = useRouter();
  
  const [profileData, setProfileData] = useState({
    nama: '',
    panggilan: '',
    foto: '',
    umur: '',
    languages: '',
    experience: '',
    location: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading) {
      if (!userProfile) {
        router.replace('/login?next=/muthawif/profile');
      } else if (userProfile.role !== 'muthawif' && userProfile.role !== 'master' && userProfile.role !== 'admin') {
        alert("Akses ditolak. Halaman ini hanya untuk Muthawif.");
        router.replace('/');
      } else {
        fetchProfile();
      }
    }
  }, [userProfile, loading, router]);

  const fetchProfile = async () => {
    if (!userProfile?.email) return;
    try {
      const res = await fetch(`/api/proxy/muthawifs/by-email/${userProfile.email}`);
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setProfileData({
          nama: d.nama || userProfile.display_name || '',
          panggilan: d.panggilan || '',
          foto: d.foto || '',
          umur: d.umur || '',
          languages: d.languages || '',
          experience: d.experience || '',
          location: d.location || ''
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.email) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/proxy/muthawifs/by-email/${userProfile.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      const json = await res.json();
      if (json.success) {
        alert("Profil berhasil diperbarui!");
      } else {
        alert("Gagal memperbarui profil: " + json.error);
      }
    } catch (error: any) {
      alert("Terjadi kesalahan: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setProfileData({ ...profileData, foto: ev.target.result.toString() });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/muthawif" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Profil Muthawif</h1>
            <p className="text-slate-500 text-sm">Kelola informasi publik Anda yang akan ditampilkan di direktori.</p>
          </div>
        </div>

        <Card className="border-none shadow-xl bg-white dark:bg-slate-900">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
            <CardTitle className="text-xl">Informasi Publik</CardTitle>
            <CardDescription>
              Data ini tidak bersifat rahasia dan akan ditampilkan di halaman pencarian muthawif FARHA.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleSave} className="space-y-8">
              
              {/* Foto Profil */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-200 dark:border-slate-700 shrink-0">
                  {profileData.foto ? (
                    <img src={profileData.foto} alt="Foto Profil" className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle2 className="w-12 h-12 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <Label>Foto Profil</Label>
                  <p className="text-xs text-slate-500 mb-2">Gunakan foto resmi atau formal yang jelas.</p>
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      <UploadCloud className="w-4 h-4 mr-2" /> Pilih Foto Baru
                    </Button>
                    <input type="file" className="hidden" accept="image/*" ref={fileInputRef} onChange={handlePhotoChange} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Nama Lengkap */}
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input 
                    id="nama" 
                    placeholder="Nama sesuai KTP/Paspor" 
                    value={profileData.nama}
                    onChange={e => setProfileData({ ...profileData, nama: e.target.value })}
                    required
                  />
                </div>

                {/* Nama Panggilan */}
                <div className="space-y-2">
                  <Label htmlFor="panggilan">Nama Panggilan</Label>
                  <Input 
                    id="panggilan" 
                    placeholder="Contoh: Ust. Ahmad" 
                    value={profileData.panggilan}
                    onChange={e => setProfileData({ ...profileData, panggilan: e.target.value })}
                  />
                </div>

                {/* Umur */}
                <div className="space-y-2">
                  <Label htmlFor="umur">Umur</Label>
                  <Input 
                    id="umur" 
                    type="number"
                    placeholder="Contoh: 35" 
                    value={profileData.umur}
                    onChange={e => setProfileData({ ...profileData, umur: e.target.value })}
                  />
                </div>

                {/* Lokasi */}
                <div className="space-y-2">
                  <Label htmlFor="location">Domisili / Lokasi</Label>
                  <Input 
                    id="location" 
                    placeholder="Contoh: Mekkah, Arab Saudi" 
                    value={profileData.location}
                    onChange={e => setProfileData({ ...profileData, location: e.target.value })}
                  />
                </div>
              </div>

              {/* Bahasa */}
              <div className="space-y-2">
                <Label htmlFor="languages">Kemampuan Bahasa (Pisahkan dengan koma)</Label>
                <Input 
                  id="languages" 
                  placeholder="Contoh: Indonesia, Arab, Inggris" 
                  value={profileData.languages}
                  onChange={e => setProfileData({ ...profileData, languages: e.target.value })}
                />
                <p className="text-xs text-slate-500">Ketikkan bahasa-bahasa yang Anda kuasai dipisahkan dengan koma.</p>
              </div>

              {/* Pengalaman */}
              <div className="space-y-2">
                <Label htmlFor="experience">Pengalaman & Deskripsi Singkat</Label>
                <Textarea 
                  id="experience" 
                  rows={4}
                  placeholder="Ceritakan singkat tentang pengalaman Anda memandu jamaah umrah/haji..." 
                  value={profileData.experience}
                  onChange={e => setProfileData({ ...profileData, experience: e.target.value })}
                />
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-[#C9A84C] to-[#8B6914] text-white font-semibold px-8 hover:opacity-90 transition-opacity">
                  {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
