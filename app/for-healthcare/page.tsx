"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingOrbs from "@/components/FloatingOrbs";
import TextShimmer from "@/components/TextShimmer";
import NoiseOverlay from "@/components/NoiseOverlay";
import ParticleField from "@/components/ParticleField";
import FaqAccordion from "@/components/FaqAccordion";
import Script from "next/script";
import { ShieldIcon, BrainIcon, ActivityIcon, ChartIcon } from "@/components/Icons";

const coreFeatures = [
  {
    title: "Between-Session Insights",
    description:
      "See how patients interact with digital environments between appointments. Komal surfaces patterns in screen engagement, content exposure, and emotional responses that children cannot self-report accurately, giving clinicians a window into daily digital life without relying on parent recall.",
    icon: ActivityIcon,
    color: "from-blue-400 to-indigo-500",
  },
  {
    title: "Developmental Pattern Tracking",
    description:
      "Clinical-grade longitudinal reports that identify attention, self-regulation, and social-emotional milestones 6-18 months earlier than traditional observation alone. Track progress over weeks and months with data that complements standardized assessments.",
    icon: ChartIcon,
    color: "from-violet-400 to-purple-500",
  },
  {
    title: "Parent Collaboration Dashboard",
    description:
      "Share actionable child development insights with parents in plain language they can act on. Bridge the gap between clinical recommendations and home implementation with concrete, data-informed guidance that parents understand without a clinical background.",
    icon: BrainIcon,
    color: "from-emerald-400 to-teal-500",
  },
  {
    title: "Privacy-First Architecture",
    description:
      "HIPAA-compatible design with on-device processing, end-to-end encryption, and zero data selling. Clinicians access aggregated behavioral patterns, never raw content. Parents retain full control over what is shared and with whom.",
    icon: ShieldIcon,
    color: "from-amber-400 to-orange-500",
  },
];

const clinicianTypes = [
  "Pediatricians",
  "Child Psychiatrists",
  "Developmental Pediatricians",
  "Clinical Psychologists",
  "Behavioral Therapists",
  "Occupational Therapists",
  "Speech Therapists",
  "Autism Centers",
  "School Counselors",
];

const workflowSteps = [
  {
    title: "Intake & Baseline",
    body: "During onboarding, Komal establishes a digital behavior baseline for the child. Within 2-3 weeks, you receive an initial profile showing screen engagement patterns, content preferences, and self-regulation indicators that inform your assessment.",
  },
  {
    title: "Ongoing Monitoring",
    body: "Between sessions, Komal passively observes digital interactions on the child's devices. You receive weekly or bi-weekly summaries highlighting changes in attention patterns, emotional regulation during screen use, and engagement with age-appropriate vs. concerning content.",
  },
  {
    title: "Session Preparation",
    body: "Before each appointment, review a concise clinical summary that flags notable changes since the last visit. Use objective behavioral data to guide conversation with the child and parent, rather than relying solely on self-report and recall.",
  },
  {
    title: "Treatment Progress Tracking",
    body: "Measure the real-world impact of interventions over time. If you recommend screen time changes, behavioral strategies, or therapy goals, Komal's longitudinal data shows whether digital behavior is shifting in the expected direction.",
  },
];

const faqs = [
  {
    question: "How does Komal support clinical practice?",
    answer:
      "Komal provides clinicians with objective, continuous data about a child's digital behavior between appointments. Instead of relying on parent recall or child self-report, which research shows are often inaccurate, you get weekly summaries of screen engagement patterns, content exposure, attention indicators, and self-regulation signals. This data complements your clinical observations and standardized assessments, giving you a fuller picture of the child's daily functioning.",
  },
  {
    question: "What data do clinicians see?",
    answer:
      "Clinicians see aggregated behavioral patterns, not raw content or surveillance data. Reports include screen engagement duration and patterns, content category breakdowns, attention and self-regulation indicators, emotional response signals, and longitudinal trend analysis. All data is presented in clinical summary format designed to be reviewed in under 3 minutes before a session. You never see specific messages, browsing history, or private content.",
  },
  {
    question: "Is Komal HIPAA compatible?",
    answer:
      "Yes. Komal is designed with HIPAA-compatible architecture. Data processing happens on-device, minimizing protected health information in transit. Aggregated behavioral summaries are encrypted end-to-end. We do not store individually identifiable health information on our servers. We are happy to execute a Business Associate Agreement (BAA) with clinical practices. Our privacy architecture has been reviewed by healthcare compliance consultants.",
  },
  {
    question: "How do parents share data with clinicians?",
    answer:
      "Parents maintain full control over data sharing. Through the Komal parent app, they can grant specific clinicians access to their child's behavioral summaries with a single tap. Parents choose what level of detail to share, can revoke access at any time, and receive notifications whenever a clinician views a report. This transparent, consent-based approach builds trust and keeps parents actively engaged in the care process.",
  },
  {
    question: "What age ranges does Komal cover?",
    answer:
      "Komal is designed for children ages 3-17, with developmental benchmarks and behavioral analysis calibrated for different age groups. For younger children (3-7), the focus is on content exposure and engagement duration. For school-age children (8-12), attention patterns, self-regulation, and social-emotional indicators become more prominent. For adolescents (13-17), the system tracks more nuanced digital wellbeing signals including social media interaction patterns and late-night usage.",
  },
  {
    question: "How is this different from screen time tracking apps?",
    answer:
      "Screen time apps measure one thing: duration. Komal measures how a child engages with digital content, not just how long. A child who spends 2 hours on creative coding apps has a very different digital profile than one who spends 2 hours on passive content. Komal analyzes engagement quality, content categories, attention patterns, self-regulation moments, and emotional responses. For clinicians, this qualitative data is far more actionable than a simple minutes-per-day number. It is the difference between knowing a patient's weight and understanding their nutrition.",
  },
];

