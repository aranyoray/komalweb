import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download KOMAL | App Store, Google Play & Chrome",
  description: "Download KOMAL - the AI-powered digital guardian for children. Available on the App Store, Google Play, and Chrome Web Store. Real-time behavioral AI, privacy-first design, and weekly parent insights.",
  keywords: "download komal app, app store, google play, chrome extension, child safety app download, parental control app, kids safety app, download komal kids, browser extension",
  openGraph: {
    title: "Download KOMAL | App Store, Google Play & Chrome",
    description: "Download KOMAL - the AI-powered digital guardian for children. Available on iOS, Android, and Chrome.",
    url: "https://komalkids.com/marketing",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Download KOMAL | App Store, Google Play & Chrome",
    description: "Download KOMAL - the AI-powered digital guardian for children. Available on iOS, Android, and Chrome.",
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
