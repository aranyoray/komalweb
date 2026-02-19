import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "For Parents | Child Internet Safety by Age Group | Komal Kids",
  description:
    "Psychology-informed digital safety for every age. Find age-specific guidance for your child: toddlers (0-5), elementary (6-10), preteens (10-13), teenagers (13-16), and older teens (16+). No dark patterns, no surveillance. Research-backed child safety. Trusted by 170+ families across 5 countries.",
  keywords:
    "child internet safety, parental controls alternative, digital safety for kids, child screen time, kids online safety, parenting digital age, child web safety by age, safe internet for children, psychology based parental controls, child development digital, kid safe browsing, screen time management children, best child safety app, alternative to bark for kids, no surveillance parental control, child digital wellbeing by age",
  openGraph: {
    title: "For Parents | Child Digital Safety by Age Group | Komal Kids",
    description:
      "Understand your child's digital world without invading their privacy. Age-specific guidance from toddlers to teens. No dark patterns, no surveillance. Trusted by 170+ families.",
    url: "https://komalkids.com/parents",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/parents",
  },
};

export default function ParentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="parents-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "For Parents", item: "https://komalkids.com/parents" },
            ],
          }),
        }}
      />
      <Script
        id="parents-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is Komal and how does it work?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Komal is a psychology-informed Talk-to-Play platform that makes the internet safer for children without surveillance or blanket blocking. It uses a peer avatar (pavatar) to guide children through voice-based prompts, a three-tier content system (Block, Gate, Allow), and provides parents with weekly plain-language insight reports.",
                },
              },
              {
                "@type": "Question",
                name: "How is Komal different from parental control apps like Bark or Qustodio?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Most parental control apps are built around surveillance and restriction. Komal is built around guidance and skill-building. Instead of monitoring every click or blocking access, Komal helps children develop the judgment and self-regulation to navigate the internet safely on their own.",
                },
              },
              {
                "@type": "Question",
                name: "Does Komal use dark patterns?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. Komal explicitly rejects dark patterns, infinite scrolls, streaks, manipulative scoring, and other engagement hooks. The platform is designed to protect intrinsic motivation and focus. Sessions end with natural stopping points, not cliffhangers.",
                },
              },
              {
                "@type": "Question",
                name: "How does Komal protect my child's privacy?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "All AI processing happens on-device. Your child's data never leaves your device without explicit consent. We never sell data or use it for advertising. Komal is COPPA and GDPR-K compliant, with parent-controlled sharing at every step.",
                },
              },
              {
                "@type": "Question",
                name: "What ages does Komal support?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Komal is designed for children and families from ages 0 through 16+. The platform adapts its approach based on developmental stage: co-play for toddlers, guided exploration for elementary kids, self-regulation scaffolding for preteens, and graduated independence for teenagers.",
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
