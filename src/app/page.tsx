import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">LA - Macan Putih</h1>
          <p className="text-slate-500 mt-2">Pilih halaman yang ingin Anda tuju untuk testing.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/penawaran">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-emerald-600 hover:bg-emerald-700">
              🛒 Ke Halaman Produk
            </Button>
          </Link>
          <Link href="/admin/products">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg border-emerald-600 text-emerald-700 hover:bg-emerald-50">
              ⚙️ Ke CMS Admin
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
