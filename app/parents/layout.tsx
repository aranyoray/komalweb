import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "For Parents | Child Internet Safety by Age Group | Komal Kids",
  description:
    "Psychology-informed digital safety for every age. Find age-specific guidance for your child: toddlers (0-5), elementary (6-10), preteens (10-13), teenagers (13-16), and older teens (16+). No dark patterns, no surveillance. Research-backed child safety.",
  keywords:
    "child internet safety, parental controls alternative, digital safety for kids, child screen time, kids online safety, parenting digital age, child web safety by age, safe internet for children, psychology based parental controls, child development digital, kid safe browsing, screen time management children",
  openGraph: {
    title: "For Parents | Digital Safety by Age Group | Komal Kids",
    description:
      "Understand your child's digital world without invading their privacy. Age-specific guidance from toddlers to teens. No dark patterns, no surveillance.",
    url: "https://komalkids.com/parents",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/parents",
  },
};

export default function ParentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="parents-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "For Parents", item: "https://komalkids.com/parents" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
