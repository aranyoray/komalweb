import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans | Child Safety App for Families & Schools",
  description: "Affordable child internet safety plans starting free. KOMAL parental control app pricing for families, schools, and therapy centers. Protect your children online with AI-powered content filtering.",
  keywords: "parental control app pricing, child safety app cost, family internet safety plan, school safety software pricing, affordable parental controls, kids safety app subscription, child protection app plans",
  openGraph: {
    title: "KOMAL Pricing | Child Internet Safety Plans",
    description: "Affordable plans for families, schools, and therapy centers. Start free with AI-powered child protection.",
    url: "https://komalkids.com/pricing",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "KOMAL Pricing Plans | Child Safety App",
    description: "Affordable child internet safety plans starting free. For families, schools, and therapy centers.",
  },
  alternates: {
    canonical: "https://komalkids.com/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
