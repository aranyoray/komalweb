import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Digital Safety for Toddlers & Preschoolers (Ages 0-5) | Komal Kids",
  description:
    "Guided first screen experiences for children ages 0-5. Co-play features, developmental tracking, and age-appropriate content for toddlers and preschoolers. No dark patterns, psychology-informed design. Trusted by child psychologists.",
  keywords:
    "toddler screen time, preschooler internet safety, baby screen time guide, first screen experience, toddler digital safety, preschool safe apps, child development screen time, co-play digital, toddler content filtering, age appropriate content 0-5, infant screen time research, early childhood digital wellbeing, safe screen time toddler, how much screen time for 2 year old, psychology informed screen time, child safe AI for toddlers",
  openGraph: {
    title: "Digital Safety for Toddlers & Preschoolers (0-5) | Komal Kids",
    description:
      "Guided first screen experiences with co-play features and developmental tracking. Psychology-informed safety for your youngest children. No ads, no dark patterns.",
    url: "https://komalkids.com/parents/0-5",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/parents/0-5",
  },
};

export default function Parents05Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="parents-0-5-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "For Parents", item: "https://komalkids.com/parents" },
              { "@type": "ListItem", position: 3, name: "Ages 0-5", item: "https://komalkids.com/parents/0-5" },
            ],
          }),
        }}
      />
      <Script
        id="parents-0-5-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How much screen time is healthy for a toddler?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The American Academy of Pediatrics recommends avoiding screen time for children under 18 months (except video calls) and limiting high-quality programming to 1 hour per day for ages 2-5, always with a caregiver present. Komal is designed around these guidelines, with built-in session limits and co-play features.",
                },
              },
              {
                "@type": "Question",
                name: "Is Komal safe for a 2-year-old to use?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Komal is designed for co-play with a parent or caregiver present. For children under 3, all interactions are voice-guided and require minimal touch. There are no ads, no in-app purchases, and no addictive mechanics.",
                },
              },
              {
                "@type": "Question",
                name: "What is a psychology-informed alternative to screen time blockers for toddlers?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Rather than simply blocking screens, Komal provides guided, age-appropriate digital experiences with built-in stopping points. This teaches healthy digital habits from the start rather than creating a forbidden-fruit dynamic around screens.",
                },
              },
              {
                "@type": "Question",
                name: "Can Komal detect early developmental patterns?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Komal is not a diagnostic tool. However, it tracks engagement patterns, attention spans, and interaction preferences over time, and presents these in plain-language reports. Some parents and clinicians find these longitudinal insights helpful context for developmental conversations.",
                },
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
