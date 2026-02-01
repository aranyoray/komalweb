import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Safety for Children: Governance and Risk Mitigation | Komal Kids",
  description: "A technical perspective on AI governance, risk mitigation, and safety architecture for child-facing AI systems. Why predictable systems are safer.",
  keywords: "ai safety for children, child ai governance, ai risk mitigation kids, child ai safety architecture, ai governance children",
  openGraph: {
    title: "AI Safety for Children: Governance and Risk Mitigation",
    description: "A technical perspective on AI governance and safety architecture for child-facing systems.",
    url: "https://komalkids.com/blog/is-ai-safe-for-kids-trust",
    type: "article",
  },
  alternates: {
    canonical: "https://komalkids.com/blog/is-ai-safe-for-kids-trust",
  },
};

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
