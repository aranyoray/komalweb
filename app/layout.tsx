import type { Metadata } from "next";
// import { Inter } from "next/font/google"; // Removed as per user request
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientScripts from "@/components/ClientScripts";

// Removed Inter configuration

export const metadata: Metadata = {
  title: "KOMAL: Guilt-Free Screen Time for Learning",
  description: "The world's first non-addictive, hands-free AI companion that understands children through behavior, not buttons.",
  keywords: "children learning app, AI learning platform, ethical AI, child behavior, educational technology",
  authors: [{ name: "KOMAL" }],
  robots: "index, follow",
  openGraph: {
    title: "KOMAL - Frontier AI for Childhood Learning",
    description: "The world's first AI companion that reads how a child feels, not just what they click.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KOMAL - Frontier AI for Childhood Learning",
    description: "The world's first AI companion that reads how a child feels, not just what they click.",
  },
  icons: {
    icon: [
      { url: '/finalstrokemonkey.png', href: '/finalstrokemonkey.png' },
    ],
    shortcut: ['/finalstrokemonkey.png'],
    apple: [
      { url: '/finalstrokemonkey.png' },
    ],
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
      </head>
      <body className="antialiased font-sans bg-[var(--color-bg)] text-[var(--color-text)]">
        <Navbar />
        {children}
        <Footer />
        <ClientScripts />
      </body>
    </html>
  );
}
