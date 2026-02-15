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
    title: "Quiet Guidance, Not Loud Restrictions",
    description:
      "Teenagers resist being controlled. Komal provides subtle, peer-like nudges that support reflection without feeling authoritarian. The safety layer is there, but it respects their growing autonomy.",
    icon: BrainIcon,
    color: "from-indigo-400 to-blue-500",
  },
  {
    title: "Digital Wellbeing Dashboard",
    description:
      "Teens can see their own patterns: focus time, distraction cycles, emotional trends. Self-awareness is the foundation of self-regulation. Komal makes that visible.",
    icon: ChartIcon,
    color: "from-violet-400 to-purple-500",
  },
  {
    title: "Graduated Independence",
    description:
      "As your teen demonstrates stronger digital judgment, Komal adapts. Less intervention over time, more independence. You see the progression in longitudinal reports.",
    icon: ActivityIcon,
    color: "from-emerald-400 to-teal-500",
  },
  {
    title: "Pioneer Program Access",
    description:
      "Teens can join the Komal Pioneer Program to become digital role models, mentor younger children, and build a portfolio that strengthens college and scholarship applications.",
    icon: ShieldIcon,
    color: "from-amber-400 to-orange-500",
  },
];

const faqs = [
  {
    question: "How do I set healthy phone habits for my teenager?",
    answer:
      "Research shows that external controls become less effective in the teen years. The most sustainable approach is building intrinsic motivation for healthy digital habits. Komal supports this by making your teen's own usage patterns visible to them, prompting self-reflection, and providing a gradual path toward independent digital wellbeing, rather than imposing rules they'll resist.",
  },
  {
    question: "How can I keep my teenager safe online without spying on them?",
    answer:
      "Komal is designed around this exact tension. It doesn't read messages, log keystrokes, or take screenshots. Instead, it tracks behavioral patterns (focus, engagement quality, emotional regulation trends) and provides you with aggregated insights. Your teen knows what Komal does and doesn't do, which preserves the trust that makes safety conversations possible.",
  },
  {
    question: "What is the best digital wellbeing app for teens that isn't surveillance?",
    answer:
      "Most 'teen safety' tools are surveillance tools with a friendlier interface. Komal is fundamentally different: it's a skill-building tool. It helps teenagers develop the judgment and self-regulation they need to stay safe independently. The goal is for your teen to eventually not need Komal, having internalized the habits it helps build.",
  },
  {
    question: "My teen is already on social media. Is it too late for Komal?",
    answer:
      "Not at all. Komal works alongside existing social media use. It adds a reflective layer to browsing sessions, helps teens notice their own patterns (like doom-scrolling or comparison spirals), and builds the self-awareness that makes healthier social media use possible. Think of it as building digital emotional intelligence, which is valuable at any stage.",
  },
  {
    question: "How does the Pioneer Program work for teenagers?",
    answer:
      "The Pioneer Program invites teens to become digital role models. Pioneers help younger children build safe digital journeys using Komal's peer-avatar technology, earn a Digital Leadership Certificate, and build a portfolio that demonstrates ethical AI literacy and community service for college and scholarship applications. Apply with code SUNSHINE50.",
  },
  {
    question: "Does Komal help with screen addiction or compulsive phone use?",
    answer:
      "Komal is not a clinical intervention for addiction. However, it provides the self-awareness foundation that supports healthier habits: teens see their own engagement patterns, receive gentle reflective prompts during extended sessions, and build the metacognitive skills that clinical experts recommend as a first step. If you're concerned about clinical-level screen dependency, we recommend consulting a child psychologist, and Komal's reports can be a useful data point in that conversation.",
  },
  {
    question: "Can my teenager use Komal independently?",
    answer:
      "Yes. For teens 13+, Komal can function as a self-directed digital wellbeing tool. Parents still receive pattern insights, but the teen has their own dashboard and can see their own data. This models the real-world dynamic they'll need as young adults: self-monitoring with a trusted person who cares about their wellbeing.",
  },
];

export default function Parents1316Page() {
  return (
    <>
      <Script
        id="parents-1316-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Digital Wellbeing for Teenagers (Ages 13-16) | Komal Kids",
            description:
              "Psychology-informed digital wellbeing for teenagers ages 13-16. Graduated independence, self-regulation skills, and Pioneer Program leadership opportunities. No surveillance, no dark patterns.",
            url: "https://komalkids.com/parents/13-16",
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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                Ages 13-16
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="font-sans font-bold leading-[1.1] tracking-tight text-primary text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] mb-6">
                They Push Back on Rules.
                <span className="block">
                  <TextShimmer duration={4}>Help Them Build Their Own.</TextShimmer>
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-center text-lg md:text-xl text-text-dim max-w-2xl mx-auto mb-10 leading-relaxed">
                Teenagers don&apos;t need more restrictions. They need the self-awareness and judgment to navigate the digital world independently. Komal builds those skills quietly, without breaking your relationship.
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
                  <Link href="/pioneer">Explore the Pioneer Program</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How Komal Works for 13-16 */}
      <section className="py-20 bg-gradient-to-b from-white to-indigo-50/30 relative">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
                From Control to Coaching
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                The teen years require a fundamentally different approach to digital safety. Komal evolves with your child.
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

      {/* The Teen Reality */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                What Changes in the Teen Years
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Control Stops Working",
                body: "Research consistently shows that authoritarian digital restrictions in the teen years increase risk-taking behavior and drive activity underground. Komal's approach aligns with developmental science.",
              },
              {
                title: "Peer Influence Peaks",
                body: "Teens learn from peers, not parents. Komal's peer-avatar model leverages this reality: guidance comes from a relatable companion, not an authority figure.",
              },
              {
                title: "Stakes Get Higher",
                body: "Digital footprints, online relationships, and mental health impacts intensify. The self-regulation skills Komal builds become a protective factor, not just a convenience.",
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

      {/* Pioneer Program CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-violet-50">
        <div className="container max-w-[1000px] px-8 mx-auto">
          <ScrollReveal>
            <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-100 text-center">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Turn Digital Wellbeing Into a Leadership Opportunity
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto mb-8">
                The Pioneer Program invites teenagers to become digital role models. Mentor younger children, earn a Digital Leadership Certificate, and build a portfolio that strengthens college applications.
              </p>
              <Button
                asChild
                size="lg"
                className="btn-primary-premium text-white text-lg px-8 py-4 h-auto rounded-full border-0"
              >
                <Link href="/pioneer">Learn About the Pioneer Program</Link>
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
              Questions from Parents of Teenagers
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
                They&apos;re Almost Ready. Help Them Get There.
              </TextShimmer>
            </h2>
            <p className="text-lg opacity-90 mb-10">
              Trusted by families and clinicians across India, the US, UK, Singapore, and the UAE. Build digital independence, not dependency.
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
