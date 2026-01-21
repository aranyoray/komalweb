import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team | Child Safety Experts & AI Researchers",
  description: "Meet the team behind AgileWeb - child safety experts, AI researchers from Yale, and dedicated parents building the future of child internet protection. Based in India, USA, and Canada.",
  keywords: "child safety team, AI researchers Yale, parental control developers, child protection experts, AgileWeb team, child safety startup, edtech founders, child AI researchers",
  openGraph: {
    title: "AgileWeb Team | Child Safety Experts & Researchers",
    description: "Meet our team of child safety experts and AI researchers from Yale building the future of online child protection.",
    url: "https://komalkids.com/team",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet the AgileWeb Team",
    description: "Child safety experts and AI researchers building the future of online child protection.",
  },
  alternates: {
    canonical: "https://komalkids.com/team",
  },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
