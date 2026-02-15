"use client";

import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingOrbs from "@/components/FloatingOrbs";
import TextShimmer from "@/components/TextShimmer";
import NoiseOverlay from "@/components/NoiseOverlay";
import ParticleField from "@/components/ParticleField";
import FaqAccordion from "@/components/FaqAccordion";
import { ShieldIcon, BrainIcon, ActivityIcon, HeartIcon } from "@/components/Icons";

const features = [
  {
    title: "Guided First Experiences",
    description:
      "Komal introduces age-appropriate digital content through voice-guided play sessions, so your toddler's first screen time is intentional and enriching.",
    icon: BrainIcon,
    color: "from-amber-400 to-orange-500",
  },
  {
    title: "Developmental Pattern Tracking",
    description:
      "See how your child responds to colors, sounds, and interactions. Komal surfaces early engagement patterns that may inform developmental conversations with your pediatrician.",
    icon: ActivityIcon,
    color: "from-blue-400 to-indigo-500",
  },
  {
    title: "No Dark Patterns, Ever",
    description:
      "No streaks, no scores, no infinite scroll. Komal uses natural stopping points and gentle wind-down cues designed for young attention spans.",
    icon: ShieldIcon,
    color: "from-emerald-400 to-teal-500",
  },
  {
    title: "Parent-Child Co-Play Mode",
    description:
      "Designed for shared moments. Sit with your child and explore together through Talk-to-Play interactions that strengthen your bond.",
    icon: HeartIcon,
    color: "from-rose-400 to-pink-500",
  },
];

const faqs = [
  {
    question: "How much screen time is healthy for a toddler?",
    answer:
      "The American Academy of Pediatrics recommends avoiding screen time for children under 18 months (except video calls) and limiting high-quality programming to 1 hour per day for ages 2-5, always with a caregiver present. Komal is designed around these guidelines, with built-in session limits and co-play features that keep screen time intentional.",
  },
  {
    question: "Is Komal safe for a 2-year-old to use?",
    answer:
      "Komal is designed for co-play with a parent or caregiver present. For children under 3, all interactions are voice-guided and require minimal touch. There are no ads, no in-app purchases, and no addictive mechanics. Every interaction is clinician-informed and developmentally appropriate.",
  },
  {
    question: "What is a psychology-informed alternative to screen time blockers for toddlers?",
    answer:
      "Rather than simply blocking screens, Komal provides guided, age-appropriate digital experiences with built-in stopping points. This teaches healthy digital habits from the start rather than creating a forbidden-fruit dynamic around screens.",
  },
  {
    question: "How does Komal protect my toddler's privacy?",
    answer:
      "All processing happens on-device. No biometric data is stored in the cloud. No data is ever sold. Parents have full control over what information is shared, and we are COPPA and GDPR-K compliant.",
  },
  {
    question: "Can Komal detect early developmental patterns?",
    answer:
      "Komal is not a diagnostic tool. However, it tracks engagement patterns, attention spans, and interaction preferences over time, and presents these in plain-language reports. Some parents and clinicians find these longitudinal insights helpful context for developmental conversations.",
  },
  {
    question: "What makes digital play different from passive screen time?",
    answer:
      "Passive screen time involves watching without interaction. Digital play, as Komal defines it, involves voice-guided exploration, responsive interactions, and natural pauses that encourage a child to reflect, respond, and engage actively with a caregiver.",
  },
  {
    question: "Does Komal work on tablets and phones?",
    answer:
      "Komal works as a browser extension on Chromebooks and desktops, with an iOS app available. For the 0-5 age group, we recommend tablet use with a parent present, leveraging the co-play features designed for this developmental stage.",
  },
];

export default function Parents05Page() {
  return (
    <>
      <Script
        id="parents-05-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Digital Safety for Toddlers & Preschoolers (Ages 0-5) | Komal Kids",
            description:
              "Psychology-informed digital play for children ages 0-5. Guided first screen experiences, developmental pattern tracking, and co-play features. No dark patterns, no ads.",
            url: "https://komalkids.com/parents/0-5",
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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Ages 0-5
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="font-sans font-bold leading-[1.1] tracking-tight text-primary text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] mb-6">
                Their First Screen Time
                <span className="block">
                  <TextShimmer duration={4}>Should Be Their Best</TextShimmer>
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-center text-lg md:text-xl text-text-dim max-w-2xl mx-auto mb-10 leading-relaxed">
                Komal turns early screen moments into guided, developmental play.
                No ads, no dark patterns, no addictive hooks. Just intentional
                digital experiences designed for tiny explorers and the parents
                who sit beside them.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary-premium text-white text-lg px-8 py-4 h-auto rounded-full border-0"
                >
                  <Link href="/demo">Start a Safe Digital Journey</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white text-primary border-primary border-2 hover:bg-primary/5 text-lg px-8 py-4 h-auto rounded-full"
                >
                  <Link href="/parents">See All Age Groups</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How Komal Works for 0-5 */}
      <section className="py-20 bg-gradient-to-b from-white to-amber-50/30 relative">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
                How Komal Works for Young Children
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Built around pediatric guidelines and developmental science, not
                engagement metrics.
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

      {/* What Makes Komal Different */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Designed Around How Young Children Actually Develop
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Natural Stopping Points",
                body: "Sessions end with gentle, narrative-driven cues instead of abrupt timers. Children transition away from screens without meltdowns.",
              },
              {
                title: "Voice-First Interaction",
                body: "Children ages 0-5 learn through listening and speaking, not tapping. Komal's Talk-to-Play model matches how toddlers naturally engage.",
              },
              {
                title: "Longitudinal Insights",
                body: "Komal tracks patterns over weeks and months, surfacing developmental trends that may appear 6-18 months before they show up in formal assessments.",
              },
            ].map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.1}>
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
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

      {/* Social Proof */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container max-w-[900px] px-8 mx-auto text-center">
          <ScrollReveal>
            <p className="text-lg text-text-dim italic mb-4">
              &ldquo;For the first time, I understand when my daughter is actually struggling versus when she&apos;s just being playful. The weekly reports are clear and actionable.&rdquo;
            </p>
            <p className="font-semibold text-primary">Priya S.</p>
            <p className="text-sm text-text-dim">Parent of a 4-year-old, India</p>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-[800px] px-8 mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
              Common Questions from Parents of Young Children
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
                Make Their First Digital Steps Count
              </TextShimmer>
            </h2>
            <p className="text-lg opacity-90 mb-10">
              Trusted by child psychologists and parents in India, the US, and beyond. Start with a guided co-play session today.
            </p>
            <Button
              asChild
              size="lg"
              className="btn-primary-premium-inverted text-lg px-8 py-4 h-auto rounded-full border-0"
            >
              <Link href="/demo">Get Early Access</Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
