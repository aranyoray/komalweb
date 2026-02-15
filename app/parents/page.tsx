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
import { LockIcon, ActivityIcon, ChartIcon, ShieldIcon, HeartIcon } from "@/components/Icons";

const ageGroups = [
  {
    ages: "0-5",
    label: "Toddlers & Preschoolers",
    description: "Guided first screen experiences, co-play features, and developmental pattern tracking for the earliest years.",
    href: "/parents/0-5",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
  },
  {
    ages: "6-10",
    label: "Early Elementary",
    description: "Three-tier content filtering, peer-avatar guidance, and weekly plain-language reports as they start exploring the web.",
    href: "/parents/6-10",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
  },
  {
    ages: "10-13",
    label: "Preteens",
    description: "Context-aware safety, social media readiness insights, and self-regulation scaffolding for the preteen transition.",
    href: "/parents/10-13",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    textColor: "text-violet-700",
  },
  {
    ages: "13-16",
    label: "Teenagers",
    description: "Graduated independence, quiet guidance that respects autonomy, and Pioneer Program leadership opportunities.",
    href: "/parents/13-16",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-700",
  },
  {
    ages: "16+",
    label: "Older Teens",
    description: "Self-directed wellbeing tools, digital citizenship skills, and preparation for independent digital life.",
    href: "/parents/16-plus",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    textColor: "text-slate-700",
  },
];

const komalFeatures = [
  {
    title: "Set Granular Controls",
    description: "Fine-tune what your child can access. Block, Gate, or Allow content with age-appropriate rules for each child.",
    icon: LockIcon,
    color: "from-emerald-400 to-teal-500",
  },
  {
    title: "Digital Journey Snapshots",
    description: "Learn the intents behind their searches, not just interests. Understand what they're curious about and why.",
    icon: ChartIcon,
    color: "from-blue-400 to-indigo-500",
  },
  {
    title: "Understand Your Child's Emotions",
    description: "Using language-free emoji analysis. See when they're happy, frustrated, or need your attention — without reading their chats.",
    icon: HeartIcon,
    color: "from-rose-400 to-pink-500",
  },
  {
    title: "Real-Time Insights",
    description: "Get weekly reports that actually make sense. Plain language, actionable insights, no technical jargon.",
    icon: ActivityIcon,
    color: "from-violet-400 to-purple-500",
  },
];

const privacyFeatures = [
  { label: "On-device processing" },
  { label: "COPPA/GDPR-K compliant" },
  { label: "Parent-controlled sharing" },
  { label: "No data selling ever" },
];

const faqs = [
  {
    question: "What is Komal and how does it work?",
    answer:
      "Komal is a psychology-informed 'Talk-to-Play' platform that makes the internet safer for children without resorting to surveillance or blanket blocking. It uses a peer avatar (pavatar) to guide children through voice-based prompts, a three-tier content system (Block, Gate, Allow), and provides parents with weekly plain-language insight reports.",
  },
  {
    question: "What ages does Komal support?",
    answer:
      "Komal is designed for children and families from ages 0 through 16+. The platform adapts its approach based on developmental stage: co-play for toddlers, guided exploration for elementary kids, self-regulation scaffolding for preteens, and graduated independence for teenagers.",
  },
  {
    question: "How is Komal different from parental control apps like Bark or Qustodio?",
    answer:
      "Most parental control apps are built around surveillance and restriction. Komal is built around guidance and skill-building. Instead of monitoring every click or blocking access, Komal helps children develop the judgment and self-regulation to navigate the internet safely on their own. The goal is for your child to eventually outgrow the need for external controls.",
  },
  {
    question: "Does Komal use dark patterns like streaks or scores?",
    answer:
      "No. Komal explicitly rejects dark patterns, infinite scrolls, streaks, manipulative scoring, and other engagement hooks. The platform is designed to protect intrinsic motivation and focus. Sessions end with natural stopping points, not cliffhangers.",
  },
  {
    question: "How does Komal protect my child's privacy?",
    answer:
      "All AI processing happens on-device. Your child's data never leaves your device without explicit consent. We never sell data or use it for advertising. Komal is COPPA and GDPR-K compliant, with parent-controlled sharing at every step.",
  },
  {
    question: "What are longitudinal developmental insights?",
    answer:
      "Komal tracks engagement patterns, attention spans, emotional regulation, and digital literacy skills over weeks and months. These longitudinal insights can surface developmental patterns 6-18 months earlier than traditional methods. These are not diagnoses — they are conversation starters for parents, educators, and clinicians.",
  },
  {
    question: "What devices does Komal work on?",
    answer:
      "Komal works as a browser extension on Chromebooks, desktops, and laptops, with an iOS app available. The platform is designed to complement school-managed devices and work seamlessly alongside existing web filters.",
  },
];

