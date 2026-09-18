"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/shared/AuthContext";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";

// ── Monochrome SVG icons ──────────────────────────────────────────────────────
const IcoHotel = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const IcoBus = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>;
const IcoFlight = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" /></svg>;
const IcoVisa = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>;
const IcoStar = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
const IcoGuide = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>;
const IcoBuilding = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="1" /><path d="M9 3v18M3 9h18M3 15h18" /></svg>;
const IcoPhone = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" /></svg>;
const IcoMail = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" /></svg>;
const IcoPin = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>;
const IcoMenu = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const IcoClose = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

type IconComp = () => React.JSX.Element;

// ── Dropdown definitions ──────────────────────────────────────────────────────
const NAV_LINKS: { label: string; href: string; dropdown: { label: string; desc: string; href: string; Icon: IconComp }[] }[] = [
  {
    label: "Produk",
    href: "#product",
    dropdown: [
      { label: "Akomodasi Hotel", desc: "Bintang 3–5 Makkah & Madinah", href: "#product", Icon: IcoHotel },
      { label: "Transportasi Darat", desc: "Bus & coaster premium", href: "#product", Icon: IcoBus },
      { label: "Tiket Penerbangan", desc: "Garuda & Arab airlines", href: "#product", Icon: IcoFlight },
      { label: "Visa & Dokumen", desc: "Pengurusan resmi & cepat", href: "#product", Icon: IcoVisa },
      { label: "Layanan Tambahan", desc: "Ziarah, VIP handling, guide", href: "#product", Icon: IcoStar },
      { label: "Muthawif & Guide", desc: "Pembimbing bersertifikat KEMENAG", href: "#product", Icon: IcoGuide },
    ],
  },
  {
    label: "Mitra",
    href: "#mitra",
    dropdown: [
      { label: "Mitra Maskapai", desc: "Garuda, Saudi Airlines & lainnya", href: "#mitra", Icon: IcoFlight },
      { label: "Mitra Hotel", desc: "Pullman, Movenpick & premium lainnya", href: "#mitra", Icon: IcoHotel },
      { label: "Mitra Transportasi", desc: "Naqaba & armada terpercaya", href: "#mitra", Icon: IcoBus },
      { label: "Institusi Resmi", desc: "KEMENAG RI & Al Rajhi Bank", href: "#mitra", Icon: IcoBuilding },
    ],
  },
  {
    label: "Kontak",
    href: "#footer",
    dropdown: [
      { label: "WhatsApp", desc: "+62 812 3456 7890", href: "#footer", Icon: IcoPhone },
      { label: "Email", desc: "info@kanza.id", href: "#footer", Icon: IcoMail },
      { label: "Kantor Jakarta", desc: "Jakarta Selatan, Indonesia", href: "#footer", Icon: IcoPin },
    ],
  },
];

const IconUser = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

