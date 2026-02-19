import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "For Children | Safe Digital Play & Learning | Komal Kids",
  description:
    "Komal makes the internet a safe, fun, and enriching place for children. Psychology-informed Talk-to-Play platform with peer avatars, guided exploration, and no dark patterns. Designed for kids ages 4-14.",
  keywords:
    "safe internet for children, child safe browsing, kids digital safety, child friendly internet, talk to play for kids, peer avatar for children, safe digital play, kids online safety app, child internet protection, digital wellbeing for children, kid safe browser, children screen time, safe apps for kids, child safe AI, educational internet for kids",
  openGraph: {
    title: "For Children | Safe Digital Play & Learning | Komal Kids",
    description:
      "The internet should be a playground for learning, not a minefield. Komal guides children through safe, enriching digital experiences with peer avatars and no dark patterns.",
    url: "https://komalkids.com/children",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/children",
  },
};

export default function ChildrenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="children-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "For Children", item: "https://komalkids.com/children" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
