import type { Metadata } from "next";
import articles from "@/contents/blog/articles.json";

interface Props {
  params: { id: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const articleId = parseInt(params.id, 10);
  const article = (articles as any[]).find((a) => a.id === articleId);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan",
      description: "Artikel yang Anda cari tidak ditemukan di LA Farha.",
    };
  }

  const title = `${article.title}`;
  const description = article.excerpt || article.content.substring(0, 155);

  return {
    title,
    description,
    alternates: {
      canonical: `https://lafarha.id/blog/${article.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://lafarha.id/blog/${article.id}`,
      siteName: "LA Farha",
      locale: "id_ID",
      type: "article",
      images: [
        {
          url: article.image || "/farha-logo-full.jpeg",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [article.image || "/farha-logo-full.jpeg"],
    },
  };
}

export default function ArticleDetailLayout({ params, children }: Props) {
  const articleId = parseInt(params.id, 10);
  const article = (articles as any[]).find((a) => a.id === articleId);

  const articleJsonLd = article
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        description: article.excerpt,
        image: article.image || "https://lafarha.id/farha-logo-full.jpeg",
        author: {
          "@type": "Organization",
          name: article.author || "LA Farha",
          url: "https://lafarha.id",
        },
        publisher: {
          "@type": "Organization",
          name: "LA Farha",
          logo: {
            "@type": "ImageObject",
            url: "https://lafarha.id/farha-logo-full.jpeg",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://lafarha.id/blog/${article.id}`,
        },
        articleSection: article.category,
      }
    : null;

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
