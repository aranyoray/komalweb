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
        "AI-powered digital guardian for child internet safety. Protect your children online with smart content filtering, parental controls, and age-appropriate browsing.",
    },
    {
      "@type": "WebSite",
      "@id": "https://komalkids.com/#website",
      url: "https://komalkids.com",
      name: "KOMAL - Child Internet Safety App",
      publisher: { "@id": "https://komalkids.com/#organization" },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      name: "KOMAL",
      applicationCategory: "EducationalApplication",
      operatingSystem: "iOS, Android",
      description:
        "AI-powered child internet safety app with smart content filtering, parental controls, and age-appropriate browsing for kids ages 3-12.",
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
    default: "KOMAL - Child Internet Safety App | Safe AI",
    template: "%s | KOMAL - Child Safety App",
  },
  description: "KOMAL is an AI-powered child internet safety app with parental controls, content filtering, and safe browsing for kids ages 3-12. COPPA compliant.",
  keywords: "child internet safety, parental control app, safe browsing for kids, content filtering for kids, AI child safety, online child protection, screen time management, kid-safe browser",
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
    title: "KOMAL - Child Internet Safety App | Safe AI",
    description: "AI-powered child internet safety with content filtering, parental controls, and safe browsing for kids ages 3-12.",
    type: "website",
    url: "https://komalkids.com",
    siteName: "KOMAL",
    locale: "en_US",
    images: [
      {
        url: "https://komalkids.com/heroimage.png",
        width: 1200,
        height: 1200,
        alt: "KOMAL - Child Internet Safety App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KOMAL - Child Internet Safety App | Safe AI",
    description: "AI-powered child internet safety with content filtering, parental controls, and safe browsing for kids ages 3-12.",
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
