"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateOrderQuote } from "@/modules/ordering/actions";

export function CalculateForm({ order, items }: { order: any, items: any[] }) {
  const [sarRate, setSarRate] = useState(4300);
  const [markup, setMarkup] = useState(1000000); // Flat markup for demo
  const [loading, setLoading] = useState(false);

  const parsedSpecs = items.length > 0 ? JSON.parse(items[0].specs_json) : {};
  const pax = parsedSpecs.pax || 0;
  
  // Base cost per pax in SAR (just for demo purposes)
  const baseCostSAR = 1500; 
  
  const totalBaseCostIDR = pax * baseCostSAR * sarRate;
  const totalAmountIDR = totalBaseCostIDR + (pax * markup);

  const handlePublish = async () => {
    setLoading(true);
    const res = await updateOrderQuote(order.id, { totalAmount: totalAmountIDR });
    setLoading(false);
    if (res.success) {
      alert("Quote published successfully!");
      window.location.reload();
    } else {
      alert("Failed to publish quote: " + res.error);
    }
  };

  const handleCopy = () => {
    const text = `Halo ${order.client_name}, ini penawaran LA Umrah Anda.\n\nTotal Pax: ${pax}\nTotal Harga: Rp ${totalAmountIDR.toLocaleString("id-ID")}\n\nSilakan klik link berikut untuk konfirmasi: https://la-dev.pages.dev/quote?id=${order.id}`;
    navigator.clipboard.writeText(text);
    alert("Teks berhasil disalin ke clipboard!");
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Calculation Desk</CardTitle>
            <CardDescription>Rapidly calculate and publish quote for {order.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Live SAR to IDR Rate</Label>
                <Input 
                  type="number" 
                  value={sarRate} 
                  onChange={(e) => setSarRate(Number(e.target.value))} 
                />
              </div>
              <div className="space-y-2">
                <Label>Markup per PAX (IDR)</Label>
                <Input 
                  type="number" 
                  value={markup} 
                  onChange={(e) => setMarkup(Number(e.target.value))} 
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold mb-2">Requested Specifications:</h4>
              <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                <li>Total Jamaah (PAX): <strong>{pax}</strong></li>
                <li>Hotel Rating: <strong>{parsedSpecs.hotelRating} Stars</strong></li>
                <li>Notes: {parsedSpecs.notes}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="bg-slate-50 dark:bg-slate-900 border-emerald-500/50">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Base Cost (SAR)</span>
              <span>{baseCostSAR * pax} SAR</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Base Cost (IDR)</span>
              <span>Rp {totalBaseCostIDR.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Markup</span>
              <span>Rp {(markup * pax).toLocaleString("id-ID")}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg text-emerald-600">
                <span>Total Client Price</span>
                <span>Rp {totalAmountIDR.toLocaleString("id-ID")}</span>
              </div>
            </div>
            <div className="space-y-2 pt-4">
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" 
                onClick={handlePublish}
                disabled={loading || order.status === 'QUOTATION_READY'}
              >
                {loading ? "Publishing..." : order.status === 'QUOTATION_READY' ? "Already Published" : "Publish Quote"}
              </Button>
              <Button variant="outline" className="w-full" onClick={handleCopy}>
                Copy WhatsApp Text
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
