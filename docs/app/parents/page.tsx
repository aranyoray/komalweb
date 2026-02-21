"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingOrbs from "@/components/FloatingOrbs";
import TextShimmer from "@/components/TextShimmer";
import NoiseOverlay from "@/components/NoiseOverlay";
import ParticleField from "@/components/ParticleField";
import { LockIcon, ActivityIcon, ChartIcon, ShieldIcon, SparklesIcon, HeartIcon } from "@/components/Icons";

const komalFeatures = [
  {
    title: "Set Granular Controls",
    description: "Fine-tune what your child can access. Block specific apps, set time limits, and customize rules for each child.",
    icon: LockIcon,
    color: "from-emerald-400 to-teal-500"
  },
  {
    title: "Digital Journey Snapshots",
    description: "Learn the intents behind their searches, not just interests. Understand what they're curious about and why.",
    icon: ChartIcon,
    color: "from-blue-400 to-indigo-500"
  },
  {
    title: "Understand Your Child's Emotions",
    description: "Using language-free emoji analysis. See when they're happy, frustrated, or need your attention—without reading their chats.",
    icon: HeartIcon,
    color: "from-rose-400 to-pink-500"
  },
  {
    title: "Real-Time Insights",
    description: "Get weekly reports that actually make sense. Plain language, actionable insights, no technical jargon.",
    icon: ActivityIcon,
    color: "from-violet-400 to-purple-500"
  },
];

const privacyFeatures = [
  { label: "On-device processing", icon: "" },
  { label: "COPPA/GDPR-K compliant", icon: "" },
  { label: "Parent-controlled sharing", icon: "" },
  { label: "No data selling ever", icon: "" },
];

export default function ParentsPage() {
  return (
    <>
      {/* Global Premium Effects */}
      <NoiseOverlay opacity={0.025} />
      <ParticleField count={35} color="263, 50%, 40%" speed={0.2} connectDistance={80} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-15">
          <FloatingOrbs count={4} />
        </div>

        <div className="container max-w-[1300px] px-6 md:px-10 mx-auto relative z-10">
          <div className="text-center">
            {/* Badge */}
           

            {/* Main Title */}
            <ScrollReveal delay={0.1}>
              <h1 className="font-sans font-bold leading-[1.1] tracking-tight text-primary text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] mb-6">
                Parent Smarter,
                <span className="block">
                  <TextShimmer duration={4}>Not Harder</TextShimmer>
                </span>
              </h1>
            </ScrollReveal>

            {/* Subtitle */}
            <ScrollReveal delay={0.2}>
              <p className="text-center text-lg md:text-xl text-text-dim max-w-2xl mx-auto mb-10 leading-relaxed">
                Understand your child's digital world without invading their privacy. Get insights that actually help you parent better.
              </p>
            </ScrollReveal>

            {/* CTA */}
            <ScrollReveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary-premium text-white text-lg px-8 py-4 h-auto rounded-full border-0"
                >
                  <Link href="mailto:play@komalkids.com">Start Free Trial</Link>
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

      {/* Komal Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 relative">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4 text-center"> Your Parenting Ally</h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto text-center">
                Finally, a tool that understands children, not just data points.
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
                  We believe your child's data belongs to your family. That's why all AI processing happens on-device. You control what gets shared, and we never sell data to advertisers. Period.
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

      {/* Emotional Understanding Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">Understand Emotions, Not Just Content</h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Our revolutionary emotion detection understands how your child feels—without reading their private conversations.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                label: "Curious",
                color: "bg-amber-100 text-amber-600",
                icon: (
                  <svg viewBox="0 0 80 80" className="w-16 h-16 mx-auto mb-3">
                    <circle cx="40" cy="40" r="35" fill="currentColor" opacity="0.2" />
                    <circle cx="28" cy="35" r="5" fill="currentColor" />
                    <circle cx="52" cy="35" r="5" fill="currentColor" />
                    <circle cx="28" cy="35" r="2" fill="#fff" />
                    <circle cx="52" cy="35" r="2" fill="#fff" />
                    <circle cx="28" cy="34" r="1" fill="currentColor" />
                    <circle cx="52" cy="34" r="1" fill="currentColor" />
                    <path d="M28 50 Q40 60 52 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="60" cy="28" r="3" fill="currentColor" opacity="0.6" />
                    <circle cx="68" cy="32" r="2" fill="currentColor" opacity="0.4" />
                  </svg>
                )
              },
              {
                label: "Focused",
                color: "bg-blue-100 text-blue-600",
                icon: (
                  <svg viewBox="0 0 80 80" className="w-16 h-16 mx-auto mb-3">
                    <circle cx="40" cy="40" r="35" fill="currentColor" opacity="0.2" />
                    <circle cx="28" cy="35" r="5" fill="currentColor" />
                    <circle cx="52" cy="35" r="5" fill="currentColor" />
                    <circle cx="28" cy="35" r="2" fill="#fff" />
                    <circle cx="52" cy="35" r="2" fill="#fff" />
                    <circle cx="28" cy="34" r="1" fill="currentColor" />
                    <circle cx="52" cy="34" r="1" fill="currentColor" />
                    <line x1="25" y1="52" x2="55" y2="52" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <path d="M35 20 L40 15 L45 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )
              },
              {
                label: "Frustrated",
                color: "bg-rose-100 text-rose-600",
                icon: (
                  <svg viewBox="0 0 80 80" className="w-16 h-16 mx-auto mb-3">
                    <circle cx="40" cy="40" r="35" fill="currentColor" opacity="0.2" />
                    <path d="M22 32 L34 38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <path d="M58 32 L46 38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="28" cy="35" r="4" fill="currentColor" />
                    <circle cx="52" cy="35" r="4" fill="currentColor" />
                    <path d="M30 50 Q40 45 50 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <path d="M20 25 L25 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M60 25 L55 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )
              },
              {
                label: "Happy",
                color: "bg-emerald-100 text-emerald-600",
                icon: (
                  <svg viewBox="0 0 80 80" className="w-16 h-16 mx-auto mb-3">
                    <circle cx="40" cy="40" r="35" fill="currentColor" opacity="0.2" />
                    <path d="M22 38 Q28 32 34 38" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <path d="M46 38 Q52 32 58 38" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="28" cy="38" r="3" fill="currentColor" />
                    <circle cx="52" cy="38" r="3" fill="currentColor" />
                    <path d="M25 52 Q40 68 55 52" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="15" cy="25" r="4" fill="currentColor" opacity="0.5" />
                    <circle cx="65" cy="20" r="3" fill="currentColor" opacity="0.4" />
                  </svg>
                )
              },
            ].map((emotion, index) => (
              <ScrollReveal key={emotion.label} delay={index * 0.1}>
                <div className={`text-center p-6 rounded-2xl ${emotion.color}`}>
                  {emotion.icon}
                  <p className="font-semibold">{emotion.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
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
            <p className="text-lg opacity-90 mb-10 text-center">Join thousands of parents who trust Komal to guide their children's digital journey.</p>
            <Button
              asChild
              size="lg"
              className="btn-primary-premium-inverted text-lg px-8 py-4 h-auto rounded-full border-0"
            >
              <Link href="mailto:play@komalkids.com">Start Free Trial</Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
