import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI App for Kids in USA | Komal Kids",
  description: "Komal Kids - the safe AI app for kids in the USA. COPPA compliant, privacy-first AI companion for American families.",
  keywords: "ai app for kids in usa, ai for kids usa, safe ai for kids usa, educational ai app usa, children ai companion usa",
  openGraph: {
    title: "AI App for Kids in USA | Komal Kids",
    description: "Komal Kids - the safe AI app for kids in the USA. COPPA compliant and privacy-first.",
    url: "https://komalkids.com/geo/usa",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/geo/usa",
  },
};

export default function USAGeoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
