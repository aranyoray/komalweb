import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safe AI App for Kids USA | Komal Kids | COPPA Compliant",
  description: "Komal Kids - America's most trusted privacy-first AI learning app for children. COPPA & CCPA compliant. Research-backed by Yale and UC Berkeley experts.",
  keywords: [
    "AI app for kids USA",
    "COPPA compliant AI",
    "safe AI for children",
    "kids learning app",
    "Komal Kids",
    "child safe AI app",
    "educational AI USA",
    "privacy AI kids",
    "parental controls AI"
  ],
  openGraph: {
    title: "Komal Kids USA | Safe AI for Children",
    description: "America's most trusted privacy-first AI learning app. COPPA compliant and research-backed.",
    url: "https://komalkids.com/us",
    siteName: "Komal Kids",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/us",
  },
};

export default function USLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
