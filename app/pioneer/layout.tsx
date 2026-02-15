import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Pioneer Program | Youth Digital Leadership & Citizenship | Komal Kids",
  description:
    "Join the Komal Pioneer Program for children, teens, and parents. Mentor younger kids in digital safety, earn a Digital Leadership Certificate, and build your portfolio. Open to any child or parent worldwide. Use code SUNSHINE50.",
  keywords:
    "youth digital leadership, digital citizenship program for kids, teen leadership program, children digital wellbeing, pioneer program for students, digital leadership certificate, online safety mentorship, youth digital role model, child digital safety program, teen leadership opportunity, digital wellbeing for families, ethical AI for kids, college application community service, youth digital wellbeing volunteer, digital citizenship certificate",
  openGraph: {
    title: "Komal Pioneer Program | Youth Digital Leadership & Citizenship",
    description:
      "The next generation of digital leaders starts here. Mentor younger children, earn certificates, shape ethical AI, and build a portfolio that matters. For children, teens, and parents. Use code SUNSHINE50.",
    url: "https://komalkids.com/pioneer",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/pioneer",
  },
};

export default function PioneerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="pioneer-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://komalkids.com" },
              { "@type": "ListItem", position: 2, name: "Pioneer Program", item: "https://komalkids.com/pioneer" },
            ],
          }),
        }}
      />
      <Script
        id="pioneer-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Who can become a Komal Pioneer?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Any child, teenager, or parent worldwide can apply. Children under 13 need parental consent. There are no minimum grades, test scores, or prior experience required. We are looking for curiosity, empathy, and a willingness to lead by example in digital spaces.",
                },
              },
              {
                "@type": "Question",
                name: "Is the Pioneer Program free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The founding rate is $19.99 (lifetime access) using code SUNSHINE50, which is a 50% discount from the standard $39.99. This covers full program access, community membership, certificate eligibility, and early access to new Komal features.",
                },
              },
              {
                "@type": "Question",
                name: "How does the Digital Leadership Certificate work?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The certificate documents your mentorship hours, workshop facilitation, feature testing contributions, and ethical AI literacy milestones. It is designed to be substantive enough for college applications and scholarship portfolios.",
                },
              },
              {
                "@type": "Question",
                name: "How does this help with college admissions?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The Pioneer Program provides documented community service in digital wellbeing, a growing area of interest for admissions committees. Pioneers can point to specific mentorship hours, workshop facilitation, and ethical AI literacy, all verified by Komal.",
                },
              },
              {
                "@type": "Question",
                name: "What countries is the Pioneer Program available in?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The Pioneer Program is available globally. Our initial community includes families from India, the US, UK, Singapore, UAE, Canada, and beyond. All program activities are conducted in English, with localization planned for additional languages.",
                },
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
