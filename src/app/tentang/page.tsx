import Image from "next/image";
import Link from "next/link";
import FooterSection from "../components/home/FooterSection";

export const metadata = {
  title: "Tentang Kami — LA Kanza",
  description: "Kenali lebih dekat tentang tim dan perusahaan LA Kanza.",
};

const FOUNDERS = [
  {
    name: "Rezki Putra",
    role: "CTO / Co-Founder",
    image: "/rezki.jpg",
    isMain: false,
  },
  {
    name: "Ahmad Fatih",
    role: "CEO / Founder",
    image: "/fatih.jpg",
    isMain: true,
  },
  {
    name: "Hasbi Jamal",
    role: "CMO / Co-Founder",
    image: "/hasbi.jpg",
    isMain: false,
  },
];

export default function TentangPage() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#C9A84C]/20 to-transparent blur-3xl opacity-50" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-gradient-to-bl from-amber-500/10 to-transparent blur-3xl opacity-50" />

      {/* Navigation */}
      <nav className="absolute top-0 left-0 w-full p-6 z-10 flex items-center">
        <Link
          href="/"
          className="group flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md rounded-full border border-slate-200/50 text-slate-600 hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-all shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="font-medium text-sm">Kembali ke Beranda</span>
        </Link>
      </nav>

      <div className="flex-grow flex flex-col items-center pt-32 pb-24 px-6 relative z-0">

        {/* Header Section */}
        <div className="max-w-3xl w-full text-center mb-24">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/50 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
            <span className="text-[#8B6914] text-xs font-bold tracking-widest uppercase">Tentang Kami</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-6 leading-tight">
            Menghubungkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#8B6914]">Tamu Allah</span> dengan Pelayanan Terbaik
          </h1>

          <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Kanza adalah platform B2B terpercaya yang berdedikasi untuk memfasilitasi kebutuhan Land Arrangement Umrah. Kami membantu travel agent di seluruh Indonesia memberikan pengalaman spiritual yang lancar dan tak terlupakan sejak tahun 2014.
          </p>
        </div>

        {/* Team Section */}
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4 font-heading">Pendiri Kami</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#C9A84C] to-transparent mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
            {FOUNDERS.map((founder, index) => (
              <div
                key={founder.name}
                className={`group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(201,168,76,0.08)] transition-all duration-300 ${founder.isMain ? 'order-first md:order-none' : ''}`}
              >
                {/* Image Container filling the top half */}
                <div className={`relative w-full bg-slate-100 overflow-hidden ${founder.isMain ? 'aspect-[4/5]' : 'aspect-square'}`}>
                  <Image
                    src={founder.image}
                    alt={`Foto ${founder.name}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content at the bottom */}
                <div className={`text-center bg-white relative z-10 flex-grow flex flex-col justify-center ${founder.isMain ? 'p-8' : 'p-6'}`}>
                  <h3 className={`${founder.isMain ? 'text-3xl' : 'text-2xl'} font-black text-slate-800 mb-1`}>{founder.name}</h3>
                  <p className="text-[#C9A84C] font-bold text-sm tracking-widest uppercase">{founder.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FooterSection />
    </main>
  );
}
