import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Blog | AI for Kids, Digital Safety & Parenting | Komal Kids",
  description: "Expert insights on AI for children, digital safety, parenting tips, and child development. Safe AI companions and screen time advice.",
  keywords: "ai for kids blog, digital safety blog, parenting blog, child development, ai companion blog, educational technology blog",
  openGraph: {
    title: "Komal Kids Blog | AI for Kids & Digital Safety",
    description: "Expert insights on AI for children, digital safety, and parenting.",
    url: "https://komalkids.com/blog",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="blog-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://komalkids.com/blog" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
