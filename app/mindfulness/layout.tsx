import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meet KOMAL | AI Digital Guardian for Child Safety",
  description: "Meet KOMAL - the AI digital guardian for children ages 3-12. Behavioral AI that understands emotions and adapts to each child's learning style.",
  keywords: "digital guardian for kids, AI child companion, child safety AI, kids learning companion, behavioral AI children, emotional AI for kids, adaptive learning child, safe AI for children",
  openGraph: {
    title: "Meet KOMAL | Your Child's AI Digital Guardian",
    description: "AI-powered companion that understands your child's emotions and learning style while keeping them safe online.",
    url: "https://komalkids.com/mindfulness",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet KOMAL | AI Digital Guardian",
    description: "The AI companion that understands your child and keeps them safe online.",
  },
  alternates: {
    canonical: "https://komalkids.com/mindfulness",
  },
};

export default function MindfulnessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
