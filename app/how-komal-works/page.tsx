"use client";

import Link from "next/link";
import FloatingParticles from "@/components/FloatingParticles";
import { Button } from "@/components/ui/button";

// Abstract SVG Icons for "Anatomy of KOMAL" section
const CoreIdentityIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="8" stroke="#1A1A1A" strokeWidth="2" />
    <circle cx="24" cy="24" r="14" stroke="#1A1A1A" strokeWidth="2" />
    <circle cx="24" cy="24" r="20" stroke="#1A1A1A" strokeWidth="2" />
  </svg>
);

const DecisionMakingIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 24C12 17.373 17.373 12 24 12V36C17.373 36 12 30.627 12 24Z" fill="#1A1A1A" />
    <circle cx="24" cy="24" r="11.5" stroke="#1A1A1A" strokeWidth="2" />
  </svg>
);

const BondingIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="24" r="10" fill="#1A1A1A" />
    <circle cx="30" cy="24" r="10" stroke="#1A1A1A" strokeWidth="2" fill="white" />
  </svg>
);

const NavigationIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="24" r="10" fill="#1A1A1A" />
    <path d="M38 24C38 29.523 33.523 34 28 34C22.477 34 18 29.523 18 24C18 18.477 22.477 14 28 14" stroke="#1A1A1A" strokeWidth="2" />
  </svg>
);

