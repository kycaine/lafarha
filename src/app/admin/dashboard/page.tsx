"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/modules/ordering/actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const columns = [
    { id: 'AWAITING_VERIFICATION', title: 'New (Awaiting WA)' },
    { id: 'CALCULATING', title: 'Calculating / In Review' },
    { id: 'QUOTATION_READY', title: 'Quotation Ready' },
    { id: 'DEAL_CLOSED', title: 'Deal Closed' }
  ];

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <main className="p-6 pt-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight">Pipeline Orders</h1>
          <p className="text-slate-500">Manage LA Umrah quotations and deals.</p>
        </header>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map(col => (
            <div key={col.id} className="w-80 flex-shrink-0 space-y-4">
              <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300 px-1">
                <span>{col.title}</span>
                <span className="bg-slate-200 dark:bg-slate-800 rounded-full px-2 py-0.5 text-xs">
                  {orders.filter((o: any) => o.status === col.id || (col.id === 'CALCULATING' && o.status === 'AWAITING_VERIFICATION')).length}
                </span>
              </div>
              
              <div className="space-y-3">
                {orders
                  .filter((o: any) => o.status === col.id || (col.id === 'CALCULATING' && o.status === 'AWAITING_VERIFICATION'))
                  .map((order: any) => (
                    <Link key={order.id} href={`/admin/orders/calculate?id=${order.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm font-bold truncate">
                            {order.client_name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-xs text-slate-500 space-y-1">
                          <p>ID: {order.id}</p>
                          <p>WA: {order.client_whatsapp}</p>
                          <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
