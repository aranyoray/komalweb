import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Safety & Trust in AI for Kids | Komal Kids",
  description: "Learn how Komal Kids designs AI safely for children with transparency, ethics, and trust at the core. Safety by design, not add-on moderation.",
  keywords: "ai safety for kids, child safe ai, ai trust children, safe ai design kids, child ai safety, ai safety by design",
  openGraph: {
    title: "Safety & Trust at Komal Kids",
    description: "Learn how Komal Kids designs AI safely for children with transparency, ethics, and trust at the core.",
    url: "https://komalkids.com/safety-trust",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/safety-trust",
  },
};

export default function SafetyTrustLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="safety-trust-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "Safety & Trust", item: "https://komalkids.com/safety-trust" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
