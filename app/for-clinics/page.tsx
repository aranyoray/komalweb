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

const clinicianTypes = [
  {
    title: "Pediatricians",
    description: "Screen time conversations with evidence. Komal reports give you objective data on a child's digital engagement patterns to inform your guidance to families.",
  },
  {
    title: "Child Psychologists & Psychiatrists",
    description: "Between-session insights into digital behavior patterns, emotional regulation trends, and attention shifts that complement clinical observations.",
  },
  {
    title: "Developmental & Behavioral Therapists",
    description: "Longitudinal data on engagement quality, self-regulation development, and digital literacy milestones to track progress alongside treatment.",
  },
  {
    title: "School Counselors",
    description: "Aggregate wellbeing patterns across student groups, informed by real digital engagement data rather than self-reports or teacher observations alone.",
  },
  {
    title: "Occupational & Speech Therapists",
    description: "Fine motor engagement data, attention span observations, and communication pattern insights that supplement in-session assessments with between-session behavioral context.",
  },
  {
    title: "Autism Centers & Specialists",
    description: "Sensory engagement patterns, routine adherence data, and interaction preferences tracked over time. Useful context for care planning without diagnostic claims.",
  },
];

const features = [
  {
    title: "Between-Session Behavioral Insights",
    description:
      "Parents share Komal reports with you via one-click sharing. See engagement patterns, emotional regulation trends, and attention shifts between appointments, not just during them.",
    icon: ChartIcon,
    color: "from-blue-400 to-indigo-500",
  },
  {
    title: "Longitudinal Developmental Patterns",
    description:
      "Komal tracks digital engagement over months, surfacing patterns that may appear 6-18 months before they show up in formal assessments. Useful context for developmental conversations.",
    icon: ActivityIcon,
    color: "from-violet-400 to-purple-500",
  },
  {
    title: "No Diagnostic Claims",
    description:
      "Komal provides insights and pattern data, not diagnoses. Reports are designed to complement your clinical judgment, not replace it. All language is careful and clinician-informed.",
    icon: BrainIcon,
    color: "from-emerald-400 to-teal-500",
  },
  {
    title: "Privacy by Architecture",
    description:
      "On-device processing. Parent-controlled sharing. No cloud storage of biometric data. Designed with healthcare privacy standards in mind, supporting HIPAA-conscious workflows.",
    icon: ShieldIcon,
    color: "from-amber-400 to-orange-500",
  },
];

