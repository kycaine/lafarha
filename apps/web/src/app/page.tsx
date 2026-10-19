import type { Metadata } from "next";
import BannerSection from "./components/home/BannerSection";
import ServiceSection from "./components/home/ServiceSection";
import BlogSection from "./components/home/BlogSection";
import MitraSection from "./components/home/MitraSection";
import Footer from "@/components/layout/Footer";
import RoleNavButtons from "./components/home/RoleNavButtons";

export const metadata: Metadata = {
  title: "FARHA — Platform B2B Land Arrangement Umrah Indonesia Terpercaya",
  description:
    "Penyedia Land Arrangement (LA) Umrah B2B terlengkap di Indonesia. Booking hotel Makkah & Madinah bintang 3-5, tiket pesawat, visa resmi, bus eksekutif, dan muthawif.",
  alternates: {
    canonical: "https://lafarha.id",
  },
  openGraph: {
    title: "FARHA — Platform B2B Land Arrangement Umrah Indonesia Terpercaya",
    description:
      "Penyedia Land Arrangement (LA) Umrah B2B terlengkap di Indonesia. Booking hotel Makkah & Madinah bintang 3-5, tiket pesawat, visa resmi, bus eksekutif, dan muthawif.",
    url: "https://lafarha.id",
    siteName: "LA Farha",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/farha-logo-full.jpeg",
        width: 1200,
        height: 630,
        alt: "LA Farha B2B Land Arrangement Umrah",
      },
    ],
  },
};

const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Apa itu Land Arrangement (LA) Umrah di LA Farha?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Land Arrangement (LA) Umrah adalah penyediaan seluruh komponen operasional ibadah Umrah di Arab Saudi (ground handling), mencakup booking hotel Makkah dan Madinah, transportasi darat bus eksekutif, pengurusan visa umrah resmi dan siskopatuh, tiket penerbangan, hingga jasa muthawif dan guide profesional khusus untuk Travel Agent Umrah.",
      },
    },
    {
      "@type": "Question",
      name: "Siapa yang dapat bermitra dan menggunakan platform LA Farha?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "LA Farha beroperasi dengan model B2B (Business-to-Business) khusus untuk Biro Perjalanan Wisata, Penyelenggara Perjalanan Ibadah Umrah (PPIU), dan Travel Agent di seluruh Indonesia yang membutuhkan penyedia layanan darat terpercaya di Tanah Suci.",
      },
    },
    {
      "@type": "Question",
      name: "Bagaimana cara travel agent meminta kalkulasi dan penawaran harga LA Umrah?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Travel agent cukup memilih modul layanan atau paket yang diinginkan melalui website lafarha.id tanpa perlu login, kemudian sistem akan mengarahkan inquiry ke WhatsApp dealing closer kami dengan token keamanan satu kali pakai untuk verifikasi instan.",
      },
    },
    {
      "@type": "Question",
      name: "Apakah LA Farha menyediakan paket custom dan komponen satuan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ya, LA Farha menyediakan sistem katalog modular di mana travel agent dapat memesan komponen satuan (seperti hotel saja, visa saja, atau transportasi saja) maupun merancang paket komplit kustom sesuai jumlah PAX dan preferensi hotel.",
      },
    },
    {
      "@type": "Question",
      name: "Apakah LA Farha memiliki kantor perwakilan di Indonesia dan Arab Saudi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ya, operasional LA Farha berbasis di Jakarta Selatan, Indonesia dengan jaringan tim operasional, handling bandara, dan muthawif lapangan yang siaga 24 jam di Jeddah, Makkah, dan Madinah.",
      },
    },
  ],
};

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
      />
      <BannerSection />
      <ServiceSection />
      <MitraSection />
      <BlogSection />
      <Footer />
      <RoleNavButtons />
    </main>
  );
}
