import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Child Safe AI Design: Architecture and Guardrails | Komal Kids",
  description: "A technical analysis of child-safe AI design, system behavior, and architectural guardrails. Why constrained AI models are safer for children.",
  keywords: "child safe ai design, ai alignment for kids, child ai architecture, ai safety guardrails, constrained ai models, child ai system design",
  openGraph: {
    title: "Child Safe AI Design: Architecture and Guardrails for Kids",
    description: "A technical analysis of how child-safe AI systems differ architecturally from general-purpose models.",
    url: "https://komalkids.com/blog/is-ai-safe-for-kids-tech",
    type: "article",
  },
  alternates: {
    canonical: "https://komalkids.com/blog/is-ai-safe-for-kids-tech",
  },
};

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
