import type { Metadata } from "next";
import { Inter, Playfair_Display, Cinzel, Caveat } from "next/font/google";
import { AuthProvider } from "@/shared/AuthContext";
import { AlertProvider } from "@/shared/AlertContext";
import "./globals.css";

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
  title: "FARHA — Platform Land Arrangement Umrah",
  description: "Platform B2B Land Arrangement Umrah terpercaya untuk travel agent di Indonesia.",
  openGraph: {
    title: "FARHA — Platform Land Arrangement Umrah",
    description: "Platform B2B Land Arrangement Umrah terpercaya untuk travel agent di Indonesia.",
    images: [
      {
        url: "/farha-logo-full.jpeg",
        width: 1200,
        height: 630,
        alt: "FARHA Logo Full",
      },
      {
        url: "/farha-logo-only.jpeg",
        width: 1200,
        height: 630,
        alt: "FARHA Logo Only",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FARHA — Platform Land Arrangement Umrah",
    description: "Platform B2B Land Arrangement Umrah terpercaya untuk travel agent di Indonesia.",
    images: ["/farha-logo-full.jpeg", "/farha-logo-only.jpeg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${playfair.variable} ${cinzel.variable} ${caveat.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <AlertProvider>
          <AuthProvider>{children}</AuthProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
