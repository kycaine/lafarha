import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Modul Layanan Land Arrangement Umrah B2B",
  description:
    "Rancang kebutuhan Umrah secara modular: reservasi Hotel Makkah & Madinah bintang 3-5, tiket pesawat internasional & domestik, transportasi bus eksekutif, dan visa resmi.",
  alternates: {
    canonical: "https://lafarha.id/products",
  },
  openGraph: {
    title: "Katalog Modul Layanan Land Arrangement Umrah B2B | LA Farha",
    description:
      "Rancang kebutuhan Umrah secara modular: reservasi Hotel Makkah & Madinah bintang 3-5, tiket pesawat internasional & domestik, transportasi bus eksekutif, dan visa resmi.",
    url: "https://lafarha.id/products",
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
