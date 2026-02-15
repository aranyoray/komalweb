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
    title: "Web Filtering with an SEL Layer",
    description:
      "Go beyond CIPA-compliant blocking. Komal adds a social-emotional learning dimension to web access, helping students develop self-regulation skills alongside content safety.",
    icon: ShieldIcon,
    color: "from-emerald-400 to-teal-500",
  },
  {
    title: "Classroom-Level Dashboards",
    description:
      "View aggregated engagement patterns, attention trends, and emotional wellbeing indicators across your classroom or grade level without accessing individual student data.",
    icon: ChartIcon,
    color: "from-blue-400 to-indigo-500",
  },
  {
    title: "Peer-Avatar Guidance",
    description:
      "Komal's pavatar technology provides real-time, voice-based guidance that helps students pause and reflect before engaging with gated content, building digital judgment naturally.",
    icon: BrainIcon,
    color: "from-violet-400 to-purple-500",
  },
  {
    title: "Privacy-First Compliance",
    description:
      "COPPA, FERPA, and GDPR-K compliant. On-device processing keeps student data secure. Full administrative control over data sharing and visibility.",
    icon: ActivityIcon,
    color: "from-amber-400 to-orange-500",
  },
];

const deploymentOptions = [
  {
    title: "Web Filter Only",
    description: "CIPA-compliant content filtering with Komal's three-tier Block/Gate/Allow system. Drop-in replacement or complement to existing filters.",
    price: "Starting at $2/student/year",
  },
  {
    title: "Web Filter + SEL Add-On",
    description: "Content filtering plus social-emotional learning prompts, mindful browsing check-ins, and classroom-level wellbeing dashboards.",
    price: "Starting at $5/student/year",
  },
  {
    title: "SEL/Mindfulness Only",
    description: "For districts that already have a web filter. Add Komal's SEL layer, peer-avatar guidance, and developmental insight reporting.",
    price: "Starting at $3/student/year",
  },
];

const pilotDetails = [
  "4-6 weeks, small cohort (you choose the grades/classes)",
  "Quick setup via browser extension on Chromebooks and desktops",
  "School receives an end-of-pilot report on usage patterns and student feedback",
  "No cost for pilot participants",
  "We handle onboarding for staff and provide a parent-facing explainer",
  "Fits around existing digital citizenship or SEL frameworks",
];

