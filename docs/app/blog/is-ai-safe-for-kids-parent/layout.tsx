import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Is AI Safe for Kids? A Parent's Guide | Komal Kids Blog",
  description: "A warm, practical guide for parents on AI safety for kids. Learn about risks, safeguards, and why Komal Kids is safer than generic AI for your child.",
  keywords: "safe ai for kids, ai for children safety, is ai safe for kids, child safe ai, ai safety for children, safe ai companion for kids",
  openGraph: {
    title: "Is AI Safe for Kids? A Parent's Guide to Safe AI for Children",
    description: "A warm, practical guide for parents on AI safety for kids. Learn about risks, safeguards, and why Komal Kids is safer.",
    url: "https://komalkids.com/blog/is-ai-safe-for-kids-parent",
    type: "article",
  },
  alternates: {
    canonical: "https://komalkids.com/blog/is-ai-safe-for-kids-parent",
  },
};

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
