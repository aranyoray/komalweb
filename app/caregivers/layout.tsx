import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "For Caregivers | Grandparent & Guardian Digital Safety | Komal Kids",
  description:
    "Digital safety tools designed for grandparents, guardians, foster parents, and extended family. Easy-to-use dashboard, emotional wellbeing tracking, and collaboration with parents. No tech expertise required.",
  keywords:
    "grandparent internet safety for kids, guardian digital safety, foster parent screen time, caregiver parental controls, grandparent parental controls, nanny screen time management, extended family internet safety, caregiver child safety app, guardian web filter, grandparent technology help, child safety for caregivers, easy parental controls grandparents",
  openGraph: {
    title: "For Caregivers | Digital Safety for Grandparents & Guardians | Komal Kids",
    description:
      "Keep the children in your care safe online with an easy-to-use dashboard. Designed for grandparents, guardians, foster parents, and all caregivers.",
    url: "https://komalkids.com/caregivers",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/caregivers",
  },
};

export default function CaregiversLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="caregivers-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "For Caregivers", item: "https://komalkids.com/caregivers" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