export default function HowKomalWorks() {
  const anatomyCards = [
    {
      icon: <CoreIdentityIcon />,
      title: "Who your child is",
      subtitle: "at the core",
    },
    {
      icon: <DecisionMakingIcon />,
      title: "How they make",
      subtitle: "decisions",
    },
    {
      icon: <BondingIcon />,
      title: "How they bond",
      subtitle: "and connect",
    },
    {
      icon: <NavigationIcon />,
      title: "How they navigate",
      subtitle: "challenges",
    },
  ];

  return (
    <>
      {/* Hero Section - Redesigned with inline pill and image */}
      <section className="relative pt-18 md:pt-32 pb-8 px-6 md:px-16 overflow-hidden bg-white">
        {/* Floating Particles Background */}
        <div className="absolute inset-0 z-0">
          <FloatingParticles count={40} />
        </div>

        <div className="max-w-[1100px] mx-auto relative z-[2]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-12 transition-colors"
          >
            ← Back to Home
          </Link>

          {/* Multi-line headline with inline animated pill */}
          <div className="text-center mb-12 animate-[fadeDown_0.8s_ease_forwards]">
            <h1 className="font-sans text-[22px] md:text-[48px] lg:text-[56px] font-light leading-[1.3] tracking-[-0.02em] text-primary">
              We use advanced AI to understand your child
              <br />
              for delivering{" "}
              <span className="inline-flex items-center align-middle mx-1">
                <span
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#E8E0F5] to-[#D4C8ED] px-4 py-2 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/20"
                >
                  {/* Animated 3D-ish icon */}
                  <span className="relative w-8 h-8 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary transition-transform duration-300 group-hover:rotate-12" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.3" />
                      <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.6" />
                      <circle cx="12" cy="12" r="3" fill="currentColor" />
                    </svg>
                  </span>
                </span>
              </span>
              {" "}personalized insights
              <br />
              to help them thrive
            </h1>
          </div>

          {/* Large placeholder image with rounded corners */}
          <div className="relative mt-8 mb-4">
            <div className="bg-gradient-to-br from-[#E8E0F5] via-[#F5F0FF] to-[#FCE4EC] rounded-3xl overflow-hidden aspect-[16/8] md:aspect-[16/6] flex items-center justify-center shadow-xl">
              {/* Abstract decorative elements */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Large ring shape */}
                <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-[40px] border-[#F8BBD9]/50 opacity-60"></div>
                {/* Secondary ring */}
                <div className="absolute left-1/4 top-1/3 w-40 h-40 rounded-full bg-gradient-to-br from-[#CE93D8]/30 to-transparent"></div>
                {/* Small floating elements */}
                <div className="absolute right-1/4 bottom-1/4 w-16 h-16 rounded-full bg-[#E1BEE7]/40"></div>
                <div className="absolute left-1/3 bottom-1/3 w-8 h-8 rounded-full bg-primary/20"></div>
              </div>

              {/* Center content */}
              <div className="relative z-10 text-center px-8">
                <p className="text-primary/60 text-lg md:text-xl font-medium">
                  Behavioral AI in Action
                </p>
                <p className="text-primary/40 text-sm mt-2">
                  Placeholder for hero visualization
                </p>
              </div>
            </div>

            {/* Floating interactive pill badge */}
            <div className="absolute -bottom-6 right-8 md:right-16">
              <div
                className="group bg-white rounded-full px-5 py-3 shadow-lg border border-border/50 flex items-center gap-3 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-lg transition-transform duration-300 group-hover:rotate-[360deg]">
                  🧠
                </span>
                <div>
                  <p className="text-primary font-medium text-sm">Real-time Analysis</p>
                  <p className="text-text-dim text-xs">Hover to explore →</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Anatomy of KOMAL - Inspired by reference image */}
      <section className="py-16 md:py-24 bg-[#F5F5F7]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-16">
          <h2 className="font-sans text-[36px] md:text-[42px] font-light text-primary mb-4 text-center md:text-left">
            The anatomy of understanding
          </h2>
          <p className="text-lg text-text-dim leading-relaxed mb-12 max-w-[800px] text-center md:text-left">
            KOMAL has studied the key markers of child development and engagement, building a sophisticated system that synthesizes your child&apos;s unique patterns and needs.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {anatomyCards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-start"
              >
                <div className="mb-6">{card.icon}</div>
                <p className="text-[15px] md:text-base text-primary font-medium leading-tight">
                  {card.title}
                </p>
                <p className="text-[15px] md:text-base text-primary font-medium leading-tight">
                  {card.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Big Idea */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[900px] mx-auto px-6 md:px-8">
          <h2 className="font-sans text-[32px] md:text-[42px] font-light text-primary mb-6 tracking-[-0.02em]">
            The Big Idea
          </h2>
          <p className="text-lg text-text-dim leading-relaxed mb-5">
            Most learning apps are like blindfolded teachers—they only see if your child got the answer right or wrong. KOMAL is different. We watch how your child engages, not just what they click. It&apos;s like having a teacher who notices when your child hesitates, when they&apos;re getting frustrated, or when they&apos;re genuinely excited.
          </p>
          <p className="text-lg text-text-dim leading-relaxed">
            We use something called &quot;behavioral signals&quot;—tiny clues about how your child is feeling and learning. Think of it like reading body language, but for learning. And here&apos;s the best part: everything happens instantly, right on your device, keeping your child&apos;s privacy safe.
          </p>
        </div>
      </section>

      {/* Why Choose KOMAL - Comparison Table */}
      <section className="py-20 md:py-28 bg-[#F5F5F7]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-16">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium uppercase tracking-[0.2em] mb-4 block">
              Comparison
            </span>
            <h2 className="font-sans text-[36px] md:text-[48px] text-center font-light text-primary mb-4 tracking-[-0.02em]">
              Why Choose KOMAL?
            </h2>
            <p className="text-lg text-text-dim leading-relaxed max-w-[700px] mx-auto mb-8">
              You need a learning companion that truly understands. That&apos;s why we built KOMAL—a behavioral-first approach to help your child thrive.
            </p>
            <Button asChild className="bg-white hover:bg-violet-100 border-violet-400 border text-primary rounded-full px-8">
              <Link href="#pricing">Discover More</Link>
            </Button>
          </div>

          {/* Comparison Table */}
          <div className="bg-white border-violet-400 rounded-2xl overflow-hidden shadow-sm border border-border/30">
            {/* Header Row */}
            <div className="grid border-violet-100 grid-cols-3 border-b border-border/30">
              <div className="p-6 bg-violet-100 text-center md:p-8 font-semibold text-primary text-lg border-r border-border/30">
                KOMAL
              </div>
              <div className="p-6 bg-gray-100 md:p-8 font-medium text-text-dim text-center border-r border-border/30">
                Traditional Apps
              </div>
              <div className="p-6 bg-slate-100 md:p-8 font-medium text-text-dim text-center">
                Standard Screen Time
              </div>
            </div>

            {/* Comparison Rows */}
            {[
              {
                komal: "Real-time behavioral AI",
                komalCheck: true,
                traditional: "Click-based tracking only",
                traditionalCheck: true,
                standard: "No learning insights",
                standardCheck: false,
              },
              {
                komal: "Emotional state detection",
                komalCheck: true,
                traditional: "No emotional awareness",
                traditionalCheck: false,
                standard: "No emotional support",
                standardCheck: false,
              },
              {
                komal: "On-device privacy",
                komalCheck: true,
                traditional: "Cloud data collection",
                traditionalCheck: true,
                standard: "Data shared with ads",
                standardCheck: false,
              },
              {
                komal: "Instant adaptation (<200ms)",
                komalCheck: true,
                traditional: "Session-based changes",
                traditionalCheck: true,
                standard: "Static content",
                standardCheck: false,
              },
              {
                komal: "Parent-friendly insights",
                komalCheck: true,
                traditional: "Basic progress reports",
                traditionalCheck: true,
                standard: "No parent visibility",
                standardCheck: false,
              },
              {
                komal: "Non-addictive by design",
                komalCheck: true,
                traditional: "Gamification hooks",
                traditionalCheck: false,
                standard: "Designed for engagement",
                standardCheck: false,
              },
            ].map((row, index) => (
              <div
                key={index}
                className="grid border-violet-100 grid-cols-3 border-b border-border/30 last:border-b-0"
              >
                <div className="p-4 border-violet-100 md:p-6 flex items-center gap-3 border-r border-border/30">
                  <span className={`text-lg ${row.komalCheck ? "text-green-600" : "text-red-500"}`}>
                    {row.komalCheck ? "✓" : "✗"}
                  </span>
                  <span className="text-sm md:text-base text-primary">{row.komal}</span>
                </div>
                <div className="p-4 md:p-6 flex items-center gap-3 justify-center border-r border-border/30">
                  <span className={`text-lg ${row.traditionalCheck ? "text-green-600" : "text-red-500"}`}>
                    {row.traditionalCheck ? "✓" : "✗"}
                  </span>
                  <span className="text-sm md:text-base text-text-dim">{row.traditional}</span>
                </div>
                <div className="p-4 md:p-6 flex items-center gap-3 justify-center">
                  <span className={`text-lg ${row.standardCheck ? "text-green-600" : "text-red-500"}`}>
                    {row.standardCheck ? "✓" : "✗"}
                  </span>
                  <span className="text-sm md:text-base text-text-dim">{row.standard}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where the Magic Happens */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1100px] text-center mx-auto px-6 md:px-16">
          <div className="text-center mb-12">
            <h2 className="font-sans text-center text-[36px] md:text-[48px] font-light text-primary mb-4 tracking-[-0.02em]">
              Where the Magic Happens
            </h2>
            <p className="text-lg text-center text-text-dim leading-relaxed max-w-[700px] mx-auto">
              All the smart stuff happens right on your device—like having a tiny, super-smart assistant living in your phone or tablet.
            </p>
          </div>

          {/* 2x2 Grid of Violet Cards */}
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            {/* Card 1: Instant Adaptation */}
            <div className="bg-[#E8E0F5] rounded-3xl p-8 md:p-10 flex flex-col items-center justify-center min-h-[280px]">
              <span className="text-[72px] md:text-[96px] font-light text-primary mb-4">&lt;200ms</span>
              <p className="text-lg md:text-xl text-primary font-medium text-center">Instant Adaptation</p>
            </div>

            {/* Card 2: Learning Over Time - with graph icon */}
            <div className="bg-[#E8E0F5] rounded-3xl p-8 md:p-10 flex flex-col items-center justify-center min-h-[280px]">
              {/* Simple bar chart SVG */}
              <svg className="w-32 md:w-40 h-20 md:h-24 mb-4" viewBox="0 0 120 60" fill="none">
                <rect x="0" y="45" width="12" height="15" fill="#270263" opacity="0.4" rx="2" />
                <rect x="16" y="40" width="12" height="20" fill="#270263" opacity="0.5" rx="2" />
                <rect x="32" y="35" width="12" height="25" fill="#270263" opacity="0.6" rx="2" />
                <rect x="48" y="28" width="12" height="32" fill="#270263" opacity="0.7" rx="2" />
                <rect x="64" y="20" width="12" height="40" fill="#270263" opacity="0.8" rx="2" />
                <rect x="80" y="15" width="12" height="45" fill="#270263" opacity="0.9" rx="2" />
                <rect x="96" y="8" width="12" height="52" fill="#270263" rx="2" />
                <path d="M6 42 L22 38 L38 32 L54 25 L70 18 L86 12 L102 6" stroke="#270263" strokeWidth="2" strokeDasharray="3 3" fill="none" />
              </svg>
              <p className="text-lg md:text-xl text-primary font-medium text-center">Learning Over Time</p>
            </div>

            {/* Card 3: On-Device Processing - with sync icon */}
            <div className="bg-[#E8E0F5] rounded-3xl p-8 md:p-10 flex flex-col items-center justify-center min-h-[280px]">
              {/* Circular sync icon */}
              <div className="relative mb-4">
                <svg className="w-24 md:w-28 h-24 md:h-28" viewBox="0 0 100 100" fill="none">
                  {/* Dashed circle */}
                  <circle cx="50" cy="50" r="40" stroke="#270263" strokeWidth="2" strokeDasharray="6 4" opacity="0.4" />
                  {/* Center circle with arrows */}
                  <circle cx="50" cy="50" r="20" fill="#270263" />
                  <path d="M42 50 L50 44 L50 48 L58 48 L58 52 L50 52 L50 56 L42 50Z" fill="white" />
                  <path d="M58 50 L50 56 L50 52 L42 52 L42 48 L50 48 L50 44 L58 50Z" fill="white" transform="rotate(180 50 50)" />
                  {/* Small icons around */}
                  <circle cx="50" cy="10" r="6" fill="#270263" opacity="0.6" />
                  <circle cx="85" cy="65" r="6" fill="#270263" opacity="0.6" />
                  <circle cx="15" cy="65" r="6" fill="#270263" opacity="0.6" />
                </svg>
              </div>
              <p className="text-lg md:text-xl text-primary font-medium text-center">On-Device Processing</p>
            </div>

            {/* Card 4: Better Every Week */}
            <div className="bg-[#E8E0F5] rounded-3xl p-8 md:p-10 flex flex-col items-center justify-center min-h-[280px]">
              <span className="text-[72px] md:text-[96px] font-light text-primary mb-4">∞</span>
              <p className="text-lg md:text-xl text-primary font-medium text-center">Better Every Week</p>
            </div>
          </div>

          {/* Descriptions below cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center ">
              <h4 className="text-lg  text-center font-semibold text-primary mb-2 flex items-center justify-center md:justify-start gap-2">
                <span></span> Instant Adaptation
              </h4>
              <p className="text-text-dim text-[15px] leading-relaxed">
                When your child shows frustration, KOMAL adapts in less than a blink of an eye. It might slow down the activity or introduce a calming mini-game—all automatically.
              </p>
            </div>
            <div className="text-center">
              <h4 className="text-lg  font-semibold text-primary mb-2 flex items-center justify-center md:justify-start gap-2">
                <span></span> Learning Over Time
              </h4>
              <p className="text-text-dim text-[15px] leading-relaxed">
                KOMAL gets smarter about your child the more they play. It learns their unique patterns and adapts personalization every week.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold text-primary mb-2 flex items-center justify-center md:justify-start gap-2">
                <span></span> Understanding, Not Data
              </h4>
              <p className="text-text-dim text-[15px] leading-relaxed">
                We translate complex behavioral signals into simple insights. Instead of jargon, you see &quot;Your child showed strong focus today!&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Science */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1100px] text-center mx-auto px-6 md:px-16">
          <div className="text-center mb-12">
            <h2 className="font-sans text-center text-[36px] md:text-[48px] font-light text-primary mb-4 tracking-[-0.02em]">
              The Science (Simplified)
            </h2>
            <p className="text-lg text-text-dim leading-relaxed max-w-[700px] mx-auto">
              KOMAL is built on research from socially assistive robotics and educational psychology. We use advanced AI techniques, but we keep them simple for you.
            </p>
          </div>

          {/* Bento Box Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Federated Learning - Large Card with nested elements */}
            <div className="bg-[#F5F5F7] rounded-3xl p-6 md:p-8">
              {/* Browser-style header dots */}
              <div className="flex gap-1.5 mb-6">
                <span className="w-3 h-3 rounded-full bg-[#E8E0F5]"></span>
                <span className="w-3 h-3 rounded-full bg-[#D4C8ED]"></span>
                <span className="w-3 h-3 rounded-full bg-primary/30"></span>
              </div>

              {/* Inner nested cards row */}
              <div className="flex gap-3 mb-6">
                <div className="bg-white rounded-xl p-4 flex-1 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-[#E8E0F5] flex items-center justify-center mb-3">
                    <span className="text-xl">👤</span>
                  </div>
                  <div className="h-2 bg-[#E8E0F5] rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-[#E8E0F5] rounded w-1/2"></div>
                </div>
                <div className="bg-white rounded-xl p-4 flex-1 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mb-3">
                    <span className="text-white text-xl">🔒</span>
                  </div>
                  <div className="h-2 bg-[#E8E0F5] rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-[#E8E0F5] rounded w-1/2"></div>
                </div>
                <div className="bg-white rounded-xl p-4 flex-1 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-[#E8E0F5] flex items-center justify-center mb-3">
                    <span className="text-xl">📊</span>
                  </div>
                  <div className="h-2 bg-[#E8E0F5] rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-[#E8E0F5] rounded w-1/2"></div>
                </div>
              </div>

              <p className="text-primary font-medium mb-2">🧪 Federated Learning</p>
              <p className="text-text-dim text-[15px] leading-relaxed">
                We improve our AI by learning from many children without ever seeing their individual data. It&apos;s like learning from a crowd while respecting everyone&apos;s privacy.
              </p>
            </div>

            {/* Card 2: Explainability - with text card inside */}
            <div className="bg-[#F5F5F7] rounded-3xl p-6 md:p-8">
              {/* Browser-style header dots */}
              <div className="flex gap-1.5 mb-6">
                <span className="w-3 h-3 rounded-full bg-[#E8E0F5]"></span>
                <span className="w-3 h-3 rounded-full bg-[#D4C8ED]"></span>
                <span className="w-3 h-3 rounded-full bg-primary/30"></span>
              </div>

              {/* Inner card with text */}
              <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
                <p className="text-text-dim text-[15px] leading-relaxed mb-4">
                  &quot;Your child showed <span className="text-primary font-medium">strong focus and engagement</span> during today&apos;s session, with natural curiosity peaks.&quot;
                </p>
                <div className="flex gap-2">
                  <span className="bg-[#E8E0F5] text-primary text-xs px-3 py-1 rounded-full">Plain Language</span>
                  <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">Confidence: High</span>
                </div>
              </div>

              <p className="text-primary font-medium mb-2">💬 Explainability</p>
              <p className="text-text-dim text-[15px] leading-relaxed">
                If we can&apos;t explain it simply, we don&apos;t use it. Every insight comes with confidence ranges and plain-language explanations.
              </p>
            </div>

            {/* Card 3: Large spanning card - Neural Vision style */}
            <div className="bg-[#F5F5F7] rounded-3xl p-6 md:p-8 md:col-span-2">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left side: Text content */}
                <div>
                  <h3 className="font-sans text-[28px] md:text-[32px] font-light text-primary mb-4">
                    Fairness & Ethics
                  </h3>
                  <p className="text-text-dim leading-relaxed mb-6">
                    We regularly check our AI to make sure it works equally well for all children, regardless of age, background, or learning style. We audit for bias and fix issues before they become problems.
                  </p>
                  <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
                    <Link href="/privacy">Learn More ⚡</Link>
                  </Button>
                </div>

                {/* Right side: Nested cards grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-2xl p-4 shadow-sm aspect-[4/3] flex flex-col justify-between">
                    <div className="w-8 h-8 rounded-lg bg-[#E8E0F5] flex items-center justify-center">
                      <span>⚖️</span>
                    </div>
                    <p className="text-primary text-sm font-medium">Bias Audits</p>
                  </div>
                  <div className="bg-[#E8E0F5] rounded-2xl p-4 aspect-[4/3] flex flex-col justify-between">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                      <span>🌍</span>
                    </div>
                    <p className="text-primary text-sm font-medium">Global Standards</p>
                  </div>
                  <div className="bg-[#E8E0F5] rounded-2xl p-4 aspect-[4/3] flex flex-col justify-between">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                      <span>👶</span>
                    </div>
                    <p className="text-primary text-sm font-medium">Age Inclusive</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm aspect-[4/3] flex flex-col justify-between">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                      <span className="text-white">✓</span>
                    </div>
                    <p className="text-primary text-sm font-medium">Verified Fair</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* What KOMAL Sees & What Parents See - Side by Side */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-[#F5F5F7]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - What KOMAL Sees */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#E8E0F5] flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-primary">What KOMAL Sees</h3>
              </div>

              <p className="text-text-dim mb-6 text-[15px]">KOMAL pays attention to how your child interacts, not who they are:</p>

              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3 text-text-dim">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></span>
                  <span className="text-[15px]"><strong className="text-primary">Eye gaze patterns</strong> — Where your child looks tells us about their attention and focus</span>
                </li>
                <li className="flex items-start gap-3 text-text-dim">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></span>
                  <span className="text-[15px]"><strong className="text-primary">Touch patterns</strong> — How they tap, swipe, and interact shows us their confidence</span>
                </li>
                <li className="flex items-start gap-3 text-text-dim">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></span>
                  <span className="text-[15px]"><strong className="text-primary">Emotional cues</strong> — Tiny expressions help us understand their mood</span>
                </li>
                <li className="flex items-start gap-3 text-text-dim">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></span>
                  <span className="text-[15px]"><strong className="text-primary">Voice tone</strong> — How they speak gives us clues about their emotional state</span>
                </li>
              </ul>

              <div className="pt-5 border-t border-border/50">
                <p className="text-[14px] text-text-dim">
                  <strong className="text-primary">What we don&apos;t see:</strong> No video storage without permission. No tracking across apps. No advertising use.
                </p>
              </div>
            </div>

            {/* Right Column - What Parents See */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#E8E0F5] flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4" />
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-primary">What You See</h3>
              </div>

              <p className="text-text-dim mb-6 text-[15px]">Every week, you get a friendly report that tells you:</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[#F5F5F7] rounded-xl p-4">
                  <h4 className="text-[15px] font-medium text-primary mb-1">Focus Area</h4>
                  <p className="text-text-dim text-[13px]">What they worked on and their engagement level</p>
                </div>
                <div className="bg-[#F5F5F7] rounded-xl p-4">
                  <h4 className="text-[15px] font-medium text-primary mb-1">Quality Score</h4>
                  <p className="text-text-dim text-[13px]">How well they connected with activities</p>
                </div>
                <div className="bg-[#F5F5F7] rounded-xl p-4">
                  <h4 className="text-[15px] font-medium text-primary mb-1">Skills Practiced</h4>
                  <p className="text-text-dim text-[13px]">Specific learning skills developed</p>
                </div>
                <div className="bg-[#F5F5F7] rounded-xl p-4">
                  <h4 className="text-[15px] font-medium text-primary mb-1">Highlights</h4>
                  <p className="text-text-dim text-[13px]">A positive moment to celebrate</p>
                </div>
              </div>

              <div className="pt-5 border-t border-border/50">
                <p className="text-[14px] text-text-dim mb-3">Each report includes:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-[#E8E0F5] text-primary text-[13px] px-3 py-1.5 rounded-full">What this means</span>
                  <span className="bg-[#E8E0F5] text-primary text-[13px] px-3 py-1.5 rounded-full">Try this at home</span>
                  <span className="bg-[#E8E0F5] text-primary text-[13px] px-3 py-1.5 rounded-full">Next tiny goal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Safety */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-[#F5F5F7]">
        <div className="max-w-[900px] mx-auto px-6 md:px-8">
          <h2 className="font-sans text-[32px] md:text-[42px] font-light text-primary mb-10 tracking-[-0.02em]">
            Privacy &amp; Safety: Our Non-Negotiables
          </h2>

          <div className="grid gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border/50">
              <h3 className="text-xl font-medium text-primary mb-4 flex items-center gap-3">
                <span className="text-2xl">🔒</span> Privacy First, Always
              </h3>
              <p className="text-text-dim leading-relaxed mb-6">
                <strong className="text-primary">Parental consent is mandatory.</strong> You control everything. You can turn off any sensor anytime. Want to disable the camera? Done. Don&apos;t want voice analysis? No problem. You&apos;re in complete control.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">No Ads</span>
                <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">No Third-Party Tracking</span>
                <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">No Video Storage (by default)</span>
                <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">Easy Delete/Export</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border/50">
              <h3 className="text-xl font-medium text-primary mb-4 flex items-center gap-3">
                <span className="text-2xl">🛡️</span> Child Safety Built-In
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-text-dim">
                  <span className="text-lg mt-0.5">✨</span>
                  <span><strong className="text-primary">No open chat:</strong> Your child only interacts with our carefully designed avatar responses</span>
                </li>
                <li className="flex items-start gap-3 text-text-dim">
                  <span className="text-lg mt-0.5">✨</span>
                  <span><strong className="text-primary">Bounded interactions:</strong> Everything your child sees is scripted and safe—no surprises</span>
                </li>
                <li className="flex items-start gap-3 text-text-dim">
                  <span className="text-lg mt-0.5">✨</span>
                  <span><strong className="text-primary">No identity inference:</strong> We don&apos;t try to figure out who your child is beyond learning patterns</span>
                </li>
                <li className="flex items-start gap-3 text-text-dim">
                  <span className="text-lg mt-0.5">✨</span>
                  <span><strong className="text-primary">No diagnosis claims:</strong> We provide insights, not medical or psychological labels</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border/50">
              <h3 className="text-xl font-medium text-primary mb-4 flex items-center gap-3">
                <span className="text-2xl">📋</span> Compliance &amp; Ethics
              </h3>
              <p className="text-text-dim mb-4">We follow the strictest standards:</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-text-dim">
                  <span className="text-lg mt-0.5">✨</span>
                  <span><strong className="text-primary">COPPA compliant:</strong> Meets all US children&apos;s privacy laws</span>
                </li>
                <li className="flex items-start gap-3 text-text-dim">
                  <span className="text-lg mt-0.5">✨</span>
                  <span><strong className="text-primary">GDPR-K compliant:</strong> Follows European children&apos;s data protection rules</span>
                </li>
                <li className="flex items-start gap-3 text-text-dim">
                  <span className="text-lg mt-0.5">✨</span>
                  <span><strong className="text-primary">HIPAA-aligned:</strong> When used by therapists, we meet healthcare privacy standards</span>
                </li>
                <li className="flex items-start gap-3 text-text-dim">
                  <span className="text-lg mt-0.5">✨</span>
                  <span><strong className="text-primary">Regular audits:</strong> Third-party experts check our systems regularly</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* The Vision */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[900px] mx-auto px-6 md:px-8">
          <h2 className="font-sans text-[32px] md:text-[42px] font-light text-primary mb-6 tracking-[-0.02em]">
            Our Bigger Vision
          </h2>
          <p className="text-lg text-text-dim leading-relaxed mb-5">
            We&apos;re not just building an app. We&apos;re building the foundation for how AI can understand and support children&apos;s learning. Our goal is to become the &quot;behavioral interface&quot; for childhood learning—meaning any educational tool could use KOMAL&apos;s understanding to better adapt to your child.
          </p>
          <p className="text-lg text-text-dim leading-relaxed">
            Imagine if every learning app could answer: &quot;Is the child engaged? Is this too hard? Is this helping?&quot; That&apos;s the future we&apos;re building—one where technology truly understands children, not just tracks them.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32 bg-primary text-white text-center">
        <div className="max-w-[900px] mx-auto px-6 md:px-8">
          <h2 className="text-4xl md:text-5xl text-center font-sans font-light mb-6">
            Ready to Experience the Magic?
          </h2>
          <p className="text-xl opacity-90 mb-10 max-w-[600px] mx-auto">
            See how KOMAL understands your child. Start your free trial today.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto rounded-full"
          >
            <Link href="/#pricing">Start Free Trial</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
