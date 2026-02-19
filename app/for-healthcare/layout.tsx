import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Komal for Healthcare | Pediatric Digital Wellbeing Insights | Child Therapy Support",
  description:
    "Komal helps pediatricians, child psychologists, developmental pediatricians, and therapists support children's digital wellbeing. Between-session insights, clinical-grade developmental reports, and HIPAA-compatible privacy architecture.",
  keywords:
    "pediatric digital wellbeing, child psychologist tools, developmental pediatrics software, child therapy digital safety, pediatric screen time, occupational therapy digital tools, speech therapy support, autism center technology, child behavioral health, between-session monitoring, child development milestones, pediatric practice technology",
  openGraph: {
    title: "Komal for Healthcare | Pediatric Digital Wellbeing Insights",
    description:
      "Support your patients' digital development with clinical-grade insights. Between-session monitoring, developmental milestone tracking, and parent collaboration tools.",
    url: "https://komalkids.com/for-healthcare",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/for-healthcare",
  },
};

export default function ForHealthcareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="for-healthcare-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "For Healthcare", item: "https://komalkids.com/for-healthcare" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
