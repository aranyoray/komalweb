import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What is a Digital Buddy for Children? | Komal Kids Blog",
  description: "Explore how AI digital buddies work, their benefits for child development, and what makes them safe and effective for children.",
  keywords: "digital buddy for children, ai companion for kids, digital buddy kids, ai friend for kids, children digital companion",
  openGraph: {
    title: "What is a Digital Buddy for Children? Understanding AI Companions",
    description: "Explore how AI digital buddies work, their benefits for child development, and what makes them safe and effective.",
    url: "https://komalkids.com/blog/what-is-digital-buddy-for-children",
    type: "article",
  },
  alternates: {
    canonical: "https://komalkids.com/blog/what-is-digital-buddy-for-children",
  },
};

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
