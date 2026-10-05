import Link from "next/link";
import GallerySection from "../components/home/GallerySection";

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white">
      {/* Navbar */}
      <nav className="w-full bg-white dark:bg-black/80 border-b border-slate-200 dark:border-white/10 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src="/farha-logo-only.svg"
              alt="FARHA Logo"
              className="w-9 h-9"
            />
            <div className="leading-tight">
              <span
                className="font-bold tracking-wide block text-[15px] text-slate-900 dark:text-white"
                style={{ fontFamily: 'var(--font-cinzel), serif' }}
              >
                FARHA
              </span>
              <span className="font-medium tracking-[0.2em] uppercase block text-[10px] text-[#C9A84C]">
                Umrah Services
              </span>
            </div>
          </Link>
          <div className="text-sm font-medium flex gap-4">
            <Link href="/" className="hover:text-emerald-500 transition-colors group flex items-center">
              <svg
                className="w-4 h-4 mr-2 transition-all duration-500 group-hover:w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                preserveAspectRatio="xMaxYMid meet"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Beranda</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-10">
        <GallerySection />
      </div>
    </main>
  );
}
