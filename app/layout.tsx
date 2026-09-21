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
import CookieConsent from "@/components/CookieConsent";


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
        width: 512,
        height: 512,
      },
      sameAs: [
        "https://x.com/komalforkids",
        "https://www.linkedin.com/company/komalkids/",
        "https://www.instagram.com/komalforkids",
        "https://www.youtube.com/@komalforkids",
      ],
      description:
        "AI-powered digital guardian for child internet safety. Protect your children online with smart content filtering, parental controls, and age-appropriate browsing.",
      foundingDate: "2024",
      contactPoint: [
        {
          "@type": "ContactPoint",
          email: "play@komalkids.com",
          contactType: "customer service",
          availableLanguage: ["English"],
        },
        {
          "@type": "ContactPoint",
          email: "privacy@komalkids.com",
          contactType: "technical support",
          availableLanguage: ["English"],
        },
      ],
      areaServed: [
        { "@type": "Country", name: "United States" },
        { "@type": "Country", name: "India" },
        { "@type": "Country", name: "Canada" },
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "Australia" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://komalkids.com/#website",
      url: "https://komalkids.com",
      name: "KOMAL - Child Internet Safety App",
      publisher: { "@id": "https://komalkids.com/#organization" },
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://komalkids.com/blog?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://komalkids.com/#app",
      name: "KOMAL",
      applicationCategory: "EducationalApplication",
      applicationSubCategory: "Parental Control",
      operatingSystem: "iOS, Android, Web",
      description:
        "AI-powered child internet safety app with smart content filtering, parental controls, and age-appropriate browsing for kids ages 3-12. COPPA and GDPR compliant.",
      screenshot: "https://komalkids.com/kid-hero.png",
      featureList: [
        "AI-Powered Content Filtering",
        "Real-Time Parental Controls",
        "Age-Appropriate Safe Browsing",
        "Screen Time Management",
        "Behavioral AI Insights",
        "Weekly Parent Reports",
        "On-Device Privacy Processing",
        "COPPA & GDPR Compliant",
      ],
      audience: {
        "@type": "PeopleAudience",
        suggestedMinAge: "3",
        suggestedMaxAge: "12",
        audienceType: "Children, Parents, Educators",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "150",
        bestRating: "5",
        worstRating: "1",
      },
      author: { "@id": "https://komalkids.com/#organization" },
    },
    {
      "@type": "MobileApplication",
      name: "KOMAL - Child Safety",
      operatingSystem: "Android",
      applicationCategory: "EducationalApplication",
      installUrl: "https://play.google.com/store/apps/details?id=com.komalkids.app&hl=en",
      author: { "@id": "https://komalkids.com/#organization" },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "MobileApplication",
      name: "KOMAL - Your Digital Buddy",
      operatingSystem: "iOS",
      applicationCategory: "EducationalApplication",
      installUrl: "https://apps.apple.com/us/app/komal-your-digital-buddy/id6757139754",
      author: { "@id": "https://komalkids.com/#organization" },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "KOMAL - #1 Child Internet Safety App | AI Parental Controls for Kids 3-12",
    template: "%s | KOMAL - Child Safety App",
  },
  description: "Protect your kids online with KOMAL — the AI-powered child safety app trusted by parents. Smart content filtering, real-time parental controls, and safe browsing for ages 3-12. COPPA & GDPR compliant. Free to start.",
  keywords: [
    "child internet safety app",
    "parental control app",
    "safe browsing for kids",
    "content filtering for children",
    "AI child safety",
    "online child protection",
    "screen time management",
    "kid-safe browser",
    "COPPA compliant app",
    "child safe AI",
    "parental monitoring app",
    "kids online safety",
    "digital guardian for kids",
    "child content filter",
    "family safe internet",
    "safe search for kids",
    "child protection software",
    "AI parental controls",
    "kids app safety",
    "internet safety for children",
  ].join(", "),
  authors: [{ name: "KOMAL - ChildCog Private Limited", url: "https://komalkids.com" }],
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
    languages: {
      "en-US": "https://komalkids.com/geo/usa",
      "en-IN": "https://komalkids.com/geo/india",
      "x-default": "https://komalkids.com",
    },
  },
  openGraph: {
    title: "KOMAL - #1 Child Internet Safety App | AI Parental Controls",
    description: "Protect your kids online with KOMAL — AI-powered content filtering, real-time parental controls, and safe browsing for ages 3-12. Free to start.",
    type: "website",
    url: "https://komalkids.com",
    siteName: "KOMAL",
    locale: "en_US",
    alternateLocale: ["en_IN", "en_GB", "en_CA", "en_AU"],
    images: [
      {
        url: "https://komalkids.com/kid-hero.png",
        width: 1200,
        height: 1200,
        alt: "KOMAL - AI Child Internet Safety App with Parental Controls",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KOMAL - #1 Child Internet Safety App | AI Parental Controls",
    description: "Protect your kids online with KOMAL — AI-powered content filtering, real-time parental controls, and safe browsing for ages 3-12.",
    images: ["https://komalkids.com/kid-hero.png"],
    creator: "@komalforkids",
    site: "@komalforkids",
  },
  category: "technology",
  classification: "Child Safety, Parental Control, Education",
  icons: {
    icon: [
      { url: '/komaliconnobg.png', sizes: '192x192', type: 'image/png' },
      { url: '/komalicon.png', sizes: '144x144', type: 'image/png' },
    ],
    shortcut: ['/komaliconnobg.png'],
    apple: [
      { url: '/komaliconnobg.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: "/manifest.json",
  other: {
    "apple-itunes-app": "app-id=6757139754",
    "google-play-app": "app-id=com.komalkids.app",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "KOMAL",
    "application-name": "KOMAL",
    "msapplication-TileColor": "#1e3a5f",
    "theme-color": "#1e3a5f",
  },
  // NOTE: Add real verification codes when available from Google Search Console and Bing Webmaster Tools
  // verification: {
  //   google: "YOUR_GOOGLE_VERIFICATION_CODE",
  //   other: {
  //     "msvalidate.01": "YOUR_BING_VERIFICATION_CODE",
  //   },
  // },
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
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#1e3a5f" />
        <meta name="format-detection" content="telephone=no" />
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
          <CookieConsent />
          <ClientScripts />
        </AuthProvider>
      </body>
    </html>
  );
}
