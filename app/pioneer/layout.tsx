import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Pioneer Program | Youth Digital Leadership & Citizenship | Komal Kids",
  description:
    "Join the Komal Pioneer Program for children, teens, and parents. Mentor younger kids in digital safety, earn a Digital Leadership Certificate, and build your portfolio. No dark patterns, psychology-informed, research-backed.",
  keywords:
    "youth digital leadership, digital citizenship program for kids, teen ambassador program, children digital wellbeing, pioneer program for students, digital leadership certificate, online safety mentorship, youth digital role model, child digital safety program, teen leadership opportunity, digital wellbeing for families, ethical AI for kids",
  openGraph: {
    title: "Komal Pioneer Program | Youth Digital Leadership & Citizenship",
    description:
      "The next generation of digital leaders starts here. Mentor younger children, earn certificates, shape ethical AI, and build a portfolio that matters. For children, teens, and parents.",
    url: "https://komalkids.com/pioneer",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/pioneer",
  },
};

export default function PioneerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="pioneer-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "Pioneer Program", item: "https://komalkids.com/pioneer" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
