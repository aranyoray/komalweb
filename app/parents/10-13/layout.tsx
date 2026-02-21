import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Digital Safety for Preteens (Ages 10-13) | Social Media Readiness | Komal Kids",
  description:
    "Context-aware safety, social media readiness insights, and self-regulation scaffolding for preteens ages 10-13. Help your child navigate the transition to independent digital life with psychology-informed guidance. No surveillance, no dark patterns.",
  keywords:
    "preteen internet safety, tween digital safety, ages 10-13 internet, preteen social media safety, middle school online safety, tween screen time, preteen parental controls, social media readiness, self-regulation digital kids, preteen content filter, tween web safety, middle schooler internet guide, should my 11 year old have social media, preteen phone safety, cyberbullying prevention preteens",
  openGraph: {
    title: "Digital Safety for Preteens (10-13) | Social Media Readiness | Komal Kids",
    description:
      "Context-aware safety with social media readiness insights and self-regulation scaffolding for the preteen transition. No surveillance, no dark patterns.",
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
      <Script
        id="parents-10-13-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Should my 11-year-old have social media?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "There is no universal answer, but research consistently shows that emotional regulation, critical thinking, and a strong parent-child communication foundation matter more than age alone. Komal helps you assess your child's readiness by tracking digital engagement patterns, self-regulation behaviors, and decision-making trends over time.",
                },
              },
              {
                "@type": "Question",
                name: "How do I keep my preteen safe online without losing their trust?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Surveillance-based tools often backfire with preteens because they feel like a violation of trust. Komal is transparent about what it does, focuses on building your child's own judgment, and gives you insight into patterns (not transcripts). The goal is a conversation, not a confrontation.",
                },
              },
              {
                "@type": "Question",
                name: "What is a psychology-informed alternative to parental control apps for preteens?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Traditional parental controls were designed for younger children and often create resistance in preteens. Komal is psychology-informed, using developmental science to scaffold self-regulation rather than impose external restrictions. The peer avatar approach matches how preteens naturally learn: from peers, not authority figures.",
                },
              },
              {
                "@type": "Question",
                name: "How does Komal handle cyberbullying concerns?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Komal does not read private messages. However, it tracks behavioral patterns that may indicate distress: changes in browsing behavior, shifts in engagement quality, and emotional regulation trends. These pattern changes can prompt a timely conversation between parent and child.",
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
