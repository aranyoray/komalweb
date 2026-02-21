/**
 * Japan Page Layout
 * =================
 *
 * SEO metadata for the Japanese landing page.
 * Targets Japanese market with Japanese and English language support.
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '子供向け安全AIアプリ | Komal Kids 日本',
  description: 'Komal Kids - 日本のプライバシー優先AI学習アプリ。個人情報保護法に準拠、教育専門家と共同開発。iOSとAndroidで無料ダウンロード。',
  keywords: [
    '子供向けAIアプリ',
    '安全なAI 子供',
    '子供学習アプリ',
    '個人情報保護法準拠アプリ',
    '教育AI 日本',
    'プライバシーAI 子供',
    '日本 子供アプリ',
    'kids learning app Japan',
  ],
  alternates: {
    canonical: 'https://komalkids.com/jp',
    languages: {
      'ja-JP': 'https://komalkids.com/jp',
      'en-JP': 'https://komalkids.com/jp?lang=en',
    },
  },
  openGraph: {
    title: '子供向け安全AIアプリ | Komal Kids',
    description: '日本のプライバシー優先AI学習アプリ。個人情報保護法に準拠、教育専門家監修。',
    url: 'https://komalkids.com/jp',
    siteName: 'Komal Kids',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '子供向け安全AIアプリ | Komal Kids',
    description: '日本のプライバシー優先AI学習アプリ。個人情報保護法に準拠。',
  },
};

export default function JapanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
