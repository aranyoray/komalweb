import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Digital Safety for Older Teens (Ages 16+) | Komal Kids",
  description:
    "Self-directed wellbeing tools, digital citizenship skills, and preparation for independent digital life for older teens ages 16 and above. Build lasting digital habits before adulthood.",
  keywords:
    "older teen internet safety, 16 plus digital safety, young adult digital wellbeing, teen digital independence, preparing teens for internet, older teenager online safety, digital citizenship older teens, young adult screen time, college prep digital skills, teen self-regulation online, 16-18 internet safety, late teen digital habits",
  openGraph: {
    title: "Digital Safety for Older Teens (16+) | Komal Kids",
    description:
      "Self-directed wellbeing tools and digital citizenship skills. Prepare older teens for independent, healthy digital life.",
    url: "https://komalkids.com/parents/16-plus",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/parents/16-plus",
  },
};

export default function Parents16PlusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="parents-16-plus-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "For Parents", item: "https://komalkids.com/parents" },
              { "@type": "ListItem", position: 3, name: "Ages 16+", item: "https://komalkids.com/parents/16-plus" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
