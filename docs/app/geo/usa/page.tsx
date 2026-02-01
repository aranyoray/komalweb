"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import Script from "next/script";

export default function USAGeoPage() {
  return (
    <>
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "AI App for Kids in USA | Komal Kids",
            "description": "Komal Kids - the safe AI app for kids in the USA. COPPA compliant, privacy-first AI companion for American families.",
            "url": "https://komalkids.com/geo/usa",
            "inLanguage": "en-US"
          }),
        }}
      />
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
          <ScrollReveal>
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text">
                AI App for Kids in USA
              </h1>
              <p className="text-xl text-text-dim max-w-3xl mx-auto">
                Komal Kids is the leading AI companion for children in the United States. COPPA compliant, 
                privacy-first, and designed specifically for American families.
              </p>
            </header>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">Why US Families Choose Komal Kids</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">COPPA Compliant</h3>
                  <p className="text-text-dim">
                    Fully compliant with the Children's Online Privacy Protection Act (COPPA), ensuring your 
                    child's data is protected according to US federal regulations.
                  </p>
                </div>
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">Privacy-First Design</h3>
                  <p className="text-text-dim">
                    All AI processing happens on your device. No data is sent to external servers without 
                    your explicit consent, giving you complete control.
                  </p>
                </div>
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">Research-Backed</h3>
                  <p className="text-text-dim">
                    Built on 20+ years of research and advised by experts from Yale, UC Berkeley, and 
                    leading US child psychology institutions.
                  </p>
                </div>
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">Weekly Parent Reports</h3>
                  <p className="text-text-dim">
                    Receive clear, actionable insights about your child's learning patterns, engagement, 
                    and emotional well-being in plain English.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <section className="mb-16 text-center">
              <h2 className="text-3xl font-bold mb-6 text-text">Download Komal Kids in the USA</h2>
              <p className="text-lg text-text-dim mb-8 max-w-2xl mx-auto">
                Available on both iOS and Android. Download now and start your child's safe AI journey.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="https://apps.apple.com/app/komal"
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

          <ScrollReveal delay={0.3}>
            <section>
              <h2 className="text-3xl font-bold mb-6 text-text">Learn More</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Link href="/about-komal" className="bg-surface/50 p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-2 text-text">About Komal Kids</h3>
                  <p className="text-text-dim">Learn about our mission, team, and research foundation.</p>
                </Link>
                <Link href="/blog/is-ai-safe-for-kids" className="bg-surface/50 p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-2 text-text">Is AI Safe for Kids?</h3>
                  <p className="text-text-dim">Read our comprehensive guide on AI safety for children.</p>
                </Link>
                <Link href="/pricing" className="bg-surface/50 p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-2 text-text">Pricing</h3>
                  <p className="text-text-dim">View our plans starting free for families.</p>
                </Link>
              </div>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