// ── NavItem with dropdown ─────────────────────────────────────────────────────
function NavItem({
  link,
  scrolled,
}: {
  link: (typeof NAV_LINKS)[0];
  scrolled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      {/* Trigger */}
      <a
        href={link.href}
        className="text-sm font-medium transition-colors duration-300 hover:text-[#C9A84C] select-none"
        style={{ color: scrolled ? "rgba(255,255,255,0.65)" : "#475569" }}
      >
        {link.label}
      </a>

      {/* Dropdown panel */}
      <div
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0px) scale(1)" : "translateY(-6px) scale(0.98)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 200ms ease, transform 200ms ease",
          transformOrigin: "top center",
        }}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50"
      >
        {/* Arrow */}
        <div
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-l border-t"
          style={{
            background: scrolled ? "#242424" : "#fff",
            borderColor: scrolled ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
          }}
        />

        <div
          className="relative rounded-2xl border overflow-hidden min-w-[240px] shadow-2xl"
          style={{
            background: scrolled ? "#242424" : "#fff",
            borderColor: scrolled ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
            boxShadow: scrolled
              ? "0 24px 60px rgba(0,0,0,0.45)"
              : "0 16px 48px rgba(0,0,0,0.12)",
          }}
        >
          {link.dropdown.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              className="group flex items-center gap-3 px-4 py-3 transition-colors duration-150"
              style={{
                borderTop: i > 0
                  ? `1px solid ${scrolled ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`
                  : "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = scrolled
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(201,168,76,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              <div
                className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg"
                style={{
                  background: scrolled ? "rgba(255,255,255,0.07)" : "rgba(201,168,76,0.08)",
                  color: scrolled ? "rgba(255,255,255,0.55)" : "#8B6914",
                }}
              >
                <item.Icon />
              </div>
              <div>
                <p
                  className="text-sm font-semibold leading-tight"
                  style={{ color: scrolled ? "rgba(255,255,255,0.9)" : "#1e293b" }}
                >
                  {item.label}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: scrolled ? "rgba(255,255,255,0.4)" : "#94a3b8" }}
                >
                  {item.desc}
                </p>
              </div>
              {/* Arrow on hover */}
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BannerSection() {
  const { user } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    await signOut();
    router.push("/login");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navStyle: React.CSSProperties = {
    transition:
      "opacity 600ms cubic-bezier(0.4,0,0.2,1), width 600ms cubic-bezier(0.4,0,0.2,1), border-radius 600ms cubic-bezier(0.4,0,0.2,1), background-color 600ms cubic-bezier(0.4,0,0.2,1), box-shadow 600ms cubic-bezier(0.4,0,0.2,1), margin-top 600ms cubic-bezier(0.4,0,0.2,1), height 600ms cubic-bezier(0.4,0,0.2,1), padding-left 600ms cubic-bezier(0.4,0,0.2,1), padding-right 600ms cubic-bezier(0.4,0,0.2,1)",
    willChange: "opacity, width, border-radius, background-color, margin-top, height",
    width: scrolled ? "min(760px, calc(100vw - 2rem))" : "100%",
    borderRadius: scrolled ? "1rem" : "0px",
    marginTop: scrolled ? "12px" : "0px",
    height: scrolled ? "48px" : "64px",
    paddingLeft: scrolled ? "20px" : "32px",
    paddingRight: scrolled ? "20px" : "32px",
    backgroundColor: scrolled ? "rgba(28,28,30,0.96)" : "transparent",
    boxShadow: scrolled
      ? "0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.06)"
      : "none",
    backdropFilter: scrolled ? "blur(24px) saturate(1.5)" : "none",
    WebkitBackdropFilter: scrolled ? "blur(24px) saturate(1.5)" : "none",
    opacity: 1,
    pointerEvents: "auto",
    fontFamily: '"Times New Roman", Times, serif',
    letterSpacing: "0.02em",
  };

  return (
    <>
      {/* ── Navbar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto overflow-visible" style={navStyle}>
          <div className="h-full flex items-center justify-between">

            {/* Logo */}
            <div className="flex items-center gap-2.5 flex-1">
              <div
                className="rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center shadow-md shadow-[#C9A84C]/30"
                style={{
                  width: scrolled ? "28px" : "36px",
                  height: scrolled ? "28px" : "36px",
                  transition: "width 600ms cubic-bezier(0.4,0,0.2,1), height 600ms cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                <span
                  className="text-white font-bold tracking-tight"
                  style={{
                    fontSize: scrolled ? "10px" : "13px",
                    transition: "font-size 600ms cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  LA
                </span>
              </div>
              <div className="leading-tight">
                <span
                  className="font-bold tracking-wide block"
                  style={{
                    color: scrolled ? "#fff" : "#1e293b",
                    fontSize: scrolled ? "11px" : "13px",
                    fontFamily: 'var(--font-cinzel), serif',
                    transition: "color 600ms cubic-bezier(0.4,0,0.2,1), font-size 600ms cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  Kanza
                </span>
                <span
                  className="font-medium tracking-[0.2em] uppercase block"
                  style={{
                    color: "#C9A84C",
                    fontSize: scrolled ? "7px" : "9px",
                    transition: "font-size 600ms cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  Umrah Services
                </span>
              </div>
            </div>

            {/* Nav links with dropdowns */}
            <div className="hidden md:flex items-center justify-center gap-7 flex-shrink-0">
              {NAV_LINKS.map((l) => (
                <NavItem key={l.label} link={l} scrolled={scrolled} />
              ))}
            </div>

            {/* Profile icon (Desktop) */}
            <div className="hidden md:flex justify-end flex-1">
              {user ? (
                // Sudah login — dropdown
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileDropdown((v) => !v)}
                    className="flex items-center gap-2.5 focus:outline-none group"
                    title={user.displayName ?? "Akun"}
                  >
                    {/* Foto profil */}
                    <div
                      className="flex-shrink-0 flex items-center justify-center rounded-full overflow-hidden border-2 border-white/60 shadow-md"
                      style={{
                        width: scrolled ? "30px" : "34px",
                        height: scrolled ? "30px" : "34px",
                        transition: "width 600ms cubic-bezier(0.4,0,0.2,1), height 600ms cubic-bezier(0.4,0,0.2,1)",
                        background: user.photoURL ? "transparent" : "linear-gradient(135deg,#C9A84C,#8B6914)",
                      }}
                    >
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName ?? "Profil"}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <IconUser />
                      )}
                    </div>

                    {/* Nama + Email */}
                    <div className="text-left leading-tight hidden lg:block">
                      <p
                        className="text-xs font-semibold truncate max-w-[120px]"
                        style={{ color: scrolled ? "rgba(255,255,255,0.9)" : "#1e293b" }}
                      >
                        {user.displayName ?? "Pengguna"}
                      </p>
                      <p
                        className="text-[10px] truncate max-w-[120px]"
                        style={{ color: scrolled ? "rgba(255,255,255,0.5)" : "#94a3b8" }}
                      >
                        {user.email ?? ""}
                      </p>
                    </div>

                    {/* Chevron */}
                    <svg
                      width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className="flex-shrink-0 hidden lg:block transition-transform duration-200"
                      style={{
                        color: scrolled ? "rgba(255,255,255,0.4)" : "#94a3b8",
                        transform: profileDropdown ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  <div
                    style={{
                      opacity: profileDropdown ? 1 : 0,
                      transform: profileDropdown ? "translateY(0) scale(1)" : "translateY(-6px) scale(0.97)",
                      pointerEvents: profileDropdown ? "auto" : "none",
                      transition: "opacity 180ms ease, transform 180ms ease",
                    }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/60 overflow-hidden z-50"
                  >
                    {/* User info mini */}
                    <div className="px-4 py-3 border-b border-slate-50">
                      <p className="text-xs font-semibold text-slate-700 truncate">{user.displayName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/settings"
                        onClick={() => setProfileDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                        Pengaturan
                      </Link>
                      <div className="border-t border-slate-50 my-1" />
                      <button
                        onClick={() => { setProfileDropdown(false); setShowLogoutModal(true); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Keluar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Belum login — icon generik, klik ke login
                <Link href="/login">
                  <button
                    className="group flex items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    style={{
                      width: scrolled ? "34px" : "38px",
                      height: scrolled ? "34px" : "38px",
                      background: "linear-gradient(135deg,#C9A84C,#8B6914)",
                      boxShadow: "0 2px 12px rgba(201,168,76,0.3)",
                      color: "#fff",
                      transition: "width 600ms cubic-bezier(0.4,0,0.2,1), height 600ms cubic-bezier(0.4,0,0.2,1)",
                    }}
                    title="Login"
                  >
                    <IconUser />
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden justify-end flex-1">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 transition-colors duration-300"
                style={{ color: scrolled ? "#fff" : "#1e293b" }}
              >
                <IcoMenu />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* ── Mobile Menu Backdrop (Click Outside to Close) ── */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-sm transition-opacity" 
          onClick={() => setMobileMenuOpen(false)} 
        />
      )}

      {/* ── Mobile Menu Dropdown ── */}
      <div 
        className={`fixed top-16 right-4 md:hidden z-[60] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden min-w-[220px] flex flex-col transition-all duration-300 origin-top-right ${mobileMenuOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        <div className="flex flex-col py-2">
          {NAV_LINKS.map(l => (
            <a 
              key={l.label} 
              href={l.href} 
              onClick={() => setMobileMenuOpen(false)} 
              className="px-5 py-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#C9A84C] transition-colors flex items-center"
            >
              {l.label}
            </a>
          ))}
          <div className="border-t border-slate-100 my-1"></div>
          <Link href="/penawaran" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3">
             <button className="w-full py-3 bg-gradient-to-r from-[#C9A84C] to-[#8B6914] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-[#C9A84C]/20 hover:-translate-y-0.5 transition-all">
               <IconUser /> Profil / Layanan
             </button>
          </Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        id="banner"
        className="relative min-h-screen flex flex-col overflow-hidden bg-white"
      >
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* Desktop Video */}
          <video autoPlay loop muted playsInline className="w-full h-full object-cover hidden sm:block" src="/banner.mp4" />
          {/* Mobile Video */}
          <video autoPlay loop muted playsInline className="w-full h-full object-cover block sm:hidden" src="/banner-hp.mp4" />
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-start sm:justify-center text-center px-4 mx-auto w-full overflow-hidden">
          <div className="w-max mx-auto flex flex-col mt-[20vh] sm:mt-0">
            {/* Headline */}
            <h1 
              className="text-[25vw] sm:text-[22vw] md:text-[20vw] lg:text-[18vw] font-black text-[#1a1a1a] leading-none tracking-tighter whitespace-nowrap"
              style={{ fontFamily: 'var(--font-cinzel), serif' }}
            >
              KANZA
            </h1>
            {/* Subtitle */}
            <p 
              className="w-full text-right text-2xl sm:text-3xl md:text-4xl font-normal text-[#1a1a1a] tracking-wide -mt-4 sm:-mt-6 md:-mt-8 lg:-mt-10"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              Land Arrangement Umrah Service
            </p>
          </div>
        </div>

        {/* CTAs mentok di bawah */}
        <div className="absolute bottom-[10vh] left-0 right-0 z-10 w-full px-4 flex flex-row flex-nowrap gap-2 sm:gap-4 justify-center items-center">
          <Link href="/penawaran">
            <button className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-black opacity-40 bg-transparent border border-black hover:opacity-100 transition-all duration-300 text-xs sm:text-sm tracking-wide whitespace-nowrap">
              Penawaran
            </button>
          </Link>
        </div>
      </section>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 w-full max-w-sm">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </div>
            <h2 className="text-center text-base font-bold text-slate-800 mb-1">Keluar dari Akun?</h2>
            <p className="text-center text-sm text-slate-500 mb-6">Sesi Anda akan berakhir dan diarahkan ke halaman login.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} disabled={loggingOut} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50">Batal</button>
              <button onClick={handleLogoutConfirm} disabled={loggingOut} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loggingOut ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                {loggingOut ? "Keluar..." : "Ya, Keluar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
