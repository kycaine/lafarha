import { MetadataRoute } from "next";
import articles from "@/contents/blog/articles.json";
import packagesData from "@/contents/packages/packages.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://lafarha.id";
  const currentDate = new Date().toISOString();

  // Rute Statis Utama
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/muthawif`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Rute Dinamis: Paket Siap Berangkat
  const packageRoutes: MetadataRoute.Sitemap = (packagesData?.readyPackages || []).map((pkg: any) => ({
    url: `${baseUrl}/packages/${pkg.id}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Rute Dinamis: Blog Artikel Edukasi & Topical Authority
  const blogRoutes: MetadataRoute.Sitemap = (articles || []).map((article: any) => ({
    url: `${baseUrl}/blog/${article.id}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...packageRoutes, ...blogRoutes];
}
