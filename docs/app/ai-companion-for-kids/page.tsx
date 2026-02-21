"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import Script from "next/script";

export default function AICompanionForKidsPage() {
  return (
    <>
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "AI Companion for Kids - Safe Digital Buddy | Komal Kids",
            "description": "Discover Komal Kids, the safe AI companion for kids. Real-time behavioral AI adapts to your child's needs with privacy-first design and COPPA compliance.",
            "url": "https://komalkids.com/ai-companion-for-kids"
          }),
        }}
      />
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
          <ScrollReveal>
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text">
                AI Companion for Kids: Reads How They Feel, Not Just What They Click
              </h1>
              <p className="text-xl text-text-dim max-w-3xl mx-auto">
                Komal Kids is a hyper-personalized digital guardian that uses real-time behavioral AI to understand 
                how your child feels and learns. Unlike traditional apps that only track clicks, Komal reads gaze patterns, 
                touch interactions, and micro-expressions to adapt learning moment-by-moment.
              </p>
            </header>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">What Makes Komal Different from Other AI Companions?</h2>
              <div className="prose prose-lg max-w-none text-text-dim leading-relaxed space-y-4">
                <p>
                  Most AI companions for kids are simply chatbots with content filters. <Link href="/about-komal" className="text-primary hover:underline font-semibold">Komal Kids</Link> 
                  is fundamentally different. We don't just track what children click—we read how they feel through 
                  behavioral signals: gaze patterns, touch interactions, and micro-expressions.
                </p>
                <p>
                  Traditional parental controls operate on a simple binary: block or allow. They build walls. But walls 
                  don't teach—they just restrict. Komal believes children learn by exploring, questioning, and sometimes 
                  stumbling. They need a guide that understands context, not a gatekeeper that follows rigid rules.
                </p>
                <p>
                  That's why Komal uses <strong>real-time behavioral AI</strong> to understand your child's engagement—detecting 
                  frustration, hesitation, or delight—and adapts the digital experience instantly (under 200ms). We don't just 
                  filter content; we nurture curiosity while keeping them safe.
                </p>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">Why Choose Komal as Your Child's AI Companion?</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">Privacy-First Design</h3>
                  <p className="text-text-dim">
                    All AI processing happens on your device. Your child's data never leaves your device without 
                    explicit consent. We're COPPA and GDPR-K compliant.
                  </p>
                </div>
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">Real-Time Adaptation</h3>
                  <p className="text-text-dim">
                    Komal detects frustration, excitement, or confusion and adapts instantly. Content difficulty, 
                    pacing, and tone adjust to match your child's emotional and learning state.
                  </p>
                </div>
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">Three-Tier Content Filtering</h3>
                  <p className="text-text-dim">
                    Unlike binary block/allow systems, Komal uses three actions: <strong>Block</strong> (harmful content, 
                    not accessible), <strong>Gate</strong> (educational content, allowed with warning/approval), and 
                    <strong> Allow</strong> (age-appropriate). This creates flexibility where educational content is 
                    treated differently from harmful content.
                  </p>
                </div>
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">Parental Insights</h3>
                  <p className="text-text-dim">
                    Receive weekly reports about your child's learning patterns, engagement quality, and actionable 
                    insights. Share reports with teachers and therapists with one click.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">Guidance, Not Gatekeeping</h2>
              <div className="prose prose-lg max-w-none text-text-dim leading-relaxed space-y-4">
                <p>
                  Komal is designed as a <strong>digital guardian</strong>, not a surveillance tool. Here's how we're different:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Behavioral AI, not click tracking:</strong> Reads gaze patterns, touch interactions, and micro-expressions to understand emotional state and engagement</li>
                  <li><strong>Real-time adaptation:</strong> Adapts in under 200ms when your child shows frustration, excitement, or confusion</li>
                  <li><strong>On-device processing:</strong> All AI happens on your device—zero biometric data stored in cloud</li>
                  <li><strong>Three-tier filtering:</strong> Block, Gate, and Allow—flexibility for educational content vs. harmful content</li>
                  <li><strong>Plain-language insights:</strong> We translate complex behavioral signals into simple, actionable reports for parents</li>
                  <li><strong>Non-addictive by design:</strong> Built to support healthy engagement, not maximize screen time</li>
                  <li><strong>No diagnostic claims:</strong> Provides insights and understanding, not medical or psychological diagnoses</li>
                </ul>
                <p className="mt-4">
                  Komal is the world's first non-addictive AI digital guardian. We believe technology should amplify a 
                  parent's intuition, not replace it. We believe in transparency over black boxes. And we believe every 
                  child deserves to explore safely.
                </p>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <section className="mb-16 text-center">
              <h2 className="text-3xl font-bold mb-6 text-text">Ready to Try Komal?</h2>
              <p className="text-lg text-text-dim mb-8 max-w-2xl mx-auto">
                Join thousands of parents who trust Komal as their child's AI companion.
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
        </div>
      </div>
    </>
  );
}
