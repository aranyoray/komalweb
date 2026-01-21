import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Safety Guide | Child Internet Safety & Age-Appropriate Filtering",
  description: "Learn how AgileWeb protects children online with AI-powered content filtering. Our Block/Gate/Allow system provides age-appropriate internet access for kids ages 3-16. COPPA compliant parental controls.",
  keywords: "child content filtering, internet safety for kids, age-appropriate content, parental control settings, content blocking for children, safe browsing kids, online content filter, child protection online, web filter for kids, COPPA compliant filter",
  openGraph: {
    title: "Child Content Safety Guide | AgileWeb Parental Control",
    description: "AI-powered content filtering with Block/Gate/Allow system. Age-appropriate internet access for children ages 3-16.",
    url: "https://komalkids.com/content-safety",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Child Content Safety Guide | AgileWeb",
    description: "How AgileWeb protects children with AI-powered content filtering and age-appropriate access.",
  },
  alternates: {
    canonical: "https://komalkids.com/content-safety",
  },
};

export default function ContentSafetyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
