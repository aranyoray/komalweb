import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Komal Kids for Pediatric Clinics | Child Development Insights",
  description: "Komal Kids helps pediatric clinics and child therapists gain insights into patient development through AI-powered behavioral analysis and comprehensive reports.",
  keywords: "pediatric clinic ai, child therapy tools, pediatric ai software, child development insights, therapy support tools, pediatric behavioral analysis",
  openGraph: {
    title: "Komal Kids for Pediatric Clinics | Child Development Insights",
    description: "Support your patients' development with AI-powered insights. Comprehensive behavioral analysis and shareable reports.",
    url: "https://komalkids.com/for-clinics",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/for-clinics",
  },
};

export default function ForClinicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
