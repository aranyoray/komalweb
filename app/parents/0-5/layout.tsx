import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Digital Safety for Toddlers & Preschoolers (Ages 0-5) | Komal Kids",
  description:
    "Guided first screen experiences for children ages 0-5. Co-play features, developmental tracking, and age-appropriate content for toddlers and preschoolers. No dark patterns, psychology-informed design.",
  keywords:
    "toddler screen time, preschooler internet safety, baby screen time guide, first screen experience, toddler digital safety, preschool safe apps, child development screen time, co-play digital, toddler content filtering, age appropriate content 0-5, infant screen time research, early childhood digital wellbeing",
  openGraph: {
    title: "Digital Safety for Toddlers & Preschoolers (0-5) | Komal Kids",
    description:
      "Guided first screen experiences with co-play features and developmental tracking. Psychology-informed safety for your youngest children.",
    url: "https://komalkids.com/parents/0-5",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/parents/0-5",
  },
};

export default function Parents05Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="parents-0-5-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "For Parents", item: "https://komalkids.com/parents" },
              { "@type": "ListItem", position: 3, name: "Ages 0-5", item: "https://komalkids.com/parents/0-5" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
