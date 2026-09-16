"use client";

import { useEffect, useState } from "react";
import { getOrders, getOrderById } from "@/modules/ordering/actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const STATUS_LABELS: Record<string, string> = {
  AWAITING_VERIFICATION: "New (Awaiting WA)",
  CALCULATING: "In Review",
  QUOTATION_READY: "Quotation Ready",
  ISSUED: "Deal Closed"
};

const STATUS_COLORS: Record<string, string> = {
  AWAITING_VERIFICATION: "bg-blue-100 text-blue-800",
  CALCULATING: "bg-yellow-100 text-yellow-800",
  QUOTATION_READY: "bg-purple-100 text-purple-800",
  ISSUED: "bg-green-100 text-green-800"
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderDetails, setOrderDetails] = useState<any | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    getOrders().then(data => {
      // Pastikan disortir berdasarkan tanggal terbaru (descending)
      const sortedData = data.sort((a: any, b: any) => 
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
      setOrders(sortedData);
      setLoading(false);
    });
  }, []);

  const handleRowClick = async (order: any) => {
    setSelectedOrder(order);
    setOrderDetails(null);
    setDetailsLoading(true);
    setIsDialogOpen(true);
    
    const details = await getOrderById(order.id);
    setOrderDetails(details);
    setDetailsLoading(false);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <main className="p-6 pt-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight">Daftar Transaksi</h1>
          <p className="text-slate-500">Monitoring semua pipeline order LA Umrah.</p>
        </header>

        {/* List View */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b text-slate-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">ID Transaksi</th>
                  <th className="px-6 py-4">Nama Pelanggan</th>
                  <th className="px-6 py-4">WhatsApp</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      Belum ada transaksi.
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr 
                      key={order.id} 
                      onClick={() => handleRowClick(order)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                      <td className="px-6 py-4 font-bold">{order.client_name}</td>
                      <td className="px-6 py-4">{order.client_whatsapp}</td>
                      <td className="px-6 py-4">
                        {order.created_at ? (
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800">
                              {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="text-xs text-slate-400">
                              {new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] || "bg-slate-100"}`}>
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Detail Transaksi: {selectedOrder?.id}</DialogTitle>
              <DialogDescription>Informasi lengkap pesanan pelanggan.</DialogDescription>
            </DialogHeader>

            {detailsLoading ? (
              <div className="py-8 text-center text-slate-500">Memuat detail...</div>
            ) : orderDetails ? (
              <div className="space-y-6">
                {/* Info Customer */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Nama</p>
                    <p className="font-bold text-slate-900">{orderDetails.client_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">WhatsApp</p>
                    <p className="font-bold text-slate-900">{orderDetails.client_whatsapp}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Status</p>
                    <p className="font-bold text-slate-900">{STATUS_LABELS[orderDetails.status] || orderDetails.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Token Akses</p>
                    <p className="font-mono text-slate-900">{orderDetails.token}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-bold mb-3 border-b pb-2">Layanan yang Dipesan</h3>
                  <div className="space-y-3">
                    {orderDetails.items?.map((item: any) => {
                      const specs = item.specs ? JSON.parse(item.specs) : {};
                      return (
                        <div key={item.id} className="p-3 border rounded-lg bg-white shadow-sm flex justify-between items-start">
                          <div>
                            <p className="font-bold text-slate-800">{item.title}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {specs.pax ? `${specs.pax} Pax` : ''} 
                            </p>
                          </div>
                          {item.subtotal > 0 && (
                            <p className="font-bold text-blue-600">Rp {item.subtotal.toLocaleString('id-ID')}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Harga Summary */}
                {orderDetails.total_amount_idr > 0 && (
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Total Harga</span>
                      <span className="font-bold">Rp {orderDetails.total_amount_idr.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">DP (Uang Muka)</span>
                      <span className="font-bold">Rp {orderDetails.dp_amount_idr?.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-blue-200 pt-2">
                      <span className="text-slate-600 font-bold">Sisa Pelunasan</span>
                      <span className="font-bold text-blue-700">Rp {orderDetails.pelunasan_amount_idr?.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-red-500">Gagal memuat detail data.</div>
            )}

            <DialogFooter className="mt-4">
              <div className="flex justify-between w-full">
                <DialogClose asChild>
                  <Button variant="outline">Tutup</Button>
                </DialogClose>
                
                {/* Action button: Jika masih baru, bisa diberi penawaran harga */}
                {(selectedOrder?.status === 'AWAITING_VERIFICATION' || selectedOrder?.status === 'CALCULATING') && (
                  <Link href={`/admin/orders/calculate?id=${selectedOrder.id}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Buat Penawaran Harga</Button>
                  </Link>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
