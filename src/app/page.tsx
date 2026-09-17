import BannerSection from "./components/home/BannerSection";
import ProductSection from "./components/home/ProductSection";
import MitraSection from "./components/home/MitraSection";
import FooterSection from "./components/home/FooterSection";

export const metadata = {
  title: "LA Macan Putih — Platform Land Arrangement Umrah Terpercaya",
  description:
    "Platform B2B terpercaya untuk kebutuhan Land Arrangement Umrah. Hotel, transportasi, penerbangan, visa, dan muthawif dalam satu platform untuk travel agent di Indonesia.",
};

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <BannerSection />
      <ProductSection />
      <MitraSection />
      <FooterSection />
    </main>
  );
}
