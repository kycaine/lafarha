import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Direktori Muthawif & Pembimbing Ibadah Umrah Terverifikasi",
  description:
    "Direktori resmi muthawif profesional, bersertifikat Kemenag, dan fasih berbahasa Arab serta Indonesia untuk membimbing jamaah Umrah di Makkah dan Madinah.",
  alternates: {
    canonical: "https://lafarha.id/muthawif",
  },
  openGraph: {
    title: "Direktori Muthawif & Pembimbing Ibadah Umrah Terverifikasi | LA Farha",
    description:
      "Direktori resmi muthawif profesional, bersertifikat Kemenag, dan fasih berbahasa Arab serta Indonesia untuk membimbing jamaah Umrah di Makkah dan Madinah.",
    url: "https://lafarha.id/muthawif",
  },
};

export default function MuthawifLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
