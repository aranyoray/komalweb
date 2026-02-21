/**
 * Korea Page Layout
 * =================
 *
 * SEO metadata for the Korean landing page.
 * Targets Korean market with Korean and English language support.
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '어린이를 위한 안전한 AI 앱 | Komal Kids 한국',
  description: 'Komal Kids - 한국의 프라이버시 우선 AI 학습 앱. 개인정보보호법 준수, 한국 교육 전문가와 함께 개발. iOS와 Android에서 무료 다운로드.',
  keywords: [
    'AI 앱 어린이',
    '안전한 AI 어린이',
    '어린이 학습 앱',
    '개인정보보호법 준수 앱',
    '교육용 AI 한국',
    '프라이버시 AI 어린이',
    '한국 어린이 앱',
    'kids learning app Korea',
  ],
  alternates: {
    canonical: 'https://komalkids.com/kr',
    languages: {
      'ko-KR': 'https://komalkids.com/kr',
      'en-KR': 'https://komalkids.com/kr?lang=en',
    },
  },
  openGraph: {
    title: '어린이를 위한 안전한 AI 앱 | Komal Kids',
    description: '한국의 프라이버시 우선 AI 학습 앱. 개인정보보호법 준수, 교육 전문가 감수.',
    url: 'https://komalkids.com/kr',
    siteName: 'Komal Kids',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '어린이를 위한 안전한 AI 앱 | Komal Kids',
    description: '한국의 프라이버시 우선 AI 학습 앱. 개인정보보호법 준수.',
  },
};

export default function KoreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
