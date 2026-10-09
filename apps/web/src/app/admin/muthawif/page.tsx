"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Eye, AlertCircle, X, Download } from 'lucide-react';
import { useAlert } from '@/shared/AlertContext';

export default function AdminMuthawifPage() {
  const [muthawifs, setMuthawifs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMuthawif, setSelectedMuthawif] = useState<any | null>(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchMuthawifs();
  }, []);

  const fetchMuthawifs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/proxy/muthawifs');
      const json = await res.json();
      if (json.success && json.data) {
        setMuthawifs(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    showAlert({
      title: "Setujui Muthawif?",
      message: "Setelah disetujui, muthawif ini akan tampil di direktori publik dan otomatis mendapatkan role akses.",
      type: "info",
      showCancel: true,
      confirmText: "Ya, Setujui",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/proxy/muthawifs/${id}/approve`, {
            method: 'PATCH',
          });
          const json = await res.json();
          if (json.success) {
            showAlert({
              title: "Berhasil",
              message: "Muthawif berhasil disetujui.",
              type: "success"
            });
            setSelectedMuthawif(null); // Tutup modal
            fetchMuthawifs(); // Refresh list
          } else {
            showAlert({
              title: "Gagal",
              message: json.message || "Gagal menyetujui muthawif.",
              type: "error"
            });
          }
        } catch (error) {
          showAlert({
            title: "Error",
            message: "Terjadi kesalahan saat menghubungi server.",
            type: "error"
          });
        }
      }
    });
  };

  const pendingMuthawifs = muthawifs.filter(m => m.status === 'PENDING');
  const approvedMuthawifs = muthawifs.filter(m => m.status === 'APPROVED');

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Manajemen Muthawif</h2>
        <p className="text-slate-500">Kelola pendaftaran dan status muthawif FARHA.</p>
      </div>

      {/* Bagian Atas: Sedang Direview */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Sedang Direview ({pendingMuthawifs.length})</h3>
        </div>

        {isLoading ? (
          <p className="text-slate-500 text-sm">Memuat data...</p>
        ) : pendingMuthawifs.length === 0 ? (
          <Card className="border-dashed bg-slate-50 dark:bg-slate-900">
            <CardContent className="flex flex-col items-center justify-center py-10 text-slate-500">
              <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
              <p>Tidak ada pendaftaran baru.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingMuthawifs.map(muthawif => (
              <Card 
                key={muthawif.id} 
                className="border-l-4 border-l-amber-500 cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => setSelectedMuthawif(muthawif)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex justify-between items-center group-hover:text-emerald-600 transition-colors">
                    {muthawif.nama}
                    <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-1 rounded-md">PENDING</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <p>{muthawif.email}</p>
                    <p className="text-xs text-slate-400">Daftar: {new Date(muthawif.created_at).toLocaleDateString('id-ID')}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* Bagian Bawah: Sudah Disetujui */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Sudah Disetujui ({approvedMuthawifs.length})</h3>
        </div>

        {isLoading ? (
          <p className="text-slate-500 text-sm">Memuat data...</p>
        ) : approvedMuthawifs.length === 0 ? (
          <Card className="border-dashed bg-slate-50 dark:bg-slate-900">
            <CardContent className="flex flex-col items-center justify-center py-10 text-slate-500">
              <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
              <p>Belum ada muthawif yang disetujui.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approvedMuthawifs.map(muthawif => (
              <Card 
                key={muthawif.id} 
                className="border-l-4 border-l-emerald-500 opacity-80 hover:opacity-100 cursor-pointer transition-all"
                onClick={() => setSelectedMuthawif(muthawif)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex justify-between items-center">
                    {muthawif.nama}
                    <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">APPROVED</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <p>{muthawif.email}</p>
                    <p className="text-xs text-slate-400">Disetujui: {new Date(muthawif.updated_at || muthawif.created_at).toLocaleDateString('id-ID')}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal Detail Muthawif */}
      {selectedMuthawif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Detail Calon Muthawif</h3>
              <button onClick={() => setSelectedMuthawif(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Informasi Personal</h4>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{selectedMuthawif.nama}</p>
                <p className="text-slate-600 dark:text-slate-400">{selectedMuthawif.email}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Dokumen Pendukung</h4>
                {selectedMuthawif.cv_file ? (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-700">
                    <div className="truncate pr-4 flex-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">CV:</span> {selectedMuthawif.cv_filename || "Dokumen CV.pdf"}
                    </div>
                    <a 
                      href={selectedMuthawif.cv_file} 
                      download={selectedMuthawif.cv_filename || "CV.pdf"}
                      className="text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 shrink-0 transition-colors"
                    >
                      <Download className="w-4 h-4" /> Unduh
                    </a>
                  </div>
                ) : (
                  <p className="text-slate-500 italic text-sm">Tidak ada dokumen CV yang dilampirkan.</p>
                )}
              </div>

              {selectedMuthawif.status === 'PENDING' && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button 
                    onClick={() => handleApprove(selectedMuthawif.id)} 
                    className="w-full py-6 text-base bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Setujui Muthawif
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
