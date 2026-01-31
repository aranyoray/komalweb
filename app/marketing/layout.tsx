import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download KOMAL | App Store & Google Play",
  description: "Download KOMAL - the AI-powered digital guardian for children. Available on the App Store and Google Play. Real-time behavioral AI, privacy-first design, and weekly parent insights.",
  keywords: "download komal app, app store, google play, child safety app download, parental control app, kids safety app, download komal kids",
  openGraph: {
    title: "Download KOMAL | App Store & Google Play",
    description: "Download KOMAL - the AI-powered digital guardian for children. Available on iOS and Android.",
    url: "https://komalkids.com/marketing",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Download KOMAL | App Store & Google Play",
    description: "Download KOMAL - the AI-powered digital guardian for children. Available on iOS and Android.",
  },
  alternates: {
    canonical: "https://komalkids.com/marketing",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
