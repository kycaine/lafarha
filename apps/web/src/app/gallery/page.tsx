import type { Metadata } from "next";
import GallerySection from "../components/home/GallerySection";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Galeri Dokumentasi Land Arrangement Umrah — LA Farha",
  description:
    "Dokumentasi visual pelayanan jamaah Umrah di Tanah Suci, handling bandara, akomodasi hotel Makkah & Madinah bintang 3-5, serta armada transportasi bus.",
  alternates: {
    canonical: "https://lafarha.id/gallery",
  },
  openGraph: {
    title: "Galeri Dokumentasi Land Arrangement Umrah — LA Farha",
    description:
      "Dokumentasi visual pelayanan jamaah Umrah di Tanah Suci, handling bandara, akomodasi hotel Makkah & Madinah bintang 3-5, serta armada transportasi bus.",
    url: "https://lafarha.id/gallery",
    siteName: "LA Farha",
    locale: "id_ID",
    type: "website",
  },
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white">
      <Header />

      <div className="flex-1 pt-10 min-h-screen">
        <header className="text-center mb-6 px-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-slate-900 dark:text-white mb-2">
            Galeri Dokumentasi Layanan
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Bukti nyata dedikasi dan kualitas operasional Land Arrangement Umrah di Makkah, Madinah, dan Jeddah.
          </p>
        </header>
        <GallerySection />
      </div>
      <Footer />
    </main>
  );
}
