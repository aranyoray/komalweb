"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import Script from "next/script";

export default function ForClinicsPage() {
  return (
    <>
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Komal Kids for Pediatric Clinics | Child Development Insights",
            "description": "Komal Kids helps pediatric clinics and child therapists gain insights into patient development through AI-powered behavioral analysis and comprehensive reports.",
            "url": "https://komalkids.com/for-clinics"
          }),
        }}
      />
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
          <ScrollReveal>
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text">
                Komal Kids for Pediatric Clinics
              </h1>
              <p className="text-xl text-text-dim max-w-3xl mx-auto">
                Support your patients' development with AI-powered insights. Comprehensive behavioral analysis, 
                engagement tracking, and shareable reports for better patient care.
              </p>
            </header>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">How Pediatric Clinics Use Komal Kids</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">Patient Development Insights</h3>
                  <p className="text-text-dim">
                    Receive detailed reports from parents about their child's digital engagement patterns, emotional 
                    responses, and learning behaviors to inform treatment plans.
                  </p>
                </div>
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">Between-Session Monitoring</h3>
                  <p className="text-text-dim">
                    Track patient progress between therapy sessions through weekly insights, helping identify patterns 
                    and adjust treatment approaches.
                  </p>
                </div>
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">Parent Collaboration</h3>
                  <p className="text-text-dim">
                    Parents can easily share Komal Kids reports with you via one-click sharing, facilitating better 
                    communication and collaborative care.
                  </p>
                </div>
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">Privacy & HIPAA Compliance</h3>
                  <p className="text-text-dim">
                    All data processing happens on-device. Komal Kids is designed with healthcare privacy standards 
                    in mind, ensuring patient information remains secure.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">Benefits for Child Therapists</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-text">Objective Behavioral Data</h3>
                    <p className="text-text-dim">
                      Access objective insights about patient behavior patterns, engagement levels, and emotional 
                      responses that complement clinical observations.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-text">Treatment Progress Tracking</h3>
                    <p className="text-text-dim">
                      Monitor how patients respond to interventions over time, identifying what works and what needs 
                      adjustment in treatment approaches.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-text">Research-Backed Methodology</h3>
                    <p className="text-text-dim">
                      Komal Kids is built on 20+ years of research and advised by leading child psychologists, 
                      including experts from the Indian Journal of Psychiatry and UC Berkeley.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <section className="mb-16 bg-surface/50 p-8 rounded-lg border border-border">
              <h2 className="text-3xl font-bold mb-4 text-text">Important Note</h2>
              <p className="text-text-dim leading-relaxed">
                <strong>Komal Kids does not provide medical or psychological diagnoses.</strong> The platform offers 
                insights and understanding about children's digital engagement patterns, emotional responses, and 
                learning behaviors. These insights are designed to complement, not replace, professional clinical 
                evaluation and treatment.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <section className="text-center">
              <h2 className="text-3xl font-bold mb-6 text-text">Get Started</h2>
              <p className="text-lg text-text-dim mb-8 max-w-2xl mx-auto">
                Learn how Komal Kids can support your practice and patient care.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/demo" className="bg-primary text-white px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg">
                  Schedule a Demo
                </Link>
                <Link href="/pricing" className="bg-surface border border-border text-text px-8 py-4 rounded-xl hover:opacity-90 transition-opacity">
                  View Pricing
                </Link>
              </div>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
