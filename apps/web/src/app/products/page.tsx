"use client";

import { ProductCatalog } from "@/modules/catalog/components/ProductCatalog";
import Link from "next/link";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getProducts } from "@/modules/catalog/product-actions";
import { useEffect, useState } from "react";

export default function PenawaranPage() {
  const [products, setProducts] = useState<any[]>([]);
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
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white">
      <Header />

      <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-6 xl:px-8 pt-6 pb-12 min-h-screen">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 font-heading">
            Katalog Modul Land Arrangement Umrah
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Sesuaikan kebutuhan travel agent Anda. Pilih beberapa layanan sekaligus mulai dari Hotel Makkah & Madinah, Tiket Pesawat, Transportasi Bus, hingga Pengurusan Visa resmi.
          </p>
        </header>

        <ProductCatalog initialProducts={products} />
      </div>
      <Footer />
    </main>
  );
}
