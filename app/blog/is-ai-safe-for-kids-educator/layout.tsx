import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI in Schools: Safe Educational AI for Children | Komal Kids",
  description: "A pedagogical perspective on using AI safely in educational environments. How Komal Kids aligns with learning objectives and supports classroom outcomes.",
  keywords: "educational ai app for kids, ai in schools children, safe ai for schools, educational technology ai, classroom ai safety",
  openGraph: {
    title: "AI in Schools: Safe Educational AI for Children",
    description: "How educational AI can support learning objectives while maintaining safety and age-appropriateness.",
    url: "https://komalkids.com/blog/is-ai-safe-for-kids-educator",
    type: "article",
  },
  alternates: {
    canonical: "https://komalkids.com/blog/is-ai-safe-for-kids-educator",
  },
};

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
