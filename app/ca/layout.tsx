import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safe AI App for Kids Canada | Komal Kids | PIPEDA Compliant",
  description: "Komal Kids - Canada's trusted privacy-first AI learning app. PIPEDA compliant, bilingual support in English and French. Trusted by 15,000+ Canadian families.",
  keywords: [
    "AI app for kids Canada",
    "PIPEDA compliant AI",
    "safe AI for children Canada",
    "kids learning app Canada",
    "Komal Kids",
    "application IA pour enfants",
    "child safe AI app",
    "educational AI Canada",
    "bilingual AI kids app"
  ],
  openGraph: {
    title: "Komal Kids Canada | Safe AI for Children",
    description: "Canada's trusted privacy-first AI learning app. PIPEDA compliant and bilingual.",
    url: "https://komalkids.com/ca",
    siteName: "Komal Kids",
    locale: "en_CA",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/ca",
    languages: {
      'en-CA': 'https://komalkids.com/ca',
      'fr-CA': 'https://komalkids.com/ca',
    },
  },
};

export default function CanadaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
