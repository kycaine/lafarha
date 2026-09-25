"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { getTransactionById } from "@/modules/ordering/actions";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function QuotePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [order, setOrder] = useState<any>(null);
  const [counterWa, setCounterWa] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      // Fetch order dan nomor WA admin secara paralel
      try {
        const [orderData, contactData] = await Promise.all([
          id ? getTransactionById(id) : Promise.resolve(null),
          fetchApi('/settings/contact').catch(() => ({}))
        ]);

        if (orderData) setOrder(orderData);
        else setError(true);

        let waNumber = "";
        const apiWa = contactData?.whatsapp_counter || contactData?.whatsapp_number;
        if (apiWa) {
          waNumber = apiWa.replace(/\D/g, '');
        }
        setCounterWa(waNumber);
      } catch (err) {
        setError(true);
      }

      setLoading(false);
    };

    if (id) {
      fetchAll();
    } else {
      setError(true);
      setLoading(false);
    }
  }, [id]);

  /** Buat link wa.me ke admin dengan pesan yang sudah include info customer */
  const buildWaLink = () => {
    const nomor = counterWa;
    const nama = order?.client_name ?? "-";
    const waUser = order?.client_whatsapp ?? "-";
    const harga = order?.total_amount_idr?.toLocaleString("id-ID") ?? "0";
    const message = [
      `Halo Min,`,
      ``,
      `Saya ingin konfirmasi pesanan berikut:`,
      `• ID Pesanan : ${order?.id}`,
      `• Nama       : ${nama}`,
      `• WA Saya    : ${waUser}`,
      `• Total      : Rp ${harga}`,
      ``,
      `Mohon info selanjutnya untuk proses pembayaran. Terima kasih 🙏`,
    ].join("\n");

    return `https://wa.me/${nomor}?text=${encodeURIComponent(message)}`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-black">Loading...</div>;
  if (error || !order) return <div className="min-h-screen flex items-center justify-center text-white bg-black">Order Not Found</div>;

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black text-white flex items-center justify-center p-6">
      <Card className="w-full max-w-3xl backdrop-blur-xl bg-white/5 dark:bg-black/50 border-white/10 shadow-2xl relative">
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
        </button>
        <CardHeader className="text-center pb-8 border-b border-white/10 mt-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
            <div className="w-8 h-8 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <CardTitle className="text-3xl font-bold">Penawaran: {order.id}</CardTitle>
          <CardDescription className="text-emerald-400 mt-2">
            Status: {order.status.replace("_", " ")}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 text-center space-y-6">
          {order.status === 'AWAITING_VERIFICATION' || order.status === 'CALCULATING' ? (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Sedang Dihitung Admin</h3>
              <p className="text-slate-400">
                Tim kami sedang menghitung harga terbaik untuk pesanan Anda.
                Halaman ini akan otomatis diperbarui setelah penawaran siap.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Penawaran Siap</h3>
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                Rp {order.total_amount_idr?.toLocaleString("id-ID")}
              </div>
              <p className="text-slate-400">Berlaku hingga: {new Date(order.quote_expiry).toLocaleString()}</p>

              <div className="pt-8">
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
                  className="inline-flex h-12 items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-emerald-600 px-8 text-sm font-medium text-white shadow transition-colors hover:from-blue-700 hover:to-emerald-700"
                >
                  Konfirmasi &amp; Lanjut Pembayaran via WA
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default function QuotePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white bg-black">Loading Page...</div>}>
      <QuotePageContent />
    </Suspense>
  );
}
