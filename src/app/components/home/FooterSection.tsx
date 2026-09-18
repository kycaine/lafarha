const LINKS = {
  Layanan: [
    { label: "Akomodasi Hotel", href: "/penawaran" },
    { label: "Transportasi Darat", href: "/penawaran" },
    { label: "Tiket Penerbangan", href: "/penawaran" },
    { label: "Visa & Dokumen", href: "/penawaran" },
    { label: "Muthawif & Guide", href: "/penawaran" },
  ],
  Perusahaan: [
    { label: "Tentang Kami", href: "/tentang" },
    { label: "Karir", href: "#" },
    { label: "Blog & Artikel", href: "#" },
    { label: "Hubungi Kami", href: "#footer" },
  ],
  Legal: [
    { label: "Syarat & Ketentuan", href: "#" },
    { label: "Kebijakan Privasi", href: "#" },
    { label: "Perizinan UMKM", href: "#" },
  ],
};

const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
  </svg>
);
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
  </svg>
);
const IconPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const CONTACTS = [
  { Icon: IconPhone, label: "WhatsApp", value: "+62 812 3456 7890" },
  { Icon: IconMail, label: "Email", value: "info@kanza.id" },
  { Icon: IconPin, label: "Kantor", value: "Jakarta Selatan, Indonesia" },
];

export default function FooterSection() {
  return (
    <footer id="footer" className="relative bg-slate-50 border-t border-slate-200">
      {/* Top golden line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center shadow-lg shadow-[#C9A84C]/25">
                <span className="text-white font-black text-sm">LA</span>
              </div>
              <div>
                <p className="text-slate-800 font-bold text-base tracking-wide" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Kanza</p>
                <p className="text-[#C9A84C] text-[9px] font-semibold tracking-[0.25em] uppercase">Umrah Land Arrangement</p>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-8">
              Platform B2B terpercaya untuk kebutuhan Land Arrangement Umrah. Melayani travel agent dan agen perjalanan di seluruh Indonesia sejak 2014.
            </p>

            {/* Contact */}
            <div className="space-y-3">
              {CONTACTS.map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#8B6914] flex-shrink-0">
                    <c.Icon />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] tracking-wider uppercase">{c.label}</p>
                    <p className="text-slate-700 text-sm font-medium">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(LINKS).map(([cat, links]) => (
            <div key={cat}>
              <h4 className="text-slate-600 font-bold text-xs tracking-widest uppercase mb-5">{cat}</h4>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-slate-400 hover:text-[#C9A84C] text-sm transition-colors duration-200"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="rounded-2xl border border-[#C9A84C]/20 bg-gradient-to-r from-amber-50 to-yellow-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div>
            <p className="text-slate-800 font-bold text-base">Siap memulai kerjasama?</p>
            <p className="text-slate-500 text-sm mt-0.5">Buat permintaan penawaran Anda sekarang, gratis dan tanpa registrasi.</p>
          </div>
          <a href="/penawaran" className="flex-shrink-0">
            <button className="px-7 py-3 rounded-xl font-bold text-[#0D1117] bg-gradient-to-r from-[#C9A84C] to-[#E8C96C] hover:from-[#E8C96C] hover:to-[#C9A84C] transition-all duration-300 shadow-lg shadow-[#C9A84C]/20 text-sm whitespace-nowrap hover:-translate-y-0.5">
              Mulai Sekarang →
            </button>
          </a>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
          <p className="text-slate-400 text-xs">
            © 2026 LA Kanza. Hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400 text-xs">Sistem operasional normal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
