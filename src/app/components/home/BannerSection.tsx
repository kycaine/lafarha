"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
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
const IcoHandling = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 20h0a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h0"/><path d="M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14"/><path d="M10 20h4"/><circle cx="16" cy="20" r="2"/><circle cx="8" cy="20" r="2"/></svg>;
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
    label: "Layanan",
    href: "#layanan",
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
    label: "Produk",
    href: "/products",
    dropdown: [
      { label: "Hotel", desc: "Pemesanan Hotel Bintang 3-5", href: "/products", Icon: IcoHotel },
      { label: "Tkt Pesawat Intr", desc: "Penerbangan Internasional", href: "/products", Icon: IcoFlight },
      { label: "Tkt Pesawat Domestik", desc: "Penerbangan Domestik", href: "/products", Icon: IcoFlight },
      { label: "Transportasi", desc: "Transportasi Bus & Mobil", href: "/products", Icon: IcoBus },
      { label: "Visa", desc: "Pengurusan Visa Umrah", href: "/products", Icon: IcoVisa },
      { label: "Visa & Transportasi", desc: "Paket bundling lengkap", href: "/products", Icon: IcoBus },
    ],
  },
  {
    label: "Blog",
    href: "/blog",
    dropdown: [],
  },
  {
    label: "Kontak",
    href: "#footer",
    dropdown: [
      { label: "WhatsApp", desc: "+62 812 3456 7890", href: "#footer", Icon: IcoPhone },
      { label: "Email", desc: "info@farha.id", href: "#footer", Icon: IcoMail },
      { label: "Kantor Jakarta", desc: "Jakarta Selatan, Indonesia", href: "#footer", Icon: IcoPin },
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
        className="text-[15px] font-medium transition-colors duration-300 hover:text-[#C9A84C] select-none drop-shadow-sm"
        style={{ color: scrolled ? "rgba(255,255,255,0.85)" : "#ffffff" }}
      >
        {link.label}
      </a>

      {/* Dropdown panel */}
      {link.dropdown.length > 0 && (
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
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

// ── Widget Product Ala Traveloka ───────────────────────────────────────────────
// ── Widget Product Ala Traveloka ───────────────────────────────────────────────
// ── Widget Product Ala Traveloka ───────────────────────────────────────────────
// ── Widget Product Ala Traveloka ───────────────────────────────────────────────
// ── Widget Product Ala Traveloka ───────────────────────────────────────────────
function BannerWidget() {
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  // Tab 0: Hotel
  const [hotelCity, setHotelCity] = useState("Mekah");
  const [hotelDate, setHotelDate] = useState("");

  // Tab 1: Pesawat
  const [flightRoute, setFlightRoute] = useState("JKT-JED");
  const [flightDate, setFlightDate] = useState("");

  // Tab 2: Transportasi
  const [transportType, setTransportType] = useState("Single trip");

  // Tab 3: Visa
  const [visaPax, setVisaPax] = useState("");
  const [visaType, setVisaType] = useState("Umrah");

  const TABS = [
    { label: "Hotel", icon: <IcoHotel /> },
    { label: "Tkt Pesawat", icon: <IcoFlight /> },
    { label: "Transportasi", icon: <IcoBus /> },
    { label: "Visa", icon: <IcoVisa /> },
    { label: "Handling", icon: <IcoHandling /> },
  ];


  const isFormValid = () => {
    if (activeTab === 0) return hotelDate !== "";
    if (activeTab === 1) return flightDate !== "";
    if (activeTab === 2) return transportType !== "";
    if (activeTab === 3) return visaPax !== "" && parseInt(visaPax) > 0;
    return true;
  };

  const handleSearch = () => {
    let url = "/products?";
    if (activeTab === 0) {
      url += `product=HOTEL&city=${encodeURIComponent(hotelCity)}&checkin=${encodeURIComponent(hotelDate)}`;
    } else if (activeTab === 1) {
      url += `product=FLIGHT_INTL&route=${encodeURIComponent(flightRoute)}&date=${encodeURIComponent(flightDate)}`;
    } else if (activeTab === 2) {
      url += `product=TRANSPORTASI&type=${encodeURIComponent(transportType)}`;
    } else if (activeTab === 3) {
      url += `product=VISA&type=${encodeURIComponent(visaType)}&pax=${encodeURIComponent(visaPax)}`;
    } else if (activeTab === 4) {
      url += `product=HANDLING`;
    }
    router.push(url);
  };

  const renderForm = () => {
    switch (activeTab) {
      case 0: // Hotel
        return (
          <>
            <div className="relative col-span-1 md:col-span-1 border border-slate-200 rounded-xl px-4 py-3 hover:border-[#C9A84C] focus-within:border-[#C9A84C] transition-colors cursor-pointer group flex flex-col justify-center">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Kota & Area</p>
              <div className="flex items-center gap-2 text-slate-800">
                <IcoPin />
                <span className="text-sm font-semibold truncate group-hover:text-[#8B6914] transition-colors">{hotelCity}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
              </div>
              <select
                value={hotelCity}
                onChange={(e) => setHotelCity(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
              >
                <option value="Mekah">Mekah</option>
                <option value="Madinah">Madinah</option>
              </select>
            </div>
            <div
              className="relative col-span-1 md:col-span-1 border border-slate-200 rounded-xl px-4 py-3 hover:border-[#C9A84C] focus-within:border-[#C9A84C] transition-colors cursor-pointer group flex flex-col justify-center"
              onClick={(e) => {
                const input = e.currentTarget.querySelector('input');
                try { if (input) input.showPicker(); } catch (err) { }
              }}
            >
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Jadwal Check-in</p>
              <div className="flex items-center gap-2 text-slate-800">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span className="text-sm font-semibold truncate group-hover:text-[#8B6914] transition-colors z-10">
                  {hotelDate ? new Date(hotelDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : "Pilih Tanggal"}
                </span>
                <input
                  type="date"
                  value={hotelDate}
                  onChange={(e) => setHotelDate(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
              </div>
            </div>
          </>
        );
      case 1: // Tkt Pesawat Intr
        return (
          <>
            <div className="relative col-span-1 md:col-span-1 border border-slate-200 rounded-xl px-4 py-3 hover:border-[#C9A84C] focus-within:border-[#C9A84C] transition-colors cursor-pointer group flex flex-col justify-center">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Rute Penerbangan</p>
              <div className="flex items-center gap-2 text-slate-800">
                <IcoFlight />
                <span className="text-sm font-semibold truncate group-hover:text-[#8B6914] transition-colors">{flightRoute}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
              </div>
              <select
                value={flightRoute}
                onChange={(e) => setFlightRoute(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
              >
                <option value="JKT-JED">JKT - JED</option>
                <option value="JKT-MED">JKT - MED</option>
              </select>
            </div>
            <div
              className="relative col-span-1 md:col-span-1 border border-slate-200 rounded-xl px-4 py-3 hover:border-[#C9A84C] focus-within:border-[#C9A84C] transition-colors flex flex-col justify-center cursor-pointer group"
              onClick={(e) => {
                const input = e.currentTarget.querySelector('input[type="date"]');
                try { if (input) (input as any).showPicker(); } catch (err) { }
              }}
            >
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Tgl Berangkat</p>
              <div className="flex items-center gap-2 text-slate-800">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span className="text-sm font-semibold truncate group-hover:text-[#8B6914] transition-colors z-10">
                  {flightDate ? new Date(flightDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : "Pilih Tanggal"}
                </span>
                <input
                  type="date"
                  value={flightDate}
                  onChange={(e) => setFlightDate(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
              </div>
            </div>
          </>
        );
      case 2: // Transportasi
        return (
          <>
            <div className="col-span-1 md:col-span-2 border border-slate-200 rounded-xl px-4 py-3 hover:border-[#C9A84C] transition-colors flex flex-col justify-center">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Jenis Perjalanan</p>
              <div className="flex w-full items-center gap-2 text-slate-800">
                {["Single trip", "Full trip", "Full trip ++"].map((type) => (
                  <label key={type} className={`flex-1 flex justify-center items-center gap-2 px-3 py-2.5 rounded-lg border transition-all cursor-pointer ${transportType === type ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#8B6914] shadow-sm" : "border-slate-200 hover:border-[#C9A84C]/50 text-slate-600 hover:text-slate-800"}`}>
                    <input
                      type="radio"
                      name="transportType"
                      value={type}
                      checked={transportType === type}
                      onChange={(e) => setTransportType(e.target.value)}
                      className="hidden"
                    />
                    <span className="text-xs font-bold">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        );
      case 3: // Visa
        return (
          <>
            <div className="relative col-span-1 md:col-span-1 border border-slate-200 rounded-xl px-4 py-3 hover:border-[#C9A84C] focus-within:border-[#C9A84C] transition-colors cursor-pointer group flex flex-col justify-center">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Jenis Visa</p>
              <div className="flex items-center gap-2 text-slate-800">
                <IcoVisa />
                <span className="text-sm font-semibold truncate group-hover:text-[#8B6914] transition-colors">{visaType}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
              </div>
              <select
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
              >
                <option value="Umrah">Umrah</option>
                <option value="Turis">Turis</option>
                <option value="Ziarah">Ziarah</option>
                <option value="Bisnis">Bisnis</option>
              </select>
            </div>
            <label className="col-span-1 md:col-span-1 border border-slate-200 rounded-xl px-4 py-3 hover:border-[#C9A84C] focus-within:border-[#C9A84C] transition-colors cursor-text group flex flex-col justify-center">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Jumlah Pax</p>
              <div className="flex items-center gap-2 text-slate-800">
                <IconUser />
                <input
                  type="number"
                  min="1"
                  placeholder="Contoh: 45"
                  value={visaPax}
                  onChange={(e) => {
                    // Prevent 0 or minus
                    const val = parseInt(e.target.value);
                    if (val < 1) setVisaPax("1");
                    else setVisaPax(e.target.value);
                  }}
                  className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-300 placeholder:font-normal group-hover:text-[#8B6914] transition-colors"
                />
              </div>
            </label>
          </>
        );
      case 4: // Handling
        return (
          <div className="col-span-1 md:col-span-2 flex items-center justify-center text-slate-400 py-3">
            <span className="text-sm font-medium">Lanjutkan untuk melihat layanan Handling kami.</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative z-20 w-full px-4 flex flex-col items-center pb-8 sm:pb-12">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-3 sm:p-6 flex flex-col gap-4 sm:gap-6 border border-slate-100">
        {/* Products Nav */}
        <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2 sm:gap-4 justify-start lg:justify-center border-b border-slate-100">
          {TABS.map((p, i) => {
            const isActive = activeTab === i;
            return (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex flex-col items-center gap-2 px-4 py-2 min-w-[90px] transition-all border-b-2 ${isActive ? "border-[#C9A84C] text-[#C9A84C]" : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
              >
                <div className={`p-2.5 rounded-full [&>svg]:w-6 [&>svg]:h-6 ${isActive ? "bg-[#C9A84C]/10" : "bg-slate-50 transition-colors hover:bg-slate-100"}`}>
                  {p.icon}
                </div>
                <span className="text-[11px] sm:text-xs font-bold whitespace-nowrap">{p.label}</span>
              </button>
            );
          })}

          {/* Lihat 10+ produk lainnya - Tab */}
          <Link href="/products" className="flex flex-col items-center gap-2 px-4 py-2 min-w-[90px] transition-all border-b-2 border-transparent text-slate-400 hover:text-slate-800 group">
            <div className="p-2.5 rounded-full bg-slate-50 transition-colors group-hover:bg-slate-100 [&>svg]:w-6 [&>svg]:h-6">
              <IcoMenu />
            </div>
            <span className="text-[11px] sm:text-xs font-bold whitespace-nowrap">Lihat 10+ produk lainnya</span>
          </Link>
        </div>

        {/* Dynamic Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderForm()}
          <div className="col-span-1 md:col-span-1 flex items-center justify-end">
            <button
              onClick={handleSearch}
              disabled={!isFormValid()}
              className="w-full h-full min-h-[50px] bg-gradient-to-r from-[#C9A84C] to-[#8B6914] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C9A84C]/30 transition-all hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              Cari Ketersediaan
            </button>
          </div>
        </div>

        {/* Trusted by bottom text */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <span className="text-xs text-slate-400 font-medium italic">Partner Resmi:</span>
          <div className="flex gap-4 opacity-50 grayscale">
            <span className="text-xs font-bold text-slate-700">KEMENAG RI</span>
            <span className="text-xs font-bold text-slate-700">SAUDIA AIRLINES</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    width: scrolled ? "min(1000px, calc(100vw - 2rem))" : "100%",
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
              <img
                src="/farha-logo-only.svg"
                alt="FARHA Logo"
                style={{
                  width: scrolled ? "28px" : "36px",
                  height: scrolled ? "28px" : "36px",
                  transition: "width 600ms cubic-bezier(0.4,0,0.2,1), height 600ms cubic-bezier(0.4,0,0.2,1)",
                  filter: "drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.95)) drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.9))",
                }}
              />
              <div className="flex flex-col justify-center" style={{ lineHeight: "1.1" }}>
                <span
                  className="font-bold tracking-wide block"
                  style={{
                    color: scrolled ? "#fff" : "#ffffff",
                    fontSize: scrolled ? "16px" : "20px",
                    fontFamily: 'var(--font-cinzel), serif',
                    transition: "color 600ms cubic-bezier(0.4,0,0.2,1), font-size 600ms cubic-bezier(0.4,0,0.2,1)",
                    textShadow: "0 4px 14px rgba(0, 0, 0, 0.95), 0 2px 4px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.85)"
                  }}
                >
                  FARHA
                </span>
                <span
                  className="font-medium tracking-[0.2em] uppercase block"
                  style={{
                    color: "#C9A84C",
                    fontSize: scrolled ? "8px" : "10px",
                    marginTop: "-1px",
                    transition: "font-size 600ms cubic-bezier(0.4,0,0.2,1)",
                    textShadow: "0 3px 10px rgba(0, 0, 0, 0.95), 0 1px 3px rgba(0, 0, 0, 0.9)"
                  }}
                >
                  Umrah Services
                </span>
              </div>
            </div>

            {/* Nav links & Profile icon (Desktop) */}
            <div className="hidden md:flex items-center justify-end flex-1 gap-8">
              {NAV_LINKS.map((l) => (
                <NavItem key={l.label} link={l} scrolled={scrolled} />
              ))}

              <div className="w-[1px] h-6 bg-white/20 mx-1"></div>

              {/* Profile icon */}
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
                        style={{ color: scrolled ? "rgba(255,255,255,0.9)" : "#ffffff", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                      >
                        {user.displayName ?? "Pengguna"}
                      </p>
                      <p
                        className="text-[10px] truncate max-w-[120px]"
                        style={{ color: scrolled ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.7)" }}
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
                        color: scrolled ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.6)",
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
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
                        Pengaturan
                      </Link>
                      <div className="border-t border-slate-50 my-1" />
                      <button
                        onClick={() => { setProfileDropdown(false); setShowLogoutModal(true); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
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
                      background: "transparent",
                      border: "1.5px solid rgba(255,255,255,0.7)",
                      color: "#ffffff",
                      transition: "width 600ms cubic-bezier(0.4,0,0.2,1), height 600ms cubic-bezier(0.4,0,0.2,1), color 600ms, border-color 600ms",
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
                className="p-2 transition-colors duration-300 text-white"
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
          {user ? (
            <div className="flex flex-col">
              <div className="px-5 py-3 bg-slate-50/50">
                <p className="text-sm font-semibold text-slate-800 truncate">{user.displayName}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
              </div>
              <Link href="/settings" onClick={() => setMobileMenuOpen(false)} className="px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
                Pengaturan
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); setShowLogoutModal(true); }}
                className="w-full text-left px-5 py-3.5 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors border-t border-slate-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                Keluar
              </button>
            </div>
          ) : (
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3">
              <button className="w-full py-3 bg-gradient-to-r from-[#C9A84C] to-[#8B6914] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-[#C9A84C]/20 hover:-translate-y-0.5 transition-all">
                <IconUser /> Sign In
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="relative flex flex-col w-full mb-8">
        <section
          ref={heroRef}
          id="banner"
          className="relative min-h-[80vh] flex flex-col bg-slate-900 justify-between pt-24"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 w-full h-full z-0 bg-cover bg-bottom"
            style={{ backgroundImage: "url('/bg-banner.jpg')" }}
          >
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          {/* Bottom-anchored content & Widget */}
          <div className="relative z-10 flex flex-col items-center justify-end w-full flex-1 pt-24 pb-0">

            {/* Text */}
            <div className="text-center px-4 max-w-4xl mx-auto flex flex-col gap-1 sm:gap-2 m-0 p-0">
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-white font-heading drop-shadow-xl flex flex-col items-center leading-none">
                <span style={{ fontFamily: 'var(--font-cinzel), serif' }}>FARHA</span>
                <span className="text-xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E5C77A] -mt-1 sm:-mt-2">Land Arrangement Umrah</span>
              </h1>
              <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-snug sm:leading-relaxed mt-2">
                Platform B2B terpercaya untuk Travel Agent Umrah di Indonesia. Nikmati kemudahan akses instan untuk pemesanan Hotel, Tiket Penerbangan, Visa, dan Produk lainnya.
              </p>
            </div>

            {/* Floating Product Widget */}
            <div className="w-full mt-8 p-0">
              <BannerWidget />
            </div>
          </div>
        </section>

        {/* Call to action outside banner */}
        <div className="w-full flex justify-center -translate-y-1/2 z-10 relative">
          <Link href="/products" className="px-8 py-4 bg-gradient-to-r from-[#C9A84C] to-[#8B6914] text-white rounded-full font-bold text-base shadow-xl shadow-[#C9A84C]/40 hover:scale-105 hover:shadow-2xl transition-all flex items-center gap-2 group">
            ke Halaman Produk
            <div className="flex items-center -space-x-1.5" style={{ animation: 'bounce-x 1s infinite' }}>
              <ChevronRight className="w-5 h-5 opacity-40" />
              <ChevronRight className="w-5 h-5 opacity-70" />
              <ChevronRight className="w-5 h-5" />
            </div>
            <style>{`
              @keyframes bounce-x {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(4px); }
              }
            `}</style>
          </Link>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 w-full max-w-sm">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
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
