import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Digital Safety for Elementary Kids (Ages 6-10) | Komal Kids",
  description:
    "Three-tier content filtering, peer-avatar guidance, and weekly reports for children ages 6-10. Help your elementary-age child explore the internet safely with psychology-informed tools.",
  keywords:
    "elementary school internet safety, child web filter ages 6-10, kids safe browsing, child content filtering, elementary digital safety, peer avatar for kids, kids internet guide, child online protection, safe search for kids, elementary screen time, child web safety tool, kid friendly internet",
  openGraph: {
    title: "Digital Safety for Elementary Kids (6-10) | Komal Kids",
    description:
      "Three-tier content filtering with peer-avatar guidance for elementary-age children. Weekly plain-language reports for parents.",
    url: "https://komalkids.com/parents/6-10",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/parents/6-10",
  },
};

export default function Parents610Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="parents-6-10-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "For Parents", item: "https://komalkids.com/parents" },
              { "@type": "ListItem", position: 3, name: "Ages 6-10", item: "https://komalkids.com/parents/6-10" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
