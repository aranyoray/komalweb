import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Komal for Government | Child Digital Safety Policy & Implementation",
  description:
    "Komal supports government agencies, education departments, and child protection bodies in implementing evidence-based digital safety for children. COPPA, CIPA, GDPR-K, and DPDP compliant.",
  keywords:
    "child digital safety policy, government child protection, education department technology, digital safety compliance, COPPA compliance tool, CIPA compliant software, child internet safety government, child protection agency technology, digital India child safety, public school digital safety, state education board technology, child online protection act",
  openGraph: {
    title: "Komal for Government | Child Digital Safety Policy & Implementation",
    description:
      "Evidence-based digital safety infrastructure for government agencies. COPPA, CIPA, GDPR-K, and DPDP compliant. Support child protection mandates with privacy-first technology.",
    url: "https://komalkids.com/for-government",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/for-government",
  },
};

export default function ForGovernmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="for-government-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "For Government", item: "https://komalkids.com/for-government" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
