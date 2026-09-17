"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateOrderQuote, issueOrder } from "@/modules/ordering/actions";
import { Clock, CheckCircle2, Copy, Ban, Percent, CreditCard, Package, Calculator, MessageCircle, Edit } from "lucide-react";

export function CalculateForm({ order, items }: { order: any, items: any[] }) {
  
  const [itemPrices, setItemPrices] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    items.forEach(item => {
      initial[item.id] = item.subtotal ? item.subtotal.toString() : "";
    });
    return initial;
  });

  const updateItemPrice = (id: number, value: string) => {
    const numericStr = value.replace(/\D/g, "");
    setItemPrices(prev => ({
      ...prev,
      [id]: numericStr
    }));
  };

  const [validityHours, setValidityHours] = useState(24);
  const [loading, setLoading] = useState(false);
  
  const isOriginallyPublished = order.status === 'QUOTATION_READY' || order.status === 'ISSUED';
  const isIssued = order.status === 'ISSUED';
  
  const [isEditing, setIsEditing] = useState(false);
  const isReadOnly = isOriginallyPublished && !isEditing;

  // Pre-parse specs once per items reference — avoids 3x JSON.parse per render
  const parsedItems = useMemo(() =>
    items.map(item => ({
      ...item,
      specs: item.specs ? JSON.parse(item.specs) : {}
    })), [items]
  );

  // Memoize total — only recomputes when prices or items actually change
  const totalClientPrice = useMemo(() =>
    parsedItems.reduce((sum, item) => {
      const pax = Number(item.specs.pax) || 1;
      // itemPrices stores digit-only strings (enforced by updateItemPrice)
      const pricePerPax = Number(itemPrices[item.id] || 0);
      return sum + (pricePerPax * pax);
    }, 0),
    [parsedItems, itemPrices]
  );

  // Termin dihapus sesuai request, DP 0, Pelunasan = Total
  const dpAmount = 0;
  const pelunasanAmount = totalClientPrice;

  const handlePublish = async () => {
    setLoading(true);
    const payload = { 
      totalAmount: totalClientPrice, 
      dpAmount, 
      pelunasanAmount, 
      validityHours,
      items: itemPrices
    };
    const res = await updateOrderQuote(order.id, payload);
    setLoading(false);
    if (res.success) {
      alert("Penawaran berhasil disimpan!");
      window.location.reload();
    } else {
      alert("Gagal menyimpan penawaran: " + res.error);
    }
  };

  const handleIssue = async () => {
    if (!confirm("Tandai pesanan ini sebagai Selesai / Issued? Pastikan pembayaran sudah lunas.")) return;
    setLoading(true);
    const res = await issueOrder(order.id);
    setLoading(false);
    if (res.success) {
      alert("Pesanan berhasil ditandai selesai!");
      window.location.reload();
    } else {
      alert("Gagal mengupdate pesanan: " + res.error);
    }
  };

  const generateWhatsAppMessage = () => {
    return `Halo ${order.client_name}, ini penawaran pesanan Anda.\n\n` +
      `📦 *Rincian Pesanan:*\n` +
      parsedItems.map(item => {
        const pax = Number(item.specs.pax) || 1;
        return `- ${item.title} (${pax} Pax)\n`;
      }).join('') + `\n` +
      `💰 *Total Harga:* Rp ${totalClientPrice.toLocaleString("id-ID")}\n\n` +
      `⏳ *Masa Berlaku Penawaran:* ${validityHours} Jam\n\n` +
      `Silakan klik link berikut untuk konfirmasi: https://la-dev.pages.dev/quote?id=${order.id}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateWhatsAppMessage());
    alert("Teks berhasil disalin ke clipboard!");
  };

  const handleChatWA = () => {
    const text = generateWhatsAppMessage();
    let phone = (order.client_whatsapp || "").replace(/\D/g, '');
    if (phone.startsWith('0')) {
      phone = '62' + phone.substring(1);
    }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        
        {/* Per-Item Cards — uses parsedItems so specs already an object */}
        {parsedItems.map((item, index) => {
          const pax = Number(item.specs.pax) || 1;
          const rawPriceStr = itemPrices[item.id] || "";
          // rawPriceStr is always digit-only (enforced by updateItemPrice)
          const pricePerPax = Number(rawPriceStr) || 0;
          
          return (
            <Card key={item.id} className="border-0 shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 px-6 py-3 border-b border-indigo-100 dark:border-indigo-800/50 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <CardTitle className="text-lg text-indigo-900 dark:text-indigo-100">{item.title}</CardTitle>
              </div>
              <CardContent className="pt-6 space-y-6">
                
                {/* Specs Summary */}
                <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-sm">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" /> Spesifikasi {item.title}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-slate-500 mb-1">Kuantitas (Pax)</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{pax}</div>
                    </div>
                    {Object.entries(item.specs).filter(([k]) => k !== 'pax' && k !== 'customFields').map(([k, v]) => (
                       <div key={k}>
                         <div className="text-slate-500 mb-1 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</div>
                         <div className="font-medium text-slate-800 dark:text-slate-200 truncate">{String(v) || '-'}</div>
                       </div>
                    ))}
                  </div>
                  {item.specs.customFields && Object.keys(item.specs.customFields).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4">
                      {Object.entries(item.specs.customFields).map(([k, v]) => (
                        <div key={k}>
                          <div className="text-slate-500 mb-1 capitalize">{k}</div>
                          <div className="font-medium text-slate-800 dark:text-slate-200">{String(v)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pricing Inputs */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-500 font-semibold">Harga Jual / Pax (IDR)</Label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-slate-400 font-medium z-10 pointer-events-none">Rp</span>
                      <Input 
                        type="text" 
                        placeholder="0"
                        className="pl-10 font-bold bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 transition-all focus:ring-emerald-500 disabled:opacity-75 disabled:bg-slate-100 disabled:dark:bg-slate-900"
                        value={rawPriceStr ? parseInt(rawPriceStr, 10).toLocaleString("id-ID") : ""} 
                        onChange={(e) => updateItemPrice(item.id, e.target.value)} 
                        disabled={isReadOnly}
                      />
                    </div>
                  </div>
                  
                  {/* Total for this item */}
                  <div className="space-y-2 flex flex-col justify-end pb-2">
                     <div className="text-sm text-slate-500">Subtotal {item.title}:</div>
                     <div className="text-xl font-bold text-slate-800 dark:text-slate-200">
                        Rp {(pricePerPax * pax).toLocaleString('id-ID')}
                     </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Terms & Conditions */}
        <div className="grid gap-6">

          <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl ring-1 ring-slate-200 dark:ring-slate-800">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-500" />
                <CardTitle className="text-base">Batas Waktu</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-slate-500 font-semibold">Penawaran Berlaku Untuk</Label>
                  <div className="flex gap-2">
                    {[3, 12, 24, 48].map(h => (
                      <Button 
                        key={h}
                        type="button"
                        variant={validityHours === h ? "default" : "outline"}
                        className={validityHours === h ? "bg-sky-500 hover:bg-sky-600" : ""}
                        onClick={() => setValidityHours(h)}
                        disabled={isReadOnly}
                      >
                        {h} Jam
                      </Button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pt-2">
                  Jika sudah lebih dari {validityHours} jam, penawaran ini hangus dan perlu dihitung ulang.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Summary Sidebar */}
      <div className="space-y-6">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 ring-1 ring-emerald-200/50 dark:ring-emerald-900/50 sticky top-6">
          <CardHeader>
            <CardTitle className="text-emerald-900 dark:text-emerald-400">Total Penawaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3 text-sm">
              {/* Uses parsedItems — specs already an object, no redundant parse */}
              {parsedItems.map(item => {
                const pax = Number(item.specs.pax) || 1;
                const price = Number(itemPrices[item.id] || 0);
                return (
                  <div key={item.id} className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span className="truncate pr-4">{item.title} (x{pax})</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-300 whitespace-nowrap">
                      Rp {(price * pax).toLocaleString("id-ID")}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <div className="pt-4 border-t border-emerald-200/50 dark:border-emerald-800/50">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-emerald-800 dark:text-emerald-500">Grand Total</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  Rp {totalClientPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3 pt-2">
            {!isEditing && isOriginallyPublished ? (
              <Button 
                size="lg"
                className="w-full h-14 text-lg font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 transition-all"
                onClick={() => setIsEditing(true)}
                disabled={isIssued}
              >
                <Edit className="w-5 h-5 mr-2" /> Atur Ulang Penawaran
              </Button>
            ) : (
              <Button 
                size="lg"
                className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all" 
                onClick={handlePublish}
                disabled={loading || totalClientPrice === 0}
              >
                {loading ? "Menyimpan..." : isOriginallyPublished ? "🔄 Perbarui Penawaran" : "🚀 Terbitkan Penawaran"}
              </Button>
            )}

            {isOriginallyPublished && !isEditing && (
              <Button 
                size="lg"
                className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all"
                onClick={handleIssue}
                disabled={loading || isIssued}
              >
                {loading ? "Menyimpan..." : isIssued ? "Pesanan Sudah Selesai (Issued)" : "✅ Tandai Selesai & Lunas"}
              </Button>
            )}

            <Button 
              variant="ghost" 
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30" 
            >
              <Ban className="w-4 h-4 mr-2" /> Batalkan Pesanan
            </Button>
          </CardFooter>
        </Card>

        {/* Communication Card */}
        <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl ring-1 ring-slate-200 dark:ring-slate-800">
          <CardHeader className="pb-4">
             <CardTitle className="text-base text-slate-800 dark:text-slate-200">Komunikasi Pelanggan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              size="lg"
              variant="outline" 
              className="w-full h-12 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400" 
              onClick={handleChatWA}
            >
              <MessageCircle className="w-4 h-4 mr-2" /> Chat WhatsApp
            </Button>
            
            <Button 
              size="lg"
              variant="outline" 
              className="w-full h-12 bg-white/50 hover:bg-white dark:bg-transparent dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400" 
              onClick={handleCopy}
            >
              <Copy className="w-4 h-4 mr-2" /> Salin Penawaran
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
