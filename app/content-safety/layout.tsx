import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Content Safety | Child Internet Safety Filtering",
  description: "Learn how KOMAL protects kids with AI content filtering. Our Block/Gate/Allow system gives age-appropriate internet access for ages 3-16.",
  keywords: "child content filtering, internet safety for kids, age-appropriate content, parental control settings, safe browsing kids, online content filter",
  openGraph: {
    title: "Child Content Safety Guide | KOMAL Parental Control",
    description: "AI-powered content filtering with Block/Gate/Allow system. Age-appropriate internet access for children ages 3-16.",
    url: "https://komalkids.com/content-safety",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Child Content Safety Guide | KOMAL",
    description: "How KOMAL protects children with AI-powered content filtering and age-appropriate access.",
  },
  alternates: {
    canonical: "https://komalkids.com/content-safety",
  },
};

export default function ContentSafetyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="content-safety-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "Content Safety", item: "https://komalkids.com/content-safety" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
