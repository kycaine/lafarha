import type { Metadata } from "next";
import packagesData from "@/contents/packages/packages.json";

interface Props {
  params: { id: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pkg = ((packagesData?.readyPackages as any[]) || []).find((p) => p.id === params.id);

  if (!pkg) {
    return {
      title: "Paket Umrah Tidak Ditemukan",
      description: "Paket Umrah yang Anda cari tidak tersedia di LA Farha.",
    };
  }

  const title = `${pkg.name} — Paket Land Arrangement Umrah`;
  const description = `${pkg.subtitle || pkg.name}. Fasilitas: ${pkg.features?.slice(0, 3).join(", ")}. Estimasi ${pkg.priceString}. Hubungi tim LA Farha untuk kustomisasi.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://lafarha.id/packages/${pkg.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://lafarha.id/packages/${pkg.id}`,
      siteName: "LA Farha",
      locale: "id_ID",
      type: "website",
    },
  };
}

export default function PackageDetailLayout({ params, children }: Props) {
  const pkg = ((packagesData?.readyPackages as any[]) || []).find((p) => p.id === params.id);

  const productJsonLd = pkg
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: pkg.name,
        description: pkg.subtitle || `${pkg.name} - Land Arrangement Umrah`,
        brand: {
          "@type": "Brand",
          name: "LA Farha",
        },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "IDR",
          lowPrice: pkg.estimatedPriceMin || 15000000,
          highPrice: pkg.estimatedPriceMax || 35000000,
          offerCount: "1",
          availability: "https://schema.org/InStock",
        },
      }
    : null;

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
