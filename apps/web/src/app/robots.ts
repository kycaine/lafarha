import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://lafarha.id";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/packages",
          "/packages/*",
          "/products",
          "/muthawif",
          "/muthawif/*",
          "/tentang",
          "/gallery",
          "/blog",
          "/blog/*",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/storage/*",
          "/counter",
          "/counter/*",
          "/quote",
          "/quote/*",
          "/login",
          "/settings",
          "/unauthorized",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
