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
    title: "Context-Aware Safety",
    description:
      "Komal understands the difference between researching a health topic for school and seeking out harmful content. Context matters more than keywords at this age.",
    icon: ShieldIcon,
    color: "from-emerald-400 to-teal-500",
  },
  {
    title: "Self-Regulation Scaffolding",
    description:
      "Instead of blocking and creating workarounds, Komal's peer avatar prompts your preteen to pause and reflect before engaging with gated content, building judgment.",
    icon: BrainIcon,
    color: "from-violet-400 to-purple-500",
  },
  {
    title: "Social Media Readiness Insights",
    description:
      "Komal helps you understand whether your child is developing the emotional regulation and critical thinking needed for social media, before they start using it.",
    icon: ChartIcon,
    color: "from-blue-400 to-indigo-500",
  },
  {
    title: "Trust-Building Transparency",
    description:
      "Your preteen can see what Komal tracks and what it doesn't. No hidden surveillance. This builds the trust that makes digital safety conversations productive.",
    icon: ActivityIcon,
    color: "from-amber-400 to-orange-500",
  },
];

const faqs = [
  {
    question: "Should my 11-year-old have social media?",
    answer:
      "This is one of the most common questions parents ask at this stage. There's no universal answer, but research consistently shows that emotional regulation, critical thinking, and a strong parent-child communication foundation matter more than age alone. Komal helps you assess your child's readiness by tracking digital engagement patterns, self-regulation behaviors, and decision-making trends over time.",
  },
  {
    question: "How do I keep my preteen safe online without losing their trust?",
    answer:
      "Surveillance-based tools often backfire with preteens because they feel like a violation of trust and drive behavior underground. Komal takes a different approach: it's transparent about what it does, focuses on building your child's own judgment, and gives you insight into patterns (not transcripts). The goal is a conversation, not a confrontation.",
  },
  {
    question: "What is a psychology-informed alternative to parental control apps for preteens?",
    answer:
      "Traditional parental controls were designed for younger children and often create resistance in preteens. Komal is psychology-informed, meaning it uses developmental science to scaffold self-regulation rather than impose external restrictions. The peer avatar approach matches how preteens naturally learn: from peers, not authority figures.",
  },
  {
    question: "How does Komal handle cyberbullying concerns?",
    answer:
      "Komal doesn't read private messages, so it can't detect specific cyberbullying incidents. However, it tracks behavioral patterns that may indicate distress: changes in browsing behavior, shifts in engagement quality, and emotional regulation trends. These pattern changes can prompt a timely conversation between parent and child.",
  },
  {
    question: "My preteen keeps finding workarounds to our current filter. How is Komal different?",
    answer:
      "Workarounds happen when children see a tool as an adversary. Komal is designed to be a companion, not a wall. Because it's transparent, non-punitive, and focused on building skills rather than restricting access, children are less motivated to circumvent it. It works with your preteen, not against them.",
  },
  {
    question: "Can Komal help with the transition to middle school and increased device use?",
    answer:
      "Yes. The 10-13 window is when most children get significantly more device independence. Komal provides a graduated approach: as your child demonstrates stronger self-regulation and judgment, the safety layer adapts. Parents see this progression in longitudinal reports, making it easier to have evidence-based conversations about expanding digital freedom.",
  },
  {
    question: "Does Komal work on Chromebooks used for school?",
    answer:
      "Komal works as a browser extension on Chromebooks, desktops, and laptops. It's designed to complement (not replace) school-managed filters, adding a developmental and emotional layer that school IT tools typically don't provide.",
  },
];

export default function Parents1013Page() {
  return (
    <>
      <Script
        id="parents-1013-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Digital Safety for Preteens (Ages 10-13) | Social Media Readiness | Komal Kids",
            description:
              "Psychology-informed digital wellbeing for preteens ages 10-13. Context-aware filtering, social media readiness insights, and self-regulation scaffolding. Trusted by families in India, the US, UK, and Singapore.",
            url: "https://komalkids.com/parents/10-13",
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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                Ages 10-13
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="font-sans font-bold leading-[1.1] tracking-tight text-primary text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] mb-6">
                They Want Independence.
                <span className="block">
                  <TextShimmer duration={4}>They Still Need Guidance.</TextShimmer>
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-center text-lg md:text-xl text-text-dim max-w-2xl mx-auto mb-10 leading-relaxed">
                The preteen years are when digital habits form for life. Komal helps your child build real judgment and self-regulation, not just follow rules they'll eventually break.
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

      {/* How Komal Works for 10-13 */}
      <section className="py-20 bg-gradient-to-b from-white to-violet-50/30 relative">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
                Build Judgment, Not Dependency
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Preteens need tools that respect their growing autonomy while quietly building the skills that keep them safe.
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

      {/* The Preteen Challenge */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Why Preteens Need a Different Approach
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Blocking tools designed for younger children backfire at this age. Preteens need scaffolded independence, not tighter walls.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Social Media Pressure",
                body: "Their friends are on Instagram and TikTok. Komal helps you assess readiness based on emotional regulation patterns, not peer pressure timelines.",
              },
              {
                title: "Growing Digital Footprint",
                body: "Preteens start creating content, not just consuming it. Komal's reflective prompts help them think before they post, share, or engage.",
              },
              {
                title: "Identity Exploration",
                body: "This is when children start exploring who they are online. Komal provides safe space for that exploration while keeping you informed of concerning pattern shifts.",
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
              &ldquo;My son&apos;s therapist loves the reports. She can see patterns between sessions that we never noticed before.&rdquo;
            </p>
            <p className="font-semibold text-primary">Rajesh K.</p>
            <p className="text-sm text-text-dim">Parent of an 11-year-old, India</p>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-[800px] px-8 mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
              Questions from Parents of Preteens
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
                Help Them Build Habits That Last
              </TextShimmer>
            </h2>
            <p className="text-lg opacity-90 mb-10">
              Trusted by families and clinicians across India, the US, UK, Singapore, and the UAE. Whether your child is at a US public school, an IB school, or a CBSE institution — start building digital judgment today.
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
