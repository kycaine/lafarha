"use client";

import React, { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Image as ImageIcon, Sparkles, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { convertAndCompressToWebp, formatFileSize, getStorageImageUrl, CompressedImageResult } from "@/lib/image-utils";
import { useAlert } from "@/shared/AlertContext";

interface GalleryItem {
  id: string;
  image: string;
  caption?: string;
  created_at: number;
}

export default function AdminGaleriPage() {
  const { showAlert } = useAlert();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  
  const [selectedImage, setSelectedImage] = useState<CompressedImageResult | null>(null);
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE_BYTES = 500 * 1024; // 500 KB

  const loadGallery = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/gallery");
      if (res.success && Array.isArray(res.data)) {
        setItems(res.data);
      }
    } catch (err) {
      console.error("Gagal memuat galeri:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showAlert({
        title: "File Tidak Valid",
        message: "Silakan pilih file gambar (JPG, PNG, WebP, dll).",
        type: "error",
      });
      return;
    }

    setCompressing(true);
    try {
      const result = await convertAndCompressToWebp(file, {
        maxSizeBytes: MAX_SIZE_BYTES,
        maxWidth: 1600,
        maxHeight: 1600,
        initialQuality: 0.90,
      });

      setSelectedImage(result);
    } catch (err: any) {
      showAlert({
        title: "Gagal Mengonversi Gambar",
        message: err.message || "Terjadi kesalahan saat memproses gambar.",
        type: "error",
      });
    } finally {
      setCompressing(false);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedImage) return;

    setUploading(true);
    try {
      // 1. Upload file via /upload endpoint
      const uploadRes = await fetchApi("/upload", {
        method: "POST",
        body: JSON.stringify({
          base64: selectedImage.dataUrl,
          folder: "gallery",
        }),
      });

      if (!uploadRes.success) {
        throw new Error(uploadRes.error || "Gagal mengunggah foto ke storage");
      }

      const imageUrl = uploadRes.url;

      // 2. Simpan ke database gallery
      const saveRes = await fetchApi("/gallery", {
        method: "POST",
        body: JSON.stringify({
          image: imageUrl,
          caption: caption.trim(),
        }),
      });

      if (!saveRes.success) {
        throw new Error(saveRes.error || "Gagal menyimpan data galeri");
      }

      showAlert({
        title: "Berhasil Diunggah!",
        message: `Foto berhasil dikonversi ke WebP (${formatFileSize(selectedImage.compressedSize)}) dan ditambahkan ke galeri.`,
        type: "info",
      });

      // Reset form
      setSelectedImage(null);
      setCaption("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // Reload list
      await loadGallery();
    } catch (err: any) {
      showAlert({
        title: "Upload Gagal",
        message: err.message || "Gagal mengunggah gambar ke server.",
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    showAlert({
      title: "Hapus Foto?",
      message: "Foto ini akan dihapus permanen dari galeri website.",
      type: "error",
      showCancel: true,
      cancelText: "Batal",
      confirmText: "Ya, Hapus",
      onConfirm: async () => {
        try {
          const res = await fetchApi(`/gallery/${id}`, { method: "DELETE" });
          if (res.success) {
            setItems((prev) => prev.filter((item) => item.id !== id));
            showAlert({ title: "Berhasil", message: "Foto telah dihapus dari galeri.", type: "info" });
          } else {
            throw new Error(res.error);
          }
        } catch (err: any) {
          showAlert({ title: "Gagal Menghapus", message: err.message, type: "error" });
        }
      },
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
          <ImageIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />
          Manajemen Galeri
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Upload foto dokumentasi umrah. Gambar otomatis dikonversi ke format <strong>WebP</strong> dengan batas maksimal <strong>500 KB</strong>.
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-emerald-600" /> Upload Foto Baru
        </h2>

        {!selectedImage ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-900/30 hover:bg-emerald-50/20"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {compressing ? (
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin" />
                <p className="font-semibold text-slate-700 dark:text-slate-200">Sedang mengonversi ke WebP & mengompresi...</p>
                <p className="text-xs text-slate-400">Menjaga ketajaman visual & membatasi ukuran di bawah 500 KB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200 text-base">Klik atau tarik foto ke sini</p>
                  <p className="text-xs text-slate-400 mt-1">Format apa saja (JPG, PNG) • Otomatis WebP Maksimal 500 KB</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-full md:w-56 h-48 rounded-xl overflow-hidden bg-slate-200 shrink-0 relative">
                <img src={selectedImage.dataUrl} alt="Preview" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  WEBP
                </span>
              </div>

              <div className="flex-1 space-y-3 w-full">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  <CheckCircle className="w-4 h-4" /> Siap Diunggah
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block">Ukuran Awal</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{formatFileSize(selectedImage.originalSize)}</span>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <span className="text-emerald-600 dark:text-emerald-400 block">Ukuran WebP</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">{formatFileSize(selectedImage.compressedSize)}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block">Resolusi</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{selectedImage.width} × {selectedImage.height} px</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Keterangan Foto (Opsional)
                  </label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Contoh: Jamaah di Pelataran Ka'bah Makkah"
                    className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleUploadSubmit}
                    disabled={uploading}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Mengunggah...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" /> Simpan ke Galeri
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    disabled={uploading}
                    className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold rounded-xl transition-colors"
                  >
                    Ganti Foto
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Items Grid */}
      <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Daftar Foto Galeri ({items.length})
          </h2>
          <button
            onClick={loadGallery}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Refresh Galeri"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-600" />
            <p className="text-sm">Memuat galeri foto...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="font-bold text-slate-600 dark:text-slate-300">Belum ada foto di galeri</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Seluruh link gambar placeholder lama telah dihapus. Silakan upload foto asli dokumentasi umrah Anda melalui form di atas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <img
                  src={getStorageImageUrl(item.image)}
                  alt={item.caption || "Foto Galeri"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="self-end">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-600/90 hover:bg-red-700 text-white rounded-xl shadow-lg transition-colors"
                      title="Hapus foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.caption && (
                    <p className="text-white text-xs font-medium truncate drop-shadow">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
