import BannerSection from "./components/home/BannerSection";
import SeparatorLine from "./components/home/SeparatorLine";
import ServiceSection from "./components/home/ServiceSection";
import BlogSection from "./components/home/BlogSection";
import MitraSection from "./components/home/MitraSection";
import GallerySection from "./components/home/GallerySection";
import FooterSection from "./components/home/FooterSection";
import RoleNavButtons from "./components/home/RoleNavButtons";

export const metadata = {
  title: "FARHA | Platform LA Umrah Terpercaya",
  description:
    "Platform B2B terpercaya untuk kebutuhan Land Arrangement Umrah. Hotel, transportasi, penerbangan, visa, dan muthawif dalam satu platform untuk travel agent di Indonesia.",
};

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <BannerSection />
      <ServiceSection />
      <MitraSection />
      <BlogSection />
      <FooterSection />
      <RoleNavButtons />
    </main>
  );
}
