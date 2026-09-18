import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-2">Akses Ditolak</h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Akun Anda tidak memiliki izin untuk mengakses halaman ini. Hubungi administrator jika Anda merasa ini adalah kesalahan.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/settings"
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
          >
            Lihat Akun Saya
          </Link>
        </div>
      </div>
    </main>
  );
}
