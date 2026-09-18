"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithGoogle } from "@/lib/auth";
import { useAuth } from "@/shared/AuthContext";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const next = searchParams.get("next") ?? "/";
  const isUnauthorized = searchParams.get("error") === "unauthorized";

  // Jika sudah login, redirect langsung
  useEffect(() => {
    if (!loading && user) {
      router.replace(next);
    }
  }, [user, loading, next, router]);

  const handleLogin = async () => {
    setSigning(true);
    setError(null);
    try {
      await signInWithGoogle();
      // AuthContext akan set cookie dan profile, lalu useEffect redirect
    } catch (err: any) {
      console.error(err);
      setError("Login gagal. Silakan coba lagi.");
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-amber-50 px-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#C9A84C]/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-amber-500/10 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/60 border border-white/60 p-10 flex flex-col items-center gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center shadow-lg shadow-[#C9A84C]/30">
              <span className="text-white font-black text-2xl tracking-tight" style={{ fontFamily: 'var(--font-cinzel), serif' }}>K</span>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-slate-800 tracking-wide" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Kanza</p>
              <p className="text-[#C9A84C] text-[11px] font-semibold tracking-[0.25em] uppercase">Land Arrangement Umrah</p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Masuk ke Platform</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              {isUnauthorized
                ? "Akun Anda tidak memiliki akses ke halaman tersebut."
                : "Login diperlukan untuk melanjutkan."}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="w-full bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Google Button */}
          <button
            onClick={handleLogin}
            disabled={signing}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-[#C9A84C]/50 hover:shadow-md hover:shadow-[#C9A84C]/10 text-slate-700 font-semibold py-3.5 px-6 rounded-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {signing ? (
              <div className="w-5 h-5 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {signing ? "Menghubungkan..." : "Login dengan Google"}
          </button>

          <p className="text-xs text-slate-400 text-center leading-relaxed">
            Dengan login, Anda menyetujui syarat dan ketentuan layanan Kanza.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
