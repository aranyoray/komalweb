import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Digital Independence for Older Teens (Ages 16+) | Komal Kids",
  description:
    "Self-directed wellbeing tools, digital citizenship skills, and preparation for independent digital life for older teens ages 16 and above. Pioneer Program leadership credentials for college applications. Build lasting digital habits before adulthood.",
  keywords:
    "older teen internet safety, 16 plus digital safety, young adult digital wellbeing, teen digital independence, preparing teens for internet, older teenager online safety, digital citizenship older teens, young adult screen time, college prep digital skills, teen self-regulation online, 16-18 internet safety, late teen digital habits, transition to digital independence, teen digital leadership program, college application digital citizenship",
  openGraph: {
    title: "Digital Independence for Older Teens (16+) | Komal Kids",
    description:
      "Self-directed wellbeing tools and digital citizenship skills. Pioneer Program leadership credentials. Prepare older teens for independent, healthy digital life.",
    url: "https://komalkids.com/parents/16-plus",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/parents/16-plus",
  },
};

export default function Parents16PlusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="parents-16-plus-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "For Parents", item: "https://komalkids.com/parents" },
              { "@type": "ListItem", position: 3, name: "Ages 16+", item: "https://komalkids.com/parents/16-plus" },
            ],
          }),
        }}
      />
      <Script
        id="parents-16-plus-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How do I transition my teen from parental controls to digital independence?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The transition should be gradual and evidence-based. Komal supports this by shifting from a parent-managed tool to a teen-owned wellbeing dashboard. Your teen sees their own patterns and sets their own goals, while you still receive high-level pattern insights.",
                },
              },
              {
                "@type": "Question",
                name: "Is Komal useful for a 17 or 18-year-old?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, but for different reasons than younger children. For older teens, Komal functions as a digital wellness tool: it helps them understand their own focus patterns, distraction triggers, and emotional engagement trends. The Pioneer Program also gives older teens a concrete leadership role.",
                },
              },
              {
                "@type": "Question",
                name: "How does the Pioneer Program help with college applications?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Pioneers earn a Komal Digital Leadership Certificate that documents their mentorship hours, workshop facilitation, and ethical AI literacy. They build a portfolio of community service specifically around digital wellbeing, which demonstrates initiative, empathy, and technical understanding.",
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
