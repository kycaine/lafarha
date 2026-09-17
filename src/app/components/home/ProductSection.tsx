"use client";

// ── Monochrome SVG icons ──────────────────────────────────────────────────────
const IconHotel  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconBus    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IconFlight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>;
const IconVisa   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>;
const IconStar   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconGuide  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;

const PRODUCTS = [
  {
    id: "hotel",
    Icon: IconHotel,
    title: "Akomodasi Hotel",
    tag: "Bintang 3–5",
    desc: "Hotel bintang 3 hingga 5 di Makkah & Madinah, dekat Masjidil Haram. Pilihan kamar fleksibel.",
    features: ["Lokasi <500m dari Haram", "Zona & jarak walking", "Konfigurasi PAX fleksibel", "Real-time availability"],
    accent: "#C9A84C",
  },
  {
    id: "transport",
    Icon: IconBus,
    title: "Transportasi Darat",
    tag: "Bus & Coaster",
    desc: "Armada bus besar dan coaster premium untuk mobilitas jamaah selama ibadah di tanah suci.",
    features: ["Bus besar & coaster premium", "Rute Makkah–Madinah–Jeddah", "Pengemudi berpengalaman", "AC terjamin"],
    accent: "#C9A84C",
  },
  {
    id: "flight",
    Icon: IconFlight,
    title: "Tiket Penerbangan",
    tag: "Garuda & Arab Airlines",
    desc: "Tiket penerbangan PP dari berbagai kota di Indonesia ke Jeddah atau Madinah.",
    features: ["Penerbangan dari 15+ kota", "Maskapai pilihan terpercaya", "Penjadwalan grup", "Handling bagasi"],
    accent: "#C9A84C",
  },
  {
    id: "visa",
    Icon: IconVisa,
    title: "Visa & Dokumen",
    tag: "Proses Resmi",
    desc: "Pengurusan visa Umrah resmi via agen terakreditasi. Dokumen lengkap, proses cepat.",
    features: ["Visa resmi Saudi Arabia", "Proses 3–7 hari kerja", "Tracking real-time", "Dokumen manifest"],
    accent: "#C9A84C",
  },
  {
    id: "addon",
    Icon: IconStar,
    title: "Layanan Tambahan",
    tag: "Add-on Premium",
    desc: "Layanan pelengkap: ziarah tambahan, handling VIP, tour guide privat, dan souvenir.",
    features: ["Ziarah Makkah & Madinah", "Tour guide privat", "Handling VIP airport", "Souvenir & perlengkapan"],
    accent: "#C9A84C",
  },
  {
    id: "muthawif",
    Icon: IconGuide,
    title: "Muthawif & Guide",
    tag: "Pembimbing Profesional",
    desc: "Muthawif berpengalaman membimbing jamaah dalam setiap rukun dan sunnah ibadah Umrah.",
    features: ["Bersertifikat KEMENAG", "Rasio 1:45 jamaah", "Bilingual Indonesia–Arab", "Siaga 24/7"],
    accent: "#C9A84C",
  },
];

export default function ProductSection() {
  return (
    <section id="product" className="relative bg-white py-32 overflow-hidden">
      {/* Subtle bg glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-50/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A84C]/25 bg-amber-50 mb-6">
            <span className="text-[#8B6914] text-xs font-semibold tracking-widest uppercase">Produk & Layanan</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-5">
            Semua Kebutuhan Umrah{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8C96C]">
              Dalam Satu Platform
            </span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Layanan Land Arrangement komprehensif — hotel, transportasi, penerbangan, visa, hingga pembimbing ibadah.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.map((p) => (
            // Card: white, static (no translate), overflow-hidden
            <div
              key={p.id}
              className="group relative rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden cursor-default"
            >
              {/* Inner content — this scales up on hover, clipped by card overflow-hidden */}
              <div className="transition-transform duration-300 ease-out group-hover:scale-[1.03] p-6 h-full">

                {/* Top row */}
                <div className="flex items-start justify-between mb-5">
                  {/* Icon box */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: `${p.accent}12`,
                      border: `1px solid ${p.accent}25`,
                      color: p.accent,
                    }}
                  >
                    <p.Icon />
                  </div>
                  {/* Tag */}
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                    style={{
                      color: p.accent,
                      backgroundColor: `${p.accent}10`,
                      border: `1px solid ${p.accent}25`,
                    }}
                  >
                    {p.tag}
                  </span>
                </div>

                {/* Title & desc */}
                <h3 className="text-slate-800 font-bold text-base mb-1.5">{p.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{p.desc}</p>

                {/* Features */}
                <ul className="space-y-1.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-slate-500 text-sm">
                      <span
                        className="w-1 h-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: p.accent }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom gold accent line — appears on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                style={{ background: `linear-gradient(to right, transparent, ${p.accent}60, transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <a href="/penawaran">
            <button className="px-10 py-4 rounded-xl font-bold text-[#0D1117] bg-gradient-to-r from-[#C9A84C] to-[#E8C96C] hover:from-[#E8C96C] hover:to-[#C9A84C] transition-all duration-300 shadow-lg shadow-[#C9A84C]/20 hover:shadow-[#C9A84C]/35 text-base">
              Mulai Buat Penawaran →
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
