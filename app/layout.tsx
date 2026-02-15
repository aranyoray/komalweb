import type { Metadata } from "next";
import Script from "next/script";
// import { Inter } from "next/font/google"; // Removed as per user request
import "./globals.css";
//import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientScripts from "@/components/ClientScripts";
import IntroLoader from "@/components/IntroLoader";
import { AuthProvider } from "@/contexts/AuthContext";

import TopBanner from "@/components/TopBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";


// Removed Inter configuration

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://komalkids.com/#organization",
      name: "KOMAL",
      legalName: "ChildCog Private Limited",
      url: "https://komalkids.com",
      logo: {
        "@type": "ImageObject",
        url: "https://komalkids.com/komaliconnobg.png",
      },
      sameAs: [
        "https://twitter.com/komalkids",
      ],
      description:
        "The first psychology-informed Talk-to-Play platform for children and families. We build the social, emotional, and cognitive foundations children need to thrive in a digital world.",
    },
    {
      "@type": "WebSite",
      "@id": "https://komalkids.com/#website",
      url: "https://komalkids.com",
      name: "KOMAL - Psychology-Informed Talk-to-Play Platform",
      publisher: { "@id": "https://komalkids.com/#organization" },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      name: "KOMAL",
      applicationCategory: "EducationalApplication",
      operatingSystem: "iOS, Android",
      description:
        "Psychology-informed Talk-to-Play platform for children and families. Three-tier content filtering, peer-avatar guidance, and longitudinal developmental insights. Ages 0-16+.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      author: { "@id": "https://komalkids.com/#organization" },
    },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "KOMAL - Talk-to-Play Digital Safety for Children | Psychology-Informed",
    template: "%s | KOMAL Kids",
  },
  description: "KOMAL is the first psychology-informed Talk-to-Play platform for children and families. Three-tier content filtering, peer-avatar guidance, and longitudinal developmental insights. COPPA, GDPR-K compliant.",
  keywords: "talk-to-play platform, child digital wellbeing, psychology-informed digital safety, parental controls without dark patterns, safe browsing for kids, content filtering for kids, digital buddy for children, screen time guidance by age",
  authors: [{ name: "KOMAL - ChildCog Private Limited" }],
  creator: "KOMAL",
  publisher: "ChildCog Private Limited",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://komalkids.com",
  },
  openGraph: {
    title: "KOMAL - Talk-to-Play Digital Safety for Children",
    description: "The first psychology-informed Talk-to-Play platform. Three-tier content filtering, peer-avatar guidance, and developmental insights for children ages 0-16+.",
    type: "website",
    url: "https://komalkids.com",
    siteName: "KOMAL",
    locale: "en_US",
    images: [
      {
        url: "https://komalkids.com/heroimage.png",
        width: 1200,
        height: 1200,
        alt: "KOMAL - Talk-to-Play Digital Safety for Children",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KOMAL - Talk-to-Play Digital Safety for Children",
    description: "The first psychology-informed Talk-to-Play platform. Three-tier content filtering, peer-avatar guidance, and developmental insights for children ages 0-16+.",
    images: ["https://komalkids.com/heroimage.png"],
    creator: "@komalkids",
  },
  category: "technology",
  classification: "Child Safety, Parental Control, Education",
  icons: {
    icon: [
      { url: '/komaliconnobg.png', href: '/komaliconnobg.png' },
    ],
    shortcut: ['/komaliconnobg.png'],
    apple: [
      { url: '/komaliconnobg.png' },
    ],
  },
  manifest: "/manifest.json",
  verification: {
    google: "google-site-verification-code",
    other: {
      "msvalidate.01": "bing-webmaster-verification-code",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased font-sans bg-[var(--color-bg)] text-[var(--color-text)]">
        <GoogleAnalytics />
        <AuthProvider>
          <IntroLoader />
          <TopBanner />
          <Navbar />
          {children}
          <Footer />
          <ClientScripts />
        </AuthProvider>
      </body>
    </html>
  );
}
