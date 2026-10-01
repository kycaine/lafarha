"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getTransactionById,
  updateTransactionContact,
  updateTransactionQuote,
  updateTransactionStatus,
} from "@/modules/ordering/actions";
import { fetchApi } from "@/lib/api";
import {
  Phone, Edit, Save, Copy, MessageCircle, CheckCircle2,
  XCircle, Clock, Package, ArrowLeft, Send, X, ClipboardPaste
} from "lucide-react";

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_BADGE: Record<string, string> = {
  PENDING:   "bg-amber-100 text-amber-700 border-amber-200",
  QUOTED:    "bg-emerald-100 text-emerald-700 border-emerald-200",
  CLOSED:    "bg-blue-100 text-blue-700 border-blue-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

function AdminTransactionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [tx, setTx] = useState<any>(null);
  const [adminWa, setAdminWa] = useState("");
  const [loading, setLoading] = useState(true);

  // WA edit state
  const [waInput, setWaInput]     = useState("");
  const [waEditing, setWaEditing] = useState(false);
  const [waSaving, setWaSaving]   = useState(false);

  // Pricing state
  const [itemPrices, setItemPrices] = useState<Record<number, string>>({});
  const [validityHours, setValidityHours] = useState(24);
  const [publishing, setPublishing] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      getTransactionById(id),
      fetchApi('/settings/contact').catch(() => ({})),
    ]).then(([txData, contactData]) => {
      if (txData) {
        setTx(txData);
        setWaInput(txData.client_whatsapp || "");
        const initial: Record<number, string> = {};
        (txData.items || []).forEach((item: any) => {
          initial[item.id] = item.subtotal ? String(item.subtotal) : "";
        });
        setItemPrices(initial);
      }
      if (contactData?.whatsapp_number) {
        setAdminWa(contactData.whatsapp_number.replace(/\D/g, ''));
      }
      setLoading(false);
    });
  }, [id]);

  // Pre-parse specs once
  const parsedItems = useMemo(
    () => (tx?.items || []).map((item: any) => ({
      ...item,
      specs: item.specs ? JSON.parse(item.specs) : {},
    })),
    [tx?.items]
  );

  // Grand total
  const grandTotal = useMemo(
    () => parsedItems.reduce((sum: number, item: any) => {
      const pax = Number(item.specs.pax) || 1;
      return sum + (Number(itemPrices[item.id] || 0) * pax);
    }, 0),
    [parsedItems, itemPrices]
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleSaveWa = async () => {
    if (!waInput.trim()) return;
    setWaSaving(true);
    const res = await updateTransactionContact(id, waInput.trim());
    setWaSaving(false);
    if (res.success) {
      setWaEditing(false);
      setTx((prev: any) => ({ ...prev, client_whatsapp: waInput.trim() }));
    } else {
      alert("Gagal menyimpan: " + res.error);
    }
  };

  const normalizePhone = (text: string) => {
    let digits = text.replace(/\D/g, '');
    if (digits.startsWith('62')) {
      digits = '0' + digits.substring(2);
    }
    return digits;
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setWaInput(normalizePhone(text));
    } catch (err) {
      alert("Gagal membaca clipboard. Izinkan akses clipboard di browser Anda.");
    }
  };

  const handlePublishQuote = async () => {
    if (grandTotal === 0) { alert("Isi harga terlebih dahulu."); return; }
    setPublishing(true);
    const res = await updateTransactionQuote(id, {
      totalAmount: grandTotal,
      validityHours,
      items: itemPrices,
    });
    setPublishing(false);
    if (res.success) {
      setTx((prev: any) => ({
        ...prev,
        status: 'QUOTED',
        total_amount_idr: grandTotal,
      }));
      alert("Penawaran berhasil diterbitkan!");
    } else {
      alert("Gagal: " + res.error);
    }
  };

  const handleUpdateStatus = async (status: 'CLOSED' | 'CANCELLED') => {
    const label = status === 'CLOSED' ? 'Selesai (Closed)' : 'Dibatalkan (Cancelled)';
    if (!confirm(`Tandai transaksi ini sebagai ${label}?`)) return;
    setActionLoading(true);
    const res = await updateTransactionStatus(id, status);
    setActionLoading(false);
    if (res.success) {
      setTx((prev: any) => ({ ...prev, status }));
    } else {
      alert("Gagal: " + res.error);
    }
  };

  const buildWaMessage = () => {
    const lines = [
      `Halo ${tx.client_name},`,
      ``,
      `Berikut penawaran untuk pesanan *${tx.id}*:`,
      ``,
      ...parsedItems.map((item: any) => {
        const pax = Number(item.specs.pax) || 1;
        const price = Number(itemPrices[item.id] || 0);
        return `• *${item.title}* (${pax} Pax) — Rp ${(price * pax).toLocaleString("id-ID")}`;
      }),
      ``,
      `💰 *Total: Rp ${grandTotal.toLocaleString("id-ID")}*`,
      `⏳ Penawaran berlaku ${validityHours} jam`,
      ``,
      `Cek status pesanan Anda di:`,
      `${typeof window !== 'undefined' ? window.location.origin : ''}/products/${tx.id}`,
      ``,
      `Balas pesan ini untuk konfirmasi. Terima kasih! 🙏`,
    ];
    return lines.join("\n");
  };

  const handleShareWa = () => {
    if (!waInput && !tx?.client_whatsapp) {
      alert("Isi nomor WA customer terlebih dahulu.");
      return;
    }
    let phone = (waInput || tx?.client_whatsapp || "").replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '62' + phone.substring(1);
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(buildWaMessage())}`, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildWaMessage());
    alert("Pesan tersalin ke clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="font-semibold text-slate-700">Transaksi tidak ditemukan</p>
          <button onClick={() => router.back()} className="mt-4 text-sm text-blue-600 hover:underline">Kembali</button>
        </div>
      </div>
    );
  }

  const isQuoted    = tx.status === 'QUOTED';
  const isClosed    = tx.status === 'CLOSED';
  const isCancelled = tx.status === 'CANCELLED';
  const isEditable  = !isClosed && !isCancelled;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 relative">
      
      {/* ── Overlay Input WA ── */}
      {!tx.client_whatsapp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-[90vw] h-[90vh] max-w-4xl max-h-[600px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 text-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">Verifikasi Nomor WA</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                Masukkan nomor WA pelanggan untuk transaksi <strong className="font-mono text-slate-700 dark:text-slate-300">{tx.id}</strong>. Anda bisa melihat nomor ini dari chat masuk di WhatsApp.
              </p>
            </div>
            
            {/* Body */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50 dark:bg-slate-950/50">
              <div className="w-full max-w-md space-y-6">
                <div className="relative">
                  <input
                    type="tel"
                    autoFocus
                    placeholder="Contoh: 081234567890"
                    value={waInput}
                    onChange={e => setWaInput(normalizePhone(e.target.value))}
                    className="w-full h-16 pl-6 pr-24 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none text-2xl font-bold transition-all shadow-inner tracking-wide"
                  />
                  <button 
                    onClick={handlePaste}
                    title="Paste dari clipboard"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-medium text-sm flex items-center gap-2 transition-colors"
                  >
                    <ClipboardPaste className="w-4 h-4" /> Paste
                  </button>
                </div>
                
                <button
                  onClick={handleSaveWa}
                  disabled={waSaving || waInput.replace(/\D/g, '').length < 9}
                  className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xl flex items-center justify-center gap-3 disabled:opacity-50 transition-colors shadow-xl shadow-blue-900/20"
                >
                  {waSaving ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-6 h-6" />}
                  {waSaving ? "Menyimpan..." : "Simpan & Tampilkan Dashboard"}
                </button>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 text-center bg-white dark:bg-slate-900">
              <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium transition-colors">
                ← Kembali ke daftar pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-mono">{tx.id}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_BADGE[tx.status] ?? STATUS_BADGE.PENDING}`}>
                {tx.status}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              {tx.client_name} · {new Date(tx.created_at).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── LEFT: Items ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {parsedItems.map((item: any, idx: number) => {
              const pax = Number(item.specs.pax) || 1;
              const rawPrice = itemPrices[item.id] || "";
              const price = Number(rawPrice) || 0;

              return (
                <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  {/* Item header */}
                  <div className="flex items-center gap-3 px-6 py-4 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800/50">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <p className="font-bold text-indigo-900 dark:text-indigo-100">{item.title}</p>
                    <Package className="w-4 h-4 text-indigo-400 ml-auto" />
                  </div>

                  <div className="px-6 py-5 space-y-5">
                    {/* Specs */}
                    <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-slate-400 mb-0.5">Pax</p>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{pax}</p>
                      </div>
                      {Object.entries(item.specs)
                        .filter(([k]) => k !== 'pax' && k !== 'customFields')
                        .map(([k, v]) => (
                          <div key={k}>
                            <p className="text-slate-400 mb-0.5 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{String(v) || '-'}</p>
                          </div>
                        ))}
                    </div>

                    {/* Price input */}
                    <div className="grid sm:grid-cols-2 gap-4 items-end">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Harga Jual / Pax (IDR)
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-slate-400 font-medium text-sm pointer-events-none">Rp</span>
                          <input
                            type="text"
                            disabled={!isEditable}
                            placeholder="0"
                            className="w-full pl-9 pr-4 h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            value={rawPrice ? parseInt(rawPrice, 10).toLocaleString("id-ID") : ""}
                            onChange={e => {
                              const digits = e.target.value.replace(/\D/g, '');
                              setItemPrices(prev => ({ ...prev, [item.id]: digits }));
                            }}
                          />
                        </div>
                      </div>
                      <div className="text-right pb-1">
                        <p className="text-sm text-slate-400">Subtotal</p>
                        <p className="text-xl font-black text-slate-800 dark:text-slate-200">
                          Rp {(price * pax).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Validity */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 px-6 py-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-slate-700 dark:text-slate-300 font-semibold">
                <Clock className="w-4 h-4 text-sky-500" /> Masa Berlaku Penawaran
              </div>
              <div className="flex gap-2 flex-wrap">
                {[3, 12, 24, 48].map(h => (
                  <button
                    key={h}
                    disabled={!isEditable}
                    onClick={() => setValidityHours(h)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      validityHours === h
                        ? 'bg-sky-500 text-white border-sky-500'
                        : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-sky-400'
                    }`}
                  >
                    {h} Jam
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Sidebar ──────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Grand total */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-2xl border border-emerald-200/50 dark:border-emerald-900/50 p-6 shadow-sm">
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400 mb-3">Grand Total</p>
              <div className="space-y-2 text-sm mb-4">
                {parsedItems.map((item: any) => {
                  const pax = Number(item.specs.pax) || 1;
                  const price = Number(itemPrices[item.id] || 0);
                  return (
                    <div key={item.id} className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span className="truncate pr-2">{item.title} (×{pax})</span>
                      <span className="font-semibold whitespace-nowrap">Rp {(price * pax).toLocaleString("id-ID")}</span>
                    </div>
                  );
                })}
              </div>
              <div className="pt-3 border-t border-emerald-200/50 dark:border-emerald-800/50 flex justify-between items-center">
                <span className="font-bold text-emerald-800 dark:text-emerald-500 text-sm">Total</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  Rp {grandTotal.toLocaleString("id-ID")}
                </span>
              </div>

              {/* Publish button */}
              {isEditable && (
                <button
                  onClick={handlePublishQuote}
                  disabled={publishing || grandTotal === 0}
                  className="mt-5 w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-900/20"
                >
                  <Send className="w-4 h-4" />
                  {publishing ? "Menyimpan..." : isQuoted ? "Perbarui Penawaran" : "Terbitkan Penawaran"}
                </button>
              )}
            </div>

            {/* WA & Communication */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Komunikasi Pelanggan</p>

              {/* WA Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Nomor WA
                  <span className="text-amber-500 font-normal ml-1">(isi dari chat WA masuk)</span>
                </label>
                {waEditing ? (
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      type="tel"
                      placeholder="08123456789"
                      value={waInput}
                      onChange={e => setWaInput(e.target.value)}
                      className="flex-1 h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      onClick={handleSaveWa}
                      disabled={waSaving || !waInput.trim()}
                      className="h-9 w-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center disabled:opacity-50"
                    >
                      {waSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => { setWaEditing(false); setWaInput(tx.client_whatsapp || ""); }}
                      className="h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700">
                    <span className="flex-1 text-sm font-mono text-slate-700 dark:text-slate-300">
                      {waInput || <span className="text-slate-400 italic">Belum diisi</span>}
                    </span>
                    <button onClick={() => setWaEditing(true)} className="text-slate-400 hover:text-blue-600 transition-colors p-1">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <p className="text-[11px] text-slate-400">Lihat nomor pengirim di WA, lalu isi di sini untuk menyimpannya.</p>
              </div>

              {/* Share buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleShareWa}
                  className="w-full h-11 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Bagikan Penawaran ke WA
                </button>
                <button
                  onClick={handleCopy}
                  className="w-full h-11 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Copy className="w-4 h-4" /> Salin Pesan
                </button>
              </div>
            </div>

            {/* Status actions */}
            {isEditable && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-2">
                <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm mb-3">Aksi</p>
                {isQuoted && (
                  <button
                    onClick={() => handleUpdateStatus('CLOSED')}
                    disabled={actionLoading}
                    className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Tandai Selesai (Closed)
                  </button>
                )}
                <button
                  onClick={() => handleUpdateStatus('CANCELLED')}
                  disabled={actionLoading}
                  className="w-full h-11 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  <XCircle className="w-4 h-4" /> Batalkan Transaksi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AdminTransactionDetail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AdminTransactionPage />
    </Suspense>
  );
}
