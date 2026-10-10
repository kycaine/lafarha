"use client";

import Link from "next/link";
import { ListOrdered, Users, Shield, Settings, LogOut, ChevronDown, User, PhoneCall, Menu, Home, X } from "lucide-react";
import { useAuth } from "@/shared/AuthContext";
import { signOut } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAlert } from "@/shared/AlertContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { showAlert } = useAlert();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    showAlert({
      title: "Keluar dari Akun?",
      message: "Anda akan diarahkan ke halaman login. Sesi Anda akan berakhir.",
      type: "error", // red color
      showCancel: true,
      cancelText: "Batal",
      confirmText: "Ya, Keluar",
      onConfirm: async () => {
        await signOut();
        router.push("/login");
      }
    });
  };

  const menuItems = [
    { label: "Pipeline Orders", href: "/admin/dashboard", icon: ListOrdered },
    { label: "Manajemen Mitra", href: "/admin/mitra", icon: Users },
    { label: "Manajemen Muthawif", href: "/admin/muthawif", icon: Users },
    { label: "Kontak & Sosmed", href: "/admin/kontak", icon: PhoneCall },
  ];

  if (userProfile?.role === "master") {
    menuItems.push({ label: "Manajemen User", href: "/admin/users", icon: Shield });
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex">
      {/* Desktop Sidebar */}
      <aside className={`bg-white dark:bg-[#111] border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex-col z-40 hidden md:flex sticky top-0 h-screen ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between h-[73px] shrink-0">
          <Link href="/admin/dashboard" className={`font-bold text-xl text-emerald-600 dark:text-emerald-500 truncate px-2 transition-all ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
            LA Admin
          </Link>
          {!sidebarOpen && (
            <Link href="/admin/dashboard" className="font-bold text-xl text-emerald-600 dark:text-emerald-500 mx-auto">
              LA
            </Link>
          )}
        </div>

        <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} title={item.label} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${isActive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <item.icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span className="truncate whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative bg-white dark:bg-[#111] w-64 h-full flex flex-col shadow-xl">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between h-[73px]">
              <span className="font-bold text-xl text-emerald-600 px-2">LA Admin</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 py-4 px-3 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${isActive ? 'bg-emerald-50 text-emerald-600 font-semibold' : 'text-slate-600'}`}>
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white dark:bg-[#111] border-b border-slate-200 dark:border-slate-800 h-[73px] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Desktop Toggle Button */}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors hidden md:block">
              <Menu className="w-5 h-5" />
            </button>
            {/* Mobile Toggle Button */}
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors md:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-semibold text-slate-800 dark:text-slate-200 md:hidden">LA Admin</span>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/" className="text-sm text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2 hidden sm:flex">
              <Home className="w-4 h-4" /> <span>Ke Halaman Depan</span>
            </Link>

            {/* User Dropdown */}
            {user && (
              <div className="relative pl-4 border-l border-slate-200 dark:border-slate-700" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName ?? ""} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                  )}
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight">{user.displayName}</p>
                    <p className="text-[10px] text-slate-400 leading-tight capitalize">{userProfile?.role ?? "..."}</p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 hidden md:block ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Panel */}
                <div
                  style={{
                    opacity: dropdownOpen ? 1 : 0,
                    transform: dropdownOpen ? "translateY(0) scale(1)" : "translateY(-6px) scale(0.97)",
                    pointerEvents: dropdownOpen ? "auto" : "none",
                    transition: "opacity 180ms ease, transform 180ms ease",
                  }}
                  className="absolute right-0 top-full mt-3 w-48 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/60 dark:shadow-none overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{user.displayName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