export default function ParentsPage() {
  return (
    <>
      <Script
        id="parents-hub-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "For Parents | Digital Safety by Age Group | Komal Kids",
            description:
              "Psychology-informed digital safety for every age. Find age-specific guidance for your child: 0-5, 6-10, 10-13, 13-16, and 16+. No dark patterns, no surveillance. Research-backed safety.",
            url: "https://komalkids.com/parents",
          }),
        }}
      />

      {/* Global Premium Effects */}
      <NoiseOverlay opacity={0.025} />
      <ParticleField count={35} color="263, 50%, 40%" speed={0.2} connectDistance={80} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <FloatingOrbs count={4} />
        </div>

        <div className="container max-w-[1300px] px-6 md:px-10 mx-auto relative z-10">
          <div className="text-center">
            <ScrollReveal delay={0.1}>
              <h1 className="font-sans font-bold leading-[1.1] tracking-tight text-primary text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] mb-6">
                Parent Smarter,
                <span className="block">
                  <TextShimmer duration={4}>Not Harder</TextShimmer>
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-center text-lg md:text-xl text-text-dim max-w-2xl mx-auto mb-10 leading-relaxed">
                Understand your child&apos;s digital world without invading their privacy. Get insights that actually help you parent better — tailored to your child&apos;s developmental stage.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary-premium text-white text-lg px-8 py-4 h-auto rounded-full border-0"
                >
                  <Link href="/demo">Start Free Trial</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white text-primary border-primary border-2 hover:bg-primary/5 text-lg px-8 py-4 h-auto rounded-full"
                >
                  <Link href="#find-your-age-group">Find Your Child&apos;s Age Group</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Age Group Navigation */}
      <section id="find-your-age-group" className="py-20 bg-gradient-to-b from-white to-slate-50 relative">
        <div className="container max-w-[1200px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
                Every Age Needs a Different Approach
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                A 4-year-old and a 14-year-old have completely different digital needs. Komal adapts its approach to match your child&apos;s developmental stage.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ageGroups.map((group, index) => (
              <ScrollReveal key={group.ages} delay={index * 0.08}>
                <Link
                  href={group.href}
                  className={`block group ${group.bgColor} rounded-2xl p-8 border ${group.borderColor} hover:shadow-lg transition-all duration-300 h-full`}
                >
                  <div className={`inline-flex items-center px-3 py-1 rounded-full ${group.bgColor} ${group.textColor} text-sm font-bold mb-4`}>
                    Ages {group.ages}
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3 group-hover:underline">
                    {group.label}
                  </h3>
                  <p className="text-text-dim leading-relaxed text-sm">
                    {group.description}
                  </p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Komal Features Section */}
      <section className="py-20 bg-white relative">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">Your Parenting Ally</h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                A tool that understands children, not just data points.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {komalFeatures.map((feature, index) => (
              <ScrollReveal key={feature.title} delay={index * 0.1}>
                <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                  <p className="text-text-dim leading-relaxed">{feature.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy First Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50 relative">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Privacy First, Always</h2>
                <p className="text-lg text-text-dim mb-8 leading-relaxed">
                  We believe your child&apos;s data belongs to your family. All AI processing happens on-device. You control what gets shared, and we never sell data to advertisers. Period.
                </p>
                <div className="space-y-4">
                  {privacyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="font-medium text-primary">{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.1}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl transform rotate-3 opacity-20" />
                <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                      <ShieldIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-primary">Privacy Score</p>
                      <p className="text-sm text-text-dim">Based on industry standards</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-5xl font-black text-emerald-600">A+</span>
                    <span className="text-emerald-600 font-semibold">Grade</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="container max-w-[900px] px-8 mx-auto text-center">
          <ScrollReveal>
            <p className="text-sm text-text-dim uppercase tracking-wider mb-8 font-medium">
              Loved by child psychologists and parents in India, the US, UK, Singapore, and beyond
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {[
                { stat: "170+", label: "Families across 5 countries" },
                { stat: "90+", label: "Hours of mindful interaction" },
                { stat: "0", label: "Dark patterns used" },
              ].map((item, index) => (
                <div key={index}>
                  <p className="text-4xl font-black text-primary">{item.stat}</p>
                  <p className="text-text-dim text-sm mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="container max-w-[800px] px-8 mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
              Frequently Asked Questions
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              <TextShimmer duration={4}>Ready to Parent Smarter?</TextShimmer>
            </h2>
            <p className="text-lg opacity-90 mb-10 text-center">Join families across India, the US, UK, Singapore, and beyond who trust Komal to guide their children&apos;s digital journey.</p>
            <Button
              asChild
              size="lg"
              className="btn-primary-premium-inverted text-lg px-8 py-4 h-auto rounded-full border-0"
            >
              <Link href="/demo">Start Free Trial</Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
