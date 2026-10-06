"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  const [contact, setContact] = useState<any>({
    whatsapp_number: "+62 812 3456 7890",
    office_city: "Gedung Perkantoran Jakarta Selatan",
  });

  useEffect(() => {
    fetchApi("/settings/contact")
      .then((data) => {
        if (data && !data.error) {
          setContact((prev: any) => ({ ...prev, ...data }));
        }
      })
      .catch(() => { });
  }, []);

  return (
    <footer id="footer" className="relative w-full h-screen min-h-[750px] bg-[#161616] overflow-hidden flex flex-col justify-center border-t border-white/5">
      {/* Background Glow & Big Logo (Mentok Kiri) */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-start pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-l from-[#161616] via-[#161616]/80 to-transparent z-10 hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/80 to-transparent z-10 md:hidden" />

        {/* Glow Effects (Emas & Lebar Sampai Tengah) */}
        <div className="absolute left-[-10%] top-1/2 -translate-y-1/2 w-[80vw] h-[100vh] bg-[#C9A84C]/15 blur-[150px] rounded-full mix-blend-screen z-0" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[50vw] h-[60vh] bg-[#ff6b2b]/10 blur-[120px] rounded-full mix-blend-screen z-0" />

        <img
          src="/farha-logo-only.png"
          alt="FARHA Logo Giant"
          className="h-[60%] md:h-[80%] w-auto max-w-[50vw] object-contain object-left opacity-20 md:opacity-70 relative z-0 ml-[5vw]"
          style={{
            filter: 'drop-shadow(0 0 60px rgba(201,168,76,0.3)) drop-shadow(0 0 100px rgba(201,168,76,0.15))'
          }}
        />
      </div>

      <div className="w-full h-full relative z-20 flex flex-col justify-between py-12 md:py-16 px-6 md:px-[5vw]">

        {/* Main Content Area */}
        <div className="flex flex-col mt-auto mb-auto max-w-2xl pt-10 md:ml-auto w-full md:w-1/2">

          {/* Content Matching Banner */}
          <div className="flex flex-col mb-10">
            <h2 className="text-6xl sm:text-7xl md:text-8xl font-black text-white font-heading drop-shadow-xl flex flex-col items-start leading-none">
              <span style={{ fontFamily: 'var(--font-cinzel), serif' }}>FARHA</span>
              <span className="text-xl sm:text-2xl md:text-3xl text-[#C9A84C] mt-1 tracking-[0.2em] font-medium uppercase block">
                Land Arrangement Umrah
              </span>
            </h2>
            <p className="mt-2 sm:mt-3 text-[13px] sm:text-[15px] text-white/90 max-w-xl leading-snug drop-shadow-md font-medium">
              Platform B2B terpercaya untuk Travel Agent Umrah di Indonesia. Nikmati kemudahan akses instan untuk pemesanan Hotel, Tiket Penerbangan, Visa, dan Produk lainnya.
            </p>
          </div>

          {/* Layout Row 1: Kontak & Sosmed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10 mb-10 w-full border-b border-white/10 pb-10">
            {/* Kontak */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Kontak</h4>
              <div className="text-white/70 text-xs sm:text-[13px] flex flex-col gap-2.5">
                <div className="flex flex-col">
                  <span className="text-white/40 text-[10px] uppercase mb-0.5">Joni</span>
                  <a href="#" className="hover:text-[#C9A84C] transition-colors font-medium">6285176861181</a>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/40 text-[10px] uppercase mb-0.5">Email</span>
                  <a href="#" className="hover:text-[#C9A84C] transition-colors font-medium">info@farha.id</a>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/40 text-[10px] uppercase mb-0.5">Kantor</span>
                  <span className="font-medium">Jakarta Selatan, Indonesia</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Sosial Media</h4>
              <div className="flex flex-col gap-3 mt-1">
                <a href="#" className="flex items-center gap-3 group w-fit">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#1877F2] group-hover:border-[#1877F2] text-white flex items-center justify-center transition-all duration-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </div>
                  <span className="text-white/70 text-xs sm:text-[13px] font-medium group-hover:text-white transition-colors">Facebook</span>
                </a>
                
                <a href="#" className="flex items-center gap-3 group w-fit">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#E1306C] group-hover:border-[#E1306C] text-white flex items-center justify-center transition-all duration-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </div>
                  <span className="text-white/70 text-xs sm:text-[13px] font-medium group-hover:text-white transition-colors">Instagram</span>
                </a>

                <a href="#" className="flex items-center gap-3 group w-fit">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-white group-hover:text-black group-hover:border-white text-white flex items-center justify-center transition-all duration-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                  </div>
                  <span className="text-white/70 text-xs sm:text-[13px] font-medium group-hover:text-white transition-colors">TikTok</span>
                </a>
              </div>
            </div>
          </div>

          {/* Layout Row 2: Layanan, Perusahaan, Legal */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 mb-12 w-full">
            {/* Layanan */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Layanan</h4>
              <div className="text-white/70 text-xs sm:text-[13px] flex flex-col gap-3 font-medium">
                <a href="#" className="hover:text-[#C9A84C] transition-colors">Akomodasi Hotel</a>
                <a href="#" className="hover:text-[#C9A84C] transition-colors">Transportasi Darat</a>
                <a href="#" className="hover:text-[#C9A84C] transition-colors">Tiket Penerbangan</a>
                <a href="#" className="hover:text-[#C9A84C] transition-colors">Visa & Dokumen</a>
                <a href="#" className="hover:text-[#C9A84C] transition-colors">Muthawif & Guide</a>
              </div>
            </div>

            {/* Perusahaan */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Perusahaan</h4>
              <div className="text-white/70 text-xs sm:text-[13px] flex flex-col gap-3 font-medium">
                <a href="#" className="hover:text-[#C9A84C] transition-colors">Tentang Kami</a>
                <a href="#" className="hover:text-[#C9A84C] transition-colors">Karir</a>
                <a href="/muthawif" className="hover:text-[#C9A84C] transition-colors">Muthawif</a>
                <a href="#" className="hover:text-[#C9A84C] transition-colors">Blog & Artikel</a>
                <a href="#" className="hover:text-[#C9A84C] transition-colors">Hubungi Kami</a>
              </div>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Legal</h4>
              <div className="text-white/70 text-xs sm:text-[13px] flex flex-col gap-3 font-medium">
                <a href="#" className="hover:text-[#C9A84C] transition-colors">Syarat & Ketentuan</a>
                <a href="#" className="hover:text-[#C9A84C] transition-colors">Kebijakan Privasi</a>
                <a href="#" className="hover:text-[#C9A84C] transition-colors">Perizinan</a>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 mt-4 border-t border-white/5 w-full text-white/40 text-[10px] sm:text-[11px] font-medium tracking-wide">
            <span>&copy; 2026, All rights reserved.</span>
            <span>Designed by Reternia</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
