"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const ThreeBackground = dynamic(() => import("./ThreeBackground"), { ssr: false });

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
      { label: "Email", desc: "info@macanputih.id", href: "#footer", Icon: IcoMail },
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
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navStyle: React.CSSProperties = {
    transition:
      "width 600ms cubic-bezier(0.4,0,0.2,1), border-radius 600ms cubic-bezier(0.4,0,0.2,1), background-color 600ms cubic-bezier(0.4,0,0.2,1), box-shadow 600ms cubic-bezier(0.4,0,0.2,1), margin-top 600ms cubic-bezier(0.4,0,0.2,1), height 600ms cubic-bezier(0.4,0,0.2,1), padding-left 600ms cubic-bezier(0.4,0,0.2,1), padding-right 600ms cubic-bezier(0.4,0,0.2,1)",
    willChange: "width, border-radius, background-color, margin-top, height",
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
                    transition: "color 600ms cubic-bezier(0.4,0,0.2,1), font-size 600ms cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  Macan Putih
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

            {/* Profile icon */}
            <div className="flex justify-end flex-1">
              <Link href="/penawaran">
              <button
                className="group flex items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  width: scrolled ? "34px" : "38px",
                  height: scrolled ? "34px" : "38px",
                  background: "linear-gradient(135deg,#C9A84C,#8B6914)",
                  boxShadow: "0 2px 12px rgba(201,168,76,0.3)",
                  color: "#fff",
                  transition:
                    "width 600ms cubic-bezier(0.4,0,0.2,1), height 600ms cubic-bezier(0.4,0,0.2,1)",
                }}
                title="Login / Akun"
              >
                <IconUser />
              </button>
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        id="banner"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white"
      >
        <ThreeBackground />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-6">
            Solusi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#F5E6B8] to-[#C9A84C]">
              B2B
            </span>
            <br />
            Umrah Terpercaya
          </h1>

          {/* Subheadline */}
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            Kami menyederhanakan proses pemesanan paket hotel, transportasi, dan layanan Umrah
            untuk travel agent & agen perjalanan di seluruh Indonesia.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/penawaran">
              <button className="px-8 py-4 rounded-xl font-bold text-[#0D1117] bg-gradient-to-r from-[#C9A84C] to-[#E8C96C] hover:from-[#E8C96C] hover:to-[#C9A84C] transition-all duration-300 shadow-xl shadow-[#C9A84C]/30 hover:shadow-[#C9A84C]/50 hover:-translate-y-1 text-base tracking-wide">
                Minta Penawaran Sekarang
              </button>
            </Link>
            <a href="#product">
              <button className="px-8 py-4 rounded-xl font-semibold text-slate-600 border border-slate-200 hover:border-[#C9A84C]/60 hover:text-[#8B6914] hover:bg-amber-50 transition-all duration-300 text-base">
                Lihat Layanan →
              </button>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-20 flex flex-col sm:flex-row gap-8 justify-center items-center">
            {[
              { value: "500+", label: "Travel Partner" },
              { value: "50K+", label: "Jamaah Terlayani" },
              { value: "10+", label: "Tahun Pengalaman" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8C96C]">
                  {s.value}
                </p>
                <p className="text-slate-500 text-sm font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-black text-xs font-semibold tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-black to-transparent animate-pulse" />
        </div>
      </section>
    </>
  );
}
