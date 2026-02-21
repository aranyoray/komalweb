import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "बच्चों के लिए AI ऐप | Komal Kids India | कोमल किड्स",
  description: "कोमल किड्स - भारत का पहला गोपनीयता-केंद्रित AI लर्निंग ऐप। बच्चों के लिए सुरक्षित AI साथी। DPDPA अनुपालन। Safe AI app for kids in India.",
  keywords: [
    "AI app for kids India",
    "बच्चों के लिए AI ऐप",
    "safe AI for children",
    "kids learning app India",
    "Komal Kids",
    "कोमल किड्स",
    "child safe AI",
    "educational AI India",
    "privacy AI kids",
    "DPDPA compliant"
  ],
  openGraph: {
    title: "Komal Kids India | बच्चों के लिए सुरक्षित AI",
    description: "भारत का पहला गोपनीयता-केंद्रित AI लर्निंग ऐप। 10,000+ भारतीय परिवारों द्वारा विश्वसनीय।",
    url: "https://komalkids.com/in",
    siteName: "Komal Kids",
    locale: "hi_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://komalkids.com/in",
    languages: {
      'hi-IN': 'https://komalkids.com/in',
      'en-IN': 'https://komalkids.com/in',
    },
  },
};

export default function IndiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
