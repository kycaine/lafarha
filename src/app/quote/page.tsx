"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getOrderById } from "@/modules/ordering/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function QuotePageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      getOrderById(id).then(data => {
        if (data) setOrder(data);
        else setError(true);
        setLoading(false);
      });
    } else {
      setError(true);
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-black">Loading...</div>;
  if (error || !order) return <div className="min-h-screen flex items-center justify-center text-white bg-black">Order Not Found</div>;

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black text-white flex items-center justify-center p-6">
      <Card className="w-full max-w-3xl backdrop-blur-xl bg-white/5 dark:bg-black/50 border-white/10 shadow-2xl">
        <CardHeader className="text-center pb-8 border-b border-white/10">
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
                  href={`https://wa.me/6281234567890?text=Halo Admin, saya konfirmasi pesanan ${order.id} seharga Rp ${order.total_amount_idr?.toLocaleString("id-ID")}`}
                  className="inline-flex h-12 items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-emerald-600 px-8 text-sm font-medium text-white shadow transition-colors hover:from-blue-700 hover:to-emerald-700"
                >
                  Konfirmasi & Lanjut Pembayaran via WA
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
