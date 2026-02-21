/**
 * Singapore Page Layout
 * =====================
 *
 * SEO metadata for the Singapore landing page.
 * Targets Singapore market with English and Chinese language support.
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Safe AI App for Kids Singapore | Komal Kids',
  description: 'Komal Kids - Singapore\'s premier privacy-first AI learning app for children. PDPA compliant, multicultural design, and trusted by educators. Download free on iOS and Android.',
  keywords: [
    'AI app for kids Singapore',
    'safe AI for children Singapore',
    'kids learning app Singapore',
    'PDPA compliant kids app',
    'educational AI Singapore',
    'privacy-first AI for children',
    'multicultural kids app',
    'Singapore children app',
  ],
  alternates: {
    canonical: 'https://komalkids.com/sg',
    languages: {
      'en-SG': 'https://komalkids.com/sg',
      'zh-SG': 'https://komalkids.com/sg?lang=zh',
    },
  },
  openGraph: {
    title: 'Safe AI App for Kids Singapore | Komal Kids',
    description: 'Singapore\'s premier privacy-first AI learning companion for children. PDPA compliant and trusted by educators.',
    url: 'https://komalkids.com/sg',
    siteName: 'Komal Kids',
    locale: 'en_SG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Safe AI App for Kids Singapore | Komal Kids',
    description: 'Singapore\'s premier privacy-first AI learning companion for children. PDPA compliant.',
  },
};

export default function SingaporeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
