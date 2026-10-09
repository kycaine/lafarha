"use client";

import { useEffect, useState } from "react";
import { getMitra, createMitra, updateMitra, deleteMitra } from "@/modules/catalog/mitra-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit2, Users, ImagePlus } from "lucide-react";
import Image from "next/image";

export default function MitraCMS() {
  const [mitras, setMitras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentMitra, setCurrentMitra] = useState<any>({
    id: "", nama: "", kategori: "", foto: ""
  });

  useEffect(() => {
    loadMitras();
  }, []);

  const loadMitras = async () => {
    setLoading(true);
    const data = await getMitra();
    setMitras(data);
    setLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar (Maksimal 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentMitra({ ...currentMitra, foto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = isEditing && currentMitra.id 
      ? await updateMitra(currentMitra) 
      : await createMitra(currentMitra);
    
    if (res.success) {
      setIsEditing(false);
      setCurrentMitra({ id: "", nama: "", kategori: "", foto: "" });
      loadMitras();
    } else {
      alert("Gagal menyimpan: " + res.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin hapus mitra ini?")) {
      const res = await deleteMitra(id);
      if (res.success) loadMitras();
      else alert("Gagal menghapus: " + res.error);
    }
  };

  if (loading) return <div className="p-10">Loading CMS...</div>;

  return (
    <div className="p-6 pt-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Users className="w-8 h-8 text-emerald-600" />
          Manajemen Mitra
        </h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>+ Tambah Mitra Baru</Button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm mb-10 animate-in fade-in zoom-in-95">
          <h2 className="text-xl font-bold mb-6">{currentMitra.id ? "Edit Mitra" : "Mitra Baru"}</h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Nama Mitra</Label>
                <Input required value={currentMitra.nama} onChange={e => setCurrentMitra({...currentMitra, nama: e.target.value})} placeholder="Contoh: Garuda Indonesia" />
              </div>
              <div className="space-y-2">
                <Label>Kategori Mitra</Label>
                <Input required value={currentMitra.kategori} onChange={e => setCurrentMitra({...currentMitra, kategori: e.target.value})} placeholder="Contoh: Maskapai, Hotel, dll" />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label>Foto / Logo (Base64) - Opsional</Label>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {currentMitra.foto ? (
                    <div className="relative w-32 h-32 border rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                      <Image src={currentMitra.foto} alt="Preview" fill className="object-contain p-2" />
                      <button type="button" onClick={() => setCurrentMitra({...currentMitra, foto: ""})} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 bg-slate-50 flex-shrink-0">
                      <ImagePlus className="w-8 h-8 mb-2" />
                      <span className="text-xs">No Image</span>
                    </div>
                  )}
                  
                  <div className="flex-1 w-full space-y-3">
                    <Input type="file" accept="image/*" onChange={handleImageUpload} className="cursor-pointer" />
                    <p className="text-xs text-slate-500">
                      Pilih file gambar dari komputer Anda. Gambar akan otomatis dikonversi ke Base64 (Maks 2MB).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 font-bold px-8">Simpan Mitra</Button>
              <Button type="button" variant="outline" onClick={() => {
                setIsEditing(false);
                setCurrentMitra({ id: "", nama: "", kategori: "", foto: "" });
              }}>Batal</Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mitras.map(p => (
            <div key={p.id} className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm flex flex-col gap-4 transition-all hover:border-emerald-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden flex items-center justify-center relative flex-shrink-0">
                  {p.foto ? (
                    <Image src={p.foto} alt={p.nama} fill className="object-contain p-1" />
                  ) : (
                    <Users className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-lg truncate" title={p.nama}>{p.nama}</h3>
                  <div className="text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md inline-block mt-1">
                    {p.kategori}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-auto pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" size="sm" className="flex-1 border-slate-200 dark:border-slate-700" onClick={() => {
                  setCurrentMitra(p);
                  setIsEditing(true);
                }}><Edit2 className="w-4 h-4 mr-2" /> Edit</Button>
                <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4 mr-2" /> Hapus</Button>
              </div>
            </div>
          ))}
          {mitras.length === 0 && <p className="text-slate-500 text-center py-10 border-2 border-dashed rounded-xl col-span-full">Belum ada mitra. Silakan tambah baru.</p>}
        </div>
      )}
    </div>
  );
}
