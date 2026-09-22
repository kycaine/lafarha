import BannerSection from "./components/home/BannerSection";
import SeparatorLine from "./components/home/SeparatorLine";
import ProductSection from "./components/home/ProductSection";
import MitraSection from "./components/home/MitraSection";
import FooterSection from "./components/home/FooterSection";
import RoleNavButtons from "./components/home/RoleNavButtons";

export const metadata = {
  title: "FARHA — Platform Land Arrangement Umrah Terpercaya",
  description:
    "Platform B2B terpercaya untuk kebutuhan Land Arrangement Umrah. Hotel, transportasi, penerbangan, visa, dan muthawif dalam satu platform untuk travel agent di Indonesia.",
};

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <BannerSection />
      <SeparatorLine />
      <ProductSection />
      <MitraSection />
      <FooterSection />
      <RoleNavButtons />
    </main>
  );
}
