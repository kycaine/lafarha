import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Wawasan Umrah — Tips, Regulasi, dan Panduan Ibadah",
  description:
    "Pusat edukasi dan panduan seputar persiapan ibadah Umrah, regulasi visa Arab Saudi, tips memilih hotel Makkah Madinah, serta manasik ibadah sesuai sunnah.",
  alternates: {
    canonical: "https://lafarha.id/blog",
  },
  openGraph: {
    title: "Blog & Wawasan Umrah — Tips, Regulasi, dan Panduan Ibadah | LA Farha",
    description:
      "Pusat edukasi dan panduan seputar persiapan ibadah Umrah, regulasi visa Arab Saudi, tips memilih hotel Makkah Madinah, serta manasik ibadah sesuai sunnah.",
    url: "https://lafarha.id/blog",
    siteName: "LA Farha",
    locale: "id_ID",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
