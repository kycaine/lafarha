"use client";

import { useAuth } from "@/shared/AuthContext";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, Mail, Shield, LogOut, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

const ROLE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  master: { label: "Master", color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  admin:  { label: "Admin",  color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  counter:{ label: "Counter",color: "text-blue-700",    bg: "bg-blue-50 border-blue-200" },
  user:   { label: "User",   color: "text-slate-600",   bg: "bg-slate-50 border-slate-200" },
  muthawif: { label: "Muthawif", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
};

export default function SettingsPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const role = userProfile?.role ?? "user";
  const roleInfo = ROLE_LABELS[role] ?? ROLE_LABELS.user;
  const createdAt = userProfile?.created_at
    ? new Date(userProfile.created_at).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "—";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Pengaturan</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola informasi akun Anda.</p>
        </div>

        {/* Account Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">Akun Saya</span>
          </div>

          {/* Profile Section */}
          <div className="px-6 py-6 flex items-center gap-5 border-b border-slate-50">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName ?? ""}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border border-slate-100">
                <User className="w-7 h-7 text-slate-400" />
              </div>
            )}
            <div>
              <p className="text-lg font-bold text-slate-800">{user?.displayName ?? "—"}</p>
              <p className="text-sm text-slate-500">{user?.email ?? "—"}</p>
            </div>
          </div>

          {/* Fields */}
          <div className="divide-y divide-slate-50">
            <div className="px-6 py-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-500 shrink-0 w-36">
                <User className="w-4 h-4" />
                <span className="text-sm">Nama Lengkap</span>
              </div>
              <p className="text-sm font-medium text-slate-800 text-right">{user?.displayName ?? "—"}</p>
            </div>

            <div className="px-6 py-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-500 shrink-0 w-36">
                <Mail className="w-4 h-4" />
                <span className="text-sm">Email</span>
              </div>
              <p className="text-sm font-medium text-slate-800 text-right">{user?.email ?? "—"}</p>
            </div>

            <div className="px-6 py-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-500 shrink-0 w-36">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Role Akses</span>
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${roleInfo.bg} ${roleInfo.color}`}>
                {roleInfo.label}
              </span>
            </div>

            <div className="px-6 py-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-500 shrink-0 w-36">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Bergabung</span>
              </div>
              <p className="text-sm text-slate-500 text-right">{createdAt}</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4 text-center">
          Akun ini terhubung melalui Google. Ubah nama atau foto di akun Google Anda.
        </p>

        {/* Muthawif Actions */}
        {role === "muthawif" && (
          <div className="mt-8">
            <h2 className="text-sm font-bold text-slate-700 mb-3 px-1">Menu Muthawif</h2>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
              <Link href="/muthawif/profile" className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Ubah Data Publik</p>
                    <p className="text-xs text-slate-500 mt-0.5">Edit foto profil, domisili, dan portofolio Anda</p>
                  </div>
                </div>
                <div className="text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-sm transition-all duration-200 disabled:opacity-60"
          >
            {loggingOut
              ? <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              : <LogOut className="w-4 h-4" />
            }
            {loggingOut ? "Keluar..." : "Keluar dari Akun"}
          </button>
        </div>
      </div>
    </main>
  );
}
