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

const coreCapabilities = [
  {
    title: "Regulatory Compliance",
    description:
      "COPPA, CIPA, GDPR-K, and India DPDP Act compliant out of the box. Komal meets the strictest child data protection standards across jurisdictions, so your deployment is audit-ready from day one.",
    icon: ShieldIcon,
    color: "from-emerald-400 to-teal-500",
  },
  {
    title: "Population-Level Insights",
    description:
      "Anonymized, aggregate data on children's digital wellbeing patterns across districts and states. Understand trends at scale without compromising individual privacy.",
    icon: ChartIcon,
    color: "from-blue-400 to-indigo-500",
  },
  {
    title: "Evidence-Based Approach",
    description:
      "Built on developmental psychology research, not surveillance. Komal's peer-reviewed framework guides children toward digital judgment rather than simply restricting access.",
    icon: BrainIcon,
    color: "from-violet-400 to-purple-500",
  },
  {
    title: "Multi-Jurisdiction Ready",
    description:
      "Adapts to US, India, Canada, Singapore, and UK compliance frameworks. One platform that respects the regulatory nuances of each jurisdiction you operate in.",
    icon: ActivityIcon,
    color: "from-amber-400 to-orange-500",
  },
];

const implementationModels = [
  {
    title: "Public School Deployment",
    description:
      "Deploy through state education boards and district-level IT infrastructure. Komal integrates with existing school devices and networks, providing CIPA-compliant filtering with a developmental layer that builds student digital judgment.",
    label: "Via State Education Boards",
    labelColor: "text-blue-600 bg-blue-50",
  },
  {
    title: "Child Protection Integration",
    description:
      "Equip child protection agencies and public health departments with longitudinal digital wellbeing data. Anonymized population-level insights help identify at-risk trends before they become crises.",
    label: "Via Child Protection Agencies",
    labelColor: "text-violet-600 bg-violet-50",
  },
  {
    title: "Digital India / National Programs",
    description:
      "Purpose-built for national-scale digital literacy and safety programs. Supports multi-language deployments, rural connectivity considerations, and integration with government identity and education platforms.",
    label: "Via National Digital Programs",
    labelColor: "text-emerald-600 bg-emerald-50",
  },
];

const complianceStandards = [
  {
    name: "COPPA",
    jurisdiction: "United States",
    description: "Children's Online Privacy Protection Act. Governs the collection of personal information from children under 13.",
  },
  {
    name: "CIPA",
    jurisdiction: "United States",
    description: "Children's Internet Protection Act. Requires content filtering for schools and libraries receiving E-rate funding.",
  },
  {
    name: "FERPA",
    jurisdiction: "United States",
    description: "Family Educational Rights and Privacy Act. Protects the privacy of student education records.",
  },
  {
    name: "GDPR-K",
    jurisdiction: "EU / United Kingdom",
    description: "General Data Protection Regulation provisions for children. Age-appropriate design code and enhanced data protections for minors.",
  },
  {
    name: "DPDP Act",
    jurisdiction: "India",
    description: "Digital Personal Data Protection Act. India's comprehensive data protection framework with specific provisions for children's data.",
  },
  {
    name: "PDPA",
    jurisdiction: "Singapore",
    description: "Personal Data Protection Act. Singapore's framework for data protection with obligations for processing children's data.",
  },
];

const faqs = [
  {
    question: "How does Komal handle government procurement processes?",
    answer:
      "Komal is structured to work within standard government procurement frameworks. We support RFP/RFQ responses, provide compliance documentation packages, and can work with existing government vendor registration systems. Our team has experience with state-level and national-level procurement cycles in the US and India.",
  },
  {
    question: "Where is data stored and processed?",
    answer:
      "Komal processes data on-device wherever possible. For aggregate analytics, data residency can be configured per jurisdiction. We support US-based, EU-based, and India-based data hosting to meet data sovereignty requirements. No child-identifiable data leaves the device without explicit consent.",
  },
  {
    question: "Can Komal scale to millions of students across a state or country?",
    answer:
      "Yes. Komal's architecture is designed for population-scale deployment. The on-device processing model means server load scales linearly, not exponentially. We have infrastructure partnerships to support deployments across entire state education systems and national programs.",
  },
  {
    question: "How does Komal differ from web filtering mandates like CIPA?",
    answer:
      "Komal meets CIPA filtering requirements but goes further. While CIPA mandates content blocking, Komal adds a developmental layer that helps children build digital judgment over time. This means better long-term outcomes: children who can navigate the internet safely even when the filter is removed.",
  },
  {
    question: "What reporting and analytics are available for policymakers?",
    answer:
      "Komal provides anonymized, aggregate dashboards showing digital wellbeing trends across districts, states, or national populations. Policymakers can see engagement patterns, content category trends, emotional regulation indicators, and developmental milestones without accessing any individual child's data.",
  },
  {
    question: "Does Komal support multi-language deployments?",
    answer:
      "Yes. Komal supports multiple languages and can be configured for regional language requirements. This is particularly relevant for deployments in India, Singapore, Canada, and other multilingual jurisdictions where children access content in different languages.",
  },
  {
    question: "How is Komal's approach validated?",
    answer:
      "Komal is built on peer-reviewed developmental psychology research and is developed in collaboration with child psychologists, educators, and policy experts. Our advisory board includes experts from institutions like Yale University. We publish our methodology and welcome independent evaluation.",
  },
  {
    question: "Can we run a pilot program before full deployment?",
    answer:
      "Absolutely. We recommend a phased approach: a controlled pilot in select districts or schools, followed by evaluation and scaling. Pilot programs include full reporting, stakeholder briefings, and a detailed assessment of outcomes to inform your deployment decision.",
  },
];

