import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Komal for Employers | Family Digital Wellbeing as an Employee Benefit",
  description:
    "Offer Komal as a family digital wellbeing benefit. Help employees' children stay safe online with psychology-informed guidance. Reduce parenting stress, support working parents, and improve employee retention.",
  keywords:
    "employee family benefits, digital wellbeing benefit, working parent support, child safety employee benefit, corporate family program, HR family benefits, parental benefit program, employee wellbeing digital safety, child internet safety benefit, corporate wellness family, employee retention family benefits",
  openGraph: {
    title: "Komal for Employers | Family Digital Wellbeing Benefit",
    description:
      "Support working parents with a family digital wellbeing benefit. Help employees' children develop healthy digital habits with psychology-informed guidance.",
    url: "https://komalkids.com/for-employers",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/for-employers",
  },
};

export default function ForEmployersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="for-employers-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "For Employers", item: "https://komalkids.com/for-employers" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
