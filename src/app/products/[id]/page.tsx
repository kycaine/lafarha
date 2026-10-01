"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { getTransactionById } from "@/modules/ordering/actions";
import { fetchApi } from "@/lib/api";
import { CheckCircle2, Clock, XCircle, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const STATUS_CONFIG = {
  PENDING: {
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    label: "Menunggu Kalkulasi",
    desc: "Tim kami sedang menghitung harga terbaik untuk pesanan Anda. Anda akan dihubungi via WhatsApp setelah penawaran siap.",
  },
  QUOTED: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    label: "Penawaran Siap",
    desc: "Harga sudah dikalkulasikan. Silakan konfirmasi via WhatsApp untuk melanjutkan pemesanan.",
  },
  CLOSED: {
    icon: CheckCircle2,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    label: "Pesanan Selesai",
    desc: "Pesanan Anda sudah dikonfirmasi dan diproses. Terima kasih telah mempercayai kami.",
  },
  CANCELLED: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    label: "Dibatalkan",
    desc: "Penawaran ini telah dibatalkan. Hubungi kami jika ada pertanyaan.",
  },
};

function TransactionStatusPage() {
  const params = useParams();
  const id = params.id as string;

  const [tx, setTx] = useState<any>(null);
  const [counterWa, setCounterWa] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      getTransactionById(id),
      fetchApi('/settings/contact').catch(() => ({})),
    ]).then(([txData, contactData]) => {
      if (txData) setTx(txData);
      else setError(true);
      const apiWa = contactData?.whatsapp_counter || contactData?.whatsapp_number;
      if (apiWa) {
        setCounterWa(apiWa.replace(/\D/g, ''));
      }
      setLoading(false);
    });
  }, [id]);

  const buildWaLink = () => {
    const nomor = counterWa;
    const message = [
      `Halo Min,`,
      ``,
      `Saya ingin konfirmasi pesanan berikut:`,
      `• ID : ${tx?.id}`,
      `• Nama : ${tx?.client_name}`,
      `• Total : Rp ${tx?.total_amount_idr?.toLocaleString("id-ID")}`,
      ``,
      `Mohon info selanjutnya untuk proses pembayaran. Terima kasih 🙏`,
    ].join("\n");
    return `https://wa.me/${nomor}?text=${encodeURIComponent(message)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !tx) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-800">
        <div className="text-center space-y-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold">Transaksi Tidak Ditemukan</h1>
          <p className="text-slate-500">ID: {id}</p>
          <Link href="/products" className="inline-flex items-center justify-center gap-2 mt-6 bg-black text-white hover:bg-gray-900 px-6 py-3 rounded-xl transition-all text-base font-black shadow-md uppercase tracking-wide">
            ← Kembali ke Penawaran
          </Link>
        </div>
      </div>
    );
  }

  const status = tx.status as keyof typeof STATUS_CONFIG;
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  const Icon = cfg.icon;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 text-slate-800">
      {/* Navbar */}
      <nav className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src="/farha-logo-only.svg"
              alt="FARHA Logo"
              className="w-9 h-9"
            />
            <div className="leading-tight">
              <span 
                className="font-bold tracking-wide block text-[15px] text-slate-900"
                style={{ fontFamily: 'var(--font-cinzel), serif' }}
              >
                FARHA
              </span>
              <span className="font-medium tracking-[0.2em] uppercase block text-[10px] text-[#C9A84C]">
                Umrah Services
              </span>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-400 font-mono font-medium hidden sm:block">ID: {tx.id}</div>
            <Link href="/products" className="flex items-center gap-2 bg-black text-white hover:bg-gray-900 px-4 py-2 rounded-xl transition-all text-sm font-bold shadow-md uppercase tracking-wide">
              Buat Penawaran Baru
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-16 max-w-2xl">
        {/* Status card */}
        <div className={`rounded-2xl border p-8 text-center space-y-6 ${cfg.bg} ${cfg.border} shadow-sm`}>
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-white shadow-sm border ${cfg.border}`}>
            <Icon className={`w-10 h-10 ${cfg.color}`} />
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Status Pesanan</p>
            <h1 className={`text-3xl font-extrabold ${cfg.color}`}>{cfg.label}</h1>
          </div>

          <p className="text-slate-600 leading-relaxed max-w-md mx-auto">{cfg.desc}</p>

          {/* Harga (jika QUOTED atau CLOSED) */}
          {(status === 'QUOTED' || status === 'CLOSED') && tx.total_amount_idr && (
            <div className="pt-4 border-t border-slate-200/60 space-y-2">
              <p className="text-sm font-semibold text-slate-500">Total Penawaran</p>
              <p className="text-4xl font-black text-[#C9A84C]">
                Rp {tx.total_amount_idr.toLocaleString("id-ID")}
              </p>
              {tx.quote_expiry && (
                <p className="text-xs font-medium text-slate-400">
                  Berlaku hingga: {new Date(tx.quote_expiry).toLocaleString("id-ID")}
                </p>
              )}
            </div>
          )}

          {/* CTA untuk QUOTED */}
          {status === 'QUOTED' && (
            <a
              href={counterWa ? buildWaLink() : "#"}
              onClick={(e) => {
                if (!counterWa) {
                  e.preventDefault();
                  alert("Service sedang maintain (Nomor Counter tidak tersedia).");
                }
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#8B6914] hover:shadow-lg hover:shadow-[#C9A84C]/20 text-white font-bold text-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Konfirmasi via WhatsApp
            </a>
          )}
        </div>

        {/* Detail layanan */}
        {tx.items && tx.items.length > 0 && (
          <div className="mt-8 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Layanan yang Dipesan</h2>
            <div className="grid gap-3">
              {tx.items.map((item: any) => {
                const specs = item.specs ? JSON.parse(item.specs) : {};
                return (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="font-bold text-slate-800">{item.title}</p>
                      {specs.pax && specs.pax !== 'N/A' && (
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{specs.pax} Pax</p>
                      )}
                    </div>
                    {item.subtotal && (
                      <p className="text-[#C9A84C] font-extrabold text-sm">
                        Rp {Number(item.subtotal).toLocaleString("id-ID")}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Info */}
        <p className="mt-8 text-center text-xs font-medium text-slate-500">
          Simpan halaman ini untuk memantau status pesanan Anda. ID: <span className="font-mono text-slate-400">{tx.id}</span>
        </p>
      </div>
    </main>
  );
}

export default function PenawaranDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TransactionStatusPage />
    </Suspense>
  );
}
