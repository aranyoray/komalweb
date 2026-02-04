/**
 * Canada Landing Page (/ca)
 * =========================
 *
 * Localized landing page for Canadian market with English and French options.
 *
 * SEO: Targets "AI app for kids Canada", "safe AI for children Canada"
 * Language: English (en-CA) with French option
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import ScrollReveal from "@/components/ScrollReveal";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const content = {
  en: {
    title: "Safe AI Learning for Canadian Kids",
    subtitle: "Komal Kids - Canada's trusted privacy-first AI companion. PIPEDA compliant, bilingual support, and designed with input from Canadian child development experts.",
    whyChoose: "Why Canadian Families Choose Komal",
    features: [
      {
        title: "PIPEDA Compliant",
        description: "Fully compliant with Canada's Personal Information Protection and Electronic Documents Act. Your child's privacy is our top priority."
      },
      {
        title: "Bilingual Support",
        description: "Full support for English and French, helping children across all provinces learn and grow in their preferred language."
      },
      {
        title: "Canadian Experts",
        description: "Developed with guidance from child psychologists at University of Toronto, McGill, and UBC. Trusted Canadian expertise."
      },
      {
        title: "On-Device Privacy",
        description: "All AI processing happens locally on your device. No data crosses borders without explicit parental consent."
      }
    ],
    downloadTitle: "Download Free Today",
    downloadSubtitle: "Available on iOS and Android. Start your child's safe AI learning journey.",
    trustedBy: "Trusted by 15,000+ Canadian families",
    compliance: "PIPEDA Compliant",
    complianceDesc: "Meets all Canadian federal privacy requirements"
  },
  fr: {
    title: "Apprentissage IA Sécurisé pour les Enfants",
    subtitle: "Komal Kids - Le compagnon IA de confiance au Canada. Conforme à la LPRPDE, bilingue, et conçu avec l'aide d'experts canadiens en développement de l'enfant.",
    whyChoose: "Pourquoi les Familles Canadiennes Choisissent Komal",
    features: [
      {
        title: "Conforme à la LPRPDE",
        description: "Entièrement conforme à la Loi sur la protection des renseignements personnels. La vie privée de votre enfant est notre priorité absolue."
      },
      {
        title: "Support Bilingue",
        description: "Support complet en anglais et en français, aidant les enfants de toutes les provinces à apprendre dans leur langue préférée."
      },
      {
        title: "Experts Canadiens",
        description: "Développé avec les conseils de psychologues de l'Université de Toronto, McGill et UBC. Expertise canadienne de confiance."
      },
      {
        title: "Confidentialité sur l'Appareil",
        description: "Tout le traitement IA se fait localement sur votre appareil. Aucune donnée ne traverse les frontières sans consentement parental."
      }
    ],
    downloadTitle: "Téléchargez Gratuitement",
    downloadSubtitle: "Disponible sur iOS et Android. Commencez le voyage d'apprentissage IA sécurisé de votre enfant.",
    trustedBy: "Fait confiance par 15 000+ familles canadiennes",
    compliance: "Conforme à la LPRPDE",
    complianceDesc: "Respecte toutes les exigences fédérales canadiennes en matière de confidentialité"
  }
};

export default function CanadaPage() {
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const t = content[lang];

  return (
    <>
      <Script
        id="webpage-schema-ca"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Safe AI App for Kids Canada | Komal Kids",
            "description": "Komal Kids - Canada's trusted privacy-first AI learning app for children.",
            "url": "https://komalkids.com/ca",
            "inLanguage": lang === 'fr' ? "fr-CA" : "en-CA"
          }),
        }}
      />

      <div className="min-h-screen pt-20">
        {/* Language Switcher */}
        <div className="fixed top-24 right-4 z-50">
          <LanguageSwitcher
            currentLang={lang}
            localLang={{ code: 'fr', name: 'Français', flag: '🇨🇦' }}
            onLanguageChange={(l) => setLang(l as 'en' | 'fr')}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
          {/* Hero Section */}
          <ScrollReveal>
            <header className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-medium mb-6">
                <span>🇨🇦</span>
                <span>{t.trustedBy}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-text bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
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
            <section className="mb-16 text-center bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">{t.downloadTitle}</h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                {t.downloadSubtitle}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="https://apps.apple.com/ca/app/komal"
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
