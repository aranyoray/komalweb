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
import { ShieldIcon, BrainIcon, ActivityIcon, ChartIcon } from "@/components/Icons";

const features = [
  {
    title: "Self-Directed Wellbeing",
    description:
      "At 16+, Komal becomes primarily a self-management tool. Your teen owns their dashboard, sets their own goals, and tracks their own digital wellbeing patterns.",
    icon: ChartIcon,
    color: "from-slate-500 to-gray-600",
  },
  {
    title: "Digital Citizenship Skills",
    description:
      "As your child prepares for college, work, and independent life, Komal helps them build the metacognitive and emotional regulation skills that transfer to every digital context.",
    icon: BrainIcon,
    color: "from-blue-400 to-indigo-500",
  },
  {
    title: "Pioneer Leadership Track",
    description:
      "Older teens can join the Pioneer Program to mentor younger children, lead digital wellbeing workshops, and earn credentials that strengthen college and scholarship applications.",
    icon: ShieldIcon,
    color: "from-amber-400 to-orange-500",
  },
  {
    title: "Transition Support for Parents",
    description:
      "Komal helps parents navigate the hardest part: letting go. Longitudinal reports show your child's growing independence, giving you evidence-based confidence to step back.",
    icon: ActivityIcon,
    color: "from-emerald-400 to-teal-500",
  },
];

const faqs = [
  {
    question: "How do I transition my teen from parental controls to digital independence?",
    answer:
      "The transition should be gradual and evidence-based, not abrupt. Komal supports this by shifting from a parent-managed tool to a teen-owned wellbeing dashboard. Your teen sees their own patterns and sets their own goals, while you still receive high-level pattern insights. This mirrors the real-world transition to adulthood: increasing self-responsibility with a trusted person available for support.",
  },
  {
    question: "Is Komal useful for a 17 or 18-year-old?",
    answer:
      "Yes, but for different reasons than younger children. For older teens, Komal functions as a digital wellness tool: it helps them understand their own focus patterns, distraction triggers, and emotional engagement trends. Many college students wish they'd built these self-awareness skills earlier. Additionally, the Pioneer Program gives older teens a concrete leadership role.",
  },
  {
    question: "What is digital citizenship for older teens?",
    answer:
      "Digital citizenship at 16+ goes beyond safety. It includes understanding digital footprint consequences, recognizing manipulation tactics online, managing attention intentionally, and contributing positively to digital communities. Komal helps build these skills through reflection prompts, pattern visibility, and optional mentorship of younger users through the Pioneer Program.",
  },
  {
    question: "How does the Pioneer Program help with college applications?",
    answer:
      "Pioneers earn a Komal Digital Leadership Certificate that documents their mentorship hours, workshop facilitation, and ethical AI literacy. They build a portfolio of community service specifically around digital wellbeing, which demonstrates initiative, empathy, and technical understanding that admissions committees value. Apply with code SUNSHINE50.",
  },
  {
    question: "My teen doesn't think they need a digital wellbeing tool. How do I approach this?",
    answer:
      "Position it as a performance and awareness tool, not a safety tool. Many teens are receptive to understanding their own focus patterns, distraction cycles, and digital habits the same way they'd use a fitness tracker. Komal at this age is less about protection and more about optimization and self-knowledge.",
  },
  {
    question: "Can my older teen use Komal without parental oversight?",
    answer:
      "Yes. For users 16+, Komal can function independently as a personal digital wellbeing tool. Parents can opt to receive high-level pattern summaries (not detailed logs), or the teen can use Komal entirely on their own. This flexibility supports whatever stage of independence your family has reached.",
  },
];

export default function Parents16PlusPage() {
  return (
    <>
      <Script
        id="parents-16plus-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Digital Independence for Older Teens (Ages 16+) | Pioneer Program | Komal Kids",
            description:
              "Help older teens transition to digital independence with self-directed wellbeing tools and Pioneer Program leadership for college applications. Ethical AI literacy and digital citizenship skills.",
            url: "https://komalkids.com/parents/16-plus",
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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200 text-slate-700 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" />
                Ages 16+
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="font-sans font-bold leading-[1.1] tracking-tight text-primary text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] mb-6">
                They&apos;re Almost Adults.
                <span className="block">
                  <TextShimmer duration={4}>Are They Ready?</TextShimmer>
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-center text-lg md:text-xl text-text-dim max-w-2xl mx-auto mb-10 leading-relaxed">
                The goal was never to control their internet use forever. It was to build the judgment, self-awareness, and emotional regulation they need to thrive independently. Komal helps you see when they&apos;re ready and helps them prove it.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary-premium text-white text-lg px-8 py-4 h-auto rounded-full border-0"
                >
                  <Link href="/pioneer">Join the Pioneer Program</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white text-primary border-primary border-2 hover:bg-primary/5 text-lg px-8 py-4 h-auto rounded-full"
                >
                  <Link href="/demo">See How It Works</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How Komal Works for 16+ */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50/50 relative">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
                From Protection to Preparation
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                At 16+, the conversation shifts from keeping them safe to preparing them for a lifetime of intentional digital engagement.
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

      {/* The Letting Go Challenge */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                The Hardest Part of Digital Parenting
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Letting go is harder than locking down. Komal gives you the evidence to do it confidently.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Readiness, Not Age",
                body: "Every teen is different. Komal's longitudinal data shows you where your child is in developing self-regulation, critical thinking, and emotional resilience, more useful than any age-based rule.",
              },
              {
                title: "Their Own Dashboard",
                body: "At 16+, your teen gets their own wellbeing dashboard. They set focus goals, track distraction patterns, and build self-awareness. You see high-level summaries, not surveillance data.",
              },
              {
                title: "A Record of Growth",
                body: "Komal's longitudinal reports show the arc of your child's digital development over months and years. This is the evidence that tells you both: they're ready.",
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

      {/* Pioneer Program Highlight */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container max-w-[1000px] px-8 mx-auto">
          <ScrollReveal>
            <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-100 text-center">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Lead, Don&apos;t Just Scroll
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto mb-6">
                The Pioneer Program turns digital wellbeing into a leadership credential. Mentor younger children, facilitate workshops, earn a Digital Leadership Certificate, and build a portfolio that strengthens college and scholarship applications.
              </p>
              <p className="text-sm text-text-dim mb-8">
                Use code <span className="font-bold text-primary">SUNSHINE50</span> to apply.
              </p>
              <Button
                asChild
                size="lg"
                className="btn-primary-premium text-white text-lg px-8 py-4 h-auto rounded-full border-0"
              >
                <Link href="/pioneer">Apply to the Pioneer Program</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-[800px] px-8 mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
              Questions About Older Teens and Digital Independence
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
                Prepare Them for a Digital Lifetime
              </TextShimmer>
            </h2>
            <p className="text-lg opacity-90 mb-10">
              The best digital safety tool is one they eventually outgrow because they&apos;ve internalized what it taught them. Start that journey now.
            </p>
            <Button
              asChild
              size="lg"
              className="btn-primary-premium-inverted text-lg px-8 py-4 h-auto rounded-full border-0"
            >
              <Link href="/demo">Get Started</Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
