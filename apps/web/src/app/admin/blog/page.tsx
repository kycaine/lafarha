"use client";

import React, { useState, useEffect, useRef } from "react";
import { BookOpen, Plus, Edit2, Trash2, Upload, RefreshCw, CheckCircle, Image as ImageIcon, Calendar, User, Search, X } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { convertAndCompressToWebp, formatFileSize, CompressedImageResult } from "@/lib/image-utils";
import { useAlert } from "@/shared/AlertContext";

interface ArticleItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

export default function AdminBlogPage() {
  const { showAlert } = useAlert();
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Umrah");
  const [author, setAuthor] = useState("Tim Farha");
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  
  // Image Upload State
  const [compressedImage, setCompressedImage] = useState<CompressedImageResult | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_BLOG_SIZE = 1024 * 1024; // 1 MB

  const loadArticles = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/articles");
      if (res.success && Array.isArray(res.data)) {
        setArticles(res.data);
      }
    } catch (err) {
      console.error("Gagal memuat artikel:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const openCreateModal = () => {
    setEditingArticle(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setCategory("Umrah");
    setAuthor("Tim Farha");
    setCurrentImageUrl("");
    setCompressedImage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (article: ArticleItem) => {
    setEditingArticle(article);
    setTitle(article.title);
    setExcerpt(article.excerpt);
    setContent(article.content);
    setCategory(article.category);
    setAuthor(article.author || "Tim Farha");
    setCurrentImageUrl(article.image || "");
    setCompressedImage(null);
    setIsModalOpen(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showAlert({
        title: "File Tidak Valid",
        message: "Silakan pilih file gambar.",
        type: "error",
      });
      return;
    }

    setCompressing(true);
    try {
      const result = await convertAndCompressToWebp(file, {
        maxSizeBytes: MAX_BLOG_SIZE,
        maxWidth: 1920,
        maxHeight: 1920,
        initialQuality: 0.90,
      });

      setCompressedImage(result);
    } catch (err: any) {
      showAlert({
        title: "Gagal Mengonversi Gambar",
        message: err.message || "Gagal memproses gambar.",
        type: "error",
      });
    } finally {
      setCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showAlert({
        title: "Form Belum Lengkap",
        message: "Judul dan isi artikel wajib diisi.",
        type: "error",
      });
      return;
    }

    setSubmitting(true);
    try {
      let finalImageUrl = currentImageUrl;

      // 1. Jika ada gambar baru yang dipilih, upload terlebih dahulu
      if (compressedImage) {
        const uploadRes = await fetchApi("/upload", {
          method: "POST",
          body: JSON.stringify({
            base64: compressedImage.dataUrl,
            folder: "blog",
          }),
        });

        if (!uploadRes.success) {
          throw new Error(uploadRes.error || "Gagal mengunggah gambar cover");
        }
        finalImageUrl = uploadRes.url;
      }

      // 2. Simpan atau update data artikel
      const payload = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        category: category.trim(),
        author: author.trim(),
        image: finalImageUrl,
        date: editingArticle?.date || new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      };

      if (editingArticle) {
        const res = await fetchApi(`/articles/${editingArticle.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        if (!res.success) throw new Error(res.error);
        showAlert({ title: "Berhasil!", message: "Artikel berhasil diperbarui.", type: "info" });
      } else {
        const res = await fetchApi("/articles", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (!res.success) throw new Error(res.error);
        showAlert({ title: "Berhasil!", message: "Artikel baru berhasil diterbitkan.", type: "info" });
      }

      setIsModalOpen(false);
      await loadArticles();
    } catch (err: any) {
      showAlert({
        title: "Gagal Menyimpan",
        message: err.message || "Terjadi kesalahan saat menyimpan artikel.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    showAlert({
      title: "Hapus Artikel?",
      message: "Artikel ini akan dihapus permanen dari website.",
      type: "error",
      showCancel: true,
      cancelText: "Batal",
      confirmText: "Ya, Hapus",
      onConfirm: async () => {
        try {
          const res = await fetchApi(`/articles/${id}`, { method: "DELETE" });
          if (res.success) {
            setArticles((prev) => prev.filter((a) => a.id !== id));
            showAlert({ title: "Berhasil", message: "Artikel telah dihapus.", type: "info" });
          } else {
            throw new Error(res.error);
          }
        } catch (err: any) {
          showAlert({ title: "Gagal Menghapus", message: err.message, type: "error" });
        }
      },
    });
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />
            Manajemen Blog & Artikel
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Kelola artikel edukasi dan panduan umrah. Cover gambar otomatis dikonversi ke <strong>WebP</strong> (Maksimal <strong>1 MB</strong>).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Tulis Artikel Baru
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan judul atau kategori..."
          className="w-full bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-xs text-slate-400 hover:text-slate-600">
            Reset
          </button>
        )}
      </div>

      {/* Articles List */}
      <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Daftar Artikel ({filteredArticles.length})
          </h2>
          <button
            onClick={loadArticles}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Refresh Artikel"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-600" />
            <p className="text-sm">Memuat artikel...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="font-bold text-slate-600 dark:text-slate-300">Tidak ada artikel ditemukan</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredArticles.map((article) => (
              <div key={article.id} className="py-5 flex flex-col md:flex-row gap-5 items-start justify-between group">
                <div className="flex gap-4 items-start flex-1 min-w-0">
                  {/* Cover thumbnail */}
                  <div className="w-24 h-20 md:w-32 md:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 relative">
                    {article.image ? (
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-emerald-50 dark:from-slate-800 dark:to-slate-900 text-slate-400 p-2 text-center">
                        <ImageIcon className="w-6 h-6 mb-1 text-[#C9A84C]" />
                        <span className="text-[10px] font-semibold text-slate-500">Belum Ada Cover</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        {article.category}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {article.date}
                      </span>
                    </div>

                    <h3 className="font-bold text-base md:text-lg text-slate-800 dark:text-white line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-slate-500 text-xs md:text-sm line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => openEditModal(article)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-600 dark:text-slate-300 hover:text-emerald-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Modif & Upload Cover
                  </button>

                  <button
                    onClick={() => handleDelete(article.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-lg"
                    title="Hapus Artikel"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-[#151515] rounded-3xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 my-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-600" />
              {editingArticle ? "Modifikasi Artikel & Ganti Cover" : "Tulis Artikel Baru"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Cover Image Upload Section */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Gambar Cover (Otomatis WebP • Maksimal 1 MB)
                </label>

                <div className="flex flex-col sm:flex-row gap-4 items-start p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
                  <div className="w-full sm:w-40 h-28 rounded-xl overflow-hidden bg-slate-200 shrink-0 relative">
                    {compressedImage ? (
                      <img src={compressedImage.dataUrl} alt="Preview Baru" className="w-full h-full object-cover" />
                    ) : currentImageUrl ? (
                      <img src={currentImageUrl} alt="Cover Sekarang" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                        <ImageIcon className="w-6 h-6 mb-1" />
                        <span>Belum Ada Cover</span>
                      </div>
                    )}
                    {(compressedImage || currentImageUrl) && (
                      <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        WEBP
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 text-xs">
                    {compressedImage ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                          <CheckCircle className="w-3.5 h-3.5" /> Konversi Berhasil
                        </div>
                        <p className="text-slate-500">
                          Awal: {formatFileSize(compressedImage.originalSize)} ➔{" "}
                          <strong className="text-emerald-600">{formatFileSize(compressedImage.compressedSize)}</strong> ({compressedImage.width}×{compressedImage.height} px)
                        </p>
                      </div>
                    ) : (
                      <p className="text-slate-500">
                        Upload foto dari komputer atau HP. Gambar akan otomatis di-resize dan dikonversi ke WebP kualitas tinggi tanpa pecah.
                      </p>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={compressing}
                        className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-200 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                      >
                        {compressing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        {currentImageUrl || compressedImage ? "Ganti Gambar" : "Pilih Gambar"}
                      </button>

                      {(currentImageUrl || compressedImage) && (
                        <button
                          type="button"
                          onClick={() => {
                            setCompressedImage(null);
                            setCurrentImageUrl("");
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Hapus Cover
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Judul Artikel *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Judul artikel..."
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Category & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Persiapan / Akomodasi / Sejarah..."
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Penulis
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Tim Farha"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Ringkasan Singkat (Excerpt)
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Ringkasan isi artikel untuk preview..."
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Konten Lengkap *
                </label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tulis isi artikel lengkap di sini..."
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {editingArticle ? "Simpan Perubahan" : "Terbitkan Artikel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
