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
    title: "Three-Tier Content Filtering",
    description:
      "Not binary block-or-allow. Komal uses Block, Gate, and Allow tiers so educational content is treated differently from harmful content. Your child can still explore and learn.",
    icon: ShieldIcon,
    color: "from-emerald-400 to-teal-500",
  },
  {
    title: "Peer-Avatar Guidance",
    description:
      "Komal's pavatar (peer avatar) walks alongside your child online, offering gentle, voice-based prompts that support reflection and self-regulation in the moment.",
    icon: BrainIcon,
    color: "from-blue-400 to-indigo-500",
  },
  {
    title: "Weekly Plain-Language Reports",
    description:
      "No jargon, no raw data dumps. Get clear reports like 'Your child showed strong focus during science searches this week' with actionable suggestions.",
    icon: ChartIcon,
    color: "from-violet-400 to-purple-500",
  },
  {
    title: "Mindful Surfing",
    description:
      "Short, research-informed check-ins during browsing sessions that help your child pause and reflect, building digital self-regulation skills over time.",
    icon: ActivityIcon,
    color: "from-amber-400 to-orange-500",
  },
];

const faqs = [
  {
    question: "How much screen time should a 7-year-old have?",
    answer:
      "The American Academy of Pediatrics recommends consistent limits for children 6 and older, ensuring screen time doesn't interfere with sleep, physical activity, and other healthy behaviors. Most experts suggest 1-2 hours of high-quality content per day. Komal helps make the time your child does spend online intentional and enriching, with built-in session awareness and gentle pause points.",
  },
  {
    question: "What is a child-safe browser that still allows learning?",
    answer:
      "Komal sits on top of existing browsers as a safety layer. Unlike blockers that restrict everything, Komal uses a three-tier system: Block (harmful content), Gate (educational content with a mindful pause), and Allow (age-appropriate content). This means your child can still research school projects while staying protected.",
  },
  {
    question: "How does Komal help with online safety for elementary school kids?",
    answer:
      "Komal provides real-time, context-aware guidance through a peer avatar that children relate to. Instead of surveillance or after-the-fact reports, Komal helps children make better decisions in the moment by prompting reflection before they click. Parents get weekly insight summaries without needing to monitor every click.",
  },
  {
    question: "Does Komal read my child's messages or searches?",
    answer:
      "No. Komal analyzes browsing patterns and engagement behaviors, not the content of private messages. All processing happens on-device. Parents see patterns and summaries, not transcripts.",
  },
  {
    question: "What makes Komal different from GoGuardian or Bark for this age group?",
    answer:
      "Most monitoring tools are designed around restriction and surveillance. Komal is designed around guidance and skill-building. Instead of alerting parents after a child visits a concerning site, Komal helps the child pause and reflect before they get there. The goal is to build self-regulation, not dependency on external controls.",
  },
  {
    question: "Can I use Komal alongside my school's web filter?",
    answer:
      "Yes. Komal complements existing school filters by adding a developmental and emotional layer on top of technical filtering. Many families use Komal at home to extend the safety net beyond the school-managed device environment.",
  },
  {
    question: "How does Komal handle YouTube and educational video content?",
    answer:
      "Komal's three-tier system can gate video platforms with mindful check-ins, allowing educational content while prompting your child to reflect on how long they've been watching. This builds self-awareness rather than creating a forbidden-fruit dynamic around video content.",
  },
];

export default function Parents610Page() {
  return (
    <>
      <Script
        id="parents-610-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Online Safety for Kids Ages 6-10 | Safe Browsing for Elementary School | Komal Kids",
            description:
              "Psychology-informed digital safety for children ages 6-10. Three-tier content filtering, peer-avatar guidance, and weekly plain-language reports for parents. No surveillance, no dark patterns.",
            url: "https://komalkids.com/parents/6-10",
          }),
        }}
      />

      <NoiseOverlay opacity={0.025} />
      <ParticleField count={35} color="263, 50%, 40%" speed={0.2} connectDistance={80} />

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
                Ages 6-10
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="font-sans font-bold leading-[1.1] tracking-tight text-primary text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] mb-6">
                They Need the Internet
                <span className="block">
                  <TextShimmer duration={4}>The Internet Needs Guardrails</TextShimmer>
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-center text-lg md:text-xl text-text-dim max-w-2xl mx-auto mb-10 leading-relaxed">
                Your child needs the web for school projects, curiosity, and growing up. Komal keeps them safe without blocking their learning or breaking your trust.
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
                  <Link href="/parents">See All Age Groups</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How Komal Works for 6-10 */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50/30 relative">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
                Guidance, Not Gatekeeping
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Komal builds the digital judgment your child needs, so they learn to navigate the web safely on their own.
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

      {/* Research-backed approach */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                What Parents of 6-10 Year Olds See
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Curiosity Patterns",
                body: "Understand the intent behind your child's searches, not just what they clicked. See whether they're exploring science, looking up a friend's game, or drifting toward content that needs a conversation.",
              },
              {
                title: "Emotional Engagement Trends",
                body: "Komal tracks engagement quality over time. You'll see when your child is focused, frustrated, or disengaged, giving you conversation starters grounded in real patterns.",
              },
              {
                title: "Developmental Milestones",
                body: "Longitudinal reports surface emerging patterns in attention, self-regulation, and digital literacy, often months before they appear in school assessments.",
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
              &ldquo;As a teacher, I&apos;ve seen many learning apps. Komal is different&mdash;it actually adapts to each child in real-time.&rdquo;
            </p>
            <p className="font-semibold text-primary">Ananya M.</p>
            <p className="text-sm text-text-dim">Elementary School Teacher</p>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-[800px] px-8 mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
              Questions from Parents of 6-10 Year Olds
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
                Let Them Explore. Safely.
              </TextShimmer>
            </h2>
            <p className="text-lg opacity-90 mb-10">
              Trusted by families in India, the US, UK, Singapore, and beyond. Over 90 hours of mindful interaction delivered to children.
            </p>
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
