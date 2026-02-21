import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "For Institutions | Schools, Clinics & Organizations | Komal Kids",
  description:
    "Komal for schools, clinics, healthcare providers, and organizations. Institutional-grade child digital safety with longitudinal developmental insights, COPPA/GDPR-K compliance, and multi-child management.",
  keywords:
    "school internet safety, institutional parental controls, clinic child digital safety, organization child protection, school web filter, institutional child safety platform, school digital wellbeing, educational institution internet safety, child safety for schools, bulk child safety management, institutional screen time, school safe browsing",
  openGraph: {
    title: "For Institutions | Komal Kids Digital Safety Platform",
    description:
      "Institutional-grade child digital safety for schools, clinics, and organizations. Longitudinal developmental insights and COPPA/GDPR-K compliance.",
    url: "https://komalkids.com/institutions",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/institutions",
  },
};

export default function InstitutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="institutions-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "For Institutions", item: "https://komalkids.com/institutions" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
