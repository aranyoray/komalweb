import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Digital Safety for Preteens (Ages 10-13) | Komal Kids",
  description:
    "Context-aware safety, social media readiness, and self-regulation scaffolding for preteens ages 10-13. Help your child navigate the transition to independent digital life with psychology-informed guidance.",
  keywords:
    "preteen internet safety, tween digital safety, ages 10-13 internet, preteen social media safety, middle school online safety, tween screen time, preteen parental controls, social media readiness, self-regulation digital kids, preteen content filter, tween web safety, middle schooler internet guide",
  openGraph: {
    title: "Digital Safety for Preteens (10-13) | Komal Kids",
    description:
      "Context-aware safety with social media readiness insights and self-regulation scaffolding for the preteen transition.",
    url: "https://komalkids.com/parents/10-13",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/parents/10-13",
  },
};

export default function Parents1013Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="parents-10-13-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "For Parents", item: "https://komalkids.com/parents" },
              { "@type": "ListItem", position: 3, name: "Ages 10-13", item: "https://komalkids.com/parents/10-13" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
