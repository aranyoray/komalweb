import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ethical AI for Kids: Responsible AI Adoption | Komal Kids",
  description: "A policy perspective on ethical AI principles, child protection, and long-term societal implications of AI designed for children.",
  keywords: "ethical ai for kids, responsible ai children, child ai ethics, ai policy children, ethical ai principles kids",
  openGraph: {
    title: "Ethical AI for Kids: Responsible AI Adoption for Children",
    description: "A policy perspective on ethical AI principles and long-term societal implications of AI for children.",
    url: "https://komalkids.com/blog/is-ai-safe-for-kids-policy",
    type: "article",
  },
  alternates: {
    canonical: "https://komalkids.com/blog/is-ai-safe-for-kids-policy",
  },
};

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
