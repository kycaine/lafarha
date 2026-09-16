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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Calculate Order: {order.id}</h1>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">{order.client_name}</span>
              <span>•</span>
              <span>{order.client_whatsapp}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <div className="px-4 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm font-semibold border border-blue-200 dark:border-blue-800/50 shadow-sm">
              Status: {order.status}
            </div>
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
