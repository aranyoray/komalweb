import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why AgileWeb | The Future of Child Internet Safety",
  description: "Discover why AgileWeb is different from traditional parental controls. AI-powered digital guardian that understands children through behavior, not just blocking content. Built by researchers and parents.",
  keywords: "why parental control, child internet safety solution, digital guardian for kids, AI child protection, behavioral AI for children, modern parental controls, child online safety, why content filtering",
  openGraph: {
    title: "Why AgileWeb | Beyond Traditional Parental Controls",
    description: "AI-powered digital guardian that understands children through behavior. Built by researchers and parents for true online safety.",
    url: "https://komalkids.com/why",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Why AgileWeb for Child Internet Safety",
    description: "Discover the AI-powered digital guardian that goes beyond blocking to truly protect children online.",
  },
  alternates: {
    canonical: "https://komalkids.com/why",
  },
};

export default function WhyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
