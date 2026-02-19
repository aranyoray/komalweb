"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingOrbs from "@/components/FloatingOrbs";
import TextShimmer from "@/components/TextShimmer";
import NoiseOverlay from "@/components/NoiseOverlay";
import ParticleField from "@/components/ParticleField";
import { GraduationCapIcon, Building2Icon, BuildingIcon, UsersIcon, ShieldIcon, BarChartIcon } from "@/components/Icons";

const institutionTypes = [
  {
    title: "For Schools",
    description: "Give educators the tools to understand student wellbeing and digital safety. Classroom-level analytics, SEL compliance dashboards, and early risk identification.",
    icon: GraduationCapIcon,
    color: "from-blue-400 to-indigo-500",
    features: ["Classroom Analytics", "SEL Compliance", "Risk Identification", "Teacher-Friendly Reports"]
  },
  {
    title: "For Pediatric Practices",
    description: "Integrate seamlessly into your workflow. Get insights parents already trust, without disrupting your current processes. Support between visits.",
    icon: Building2Icon,
    color: "from-emerald-400 to-teal-500",
    features: ["Patient Insights", "Development Tracking", "Parent Collaboration", "Easy Integration"]
  },
  {
    title: "For Government",
    description: "Scale child protection across communities. Privacy-first infrastructure that meets the highest compliance standards. Protect the future generation.",
    icon: BuildingIcon,
    color: "from-violet-400 to-purple-500",
    features: ["COPPA/GDPR-K Compliant", "Scalable Infrastructure", "Community Protection", "Data Sovereignty"]
  },
];

const partnershipOptions = [
  {
    title: "White-Labelling",
    description: "Put your brand on our technology. Full customization for your organization's identity.",
    icon: (
      <svg viewBox="0 0 80 80" className="w-14 h-14">
        <rect x="15" y="20" width="50" height="40" rx="8" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M25 35 L35 35 L35 45 L25 45 Z" fill="currentColor" opacity="0.3" />
        <circle cx="45" cy="40" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M45 36 L45 44 M41 40 L49 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M58 30 L58 50 M53 40 L63 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: "Co-Branding",
    description: "Partnership that showcases both our brands. Shared success, shared visibility.",
    icon: (
      <svg viewBox="0 0 80 80" className="w-14 h-14">
        <circle cx="25" cy="40" r="18" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="55" cy="40" r="18" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.7" />
        <path d="M35 40 L45 40" stroke="currentColor" strokeWidth="2" />
        <text x="25" y="44" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">A</text>
        <text x="55" y="44" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold" opacity="0.7">B</text>
      </svg>
    )
  },
  {
    title: "Private-Labelling",
    description: "Fully dedicated instance. Your infrastructure, your control, our technology.",
    icon: (
      <svg viewBox="0 0 80 80" className="w-14 h-14">
        <rect x="12" y="15" width="35" height="50" rx="6" fill="none" stroke="currentColor" strokeWidth="3" />
        <rect x="33" y="15" width="35" height="50" rx="6" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.7" />
        <path d="M20 30 L28 30 M20 40 L28 40 M20 50 L25 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M40 30 L48 30 M40 40 L48 40 M40 50 L45 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <circle cx="40" cy="40" r="5" fill="currentColor" />
      </svg>
    )
  },
];

export default function InstitutionsPage() {
  return (
    <>
      {/* Global Premium Effects */}
      <NoiseOverlay opacity={0.025} />
      <ParticleField count={35} color="263, 50%, 40%" speed={0.2} connectDistance={80} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-36 md:pt-44 pb-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-15">
          <FloatingOrbs count={4} />
        </div>

        <div className="container max-w-[1300px] px-6 md:px-10 mx-auto relative z-10">
          <div className="text-center">
            {/* Badge */}
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200/50 mb-8">
                <UsersIcon className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Enterprise Solutions</span>
              </div>
            </ScrollReveal>

            {/* Main Title */}
            <ScrollReveal delay={0.1}>
              <h1 className="font-sans font-bold leading-[1.1] tracking-tight text-primary text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] mb-6">
                Protect at
                <span className="block">
                  <TextShimmer duration={4}>Scale</TextShimmer>
                </span>
              </h1>
            </ScrollReveal>

            {/* Subtitle */}
            <ScrollReveal delay={0.2}>
              <p className="text-lg md:text-xl text-text-dim max-w-2xl mx-auto mb-10 leading-relaxed">
                Institutional-grade child safety infrastructure. White-label, co-brand, or private-label options available.
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
                  <Link href="mailto:play@komalkids.com">Request Demo</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white text-primary border-primary border-2 hover:bg-primary/5 text-lg px-8 py-4 h-auto rounded-full"
                >
                  <Link href="/demo">Learn More</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Institution Types Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 relative">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4 text-center">Built for Every Institution</h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto text-center">
                From classrooms to clinics to government agencies, Komal adapts to your needs.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-8">
            {institutionTypes.map((institution, index) => (
              <ScrollReveal key={institution.title} delay={index * 0.1}>
                <div className="group bg-white rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${institution.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                        <institution.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold text-primary mb-3">{institution.title}</h3>
                      <p className="text-text-dim leading-relaxed">{institution.description}</p>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="grid grid-cols-2 gap-4">
                        {institution.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                            <span className="font-medium text-primary text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Options Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-center text-primary mb-4">Flexible Partnership Models</h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto text-center">
                Choose the approach that fits your organization's goals and infrastructure.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnershipOptions.map((option, index) => (
              <ScrollReveal key={option.title} delay={index * 0.1}>
                <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 text-center group">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-violet-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    {option.icon}
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{option.title}</h3>
                  <p className="text-text-dim leading-relaxed">{option.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <FloatingOrbs count={3} />
        </div>
        <div className="container max-w-[1100px] px-8 mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Enterprise-Grade Compliance</h2>
                <p className="text-lg opacity-90 mb-8 leading-relaxed">
                  Built from the ground up with institutional requirements in mind. Our infrastructure meets the highest standards for child data protection worldwide.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {["COPPA", "GDPR-K", "DPDPA", "SOC 2 Type II"].map((cert) => (
                    <div key={cert} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                      <p className="font-bold">{cert}</p>
                      <p className="text-xs opacity-75">Compliant</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.1}>
              <div className="bg-white/10 backdrop-blur rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <ShieldIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold">Infrastructure</p>
                    <p className="text-sm opacity-75">Built for scale</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-75">Uptime SLA</span>
                    <span className="font-bold">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-75">Data Regions</span>
                    <span className="font-bold">Global</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-75">On-Premise</span>
                    <span className="font-bold">Available</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="container max-w-[900px] px-8 mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 text-center">
              <TextShimmer duration={4}>Ready to Partner?</TextShimmer>
            </h2>
            <p className="text-lg text-text-dim mb-10 text-center">
              Let's discuss how Komal can serve your institution's needs. Custom solutions available.
            </p>
            <Button
              asChild
              size="lg"
              className="btn-primary-premium text-lg px-8 py-4 h-auto rounded-full border-0"
            >
              <Link href="mailto:play@komalkids.com">Contact Our Team</Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
