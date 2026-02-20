"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import Script from "next/script";

export default function IndiaGeoPage() {
  return (
    <>
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "AI Learning App for Kids India | Komal Kids",
            "description": "Komal Kids - the safe AI learning app for kids in India. Privacy-first AI companion designed for Indian families.",
            "url": "https://komalkids.com/geo/india",
            "inLanguage": "en-IN"
          }),
        }}
      />
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
          <ScrollReveal>
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text">
                AI Learning App for Kids India
              </h1>
              <p className="text-xl text-text-dim max-w-3xl mx-auto">
                Komal Kids brings safe, personalized AI learning experiences to children across India. 
                Privacy-first design, culturally relevant content, and expert guidance from Indian child psychology leaders.
              </p>
            </header>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">Why Indian Families Choose Komal Kids</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">Culturally Relevant</h3>
                  <p className="text-text-dim">
                    Built with understanding of Indian cultural contexts and learning styles, informed by 
                    research from leading Indian educational institutions.
                  </p>
                </div>
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">Expert Advisory</h3>
                  <p className="text-text-dim">
                    Advised by leading Indian child psychologists including Prof. Om Prakash Singh, 
                    Editor-in-Chief of the Indian Journal of Psychiatry.
                  </p>
                </div>
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">Privacy Protected</h3>
                  <p className="text-text-dim">
                    All processing happens on-device. Your child's data never leaves your device without 
                    explicit consent, ensuring complete privacy.
                  </p>
                </div>
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">Affordable Pricing</h3>
                  <p className="text-text-dim">
                    Plans starting from ₹0, making safe AI learning accessible to families across India.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <section className="mb-16 text-center">
              <h2 className="text-3xl font-bold mb-6 text-text">Download Komal Kids in India</h2>
              <p className="text-lg text-text-dim mb-8 max-w-2xl mx-auto">
                Available on both iOS and Android. Start your child's safe AI learning journey today.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="https://apps.apple.com/us/app/komal-your-digital-buddy/id6757139754"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-text text-surface px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[11px] leading-none opacity-80">Download on the</span>
                    <span className="text-base font-semibold leading-tight">App Store</span>
                  </div>
                </Link>
                <Link
                  href="https://play.google.com/store/apps/details?id=com.komalkids.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-text text-surface px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[11px] leading-none opacity-80">GET IT ON</span>
                    <span className="text-base font-semibold leading-tight">Google Play</span>
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
