import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Digital Wellbeing for Teenagers (Ages 13-16) | No Surveillance | Komal Kids",
  description:
    "Graduated independence, quiet guidance that respects autonomy, and Pioneer Program leadership opportunities for teenagers ages 13-16. Build digital judgment without surveillance or dark patterns. Trusted by families and clinicians.",
  keywords:
    "teenager internet safety, teen digital safety, ages 13-16 internet, teen parental controls, high school online safety, teen screen time, teenager web safety, teen social media safety, graduated digital independence, teen digital citizenship, adolescent internet guide, teen online wellbeing, keep teenager safe online without spying, teen digital wellbeing app, teen phone addiction help",
  openGraph: {
    title: "Digital Wellbeing for Teenagers (13-16) | No Surveillance | Komal Kids",
    description:
      "Graduated independence with quiet guidance that respects teen autonomy. Pioneer Program leadership opportunities for digital role models. No surveillance.",
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
      <Script
        id="parents-13-16-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How do I set healthy phone habits for my teenager?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Research shows that external controls become less effective in the teen years. The most sustainable approach is building intrinsic motivation for healthy digital habits. Komal supports this by making your teen's own usage patterns visible to them, prompting self-reflection, and providing a gradual path toward independent digital wellbeing.",
                },
              },
              {
                "@type": "Question",
                name: "How can I keep my teenager safe online without spying on them?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Komal doesn't read messages, log keystrokes, or take screenshots. Instead, it tracks behavioral patterns (focus, engagement quality, emotional regulation trends) and provides you with aggregated insights. Your teen knows what Komal does and doesn't do, which preserves the trust that makes safety conversations possible.",
                },
              },
              {
                "@type": "Question",
                name: "What is the best digital wellbeing app for teens that isn't surveillance?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Most teen safety tools are surveillance tools with a friendlier interface. Komal is fundamentally different: it's a skill-building tool that helps teenagers develop judgment and self-regulation to stay safe independently. The goal is for your teen to eventually not need Komal.",
                },
              },
              {
                "@type": "Question",
                name: "How does the Pioneer Program work for teenagers?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The Pioneer Program invites teens to become digital role models. Pioneers help younger children build safe digital journeys, earn a Digital Leadership Certificate, and build a portfolio that demonstrates ethical AI literacy and community service for college and scholarship applications.",
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
