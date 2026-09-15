"use client";

import { ProductCatalog } from "@/modules/catalog/components/ProductCatalog";
import Link from "next/link";
import { getProducts } from "@/modules/catalog/product-actions";
import { useEffect, useState } from "react";

export default function PenawaranPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white">
      {/* Navbar */}
      <nav className="w-full bg-white dark:bg-black/80 border-b border-slate-200 dark:border-white/10 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">
              LA
            </div>
            <span className="text-xl font-bold tracking-tight">Umrah Premium</span>
          </Link>
          <div className="text-sm font-medium">
            <Link href="/" className="hover:text-emerald-500 transition-colors">Kembali ke Beranda</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Rakit Paket LA Umrah Anda
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Pilih satu atau beberapa layanan sekaligus (Hotel, Tiket, Bus, Visa). Form detail akan muncul secara otomatis di bawah sesuai pilihan Anda.
          </p>
        </header>

        <ProductCatalog initialProducts={products} />
      </div>
    </main>
  );
}