const faqs = [
  {
    question: "How does Komal compare to GoGuardian or Lightspeed?",
    answer:
      "GoGuardian, Lightspeed, and similar tools are excellent web filters focused on content blocking and monitoring. Komal adds a developmental layer on top of filtering: peer-avatar guidance that builds self-regulation, SEL-aligned check-ins, and longitudinal insight reports that help educators understand student engagement patterns beyond what click data shows. Komal can replace or complement your existing filter.",
  },
  {
    question: "Is Komal CIPA compliant?",
    answer:
      "Yes. Komal's web filtering meets CIPA requirements for content filtering in schools receiving E-rate funding. Our three-tier system (Block, Gate, Allow) provides CIPA-compliant blocking while adding an educational layer that helps students develop judgment about online content.",
  },
  {
    question: "What is the typical per-student cost?",
    answer:
      "Komal is priced competitively with existing school web filters at $2-5 per student per year for the filtering layer, with SEL add-ons available. Volume discounts are available for districts with 5,000+ students. Contact us for enterprise pricing.",
  },
  {
    question: "Does Komal work on Chromebooks?",
    answer:
      "Yes. Komal deploys as a browser extension on Chromebooks, the most common device in US K-12 schools. It also works on desktops and laptops. An iOS version is available for schools using iPads or iPhones.",
  },
  {
    question: "How does the pilot program work?",
    answer:
      "Pilots run 4-6 weeks with a small cohort of your choosing. We handle teacher onboarding and provide parent-facing communication materials. At the end, your school receives a usage patterns report and qualitative feedback summary. Pilots are free of charge.",
  },
  {
    question: "Does Komal integrate with Google Classroom or Canvas?",
    answer:
      "Komal is designed to complement existing LMS platforms. While direct LMS integration is on our roadmap, Komal currently operates at the browser level, which means it works alongside any LMS without requiring configuration changes.",
  },
  {
    question: "How does Komal handle FERPA requirements?",
    answer:
      "Komal processes data on-device and does not store personally identifiable student information in the cloud without explicit consent. Administrative controls allow schools to define data sharing policies. We sign standard Data Privacy Agreements and are committed to FERPA compliance.",
  },
  {
    question: "Can Komal support multiple school types (public, charter, private, international)?",
    answer:
      "Yes. Komal is used in US public and charter schools, private school networks, and international schools including IB, CBSE, ICSE, and GCSE-affiliated institutions. Our system adapts to different compliance frameworks and school structures.",
  },
];

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
            name: "Komal for Schools | Web Filtering with SEL | CIPA Compliant | Alternative to GoGuardian",
            description:
              "CIPA-compliant web filtering with a social-emotional learning layer. Starting at $2/student/year. Classroom dashboards, peer-avatar guidance, and privacy-first compliance. Alternative to GoGuardian, Lightspeed, and Securly with developmental insights.",
            url: "https://komalkids.com/for-schools",
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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                For Schools &amp; Districts
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="font-sans font-bold leading-[1.1] tracking-tight text-primary text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] mb-6">
                Students Need Web Access.
                <span className="block">
                  <TextShimmer duration={4}>They Also Need Judgment.</TextShimmer>
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-center text-lg md:text-xl text-text-dim max-w-2xl mx-auto mb-10 leading-relaxed">
                Komal provides CIPA-compliant web filtering combined with a social-emotional learning layer that helps students develop digital judgment, not just follow rules. Privacy-first. No surveillance.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary-premium text-white text-lg px-8 py-4 h-auto rounded-full border-0"
                >
                  <Link href="/demo">Request a Pilot</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white text-primary border-primary border-2 hover:bg-primary/5 text-lg px-8 py-4 h-auto rounded-full"
                >
                  <Link href="/pricing">View School Pricing</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                The School Digital Safety Dilemma
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Schools are caught between two broken approaches. Komal offers a third way.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Block Everything",
                body: "Students can't access legitimate educational content. Teachers work around the filter. Learning suffers.",
                label: "Current approach",
                labelColor: "text-rose-600 bg-rose-50",
              },
              {
                title: "Monitor Everything",
                body: "Surveillance creates distrust and resistance. Students find workarounds. Staff spend time reviewing alerts instead of teaching.",
                label: "Current approach",
                labelColor: "text-rose-600 bg-rose-50",
              },
              {
                title: "Guide + Build Judgment",
                body: "Age-appropriate filtering with real-time guidance that helps students develop the self-regulation to navigate the web safely on their own.",
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

      {/* Core Features */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
                What Komal Provides for Schools
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Web filtering, SEL alignment, and developmental insights in one platform.
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

      {/* Pricing Options */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Flexible School Pricing
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Choose the configuration that fits your district. All options include CIPA compliance and privacy-first architecture.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {deploymentOptions.map((option, index) => (
              <ScrollReveal key={option.title} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 h-full flex flex-col">
                  <h3 className="text-xl font-bold text-primary mb-3">
                    {option.title}
                  </h3>
                  <p className="text-text-dim leading-relaxed mb-6 flex-grow">
                    {option.description}
                  </p>
                  <p className="text-sm font-semibold text-emerald-600">
                    {option.price}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pilot Program */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1000px] px-8 mx-auto">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-10 border border-emerald-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                  Run a Free Pilot This Term
                </h2>
                <p className="text-lg text-text-dim max-w-2xl mx-auto">
                  See Komal in action in your school before committing. Our pilot is lightweight, free, and designed to complement existing efforts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pilotDetails.map((detail, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-text-dim leading-relaxed">{detail}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary-premium text-white text-lg px-8 py-4 h-auto rounded-full border-0"
                >
                  <Link href="/demo">Request a Pilot</Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Competitive Context */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                How Komal Fits Your Existing Stack
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Replace Your Current Filter",
                body: "Komal provides full CIPA-compliant web filtering with the added benefit of SEL integration and developmental insights that tools like GoGuardian, Lightspeed, and Securly don't offer.",
              },
              {
                title: "Complement Your Current Filter",
                body: "Keep your existing filter for content blocking and add Komal's SEL layer for peer-avatar guidance, mindful browsing, and classroom-level wellbeing dashboards on top.",
              },
              {
                title: "Works with Any LMS",
                body: "Komal operates at the browser level and works alongside Google Classroom, Canvas, Schoology, and any other learning management system without integration overhead.",
              },
              {
                title: "All School Types, Globally",
                body: "Deployed in US public and charter schools, private school networks, and international schools (IB, CBSE, ICSE, GCSE). Works for districts in the US (CIPA/FERPA), schools in India (DPDP), and UK institutions (GDPR-K, Age Appropriate Design Code). Adapts to different compliance requirements and school structures.",
              },
            ].map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-8 border border-slate-100">
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

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-[800px] px-8 mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
              Questions from School IT Leaders
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
                Move Beyond Blocking. Build Judgment.
              </TextShimmer>
            </h2>
            <p className="text-lg opacity-90 mb-10">
              Join schools using Komal to combine CIPA compliance with genuine student development. Start with a free pilot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="btn-primary-premium-inverted text-lg px-8 py-4 h-auto rounded-full border-0"
              >
                <Link href="/demo">Request a Pilot</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white border-2 hover:bg-white/10 text-lg px-8 py-4 h-auto rounded-full"
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
