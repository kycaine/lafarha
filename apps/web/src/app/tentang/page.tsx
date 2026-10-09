import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Tentang Kami — FARHA",
  description: "Kenali lebih dekat tentang tim dan perusahaan FARHA.",
};

const FOUNDERS = [
  {
    name: "Rezki Ade",
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
      {/* Gold Banner with Layered Waves */}
      <div className="relative w-full h-[50vh] min-h-[400px] bg-gradient-to-br from-[#d4b455] to-[#8B6914] flex flex-col justify-center items-center overflow-hidden">
        {/* Navigation inside Banner */}
        <nav className="absolute top-0 left-0 w-full p-6 z-10 flex items-center">
          <Link
            href="/"
            className="group flex items-center gap-2 px-4 py-2 bg-black/10 backdrop-blur-md rounded-full border border-black/10 text-white/90 hover:bg-black/20 hover:text-white transition-all shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="font-medium text-sm">Kembali</span>
          </Link>
        </nav>

        {/* Title */}
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight font-heading drop-shadow-xl">
            Bertumbuh karena <br className="hidden md:block" />
            <span className="text-slate-800 tracking-tighter text-5xl md:text-6xl lg:text-7xl">
              INTEGRITAS
            </span>
          </h1>
        </div>

        {/* Layered White Bottom Waves */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none translate-y-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-[100%] min-w-[1000px] h-[120px] md:h-[180px] block" preserveAspectRatio="none">
            <path fill="rgba(255, 255, 255, 0.15)" d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,213.3C672,203,768,149,864,128C960,107,1056,117,1152,149.3C1248,181,1344,235,1392,261.3L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            <path fill="rgba(255, 255, 255, 0.35)" d="M0,96L48,112C96,128,192,160,288,176C384,192,480,192,576,176C672,160,768,128,864,117.3C960,107,1056,117,1152,144C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            <path fill="rgba(255, 255, 255, 0.7)" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,208C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            <path fill="#f8fafc" d="M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,192C672,224,768,256,864,256C960,256,1056,224,1152,192C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center pt-16 pb-24 px-6 relative z-0 min-h-screen">

        {/* Description Section */}
        <div className="max-w-3xl w-full mb-24">
          <div className="text-slate-500 text-lg leading-relaxed mx-auto space-y-6 text-justify">
            <p className="indent-8">
              FARHA mengawali langkah pertamanya di industri perjalanan ibadah pada tahun 2023. Pada masa awal tersebut, kami memulai perjalanan dari skala yang kecil dengan menangani beberapa layanan umrah dalam lingkup yang masih terbatas. Berangkat dari komitmen yang kuat untuk selalu mengutamakan kenyamanan, keamanan, dan kualitas pelayanan berstandar tinggi, dedikasi kami perlahan membuahkan hasil. Kepercayaan dari para tamu Allah terus bertumbuh seiring dengan banyaknya pengalaman spiritual yang berkesan, yang pada akhirnya memotivasi kami untuk terus melangkah lebih jauh.
            </p>
            <p className="indent-8">
              Memasuki tahun 2025, sejalan dengan visi untuk memberikan dampak yang lebih luas, FARHA mulai mengembangkan sayap melalui ekspansi layanan yang jauh lebih komprehensif. Berbekal pengalaman dan jaringan kuat yang telah terbangun di Tanah Suci, kami bertransformasi secara strategis menjadi platform penyedia layanan Land Arrangement secara terintegrasi. Transformasi ini memungkinkan kami untuk memiliki kapasitas operasional berskala besar, mulai dari pemesanan akomodasi hotel premium, penyediaan transportasi darat eksklusif, hingga manajemen visa dan pendampingan muthawif yang sangat berpengalaman.
            </p>
            <p className="indent-8">
              Saat ini, ruang lingkup FARHA telah berkembang pesat melampaui akar asalnya. Kami tidak hanya sekadar melayani kebutuhan pasar secara langsung kepada para jamaah, melainkan telah beroperasi penuh sebagai mitra strategis andal di sektor pelayanan antar bisnis atau korporasi. Sebagai fasilitator yang menjunjung tinggi nilai integritas, kami mendukung penuh kebutuhan operasional dari berbagai biro perjalanan umrah di seluruh penjuru Indonesia, memastikan setiap tamu Allah senantiasa mendapatkan pelayanan ibadah yang paling maksimal.
            </p>
          </div>
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

      <Footer />
    </main>
  );
}
