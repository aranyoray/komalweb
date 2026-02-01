import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | AI for Kids, Digital Safety & Parenting | Komal Kids",
  description: "Expert insights on AI for children, digital safety, parenting tips, and child development. Learn about safe AI companions, educational apps, and screen time management.",
  keywords: "ai for kids blog, digital safety blog, parenting blog, child development, ai companion blog, educational technology blog",
  openGraph: {
    title: "Komal Kids Blog | AI for Kids & Digital Safety",
    description: "Expert insights on AI for children, digital safety, and parenting.",
    url: "https://komalkids.com/blog",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
