import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Komal for Schools | AI Learning Platform",
  description: "Komal helps schools deliver personalized, safe AI learning. Classroom dashboards, SEL alignment, and student insights.",
  keywords: "ai for schools, educational ai platform, classroom ai, student engagement analytics, sel framework, school ai software, educational technology for schools",
  openGraph: {
    title: "Komal Kids for Schools | AI Learning Platform",
    description: "Empower your students with personalized AI learning experiences. Classroom-level insights and SEL framework alignment.",
    url: "https://komalkids.com/for-schools",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/for-schools",
  },
};

export default function ForSchoolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="for-schools-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "For Schools", item: "https://komalkids.com/for-schools" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
