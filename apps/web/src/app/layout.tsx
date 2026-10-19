import type { Metadata } from "next";
import { Inter, Playfair_Display, Cinzel, Caveat } from "next/font/google";
import { AuthProvider } from "@/shared/AuthContext";
import { AlertProvider } from "@/shared/AlertContext";
import PageWrapper from "@/components/layout/PageWrapper";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lafarha.id"),
  title: {
    default: "FARHA — Platform B2B Land Arrangement Umrah Indonesia",
    template: "%s | LA Farha",
  },
  description:
    "Platform B2B Land Arrangement (LA) Umrah terpercaya untuk Travel Agent di Indonesia. Solusi terintegrasi untuk booking hotel Makkah & Madinah, tiket penerbangan, visa resmi, bus, dan muthawif.",
  keywords: [
    "Land Arrangement Umrah",
    "LA Umrah Indonesia",
    "Provider LA Umrah",
    "B2B Land Arrangement Umrah",
    "Paket LA Umrah Terbaik",
    "Handling Umrah Indonesia",
    "Booking Hotel Umrah Makkah Madinah",
    "Provider Visa Umrah Resmi",
  ],
  authors: [
    { name: "Ahmad Fatih (CEO / Founder)" },
    { name: "Rezki Ade (CTO / Co-Founder)", url: "https://rezkiade.com" },
    { name: "Hasbi Jamal (CMO / Co-Founder)" },
    { name: "LA Farha" },
  ],
  creator: "LA Farha",
  publisher: "LA Farha",
  alternates: {
    canonical: "https://lafarha.id",
  },
  openGraph: {
    title: "FARHA — Platform B2B Land Arrangement Umrah Indonesia",
    description:
      "Platform B2B Land Arrangement (LA) Umrah terpercaya untuk Travel Agent di Indonesia. Layanan hotel Makkah & Madinah, tiket penerbangan, visa resmi, bus, dan muthawif.",
    url: "https://lafarha.id",
    siteName: "LA Farha",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/farha-logo-full.jpeg",
        width: 1200,
        height: 630,
        alt: "LA Farha — Platform B2B Land Arrangement Umrah Indonesia",
      },
      {
        url: "/farha-logo-only.jpeg",
        width: 1200,
        height: 630,
        alt: "LA Farha Emblem Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FARHA — Platform B2B Land Arrangement Umrah Indonesia",
    description:
      "Platform B2B Land Arrangement (LA) Umrah terpercaya untuk Travel Agent di Indonesia. Layanan hotel Makkah & Madinah, tiket penerbangan, visa resmi, bus, dan muthawif.",
    images: ["/farha-logo-full.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/farha-logo-only.png",
  },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TravelAgency",
      "@id": "https://lafarha.id/#organization",
      name: "LA Farha",
      alternateName: [
        "Farha",
        "PT LA Farha",
        "LA Farha Umrah",
        "Farha Umrah Services",
      ],
      url: "https://lafarha.id",
      logo: "https://lafarha.id/farha-logo-full.jpeg",
      image: "https://lafarha.id/farha-logo-full.jpeg",
      description:
        "Platform B2B Land Arrangement Umrah terpercaya di Indonesia untuk travel agent yang menyediakan akomodasi hotel Makkah & Madinah, tiket penerbangan, visa resmi, transportasi darat, dan muthawif.",
      telephone: "+6285176861181",
      email: "info@lafarha.id",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Jakarta Selatan",
        addressRegion: "DKI Jakarta",
        addressCountry: "ID",
      },
      areaServed: [
        { "@type": "Country", "name": "Indonesia" },
        { "@type": "Country", "name": "Saudi Arabia" },
      ],
      founder: [
        {
          "@type": "Person",
          name: "Ahmad Fatih",
          jobTitle: "CEO / Founder",
        },
        {
          "@type": "Person",
          name: "Rezki Ade",
          alternateName: "Rezki Ade Pratama Putra",
          jobTitle: "CTO / Co-Founder",
          url: "https://rezkiade.com",
          sameAs: [
            "https://rezkiade.com",
            "https://linkedin.com/in/rezkiade",
            "https://github.com/kycaine",
          ],
        },
        {
          "@type": "Person",
          name: "Hasbi Jamal",
          jobTitle: "CMO / Co-Founder",
        },
      ],
      parentOrganization: {
        "@type": "Organization",
        name: "Reternia",
        url: "https://reternia.com",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Layanan Land Arrangement Umrah B2B",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Akomodasi Hotel Makkah & Madinah Bintang 3-5",
              description: "Pemesanan kamar hotel Double, Triple, Quad, dan Quint di Makkah dan Madinah.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Transportasi Darat Bus & Coaster",
              description: "Layanan transportasi bus eksekutif full trip Makkah, Madinah, Jeddah, dan ziarah.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Tiket Penerbangan Umrah",
              description: "Tiket pesawat internasional dan domestik untuk rombongan umrah.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Pengurusan Visa Umrah Resmi & Siskopatuh",
              description: "Layanan provider visa umrah resmi dengan integrasi sistem Kementerian Agama.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Muthawif & Guide Profesional",
              description: "Pembimbing ibadah bersertifikat resmi untuk pendampingan jamaah di Tanah Suci.",
            },
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://lafarha.id/#website",
      url: "https://lafarha.id",
      name: "LA Farha",
      publisher: {
        "@id": "https://lafarha.id/#organization",
      },
      inLanguage: "id-ID",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${playfair.variable} ${cinzel.variable} ${caveat.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white">
        <link rel="stylesheet" href="/styles.css" precedence="default" />
        <AlertProvider>
          <AuthProvider>
            <PageWrapper>{children}</PageWrapper>
          </AuthProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
