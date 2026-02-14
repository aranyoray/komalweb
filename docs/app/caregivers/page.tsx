"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingOrbs from "@/components/FloatingOrbs";
import TextShimmer from "@/components/TextShimmer";
import NoiseOverlay from "@/components/NoiseOverlay";
import ParticleField from "@/components/ParticleField";
import { HeartIcon, ShieldIcon, ActivityIcon, ChartIcon, UsersIcon, MessageCircleIcon } from "@/components/Icons";

const caregiverFeatures = [
  {
    title: "Easy-to-Use Dashboard",
    description: "No tech expertise needed. A clear, simple dashboard gives you everything you need to keep your grandchild or ward safe online.",
    icon: ChartIcon,
    color: "from-blue-400 to-indigo-500"
  },
  {
    title: "Instant Safety Alerts",
    description: "Get notified immediately when something needs your attention. Clear, actionable alerts in plain language—no jargon.",
    icon: ActivityIcon,
    color: "from-rose-400 to-pink-500"
  },
  {
    title: "Emotional Wellbeing Tracking",
    description: "Understand how the child in your care feels online using emoji-based analysis—without reading their private conversations.",
    icon: HeartIcon,
    color: "from-emerald-400 to-teal-500"
  },
  {
    title: "Collaborate with Parents",
    description: "Seamlessly share insights with parents or co-caregivers. Stay aligned on rules and boundaries, even across households.",
    icon: UsersIcon,
    color: "from-violet-400 to-purple-500"
  },
];

const caregiverTypes = [
  { label: "Grandparents", description: "Stay connected and informed about your grandchild's digital life, even if technology isn't your strength." },
  { label: "Guardians & Foster Parents", description: "Build trust while keeping children safe. Get the insights you need during the transition into your care." },
  { label: "Extended Family", description: "Aunts, uncles, or family friends who step in—Komal helps you protect children no matter the caregiving arrangement." },
  { label: "Nannies & Au Pairs", description: "Professional caregivers can monitor screen time and safety during their shifts, with parent-approved permissions." },
];

const privacyFeatures = [
  { label: "On-device processing" },
  { label: "COPPA/GDPR-K compliant" },
  { label: "Caregiver-controlled sharing" },
  { label: "No data selling ever" },
];

export default function CaregiversPage() {
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
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-100 to-emerald-100 border border-teal-200/50 mb-8">
                <HeartIcon className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-semibold text-teal-700">For Every Caregiver</span>
              </div>
            </ScrollReveal>

            {/* Main Title */}
            <ScrollReveal delay={0.1}>
              <h1 className="font-sans font-bold leading-[1.1] tracking-tight text-primary text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] mb-6">
                Caregiving Made
                <span className="block">
                  <TextShimmer duration={4}>Confident</TextShimmer>
                </span>
              </h1>
            </ScrollReveal>

            {/* Subtitle */}
            <ScrollReveal delay={0.2}>
              <p className="text-center text-lg md:text-xl text-text-dim max-w-2xl mx-auto mb-10 leading-relaxed">
                Whether you're a grandparent, guardian, or foster parent—Komal gives you the tools to protect the children in your care online, simply and effectively.
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

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 relative">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4 text-center">Your Caregiving Companion</h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto text-center">
                Designed for caregivers of all backgrounds—simple, supportive, and always privacy-first.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caregiverFeatures.map((feature, index) => (
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

      {/* Caregiver Types Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-emerald-50 relative">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4 text-center">Built for Every Caregiver</h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto text-center">
                No matter your role, Komal adapts to your unique caregiving situation.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caregiverTypes.map((type, index) => (
              <ScrollReveal key={type.label} delay={index * 0.1}>
                <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-primary">{type.label}</h3>
                  </div>
                  <p className="text-text-dim leading-relaxed">{type.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Privacy First, Always</h2>
                <p className="text-lg text-text-dim mb-8 leading-relaxed">
                  The children in your care deserve the same privacy protections as any family. All AI processing happens on-device. You control what gets shared—and we never sell data. Period.
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
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-3xl transform rotate-3 opacity-20" />
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

      {/* Final CTA */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <FloatingOrbs count={4} />
        </div>
        <div className="container max-w-[900px] px-8 mx-auto text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              <TextShimmer duration={4}>Ready to Protect with Confidence?</TextShimmer>
            </h2>
            <p className="text-lg opacity-90 mb-10 text-center">Join caregivers everywhere who trust Komal to keep the children in their lives safe online.</p>
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
