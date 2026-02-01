import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Komal Kids | The Trusted AI Platform for Children",
  description: "Komal Kids is building child-safe AI designed for learning, trust, and long-term impact across homes, schools, and institutions.",
  keywords: "child safe ai platform, ai for children investment, child ai technology, safe ai for kids platform, child ai startup",
  openGraph: {
    title: "Komal Kids | The Trusted AI Platform for Children",
    description: "Building the future of child-safe AI designed for learning, trust, and long-term impact.",
    url: "https://komalkids.com/investors",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/investors",
  },
};

export default function InvestorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
