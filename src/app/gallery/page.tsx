import Link from "next/link";
import GallerySection from "../components/home/GallerySection";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function GalleryPage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white">
      <Header />

      <div className="flex-1 pt-10 min-h-screen">
        <GallerySection />
      </div>
      <Footer />
    </main>
  );
}
