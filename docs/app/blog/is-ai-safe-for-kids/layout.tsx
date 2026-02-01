import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Is AI Safe for Kids? A Parent's Complete Guide | Komal Kids Blog",
  description: "Understanding the safety implications of AI for children and how to choose the right AI companion for your child. Learn about privacy, content filtering, and best practices.",
  keywords: "is ai safe for kids, ai safety for children, safe ai for kids, ai companion safety, children ai safety, ai privacy for kids",
  openGraph: {
    title: "Is AI Safe for Kids? A Parent's Complete Guide",
    description: "Understanding the safety implications of AI for children and how to choose the right AI companion for your child.",
    url: "https://komalkids.com/blog/is-ai-safe-for-kids",
    type: "article",
  },
  alternates: {
    canonical: "https://komalkids.com/blog/is-ai-safe-for-kids",
  },
};

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
