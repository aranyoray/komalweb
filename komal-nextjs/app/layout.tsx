import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientScripts from "@/components/ClientScripts";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KOMAL - AI Companion That Understands How Your Child Feels | Personalized Learning for Kids 3-12",
  description: "KOMAL - The world's first AI companion that reads how your child feels, not just what they click. Hyper-personalized learning platform for children ages 3-12 with real-time behavioral AI and parent insights.",
  keywords: "children learning app, AI learning platform, child development, social emotional learning, SEL, cognitive learning, parent insights, child behavior, educational technology, kids app",
  authors: [{ name: "KOMAL" }],
  robots: "index, follow",
  openGraph: {
    title: "KOMAL - AI Companion That Understands Your Child",
    description: "The world's first AI companion that reads how a child feels, not just what they click. Real-time behavioral AI for personalized learning.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KOMAL - AI Companion That Understands Your Child",
    description: "The world's first AI companion that reads how a child feels, not just what they click.",
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
        <ClientScripts />
      </body>
    </html>
  );
}
