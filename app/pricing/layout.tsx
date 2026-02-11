import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Pricing Plans | Child Safety App for Families & Schools",
  description: "Affordable child internet safety plans starting free. KOMAL pricing for families, schools, and clinics. AI-powered parental controls.",
  keywords: "parental control app pricing, child safety app cost, family internet safety plan, school safety software pricing, affordable parental controls, kids safety app subscription, child protection app plans",
  openGraph: {
    title: "KOMAL Pricing | Child Internet Safety Plans",
    description: "Affordable plans for families, schools, and therapy centers. Start free with AI-powered child protection.",
    url: "https://komalkids.com/pricing",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "KOMAL Pricing Plans | Child Safety App",
    description: "Affordable child internet safety plans starting free. For families, schools, and therapy centers.",
  },
  alternates: {
    canonical: "https://komalkids.com/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="pricing-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "Pricing", item: "https://komalkids.com/pricing" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
