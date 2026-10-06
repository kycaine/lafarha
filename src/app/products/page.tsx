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
    <main className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white">
      <Header />

      <div className="container mx-auto px-6 py-12">
        <header className="mb-12 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">
            Rancang Perjalanan Anda
          </h3>
          <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Bisa pilih beberapa layanan sekaligus
          </p>
        </header>

        <ProductCatalog initialProducts={products} />
      </div>
      <Footer />
    </main>
  );
}
