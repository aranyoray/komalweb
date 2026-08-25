/**
 * India Landing Page (/in)
 * ========================
 *
 * Localized landing page for Indian market with Hindi content
 * and option to switch to English.
 *
 * SEO: Targets "AI app for kids India", "safe AI for children India"
 * Language: Hindi (hi-IN) with English option
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import ScrollReveal from "@/components/ScrollReveal";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// Content in Hindi and English
const content = {
  hi: {
    title: "बच्चों के लिए सुरक्षित AI साथी",
    subtitle: "कोमल किड्स - भारत का पहला गोपनीयता-केंद्रित AI लर्निंग ऐप जो आपके बच्चे की भावनाओं को समझता है और उन्हें सीखने में मदद करता है।",
    whyChoose: "भारतीय परिवार कोमल को क्यों चुनते हैं",
    features: [
      {
        title: "सांस्कृतिक रूप से प्रासंगिक",
        description: "भारतीय संस्कृति और शिक्षा शैली को ध्यान में रखते हुए बनाया गया। प्रमुख भारतीय शैक्षिक संस्थानों के शोध पर आधारित।"
      },
      {
        title: "विशेषज्ञ सलाहकार",
        description: "भारतीय मनोचिकित्सा जर्नल के प्रधान संपादक प्रो. ओम प्रकाश सिंह सहित प्रमुख भारतीय बाल मनोवैज्ञानिकों द्वारा सलाह।"
      },
      {
        title: "गोपनीयता सुरक्षित",
        description: "सारी प्रोसेसिंग आपके डिवाइस पर होती है। आपके बच्चे का डेटा बिना अनुमति के कभी भी आपके डिवाइस से बाहर नहीं जाता।"
      },
      {
        title: "किफायती मूल्य",
        description: "₹0 से शुरू होने वाली योजनाएं, जिससे सुरक्षित AI शिक्षा पूरे भारत के परिवारों के लिए सुलभ हो।"
      }
    ],
    downloadTitle: "अभी डाउनलोड करें",
    downloadSubtitle: "iOS और Android दोनों पर उपलब्ध। आज ही अपने बच्चे की सुरक्षित AI शिक्षा यात्रा शुरू करें।",
    appStore: "App Store",
    playStore: "Google Play",
    trustedBy: "10,000+ भारतीय परिवारों द्वारा विश्वसनीय",
    compliance: "DPDPA अनुपालन",
    complianceDesc: "भारतीय डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम के अनुसार"
  },
  en: {
    title: "Safe AI Companion for Kids",
    subtitle: "Komal Kids - India's first privacy-focused AI learning app that understands your child's emotions and helps them learn.",
    whyChoose: "Why Indian Families Choose Komal",
    features: [
      {
        title: "Culturally Relevant",
        description: "Built with understanding of Indian cultural contexts and learning styles, informed by research from leading Indian educational institutions."
      },
      {
        title: "Expert Advisory",
        description: "Advised by leading Indian child psychologists and mental-health experts, grounded in clinical research and best practices."
      },
      {
        title: "Privacy Protected",
        description: "All processing happens on-device. Your child's data never leaves your device without explicit consent, ensuring complete privacy."
      },
      {
        title: "Affordable Pricing",
        description: "Plans starting from ₹0, making safe AI learning accessible to families across India."
      }
    ],
    downloadTitle: "Download Now",
    downloadSubtitle: "Available on both iOS and Android. Start your child's safe AI learning journey today.",
    appStore: "App Store",
    playStore: "Google Play",
    trustedBy: "Trusted by 10,000+ Indian families",
    compliance: "DPDPA Compliant",
    complianceDesc: "In accordance with India's Digital Personal Data Protection Act"
  }
};

export default function IndiaPage() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const t = content[lang];

  return (
    <>
      <Script
        id="webpage-schema-in"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "AI Learning App for Kids India | Komal Kids",
            "description": "Komal Kids - the safe AI learning app for kids in India. Privacy-first AI companion designed for Indian families.",
            "url": "https://komalkids.com/in",
            "inLanguage": lang === 'hi' ? "hi-IN" : "en-IN"
          }),
        }}
      />

      <div className="min-h-screen pt-20">
        {/* Language Switcher */}
        <div className="fixed top-24 right-4 z-50">
          <LanguageSwitcher
            currentLang={lang}
            localLang={{ code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }}
            onLanguageChange={(l) => setLang(l as 'hi' | 'en')}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
          {/* Hero Section */}
          <ScrollReveal>
            <header className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 text-sm font-medium mb-6">
                <span>🇮🇳</span>
                <span>{t.trustedBy}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-text bg-gradient-to-r from-orange-500 to-green-600 bg-clip-text text-transparent">
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
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-green-50 border border-green-200">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="font-semibold text-green-800">{t.compliance}</p>
                  <p className="text-sm text-green-600">{t.complianceDesc}</p>
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
                    className="bg-gradient-to-br from-orange-50/50 to-white p-6 rounded-2xl border border-orange-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-4">
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
            <section className="mb-16 text-center bg-gradient-to-br from-orange-500 to-green-600 rounded-3xl p-12 text-white">
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
                    <p className="text-base font-semibold leading-tight">{t.appStore}</p>
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
                    <p className="text-base font-semibold leading-tight">{t.playStore}</p>
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