export default function ForGovernmentPage() {
  return (
    <>
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Komal for Government | Evidence-Based Child Digital Safety at Scale",
            description:
              "Child digital safety policy solution for government agencies, education departments, and child protection bodies. COPPA, CIPA, GDPR-K, and DPDP Act compliant. Population-level insights and evidence-based approach to digital safety compliance.",
            url: "https://komalkids.com/for-government",
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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                For Government &amp; Education Departments
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="font-sans font-bold leading-[1.1] tracking-tight text-primary text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] mb-6">
                Evidence-Based Child
                <span className="block">
                  <TextShimmer duration={4}>Digital Safety at Scale</TextShimmer>
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-center text-lg md:text-xl text-text-dim max-w-2xl mx-auto mb-10 leading-relaxed">
                Meet compliance mandates while genuinely protecting children online. Komal gives government agencies and education departments a developmental approach to child online protection that works across jurisdictions and at population scale.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary-premium text-white text-lg px-8 py-4 h-auto rounded-full border-0"
                >
                  <Link href="/demo">Request a Briefing</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white text-primary border-primary border-2 hover:bg-primary/5 text-lg px-8 py-4 h-auto rounded-full"
                >
                  <Link href="#compliance-framework">View Compliance Details</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* The Policy Challenge */}
      <section className="py-20 bg-gradient-to-b from-white to-violet-50/30">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                The Policy Challenge
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Children need internet access for learning, but existing solutions are either too restrictive or too permissive. Komal provides a third way.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Too Restrictive",
                body: "Heavy-handed blocking denies children access to educational resources. Teachers and students work around filters, undermining the policy entirely.",
                label: "Current approach",
                labelColor: "text-rose-600 bg-rose-50",
              },
              {
                title: "Too Permissive",
                body: "Minimal filtering exposes children to harmful content and predatory design. The burden of protection falls entirely on parents and teachers.",
                label: "Current approach",
                labelColor: "text-rose-600 bg-rose-50",
              },
              {
                title: "Guided Digital Access",
                body: "Age-appropriate filtering combined with real-time developmental guidance that builds children's judgment. Evidence-based protection that scales.",
                label: "The Komal approach",
                labelColor: "text-emerald-600 bg-emerald-50",
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

      {/* Core Capabilities */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
                Core Capabilities
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Purpose-built for government-scale child digital safety with compliance, insights, and evidence at the center.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreCapabilities.map((capability, index) => (
              <ScrollReveal key={capability.title} delay={index * 0.1}>
                <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${capability.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <capability.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">
                    {capability.title}
                  </h3>
                  <p className="text-text-dim leading-relaxed">
                    {capability.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Models */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Implementation Models
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Flexible deployment paths designed for government and institutional workflows.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {implementationModels.map((model, index) => (
              <ScrollReveal key={model.title} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 h-full flex flex-col">
                  <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mb-4 ${model.labelColor}`}>
                    {model.label}
                  </span>
                  <h3 className="text-xl font-bold text-primary mb-3">
                    {model.title}
                  </h3>
                  <p className="text-text-dim leading-relaxed flex-grow">
                    {model.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Framework */}
      <section id="compliance-framework" className="py-20 bg-white">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Compliance Framework
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Komal is built to meet child data protection standards across the world's major regulatory frameworks.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complianceStandards.map((standard, index) => (
              <ScrollReveal key={standard.name} delay={index * 0.08}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white shrink-0">
                      <ShieldIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-primary">{standard.name}</h3>
                      <p className="text-xs text-text-dim">{standard.jurisdiction}</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-dim leading-relaxed">
                    {standard.description}
                  </p>
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
              Questions from Government Buyers
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
                Protect Children at Scale. Build Digital Judgment.
              </TextShimmer>
            </h2>
            <p className="text-lg opacity-90 mb-10">
              Evidence-based. Compliance-ready. Designed for population-scale deployment. Schedule a briefing to learn how Komal can support your child digital safety mandate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="btn-primary-premium-inverted text-lg px-8 py-4 h-auto rounded-full border-0"
              >
                <Link href="/demo">Request a Briefing</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white border-2 hover:bg-white/10 text-lg px-8 py-4 h-auto rounded-full"
              >
                <Link href="#compliance-framework">View Compliance Details</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
