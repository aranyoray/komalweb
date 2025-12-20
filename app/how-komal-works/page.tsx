"use client";

import Link from "next/link";
import FloatingParticles from "@/components/FloatingParticles";
import { Button } from "@/components/ui/button";

// Abstract SVG Icons for "Anatomy of Komal" section
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

          {/* Multi-line headline with inline animated pill */}
          <div className="text-center mb-12 animate-[fadeDown_0.8s_ease_forwards]">
            <h1 className="font-sans text-[22px] md:text-[48px] lg:text-[56px] font-bold leading-[1.3] tracking-[-0.02em] text-primary">
              We use <span className="font-semibold">advanced AI</span> to understand your child and deliver{" "}
              <span className="inline-flex items-center align-middle mx-1">
                <span
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#E8E0F5] to-[#D4C8ED] px-4 py-2 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/20"
                >
                  <span className="relative w-8 h-8 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary transition-transform duration-300 group-hover:rotate-12" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.3" />
                      <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.6" />
                      <circle cx="12" cy="12" r="3" fill="currentColor" />
                    </svg>
                  </span>
                </span>
              </span>
              {" "}<span className="font-semibold">personalised insights</span> to help them thrive.
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
                  Behavioural AI in Action
                </p>
              </div>
            </div>

            {/* Floating interactive pill badge */}
            <div className="absolute -bottom-6 right-8 md:right-16">
              <div
                className="group bg-white rounded-full px-5 py-3 shadow-lg border border-border/50 flex items-center gap-3 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-lg transition-transform duration-300 group-hover:rotate-[360deg]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
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

      {/* The Anatomy of Komal - Inspired by reference image */}
      <section className="py-16 md:py-24 bg-[#F5F5F7]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-16">
          <h2 className="font-sans text-[36px] md:text-[42px] font-semibold text-primary mb-4 text-center md:text-left">
            The anatomy of <span className="font-bold">companionship</span>
          </h2>
          <p className="text-lg text-text-dim leading-relaxed mb-12 max-w-[800px] text-center md:text-left">
            Komal has studied the key markers of child development and engagement, building a sophisticated system that synthesises your child&apos;s unique patterns and needs.
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
          <h2 className="font-sans text-[32px] md:text-[42px] font-semibold text-primary mb-6 tracking-[-0.02em]">
            The Big Idea
          </h2>
          <p className="text-lg text-text-dim leading-relaxed mb-5">
            Most learning apps are blindfolded—they only see if your child got the answer right or wrong. Komal is different. We watch how your child engages, not just what they click. We use <span className="font-semibold">microexpressions</span> and <span className="font-semibold">gaze</span> to study <span className="font-semibold">behaviour</span>, instead of bombarding them with buttons.
          </p>
          <p className="text-lg text-text-dim leading-relaxed">
            It&apos;s like having a teacher who notices when your child hesitates, when they&apos;re getting frustrated, or when they&apos;re genuinely excited. Komal is <span className="font-bold">(child-first, game-second)</span>.
          </p>
        </div>
      </section>

      {/* Where the Magic Happens */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1100px] text-center mx-auto px-6 md:px-16">
          <div className="text-center mb-12">
            <h2 className="font-sans text-center text-[36px] md:text-[48px] font-semibold text-primary mb-4 tracking-[-0.02em]">
              Where the Magic Happens
            </h2>
            <p className="text-lg text-center text-text-dim leading-relaxed max-w-[700px] mx-auto">
              All the smart stuff happens right on your device—like having a tiny parent assistant living in your phone, laptop, or PC.
            </p>
          </div>

          {/* 2x2 Grid of Violet Cards */}
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            {/* Card 1: Instant Adaptation */}
            <div className="bg-[#E8E0F5] rounded-3xl p-8 md:p-10 flex flex-col items-center justify-center min-h-[280px]">
              <span className="text-[72px] md:text-[96px] font-bold text-primary mb-4">&lt;200ms</span>
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
              <span className="text-[72px] md:text-[96px] font-bold text-primary mb-4">∞</span>
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
                When your child shows frustration, Komal adapts in less than a blink of an eye. It might slow down the activity or introduce a calming mini-game—all automatically.
              </p>
            </div>
            <div className="text-center">
              <h4 className="text-lg  font-semibold text-primary mb-2 flex items-center justify-center md:justify-start gap-2">
                <span></span> Learning Over Time
              </h4>
              <p className="text-text-dim text-[15px] leading-relaxed">
                Komal gets smarter about your child the more they play. It learns their unique patterns and adapts personalisation every week.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold text-primary mb-2 flex items-center justify-center md:justify-start gap-2">
                <span></span> Understanding, Not Data
              </h4>
              <p className="text-text-dim text-[15px] leading-relaxed">
                We translate complex <span className="font-semibold">behavioural signals</span> into simple insights. Instead of jargon, you see &quot;Your child showed strong focus today!&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Science */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1100px] text-center mx-auto px-6 md:px-16">
          <div className="text-center mb-12">
            <h2 className="font-sans text-center text-[36px] md:text-[48px] font-semibold text-primary mb-4 tracking-[-0.02em]">
              The Science, Simply Said
            </h2>
            <p className="text-lg text-text-dim leading-relaxed max-w-[700px] mx-auto">
              Komal is built on research from socially assistive robotics and educational psychology. We use <span className="font-semibold">advanced AI</span> techniques, but we keep them simple for you.
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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#270263" strokeWidth="2">
                      <circle cx="12" cy="8" r="4"/>
                      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                    </svg>
                  </div>
                  <div className="h-2 bg-[#E8E0F5] rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-[#E8E0F5] rounded w-1/2"></div>
                </div>
                <div className="bg-white rounded-xl p-4 flex-1 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <div className="h-2 bg-[#E8E0F5] rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-[#E8E0F5] rounded w-1/2"></div>
                </div>
                <div className="bg-white rounded-xl p-4 flex-1 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-[#E8E0F5] flex items-center justify-center mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#270263" strokeWidth="2">
                      <line x1="12" y1="20" x2="12" y2="10"/>
                      <line x1="18" y1="20" x2="18" y2="4"/>
                      <line x1="6" y1="20" x2="6" y2="16"/>
                    </svg>
                  </div>
                  <div className="h-2 bg-[#E8E0F5] rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-[#E8E0F5] rounded w-1/2"></div>
                </div>
              </div>

              <p className="text-primary font-medium mb-2">Federated Learning</p>
              <p className="text-text-dim text-[15px] leading-relaxed">
                We improve our <span className="font-semibold">advanced AI</span> by learning from many children without ever seeing their individual data. It&apos;s like learning from a crowd whilst respecting everyone&apos;s privacy.
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

              <p className="text-primary font-medium mb-2">Explainability</p>
              <p className="text-text-dim text-[15px] leading-relaxed">
                If we can&apos;t explain it simply, we don&apos;t use it. Every insight comes with confidence ranges and plain-language explanations using <span className="font-semibold">personalised insights</span>.
              </p>
            </div>

            {/* Card 3: Large spanning card - Neural Vision style */}
            <div className="bg-[#F5F5F7] rounded-3xl p-6 md:p-8 md:col-span-2">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left side: Text content */}
                <div>
                  <h3 className="font-sans text-[28px] md:text-[32px] font-semibold text-primary mb-4">
                    Fairness & Ethics
                  </h3>
                  <p className="text-text-dim leading-relaxed mb-6">
                    We regularly check our AI to make sure it works equally well for all children, regardless of age, background, or learning style. We audit for bias and fix issues before they become problems.
                  </p>
                  <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
                    <Link href="/privacy">Learn More</Link>
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
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#270263" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                    </div>
                    <p className="text-primary text-sm font-medium">Global Standards</p>
                  </div>
                  <div className="bg-[#E8E0F5] rounded-2xl p-4 aspect-[4/3] flex flex-col justify-between">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#270263" strokeWidth="2">
                        <circle cx="12" cy="8" r="3"/>
                        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                      </svg>
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


      {/* What Komal Sees & What Parents See - Side by Side */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-[#F5F5F7]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - What Komal Sees */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#E8E0F5] flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-primary">What Komal Sees</h3>
              </div>

              <p className="text-text-dim mb-6 text-[15px]">Komal pays attention to how your child interacts, not who they are:</p>

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
          <h2 className="font-sans text-[32px] md:text-[42px] font-semibold text-primary mb-10 tracking-[-0.02em]">
            Privacy &amp; Safety: Our Non-Negotiables
          </h2>

          <div className="grid gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border/50">
              <h3 className="text-xl font-medium text-primary mb-4 flex items-center gap-3">
                Privacy First, Always
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
                Child Safety Built-In
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-text-dim">
                  <span><strong className="text-primary">No open chat:</strong> Your child only interacts with our carefully designed avatar responses</span>
                </li>
                <li className="flex items-start gap-3 text-text-dim">
                  <span><strong className="text-primary">Bounded interactions:</strong> Everything your child sees is scripted and safe—no surprises</span>
                </li>
                <li className="flex items-start gap-3 text-text-dim">
                  <span><strong className="text-primary">No identity inference:</strong> We don&apos;t try to figure out who your child is beyond learning patterns</span>
                </li>
                <li className="flex items-start gap-3 text-text-dim">
                  <span><strong className="text-primary">No diagnosis claims:</strong> We provide insights, not medical or psychological labels</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border/50">
              <h3 className="text-xl font-medium text-primary mb-4 flex items-center gap-3">
                Compliance &amp; Ethics
              </h3>
              <p className="text-text-dim mb-4">We follow the strictest standards:</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-text-dim">
                  <span><strong className="text-primary">COPPA compliant:</strong> Meets all US children&apos;s privacy laws</span>
                </li>
                <li className="flex items-start gap-3 text-text-dim">
                  <span><strong className="text-primary">GDPR-K compliant:</strong> Follows European children&apos;s data protection rules</span>
                </li>
                <li className="flex items-start gap-3 text-text-dim">
                  <span><strong className="text-primary">HIPAA-aligned:</strong> When used by therapists, we meet healthcare privacy standards</span>
                </li>
                <li className="flex items-start gap-3 text-text-dim">
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
          <h2 className="font-sans text-[32px] md:text-[42px] font-semibold text-primary mb-6 tracking-[-0.02em]">
            Our Bigger Vision
          </h2>
          <p className="text-lg text-text-dim leading-relaxed mb-5">
            We&apos;re not just building an app. We&apos;re building the foundation for how AI can understand and support children&apos;s learning. Our goal is to become the &quot;behavioural interface&quot; for childhood learning—meaning any educational tool could use Komal&apos;s understanding to better adapt to your child.
          </p>
          <p className="text-lg text-text-dim leading-relaxed">
            Imagine if every learning app could answer: &quot;Is the child engaged? Is this too hard? Is this helping?&quot; That&apos;s the future we&apos;re building—one where technology truly understands children, not just tracks them.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32 bg-primary text-white text-center">
        <div className="max-w-[900px] mx-auto px-6 md:px-8">
          <h2 className="text-4xl md:text-5xl text-center font-sans font-semibold mb-6">
            Ready to Experience the Magic?
          </h2>
          <p className="text-xl opacity-90 mb-10 max-w-[600px] mx-auto">
            See how Komal understands your child. Get your FREE AI Report today.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto rounded-full"
          >
            <Link href="/#pricing">Get FREE AI Report</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
