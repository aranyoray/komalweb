"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import Script from "next/script";

export default function AboutKomalPage() {
  return (
    <>
      {/* Comprehensive Structured Data for Knowledge Panel */}
      <Script
        id="about-komal-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Komal Kids",
            "alternateName": ["Komal", "Komal – Your Digital Buddy", "KomalKids"],
            "url": "https://komalkids.com",
            "logo": "https://komalkids.com/komaliconnobg.png",
            "description": "Komal Kids (also known as Komal, Komal – Your Digital Buddy) is an AI-powered digital guardian for children ages 3-12. Using real-time behavioral AI, Komal adapts to each child's emotional and learning state, providing safe, age-appropriate digital experiences while protecting privacy through on-device processing.",
            "foundingDate": "2024",
            "sameAs": [
              "https://play.google.com/store/apps/details?id=com.komalkids.app&hl=en",
              "https://apps.apple.com/us/app/komal-your-digital-buddy/id6757139754",
              "https://chromewebstore.google.com/detail/egobidnbpgjogfjfjcchjdidcnpfgbki",
              "https://www.linkedin.com/company/komalkids/",
              "https://x.com/komalforkids",
              "https://www.instagram.com/komalforkids",
              "https://www.youtube.com/@komalforkids"
            ],
            "areaServed": {
              "@type": "Place",
              "name": "Global"
            },
            "audience": {
              "@type": "PeopleAudience",
              "audienceType": "Parents, Children, Educators, Pediatric Clinics"
            },
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "iOS, Android"
          }),
        }}
      />
      <Script
        id="about-komal-software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Komal Kids",
            "alternateName": ["Komal", "Komal – Your Digital Buddy"],
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "iOS, Android",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "500"
            },
            "screenshot": "https://komalkids.com/kid-hero.png",
            "featureList": [
              "Real-time behavioral AI adaptation",
              "On-device privacy processing",
              "Weekly parent insights",
              "COPPA & GDPR-K compliant",
              "Age-appropriate content filtering",
              "Screen time management"
            ]
          }),
        }}
      />

      <div className="min-h-screen pt-20">
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
          {/* Header */}
          <ScrollReveal>
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text">
                About Komal Kids
              </h1>
              <p className="text-xl text-text-dim leading-relaxed">
                <strong>Komal Kids</strong> (also known as <strong>Komal</strong>, <strong>Komal – Your Digital Buddy</strong>) 
                is the world's first AI-powered digital guardian that reads how a child feels, not just what they click.
              </p>
            </header>
          </ScrollReveal>

          {/* What is Komal */}
          <ScrollReveal delay={0.1}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-text">What is Komal Kids?</h2>
              <div className="prose prose-lg max-w-none text-text-dim leading-relaxed space-y-4">
                <p>
                  Komal Kids is an AI-powered digital guardian designed for children ages 3-12. Unlike traditional 
                  parental control apps that operate on simple block-or-allow rules, Komal uses real-time behavioral 
                  AI to understand your child's emotional state, engagement level, and learning patterns through 
                  gaze tracking, touch interactions, and micro-expressions.
                </p>
                <p>
                  The platform adapts the digital experience instantly—detecting frustration, hesitation, or delight—and 
                  adjusts content pacing, difficulty, and tone in under 200 milliseconds. This real-time adaptation 
                  ensures children receive age-appropriate, safe content while nurturing their curiosity and learning.
                </p>
                <p>
                  All AI processing happens on-device, meaning your child's data never leaves your device without 
                  explicit parental consent. Komal is COPPA and GDPR-K compliant, built on 20+ years of research and 
                  analysis of approximately 2 billion played sessions.
                </p>
              </div>
            </section>
          </ScrollReveal>

          {/* Research Foundation */}
          <ScrollReveal delay={0.4}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-text">Research Foundation</h2>
              <div className="prose prose-lg max-w-none text-text-dim leading-relaxed space-y-4">
                <p>
                  Komal Kids is built on 20+ years of extensive research and analysis of approximately 2 billion played 
                  sessions. Our approach is grounded in evidence-based practices from child psychology, developmental 
                  neuroscience, and educational technology.
                </p>
                <p>
                  The platform incorporates insights from leading research institutions including Yale University, UC Berkeley, 
                  and the University of Calgary's Internal Attention Lab, alongside expertise spanning child psychiatry, 
                  clinical psychology, and pediatric mental health.
                </p>
                <p>
                  Komal's real-time behavioral AI is informed by research on attention tracking, ADHD detection, mindfulness 
                  interventions, and culturally relevant learning frameworks. All methodologies are peer-reviewed and 
                  published in leading academic journals.
                </p>
              </div>
            </section>
          </ScrollReveal>

          {/* Privacy & Compliance */}
          <ScrollReveal delay={0.5}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-text">Privacy & Compliance</h2>
              <div className="prose prose-lg max-w-none text-text-dim leading-relaxed space-y-4">
                <p>
                  Komal Kids is fully compliant with COPPA (Children's Online Privacy Protection Act) and GDPR-K 
                  (General Data Protection Regulation for Kids). All AI processing happens on-device, meaning no raw 
                  video, audio, or biometric identifiers are stored or transmitted.
                </p>
                <p>
                  Only de-identified scores are used for long-term analyses. Raw media is automatically deleted after 
                  24 hours or if the app is uninstalled. Parents maintain full control over what data is shared and with 
                  whom, including the ability to share reports with teachers and therapists via one-click sharing.
                </p>
                <p>
                  Komal never sells data or uses it for advertising purposes. Our privacy-first approach ensures that 
                  children can explore safely while parents maintain complete transparency and control.
                </p>
              </div>
            </section>
          </ScrollReveal>

          {/* Download Links */}
          <ScrollReveal delay={0.6}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-text">Download Komal Kids</h2>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="https://apps.apple.com/us/app/komal-your-digital-buddy/id6757139754"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-text text-surface px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
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
                  href="https://play.google.com/store/apps/details?id=com.komalkids.app&hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-text text-surface px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[11px] leading-none opacity-80">GET IT ON</span>
                    <span className="text-base font-semibold leading-tight">Google Play</span>
                  </div>
                </Link>
                <Link
                  href="https://chromewebstore.google.com/detail/egobidnbpgjogfjfjcchjdidcnpfgbki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-text text-surface px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18a6 6 0 110-12 6 6 0 010 12zm0-9a3 3 0 100 6 3 3 0 000-6z" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[11px] leading-none opacity-80">Available on</span>
                    <span className="text-base font-semibold leading-tight">Chrome</span>
                  </div>
                </Link>
              </div>
            </section>
          </ScrollReveal>

          {/* Contact & Links */}
          <ScrollReveal delay={0.7}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-text">Connect With Us</h2>
              <div className="flex flex-wrap gap-4">
                <Link href="https://www.linkedin.com/company/komalkids/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  LinkedIn
                </Link>
                <Link href="https://x.com/komalforkids" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Twitter/X
                </Link>
                <Link href="https://www.instagram.com/komalforkids" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Instagram
                </Link>
                <Link href="https://www.youtube.com/@komalforkids" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  YouTube
                </Link>
              </div>
            </section>
          </ScrollReveal>
        </article>
      </div>
    </>
  );
}
