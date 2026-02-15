import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Online Safety for Kids Ages 6-10 | Safe Browsing for Elementary School | Komal Kids",
  description:
    "Three-tier content filtering, peer-avatar guidance, and weekly reports for children ages 6-10. Help your elementary-age child explore the internet safely with psychology-informed tools. No surveillance, no dark patterns.",
  keywords:
    "elementary school internet safety, child web filter ages 6-10, kids safe browsing, child content filtering, elementary digital safety, peer avatar for kids, kids internet guide, child online protection, safe search for kids, elementary screen time, child web safety tool, kid friendly internet, safe browser for elementary kids, parental controls for 7 year old, online safety for first graders",
  openGraph: {
    title: "Online Safety for Elementary Kids (6-10) | Komal Kids",
    description:
      "Three-tier content filtering with peer-avatar guidance for elementary-age children. Weekly plain-language reports for parents. No surveillance.",
    url: "https://komalkids.com/parents/6-10",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/parents/6-10",
  },
};

export default function Parents610Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="parents-6-10-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "For Parents", item: "https://komalkids.com/parents" },
              { "@type": "ListItem", position: 3, name: "Ages 6-10", item: "https://komalkids.com/parents/6-10" },
            ],
          }),
        }}
      />
      <Script
        id="parents-6-10-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How much screen time should a 7-year-old have?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The American Academy of Pediatrics recommends consistent limits for children 6 and older, ensuring screen time doesn't interfere with sleep, physical activity, and other healthy behaviors. Most experts suggest 1-2 hours of high-quality content per day. Komal helps make the time your child does spend online intentional and enriching.",
                },
              },
              {
                "@type": "Question",
                name: "What is a child-safe browser that still allows learning?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Komal sits on top of existing browsers as a safety layer. Unlike blockers that restrict everything, Komal uses a three-tier system: Block (harmful content), Gate (educational content with a mindful pause), and Allow (age-appropriate content).",
                },
              },
              {
                "@type": "Question",
                name: "What makes Komal different from GoGuardian or Bark for this age group?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Most monitoring tools are designed around restriction and surveillance. Komal is designed around guidance and skill-building. Instead of alerting parents after a child visits a concerning site, Komal helps the child pause and reflect before they get there.",
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
