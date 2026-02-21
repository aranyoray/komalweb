/**
 * Korea Landing Page (/kr)
 * ========================
 *
 * Localized landing page for Korean market.
 *
 * SEO: Targets "AI 앱 어린이 한국", "안전한 AI 어린이"
 * Language: Korean (ko-KR) with English option
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import ScrollReveal from "@/components/ScrollReveal";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const content = {
  ko: {
    title: "우리 아이를 위한 안전한 AI 학습 친구",
    subtitle: "Komal Kids - 한국의 프라이버시 우선 AI 학습 앱. 개인정보보호법 준수, 한국 교육 전문가와 함께 개발, 수천 가정이 신뢰하는 서비스.",
    whyChoose: "한국 가정이 Komal을 선택하는 이유",
    features: [
      {
        title: "개인정보보호법 준수",
        description: "한국 개인정보보호법을 완벽하게 준수합니다. 아이의 데이터는 엄격한 보안 기준으로 보호됩니다."
      },
      {
        title: "한국어 최적화",
        description: "한국 아이들을 위해 특별히 설계되었습니다. 자연스러운 한국어 대화와 문화에 맞는 콘텐츠를 제공합니다."
      },
      {
        title: "교육 전문가 감수",
        description: "서울대, 연세대, 고려대 아동 발달 전문가들과 함께 개발되었습니다. 신뢰할 수 있는 교육 콘텐츠."
      },
      {
        title: "기기 내 AI 처리",
        description: "모든 AI 처리가 기기 내에서 이루어집니다. 클라우드 전송 없이 완벽한 데이터 프라이버시를 보장합니다."
      }
    ],
    downloadTitle: "지금 무료로 다운로드하세요",
    downloadSubtitle: "iOS와 Android에서 사용 가능합니다. Komal Kids를 사용하는 수천 한국 가정과 함께하세요.",
    trustedBy: "10,000+ 한국 가정이 신뢰",
    compliance: "개인정보보호법 준수",
    complianceDesc: "한국 개인정보 보호 요건 충족"
  },
  en: {
    title: "Safe AI Learning Friend for Korean Kids",
    subtitle: "Komal Kids - Korea's trusted privacy-first AI learning app. Compliant with Korean privacy laws, developed with Korean education experts.",
    whyChoose: "Why Korean Families Choose Komal",
    features: [
      {
        title: "Privacy Law Compliant",
        description: "Fully compliant with Korean Personal Information Protection Act. Your child's data is protected under strict security standards."
      },
      {
        title: "Korean Optimized",
        description: "Specially designed for Korean children. Natural Korean conversations and culturally appropriate content."
      },
      {
        title: "Expert Reviewed",
        description: "Developed with child development experts from Seoul National University, Yonsei, and Korea University. Trusted educational content."
      },
      {
        title: "On-Device AI",
        description: "All AI processing happens on your device. Complete data privacy with zero cloud transmission."
      }
    ],
    downloadTitle: "Download Free Today",
    downloadSubtitle: "Available on iOS and Android. Join thousands of Korean families using Komal Kids.",
    trustedBy: "Trusted by 10,000+ Korean families",
    compliance: "Privacy Law Compliant",
    complianceDesc: "Meets Korean personal information protection requirements"
  }
};

export default function KoreaPage() {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const t = content[lang];

  return (
    <>
      <Script
        id="webpage-schema-kr"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Safe AI App for Kids Korea | Komal Kids",
            "description": "Komal Kids - Korea's trusted privacy-first AI learning app for children.",
            "url": "https://komalkids.com/kr",
            "inLanguage": lang === 'en' ? "en-KR" : "ko-KR"
          }),
        }}
      />

      <div className="min-h-screen pt-20">
        {/* Language Switcher */}
        <div className="fixed top-24 right-4 z-50">
          <LanguageSwitcher
            currentLang={lang}
            localLang={{ code: 'ko', name: '한국어', flag: '🇰🇷' }}
            onLanguageChange={(l) => setLang(l as 'ko' | 'en')}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
          {/* Hero Section */}
          <ScrollReveal>
            <header className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
                <span>🇰🇷</span>
                <span>{t.trustedBy}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-text bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-xl text-text-dim max-w-3xl mx-auto leading-relaxed">
                {t.subtitle}
              </p>
            </header>
          </ScrollReveal>

          {/* Compliance Badge */}
          <ScrollReveal delay={0.05}>
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-blue-50 border border-blue-200">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="font-semibold text-blue-800">{t.compliance}</p>
                  <p className="text-sm text-blue-600">{t.complianceDesc}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Features Grid */}
          <ScrollReveal delay={0.1}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-text text-center">{t.whyChoose}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {t.features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-50/50 to-white p-6 rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-text">{feature.title}</h3>
                    <p className="text-text-dim leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* Download Section */}
          <ScrollReveal delay={0.2}>
            <section className="mb-16 text-center bg-gradient-to-br from-blue-600 to-red-500 rounded-3xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">{t.downloadTitle}</h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                {t.downloadSubtitle}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="https://apps.apple.com/kr/app/komal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="text-left">
                    <span className="text-[11px] leading-none opacity-70">Download on the</span>
                    <p className="text-base font-semibold leading-tight">App Store</p>
                  </div>
                </Link>
                <Link
                  href="https://play.google.com/store/apps/details?id=com.komalkids.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                  </svg>
                  <div className="text-left">
                    <span className="text-[11px] leading-none opacity-70">GET IT ON</span>
                    <p className="text-base font-semibold leading-tight">Google Play</p>
                  </div>
                </Link>
              </div>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
