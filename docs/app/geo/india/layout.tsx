import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Learning App for Kids India | Komal Kids",
  description: "Komal Kids - the safe AI learning app for kids in India. Privacy-first AI companion designed for Indian families.",
  keywords: "ai learning app for kids india, ai for kids india, safe ai for kids india, educational ai app india, children ai companion india",
  openGraph: {
    title: "AI Learning App for Kids India | Komal Kids",
    description: "Komal Kids - the safe AI learning app for kids in India. Privacy-first and culturally relevant.",
    url: "https://komalkids.com/geo/india",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/geo/india",
  },
};

export default function IndiaGeoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
