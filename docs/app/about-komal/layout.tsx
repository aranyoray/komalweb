import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Komal Kids | AI Digital Guardian for Children",
  description: "Learn about Komal Kids (also known as Komal, Komal – Your Digital Buddy) - the world's first AI-powered digital guardian for children ages 3-12. Founded by Yale and USF alumni, backed by UC Berkeley and APA advisors.",
  keywords: "about komal kids, komal digital buddy, komal kids founders, komal kids team, komal kids advisors, ai for kids company, child safety app founders, komal kids research",
  openGraph: {
    title: "About Komal Kids | AI Digital Guardian for Children",
    description: "Komal Kids (also known as Komal, Komal – Your Digital Buddy) is the world's first AI-powered digital guardian that reads how a child feels, not just what they click.",
    url: "https://komalkids.com/about-komal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Komal Kids | AI Digital Guardian for Children",
    description: "Learn about Komal Kids - founded by Yale and USF alumni, backed by UC Berkeley and APA advisors.",
  },
  alternates: {
    canonical: "https://komalkids.com/about-komal",
  },
};

export default function AboutKomalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
