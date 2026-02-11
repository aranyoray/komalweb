import type { Metadata } from "next";
import Script from "next/script";
// import { Inter } from "next/font/google"; // Removed as per user request
import "./globals.css";
//import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientScripts from "@/components/ClientScripts";
import IntroLoader from "@/components/IntroLoader";

import TopBanner from "@/components/TopBanner";

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
    default: "KOMAL - Child Internet Safety App | Parental Control & Safe Browsing for Kids",
    template: "%s | KOMAL - Child Safety App",
  },
  description: "Protect your children online with KOMAL - the AI-powered child internet safety app. Smart content filtering, parental controls, age-appropriate browsing, and real-time protection. COPPA compliant. Safe screen time for kids ages 3-12.",
  keywords: "child internet safety, parental control app, kids safe browsing, online safety for children, content filtering for kids, digital guardian, child protection app, safe screen time, age-appropriate content, family safety app, COPPA compliant app, children privacy app, kid-safe browser, internet filter for kids, child online protection, screen time management, parental monitoring app, safe apps for kids, children digital safety, online child protection",
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
    title: "KOMAL - Child Internet Safety App | Protect Kids Online",
    description: "AI-powered digital guardian for child internet safety. Smart content filtering, parental controls, and age-appropriate browsing for kids ages 3-12. COPPA compliant.",
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
    title: "KOMAL - Child Internet Safety App | Parental Control for Kids",
    description: "Protect your children online with AI-powered content filtering and parental controls. Safe screen time for ages 3-12.",
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
        {/* <ClerkProvider> */}
        <IntroLoader />
        <TopBanner />
        <Navbar />
        {children}
        <Footer />
        <ClientScripts />
        {/* </ClerkProvider> */}
      </body>
    </html>
  );
}
