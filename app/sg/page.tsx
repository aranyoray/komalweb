/**
 * Singapore Landing Page (/sg)
 * ============================
 *
 * Localized landing page for Singapore market.
 *
 * SEO: Targets "AI app for kids Singapore", "safe AI for children Singapore"
 * Language: English (en-SG) with Chinese option
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import ScrollReveal from "@/components/ScrollReveal";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const content = {
  en: {
    title: "Smart & Safe AI Learning for Singapore Kids",
    subtitle: "Komal Kids - Singapore's premier privacy-first AI companion. PDPA compliant, designed for our multicultural society, and trusted by educators.",
    whyChoose: "Why Singapore Families Choose Komal",
    features: [
      {
        title: "PDPA Compliant",
        description: "Fully compliant with Singapore's Personal Data Protection Act. Your child's data stays protected under our strict privacy standards."
      },
      {
        title: "Multicultural Design",
        description: "Built for Singapore's diverse community. Support for multiple languages and culturally inclusive content for every child."
      },
      {
        title: "Education-Aligned",
        description: "Designed with input from Singapore educators and aligned with MOE's focus on 21st-century competencies and emotional learning."
      },
      {
        title: "On-Device AI",
        description: "All AI processing happens locally on your device. Zero cloud processing means complete data privacy for your family."
      }
    ],
    downloadTitle: "Download Free Today",
    downloadSubtitle: "Available on iOS and Android. Join thousands of Singapore families using Komal Kids.",
    trustedBy: "Trusted by 8,000+ Singapore families",
    compliance: "PDPA Compliant",
    complianceDesc: "Meets all Singapore data protection requirements"
  },
  zh: {
    title: "为新加坡儿童打造的安全AI学习伙伴",
    subtitle: "Komal Kids - 新加坡首选的隐私优先AI伴侣。符合PDPA标准，专为我们的多元文化社会设计，深受教育工作者信赖。",
    whyChoose: "为什么新加坡家庭选择Komal",
    features: [
      {
        title: "符合PDPA标准",
        description: "完全符合新加坡个人数据保护法。您孩子的数据在我们严格的隐私标准下受到保护。"
      },
      {
        title: "多元文化设计",
        description: "专为新加坡多元化社区打造。支持多种语言，为每个孩子提供包容性文化内容。"
      },
      {
        title: "与教育接轨",
        description: "与新加坡教育工作者合作设计，符合教育部对21世纪能力和情感学习的重视。"
      },
      {
        title: "设备端AI",
        description: "所有AI处理都在您的设备上本地完成。零云处理意味着为您的家庭提供完整的数据隐私。"
      }
    ],
    downloadTitle: "立即免费下载",
    downloadSubtitle: "iOS和Android均可使用。加入数千个使用Komal Kids的新加坡家庭。",
    trustedBy: "超过8,000个新加坡家庭信赖",
    compliance: "符合PDPA标准",
    complianceDesc: "满足所有新加坡数据保护要求"
  }
};

export default function SingaporePage() {
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  const t = content[lang];

  return (
    <>
      <Script
        id="webpage-schema-sg"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Safe AI App for Kids Singapore | Komal Kids",
            "description": "Komal Kids - Singapore's premier privacy-first AI learning app for children.",
            "url": "https://komalkids.com/sg",
            "inLanguage": lang === 'zh' ? "zh-SG" : "en-SG"
          }),
        }}
      />

      <div className="min-h-screen pt-20">
        {/* Language Switcher */}
        <div className="fixed top-24 right-4 z-50">
          <LanguageSwitcher
            currentLang={lang}
            localLang={{ code: 'zh', name: '中文', flag: '🇸🇬' }}
            onLanguageChange={(l) => setLang(l as 'en' | 'zh')}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
          {/* Hero Section */}
          <ScrollReveal>
            <header className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-medium mb-6">
                <span>🇸🇬</span>
                <span>{t.trustedBy}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-text bg-gradient-to-r from-red-600 to-white bg-clip-text text-transparent" style={{WebkitTextStroke: '1px #dc2626'}}>
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
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-red-50 border border-red-200">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="font-semibold text-red-800">{t.compliance}</p>
                  <p className="text-sm text-red-600">{t.complianceDesc}</p>
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
                    className="bg-gradient-to-br from-red-50/50 to-white p-6 rounded-2xl border border-red-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mb-4">
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
            <section className="mb-16 text-center bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">{t.downloadTitle}</h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                {t.downloadSubtitle}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="https://apps.apple.com/us/app/komal-your-digital-buddy/id6757139754"
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
                  href="https://play.google.com/store/apps/details?id=com.komalkids.app&hl=en"
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
                <Link
                  href="https://chromewebstore.google.com/detail/egobidnbpgjogfjfjcchjdidcnpfgbki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18a6 6 0 110-12 6 6 0 010 12zm0-9a3 3 0 100 6 3 3 0 000-6z" />
                  </svg>
                  <div className="text-left">
                    <span className="text-[11px] leading-none opacity-70">Available on</span>
                    <p className="text-base font-semibold leading-tight">Chrome</p>
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
