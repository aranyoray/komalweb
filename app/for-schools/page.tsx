"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import Script from "next/script";

export default function ForSchoolsPage() {
  return (
    <>
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Komal Kids for Schools | AI Learning Platform for Educational Institutions",
            "description": "Komal Kids helps schools provide personalized, safe AI learning experiences for students. Classroom-level dashboards, SEL framework alignment, and comprehensive student insights.",
            "url": "https://komalkids.com/for-schools"
          }),
        }}
      />
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
          <ScrollReveal>
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text">
                Komal Kids for Schools
              </h1>
              <p className="text-xl text-text-dim max-w-3xl mx-auto">
                Empower your students with personalized AI learning experiences. Classroom-level insights, 
                SEL framework alignment, and comprehensive student engagement analytics.
              </p>
            </header>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">Why Schools Choose Komal Kids</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">Classroom Dashboards</h3>
                  <p className="text-text-dim">
                    Monitor student engagement, learning patterns, and emotional well-being across your entire classroom 
                    with comprehensive analytics and insights.
                  </p>
                </div>
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">SEL Framework Alignment</h3>
                  <p className="text-text-dim">
                    Align with Social-Emotional Learning frameworks and track student progress in emotional regulation, 
                    empathy, and social skills development.
                  </p>
                </div>
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">Privacy & Compliance</h3>
                  <p className="text-text-dim">
                    COPPA and GDPR-K compliant with on-device processing. Student data stays secure and private, 
                    with full administrative control.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">Features for Educational Institutions</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-text">Classroom-Level Analytics</h3>
                    <p className="text-text-dim">
                      View aggregated insights across all students, identify learning trends, and make data-driven 
                      decisions to improve educational outcomes.
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
                    <h3 className="text-xl font-semibold mb-2 text-text">Individual Student Reports</h3>
                    <p className="text-text-dim">
                      Access detailed reports for each student, including learning patterns, engagement quality, and 
                      recommendations for personalized support.
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
                    <h3 className="text-xl font-semibold mb-2 text-text">Anonymized Engagement Trends</h3>
                    <p className="text-text-dim">
                      Understand overall classroom engagement patterns while maintaining student privacy through 
                      anonymized aggregate data.
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
                    <h3 className="text-xl font-semibold mb-2 text-text">Integration with Existing Systems</h3>
                    <p className="text-text-dim">
                      Seamlessly integrate Komal Kids with your school's existing learning management systems and 
                      educational technology stack.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">Pricing for Schools</h2>
              <div className="bg-surface/50 p-8 rounded-lg border border-border">
                <p className="text-text-dim mb-4">
                  Komal Kids offers special pricing for educational institutions. Our <Link href="/pricing" className="text-primary hover:underline">Thrive plan</Link> includes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-text-dim mb-6">
                  <li>Classroom-level dashboards</li>
                  <li>SEL framework alignment and reporting</li>
                  <li>Anonymized engagement trends</li>
                  <li>Unlimited student profiles</li>
                  <li>Priority support for educators</li>
                  <li>Training and onboarding</li>
                </ul>
                <Link href="/demo" className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                  Schedule a Demo
                </Link>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <section className="text-center">
              <h2 className="text-3xl font-bold mb-6 text-text">Get Started Today</h2>
              <p className="text-lg text-text-dim mb-8 max-w-2xl mx-auto">
                Join schools worldwide using Komal Kids to enhance student learning and well-being.
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