export default function ForHealthcarePage() {
  return (
    <>
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Komal for Healthcare | Pediatric Digital Wellbeing Insights for Clinicians",
            description:
              "Between-session digital behavior insights for pediatricians, child psychologists, and developmental specialists. Clinical-grade developmental pattern tracking, parent collaboration dashboard, and HIPAA-compatible privacy-first architecture.",
            url: "https://komalkids.com/for-healthcare",
          }),
        }}
      />

      <NoiseOverlay opacity={0.025} />
      <ParticleField count={30} color="263, 50%, 40%" speed={0.15} connectDistance={80} />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <FloatingOrbs count={3} />
        </div>

        <div className="container max-w-[1300px] px-6 md:px-10 mx-auto relative z-10">
          <div className="text-center">
            <ScrollReveal delay={0.05}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                For Healthcare Professionals
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="font-sans font-bold leading-[1.1] tracking-tight text-primary text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] mb-6">
                Digital Wellbeing Insights
                <span className="block">
                  <TextShimmer duration={4}>That Improve Patient Care.</TextShimmer>
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-center text-lg md:text-xl text-text-dim max-w-2xl mx-auto mb-10 leading-relaxed">
                Komal gives pediatricians, child psychologists, and developmental specialists objective, between-session data on how children interact with digital environments, so you can make better-informed clinical decisions.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary-premium text-white text-lg px-8 py-4 h-auto rounded-full border-0"
                >
                  <Link href="/demo">Book a Demo</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white text-primary border-primary border-2 hover:bg-primary/5 text-lg px-8 py-4 h-auto rounded-full"
                >
                  <Link href="#clinical-challenge">Learn More</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* The Clinical Challenge */}
      <section id="clinical-challenge" className="py-20 bg-gradient-to-b from-white to-blue-50/30">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                The Clinical Challenge
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Children spend 4-9 hours per day on screens. Clinicians see them for 30-60 minutes per week. That leaves a massive blind spot in understanding how digital environments affect development, behavior, and mental health.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Unreliable Self-Report",
                body: "Children under 12 cannot accurately report their own screen behavior. Adolescents often underreport. Parents estimate, but research shows parent recall is off by 30-50% on average.",
                label: "The problem",
                labelColor: "text-rose-600 bg-rose-50",
              },
              {
                title: "No Between-Session Data",
                body: "Clinicians make treatment decisions based on a snapshot from a single appointment. What happens in the other 167 hours of the week remains invisible, especially in digital environments.",
                label: "The problem",
                labelColor: "text-rose-600 bg-rose-50",
              },
              {
                title: "Objective Digital Insights",
                body: "Komal provides continuous, passive monitoring of digital behavior patterns and delivers clinical-grade summaries that fill the gap between appointments with actionable child development insights.",
                label: "The Komal approach",
                labelColor: "text-blue-600 bg-blue-50",
              },
            ].map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 h-full">
                  <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mb-4 ${item.labelColor}`}>
                    {item.label}
                  </span>
                  <h3 className="text-lg font-bold text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-text-dim leading-relaxed">{item.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
                Clinical Tools for Pediatric Digital Wellbeing
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Between-session monitoring, developmental pattern tracking, and parent collaboration designed for clinical workflows.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreFeatures.map((feature, index) => (
              <ScrollReveal key={feature.title} delay={index * 0.1}>
                <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-text-dim leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who Uses Komal */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Who Uses Komal
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Healthcare professionals across specialties use Komal to gain child development insights and improve screen time clinical tools in their practice.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {clinicianTypes.map((type, index) => (
              <ScrollReveal key={type} delay={index * 0.05}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white mx-auto mb-4">
                    <BrainIcon className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-primary text-sm md:text-base">{type}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Integration with Clinical Practice */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Integration with Clinical Practice
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Komal fits into your existing workflow without adding administrative overhead. From intake to long-term treatment tracking, between-session monitoring runs in the background while you focus on patient care.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {workflowSteps.map((step, index) => (
              <ScrollReveal key={step.title} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-bold text-primary">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-text-dim leading-relaxed">{step.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container max-w-[800px] px-8 mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
              Questions from Clinicians
            </h2>
          </ScrollReveal>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <FloatingOrbs count={4} />
        </div>
        <div className="container max-w-[900px] px-8 mx-auto text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <TextShimmer duration={4}>
                See What Happens Between Sessions.
              </TextShimmer>
            </h2>
            <p className="text-lg opacity-90 mb-10">
              Join clinicians using Komal to gain pediatric digital wellbeing insights that inform better treatment decisions. Book a demo to see how between-session monitoring works in practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="btn-primary-premium-inverted text-lg px-8 py-4 h-auto rounded-full border-0"
              >
                <Link href="/demo">Book a Demo</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white border-2 hover:bg-white/10 text-lg px-8 py-4 h-auto rounded-full"
              >
                <Link href="#clinical-challenge">Learn How It Works</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
