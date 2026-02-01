import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Companion for Kids | Safe Digital Buddy | Komal Kids",
  description: "Discover Komal Kids, the safe AI companion for kids. Real-time behavioral AI adapts to your child's needs with privacy-first design and COPPA compliance.",
  keywords: "ai companion for kids, ai friend for kids, digital buddy for children, safe ai for kids, ai learning companion, children ai companion",
  openGraph: {
    title: "AI Companion for Kids | Safe Digital Buddy | Komal Kids",
    description: "Discover Komal Kids, the safe AI companion for kids. Real-time behavioral AI adapts to your child's needs.",
    url: "https://komalkids.com/ai-companion-for-kids",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/ai-companion-for-kids",
  },
};

export default function AICompanionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
