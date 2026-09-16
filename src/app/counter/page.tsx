"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/modules/ordering/actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Calculator, ArrowRight, User, ChevronDown, ChevronUp } from "lucide-react";

export default function CalculatorDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [quotedOrders, setQuotedOrders] = useState<any[]>([]);
  const [issuedOrders, setIssuedOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuoted, setShowQuoted] = useState(true);
  const [showIssued, setShowIssued] = useState(true);

  useEffect(() => {
    getOrders().then(data => {
      // Filter ONLY orders that need calculation
      const pendingOrders = data.filter((o: any) => 
        o.status === 'AWAITING_VERIFICATION' || o.status === 'CALCULATING'
      );
      const quoted = data.filter((o: any) => 
        o.status === 'QUOTATION_READY'
      );
      const issued = data.filter((o: any) => 
        o.status === 'ISSUED' || o.status === 'CLOSED'
      );
      setOrders(pendingOrders);
      setQuotedOrders(quoted);
      setIssuedOrders(issued);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 pt-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Calculator className="w-8 h-8 text-blue-500" />
              Sales & Calculator Desk
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Select an incoming order below to calculate and generate a quote.</p>
          </div>
          <div className="mt-4 md:mt-0 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg font-semibold text-sm border border-blue-200 dark:border-blue-800/50">
            {orders.length} Orders Pending
          </div>
        </header>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400">All caught up!</h3>
            <p className="text-slate-500">There are no orders awaiting calculation at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order: any) => (
              <Link key={order.id} href={`/counter/calculate?id=${order.id}`}>
                <Card className="hover:shadow-lg transition-all cursor-pointer border-t-4 border-t-blue-500 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm group">
                  <CardHeader className="p-5 pb-3">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{order.client_name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-4">
                    <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                      <p><strong>Order ID:</strong> {order.id.slice(0, 8)}...</p>
                      <p><strong>WA:</strong> {order.client_whatsapp}</p>
                      <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300">
                      Calculate Quote <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {quotedOrders.length > 0 && (
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setShowQuoted(!showQuoted)}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-semibold text-lg hover:text-blue-600 transition-colors w-full text-left"
            >
              Penawaran Sudah Terbit ({quotedOrders.length})
              {showQuoted ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {showQuoted && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {quotedOrders.map((order: any) => (
                  <Link key={order.id} href={`/counter/calculate?id=${order.id}`}>
                    <Card className="hover:shadow-lg transition-all cursor-pointer border-t-4 border-t-amber-500 bg-slate-50 dark:bg-slate-900/40 backdrop-blur-sm group opacity-80 hover:opacity-100">
                      <CardHeader className="p-5 pb-3">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="truncate">{order.client_name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 pt-0 space-y-4">
                        <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                          <p><strong>Order ID:</strong> {order.id.slice(0, 15)}...</p>
                          <p><strong>WA:</strong> {order.client_whatsapp}</p>
                          <p><strong>Status:</strong> {order.status}</p>
                        </div>
                        
                        <div className="flex items-center text-amber-600 dark:text-amber-400 font-semibold text-sm group-hover:text-amber-700 dark:group-hover:text-amber-300">
                          Lihat Detail <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {issuedOrders.length > 0 && (
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setShowIssued(!showIssued)}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-semibold text-lg hover:text-emerald-600 transition-colors w-full text-left"
            >
              Penawaran Selesai & Lunas ({issuedOrders.length})
              {showIssued ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {showIssued && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {issuedOrders.map((order: any) => (
                  <Link key={order.id} href={`/counter/calculate?id=${order.id}`}>
                    <Card className="hover:shadow-lg transition-all cursor-pointer border-t-4 border-t-emerald-500 bg-slate-50 dark:bg-slate-900/40 backdrop-blur-sm group opacity-80 hover:opacity-100">
                      <CardHeader className="p-5 pb-3">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="truncate">{order.client_name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 pt-0 space-y-4">
                        <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                          <p><strong>Order ID:</strong> {order.id.slice(0, 15)}...</p>
                          <p><strong>WA:</strong> {order.client_whatsapp}</p>
                          <p><strong>Status:</strong> {order.status}</p>
                        </div>
                        
                        <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold text-sm group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                          Lihat Detail <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
