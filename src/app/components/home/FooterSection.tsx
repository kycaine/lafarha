"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

const LINKS = {
  Layanan: [
    { label: "Akomodasi Hotel", href: "/products" },
    { label: "Transportasi Darat", href: "/products" },
    { label: "Tiket Penerbangan", href: "/products" },
    { label: "Visa & Dokumen", href: "/products" },
    { label: "Muthawif & Guide", href: "/products" },
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

const IconWhatsApp = () => (
  <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
    <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.648 4.895 1.88 7.027L2 30l7.188-1.854A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.55 11.55 0 01-5.89-1.614l-.422-.251-4.268 1.1 1.126-4.146-.277-.443A11.56 11.56 0 014.4 16C4.4 9.593 9.593 4.4 16 4.4S27.6 9.593 27.6 16 22.407 27.6 16 27.6zm6.338-8.667c-.347-.174-2.054-1.013-2.373-1.129-.32-.116-.552-.174-.784.174-.232.347-.9 1.129-1.102 1.36-.203.232-.405.26-.752.087-.347-.174-1.464-.54-2.788-1.72-1.03-.918-1.725-2.052-1.928-2.399-.203-.347-.022-.535.152-.708.157-.155.347-.405.52-.607.174-.203.232-.347.347-.578.116-.232.058-.435-.029-.607-.087-.174-.784-1.89-1.074-2.588-.283-.68-.57-.587-.784-.598l-.667-.012c-.232 0-.607.087-.925.435-.319.347-1.218 1.19-1.218 2.9 0 1.71 1.247 3.363 1.42 3.595.174.232 2.454 3.748 5.946 5.257.831.359 1.48.573 1.986.733.834.265 1.594.228 2.194.138.669-.1 2.054-.84 2.344-1.652.29-.812.29-1.508.203-1.652-.086-.145-.318-.232-.666-.405z"/>
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

interface ContactSettings {
  whatsapp_number: string;
  whatsapp_label: string;
  email: string;
  office_address: string;
  office_city: string;
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
  tiktok: string;
  linkedin: string;
  telegram: string;
}

const DEFAULT: ContactSettings = {
  whatsapp_number: "+62 812 3456 7890",
  whatsapp_label: "Customer Service",
  email: "info@farha.id",
  office_address: "",
  office_city: "Jakarta Selatan, Indonesia",
  instagram: "", facebook: "", twitter: "",
  youtube: "", tiktok: "", linkedin: "", telegram: "",
};

export default function FooterSection() {
  const [contact, setContact] = useState<ContactSettings>(DEFAULT);

  useEffect(() => {
    fetchApi("/settings/contact")
      .then((data) => {
        if (data && !data.error) {
          setContact((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

  const contacts = [
    {
      Icon: IconWhatsApp,
      label: contact.whatsapp_label || "WhatsApp",
      value: contact.whatsapp_number || DEFAULT.whatsapp_number,
      href: contact.whatsapp_number
        ? `https://wa.me/${contact.whatsapp_number.replace(/\D/g, "")}`
        : "#footer",
    },
    {
      Icon: IconMail,
      label: "Email",
      value: contact.email || DEFAULT.email,
      href: contact.email ? `mailto:${contact.email}` : "#footer",
    },
    {
      Icon: IconPin,
      label: "Kantor",
      value: contact.office_city || DEFAULT.office_city,
      href: "#footer",
    },
  ];

  // Social media links (only show if value is set)
  const socialLinks = [
    { label: "Instagram", value: contact.instagram, url: `https://instagram.com/${contact.instagram}`, icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
      </svg>
    )},
    { label: "Facebook", value: contact.facebook, url: `https://facebook.com/${contact.facebook}`, icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
      </svg>
    )},
    { label: "Twitter / X", value: contact.twitter, url: `https://x.com/${contact.twitter}`, icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )},
    { label: "YouTube", value: contact.youtube, url: `https://youtube.com/${contact.youtube}`, icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor"/>
      </svg>
    )},
    { label: "TikTok", value: contact.tiktok, url: `https://tiktok.com/${contact.tiktok}`, icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.22 8.22 0 004.8 1.54V6.84a4.85 4.85 0 01-1.03-.15z"/>
      </svg>
    )},
    { label: "LinkedIn", value: contact.linkedin, url: `https://linkedin.com/${contact.linkedin}`, icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
        <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
      </svg>
    )},
    { label: "Telegram", value: contact.telegram, url: `https://t.me/${contact.telegram}`, icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
    )},
  ].filter((s) => s.value);

  return (
    <footer id="footer" className="relative bg-slate-50 border-t border-slate-200">
      {/* Top golden line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/farha-logo-full.svg"
                alt="FARHA Logo"
                className="h-24 w-auto object-contain"
              />
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-8">
              Platform B2B terpercaya untuk kebutuhan Land Arrangement Umrah. Melayani travel agent dan agen perjalanan di seluruh Indonesia sejak 2014.
            </p>

            {/* Contact & Sosmed */}
            <div className="flex flex-col sm:flex-row gap-10 sm:gap-16">
              {/* Kontak */}
              <div>
                <p className="text-slate-400 text-[10px] tracking-wider uppercase mb-3">Kontak</p>
                <div className="space-y-3">
                  {contacts.map((c: any) => (
                    <a
                      key={c.label}
                      href={c.href}
                      className="flex items-center gap-3 group"
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors text-[#8B6914]`}>
                        <c.Icon />
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px] tracking-wider uppercase">{c.label}</p>
                        <p className="text-slate-700 text-sm font-medium group-hover:text-[#C9A84C] transition-colors">{c.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Sosial Media */}
              {socialLinks.length > 0 && (
                <div>
                  <p className="text-slate-400 text-[10px] tracking-wider uppercase mb-3">Ikuti Kami</p>
                  <div className="space-y-3">
                    {socialLinks.map((s) => (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-amber-50 group-hover:border-amber-200/60 group-hover:text-[#8B6914] transition-all duration-200 flex-shrink-0">
                          {s.icon}
                        </div>
                        <div>
                          <p className="text-slate-400 text-[10px] tracking-wider uppercase">{s.label}</p>
                          <p className="text-slate-700 text-sm font-medium group-hover:text-[#C9A84C] transition-colors">@{s.value}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
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
          <a href="/products" className="flex-shrink-0">
            <button className="px-7 py-3 rounded-xl font-bold text-[#0D1117] bg-gradient-to-r from-[#C9A84C] to-[#E8C96C] hover:from-[#E8C96C] hover:to-[#C9A84C] transition-all duration-300 shadow-lg shadow-[#C9A84C]/20 text-sm whitespace-nowrap hover:-translate-y-0.5">
              Mulai Sekarang →
            </button>
          </a>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
          <p className="text-slate-400 text-xs">
            © 2026 FARHA. Hak cipta dilindungi undang-undang.
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