const faqs = [
  {
    question: "Does Komal provide clinical diagnoses?",
    answer:
      "No. Komal explicitly does not provide medical or psychological diagnoses. The platform provides insights about digital engagement patterns, emotional regulation trends, and developmental milestones. These are designed to complement clinical evaluation, not replace it. All report language is reviewed by child psychologists to ensure it avoids diagnostic framing.",
  },
  {
    question: "How do patients share Komal reports with me?",
    answer:
      "Sharing is parent-initiated and parent-controlled. Parents can share reports with clinicians via email or WhatsApp with one click from their Komal dashboard. Clinicians receive a plain-language summary of engagement patterns, emotional trends, and developmental observations without needing a Komal account.",
  },
  {
    question: "What kind of data do the reports contain?",
    answer:
      "Reports include engagement quality patterns (focused, distracted, frustrated), attention span trends over time, browsing behavior categories (educational, entertainment, social), emotional regulation indicators, and self-regulation milestones. Reports do not include message content, specific URLs visited, or biometric data.",
  },
  {
    question: "Is Komal HIPAA compliant?",
    answer:
      "Komal processes data on-device and is designed with healthcare privacy standards in mind. We do not store patient-identifiable health information in the cloud. For formal HIPAA compliance requirements, we recommend discussing your specific use case with our team to ensure alignment with your practice's compliance framework.",
  },
  {
    question: "Can I recommend Komal to patient families?",
    answer:
      "Yes. Many pediatricians and child psychologists recommend Komal as a tool families can use at home to support healthy digital habits and provide clinicians with useful between-session data. We can provide referral materials tailored for your practice.",
  },
  {
    question: "How is Komal different from screen time tracking apps?",
    answer:
      "Screen time apps measure quantity (hours used, apps opened). Komal measures quality: engagement depth, emotional patterns, self-regulation behavior, and developmental trends over time. This is the difference between knowing a child spent 2 hours on a device and understanding how they engaged and what patterns are emerging.",
  },
  {
    question: "Who designed Komal's clinical approach?",
    answer:
      "Komal is clinician-designed and research-informed, developed in collaboration with child psychologists, developmental experts, and pediatricians. The platform is built on principles from developmental psychology and is advised by experts from institutions including Yale University.",
  },
];

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
            name: "Komal for Clinicians | Between-Session Child Development Insights",
            description:
              "Between-session behavioral and developmental insights for pediatricians, child psychologists, therapists, and autism specialists. Longitudinal engagement data, emotional regulation patterns, and parent-shared reports. Used by clinicians in India, the US, UK, and Singapore.",
            url: "https://komalkids.com/for-clinics",
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
                For Clinicians &amp; Psychologists
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="font-sans font-bold leading-[1.1] tracking-tight text-primary text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] mb-6">
                See What Happens
                <span className="block">
                  <TextShimmer duration={4}>Between Sessions</TextShimmer>
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-center text-lg md:text-xl text-text-dim max-w-2xl mx-auto mb-10 leading-relaxed">
                Komal gives pediatricians, child psychologists, and developmental therapists longitudinal insights into a child&apos;s digital engagement patterns. Not diagnoses. Not surveillance. Just useful data that complements your clinical judgment.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary-premium text-white text-lg px-8 py-4 h-auto rounded-full border-0"
                >
                  <Link href="/demo">Schedule a Conversation</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white text-primary border-primary border-2 hover:bg-primary/5 text-lg px-8 py-4 h-auto rounded-full"
                >
                  <Link href="#for-your-specialty">For Your Specialty</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50/30">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
                What Komal Provides Clinicians
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Objective digital behavior data that complements your expertise. Parent-shared, privacy-first, clinician-informed.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
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

      {/* By Specialty */}
      <section id="for-your-specialty" className="py-20 bg-white">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                For Your Specialty
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Komal is a referral and insight tool for clinicians who work with children and families.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {clinicianTypes.map((type, index) => (
              <ScrollReveal key={type.title} delay={index * 0.1}>
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                  <h3 className="text-lg font-bold text-primary mb-3">
                    {type.title}
                  </h3>
                  <p className="text-text-dim leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Important Note */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container max-w-[900px] px-8 mx-auto">
          <ScrollReveal>
            <div className="bg-amber-50 rounded-2xl p-8 border border-amber-200">
              <h3 className="text-lg font-bold text-primary mb-3">
                Clinical Integrity Statement
              </h3>
              <p className="text-text-dim leading-relaxed">
                Komal does not provide medical or psychological diagnoses. The platform offers insights about digital engagement patterns, emotional responses, and developmental trends. These insights are designed to complement, not replace, professional clinical evaluation and treatment. All report language is reviewed by child psychologists to ensure appropriate framing.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-slate-50">
        <div className="container max-w-[900px] px-8 mx-auto text-center">
          <ScrollReveal>
            <p className="text-lg text-text-dim italic mb-4">
              &ldquo;My son&apos;s therapist loves the reports. She can see patterns between sessions that we never noticed before.&rdquo;
            </p>
            <p className="font-semibold text-primary">Rajesh K.</p>
            <p className="text-sm text-text-dim">Parent, India</p>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-[800px] px-8 mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
              Questions from Clinicians
            </h2>
          </ScrollReveal>
          <FaqAccordion faqs={faqs} />
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
                Better Data. Better Conversations. Better Outcomes.
              </TextShimmer>
            </h2>
            <p className="text-lg opacity-90 mb-10">
              Clinician-designed. Research-informed. Piloted with child psychologists and developmental experts. Schedule a conversation to learn how Komal can support your practice.
            </p>
            <Button
              asChild
              size="lg"
              className="btn-primary-premium-inverted text-lg px-8 py-4 h-auto rounded-full border-0"
            >
              <Link href="/demo">Schedule a Conversation</Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
