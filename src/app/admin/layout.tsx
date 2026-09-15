import Link from "next/link";
import { PackageSearch, ListOrdered } from "lucide-react";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <nav className="bg-white dark:bg-[#111] border-b border-slate-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="font-bold text-xl text-emerald-600 dark:text-emerald-500">LA Umrah Admin</div>
            <div className="flex items-center gap-2">
              <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors">
                <ListOrdered className="w-4 h-4" /> Pipeline Orders
              </Link>
              <Link href="/admin/products" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors">
                <PackageSearch className="w-4 h-4" /> Manajemen Layanan (CMS)
              </Link>
            </div>
          </div>
          <div>
             <Link href="/" className="text-sm text-slate-500 hover:text-emerald-500">Buka Halaman Depan ↗</Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
