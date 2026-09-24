"use client";

import Link from "next/link";
import { PackageSearch, ListOrdered, Users, Shield, Settings, LogOut, ChevronDown, User, PhoneCall } from "lucide-react";
import { useAuth } from "@/shared/AuthContext";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

function LogoutConfirmModal({ onConfirm, onCancel, loading }: {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
      {/* Dialog */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 w-full max-w-sm">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
          <LogOut className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="text-center text-base font-bold text-slate-800 mb-1">Keluar dari Akun?</h2>
        <p className="text-center text-sm text-slate-500 mb-6">
          Anda akan diarahkan ke halaman login. Sesi Anda akan berakhir.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : null
            }
            {loading ? "Keluar..." : "Ya, Keluar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    await signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <nav className="bg-white dark:bg-[#111] border-b border-slate-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 w-full">
            <div className="font-bold text-xl text-emerald-600 dark:text-emerald-500 flex justify-between w-full md:w-auto">
              LA Umrah Admin
              <Link href="/" className="md:hidden text-sm text-slate-500 hover:text-emerald-500 font-normal">Halaman Depan ↗</Link>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
              <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors">
                <ListOrdered className="w-4 h-4" /> Pipeline Orders
              </Link>
              <Link href="/admin/products" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors">
                <PackageSearch className="w-4 h-4" /> Manajemen Layanan (CMS)
              </Link>
              <Link href="/admin/mitra" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors">
                <Users className="w-4 h-4" /> Manajemen Mitra
              </Link>
              <Link href="/admin/kontak" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors">
                <PhoneCall className="w-4 h-4" /> Kontak &amp; Sosmed
              </Link>
              {userProfile?.role === "master" && (
                <Link href="/admin/users" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-purple-600 transition-colors">
                  <Shield className="w-4 h-4" /> Manajemen User
                </Link>
              )}
            </div>
          </div>

          {/* User Avatar Dropdown */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link href="/" className="text-sm text-slate-500 hover:text-emerald-500 whitespace-nowrap">
              Buka Halaman Depan ↗
            </Link>

            {user && (
              <div className="relative pl-3 border-l border-slate-200" ref={dropdownRef}>
                {/* Trigger Button */}
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName ?? ""} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-700 leading-tight">{user.displayName}</p>
                    <p className="text-[10px] text-slate-400 leading-tight capitalize">{userProfile?.role ?? "..."}</p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Panel */}
                <div
                  style={{
                    opacity: dropdownOpen ? 1 : 0,
                    transform: dropdownOpen ? "translateY(0) scale(1)" : "translateY(-6px) scale(0.97)",
                    pointerEvents: dropdownOpen ? "auto" : "none",
                    transition: "opacity 180ms ease, transform 180ms ease",
                  }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/60 overflow-hidden z-50"
                >
                  {/* User info mini */}
                  <div className="px-4 py-3 border-b border-slate-50">
                    <p className="text-xs font-semibold text-slate-700 truncate">{user.displayName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <Link
                      href="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      Pengaturan
                    </Link>

                    <div className="border-t border-slate-50 my-1" />

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {children}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <LogoutConfirmModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
          loading={loggingOut}
        />
      )}
    </div>
  );
}
