import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Digital Safety for Teenagers (Ages 13-16) | Komal Kids",
  description:
    "Graduated independence, quiet guidance that respects autonomy, and Pioneer Program leadership opportunities for teenagers ages 13-16. Build digital judgment without surveillance.",
  keywords:
    "teenager internet safety, teen digital safety, ages 13-16 internet, teen parental controls, high school online safety, teen screen time, teenager web safety, teen social media safety, graduated digital independence, teen digital citizenship, adolescent internet guide, teen online wellbeing",
  openGraph: {
    title: "Digital Safety for Teenagers (13-16) | Komal Kids",
    description:
      "Graduated independence with quiet guidance that respects teen autonomy. Pioneer Program leadership opportunities for digital role models.",
    url: "https://komalkids.com/parents/13-16",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/parents/13-16",
  },
};

export default function Parents1316Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="parents-13-16-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "For Parents", item: "https://komalkids.com/parents" },
              { "@type": "ListItem", position: 3, name: "Ages 13-16", item: "https://komalkids.com/parents/13-16" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
