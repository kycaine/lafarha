"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getOrderById } from "@/modules/ordering/actions";
import { CalculateForm } from "@/modules/ordering/components/CalculateForm";

function CalculatePageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getOrderById(id).then(res => {
        setData(res);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data) return <div className="p-6">Order Not Found</div>;

  const { items, ...order } = data;

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-white dark:bg-black p-4 rounded-xl shadow-sm">
          <div>
            <h1 className="text-xl font-bold">Calculate Order: {order.id}</h1>
            <p className="text-sm text-slate-500">Client: {order.client_name} ({order.client_whatsapp})</p>
          </div>
          <div className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs font-semibold">
            Status: {order.status}
          </div>
        </header>

        <CalculateForm order={order} items={items || []} />
      </div>
    </main>
  );
}

export default function CalculatePage() {
  return (
    <Suspense fallback={<div className="p-6">Loading Page...</div>}>
      <CalculatePageContent />
    </Suspense>
  );
}
