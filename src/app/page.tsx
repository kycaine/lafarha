import BannerSection from "./components/home/BannerSection";
import SeparatorLine from "./components/home/SeparatorLine";
import ProductSection from "./components/home/ProductSection";
import MitraSection from "./components/home/MitraSection";
import FooterSection from "./components/home/FooterSection";

export const metadata = {
  title: "LA Macan Putih — Platform Land Arrangement Umrah Terpercaya",
  description:
    "Platform B2B terpercaya untuk kebutuhan Land Arrangement Umrah. Hotel, transportasi, penerbangan, visa, dan muthawif dalam satu platform untuk travel agent di Indonesia.",
};

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <BannerSection />
      <SeparatorLine />
      <ProductSection />
      <MitraSection />
      <FooterSection />
      
      {/* Example Navigation Buttons */}
      <div className="bg-slate-950 py-6 px-6 flex justify-center gap-4 flex-wrap border-t border-slate-800">
        <Link href="/penawaran" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 text-sm font-medium transition-colors">
          Lihat Produk
        </Link>
        <Link href="/admin/dashboard" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 text-sm font-medium transition-colors">
          Admin Dashboard
        </Link>
        <Link href="/counter" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 text-sm font-medium transition-colors">
          Halaman Counter
        </Link>
      </div>
    </main>
  );
}
