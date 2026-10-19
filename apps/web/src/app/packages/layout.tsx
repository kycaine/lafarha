import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paket Land Arrangement Umrah Siap Berangkat & Kustom",
  description:
    "Pilihan paket Land Arrangement (LA) Umrah terintegrasi untuk Travel Agent: Paket Hemat, Bronze, Silver, Gold, dan VIP. Kustomisasi hotel, tiket, dan bus dengan mudah.",
  alternates: {
    canonical: "https://lafarha.id/packages",
  },
  openGraph: {
    title: "Paket Land Arrangement Umrah Siap Berangkat & Kustom | LA Farha",
    description:
      "Pilihan paket Land Arrangement (LA) Umrah terintegrasi untuk Travel Agent: Paket Hemat, Bronze, Silver, Gold, dan VIP. Kustomisasi hotel, tiket, dan bus dengan mudah.",
    url: "https://lafarha.id/packages",
  },
};

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
