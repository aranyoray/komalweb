"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import AdvisorsSection from "@/components/AdvisorsSection";


import FaqAccordion from "@/components/FaqAccordion";
import PartnersCarousel from "@/components/PartnersCarousel";
import HeroImageGallery from "@/components/HeroImageGallery";
import { BrainIcon, ActivityIcon, ChartIcon, ShieldIcon, LockIcon, ZapIcon } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Aurora from "@/components/Aurora";
import FloatingButterflies from "@/components/FloatingButterflies";
import FloatingDots from "@/components/FloatingDots";
import KomalYourBestSection from "@/components/KomalYourBestSection";
import SplitText from "@/components/SplitText";
import WaitlistModal from "@/components/WaitlistModal";

// Premium dynamic effects
import SpotlightCursor from "@/components/SpotlightCursor";
import FloatingOrbs from "@/components/FloatingOrbs";
import NoiseOverlay from "@/components/NoiseOverlay";
import TextShimmer from "@/components/TextShimmer";
import ScrollReveal from "@/components/ScrollReveal";
import ParticleField from "@/components/ParticleField";


export default function Home() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  // Auto-open waitlist modal when someone visits the website
  useEffect(() => {
    setIsWaitlistOpen(true);
  }, []);

  const testimonials = [
    {
      quote:
        "For the first time, I understand when my daughter is actually struggling versus when she's just being playful. The weekly reports are clear and actionable.",
      author: "Priya S.",
      role: "Parent",
    },
    {
      quote:
        "My son's therapist loves the reports. She can see patterns between sessions that we never noticed before.",
      author: "Rajesh K.",
      role: "Parent",
    },
    {
      quote:
        "As a teacher, I've seen many learning apps. Komal is different—it actually adapts to each child in real-time.",
      author: "Ananya M.",
      role: "Elementary School Teacher",
    },
    {
      quote:
        "The privacy features give me peace of mind. Everything stays on our device, and I control exactly who sees the insights.",
      author: "Vikram P.",
      role: "Parent",
    },
  ];



  const faqs = [
    {
      question: "What is Komal?",
      answer:
        "Komal is a hyper-personalised digital guardian for children ages 3-12 that uses real-time behavioural AI to understand how your child feels and learns. Unlike traditional apps that only track clicks, Komal reads gaze patterns, touch interactions, and micro-expressions to adapt learning moment-by-moment.",
    },
    {
      question: "How does Komal protect my child's privacy?",
      answer:
        "All AI processing happens on-device—your child's data never leaves your device without explicit consent. Parents control what’s shared, and we never sell data or use it for advertising.",
    },
    {
      question: "Does Komal diagnose my child?",
      answer:
        "No. Komal provides insights and understanding, not medical or psychological diagnoses. We never label, categorise, or make diagnostic claims.",
    },
    {
      question: "What age is Komal designed for?",
      answer:
        "Komal is designed for children ages 3-12. The AI adapts to each child's developmental stage, learning style, and individual needs.",
    },
    {
      question: "How does the real-time adaptation work?",
      answer:
        "Komal processes behavioural signals in real-time (under ~200ms). When your child hesitates, shows frustration, or loses attention, the app adapts pacing, tone, and difficulty automatically.",
    },
    {
      question: "What do the parent reports include?",
      answer:
        "Weekly, plain-language reports describing learning patterns, engagement quality, and actionable next steps (e.g. what worked best, what to try at home).",
    },
    {
      question: "Can I share reports with my child's teacher or therapist?",
      answer:
        "Yes. Sharing is parent-initiated and parent-controlled. You can share reports via email or WhatsApp with one click.",
    },
    {
      question: "Does Komal work offline?",
      answer: "Yes. Core learning features and real-time adaptation work offline; internet is only needed for syncing and report delivery (if you enable it).",
    },
    {
      question: "How does Komal filter age-inappropriate content?",
      answer:
        "Komal uses AI to analyze content across multiple signals—text, images, video, and audio—and matches it to age-appropriate rules. Instead of binary blocking, we use three actions: Block (not accessible), Gate (allowed with warning or approval), and Allow. This creates flexibility where educational content can be treated differently from harmful content.",
    },
    {
      question: "Can I customize what content my child sees?",
      answer:
        "Yes. Parents can block specific interests, URLs, or keywords. You can also adjust the default rules per child profile and receive notifications when blocked content is attempted. Parent rules always override the default settings.",
    },
  ];

  return (
    <>
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "KOMAL AI",
            operatingSystem: "Web",
            applicationCategory: "EducationApplication",
            description:
              "The world's first AI digital guardian that reads how a child feels, not just what they click. Hyper-personalised platform for children ages 3-12.",
            screenshot: "https://komal.ai/screenshot.jpg",
            featureList:
              "Real-time behavioural AI, Personalised learning, Parent insights, Privacy-first design",
          }),
        }}
      />

      {/* Global Premium Effects */}
      <SpotlightCursor />
      <NoiseOverlay opacity={0.025} />
      <ParticleField count={35} color="263, 50%, 40%" speed={0.2} connectDistance={80} />

      {/* Hero Section */}
      <section className="hero-section relative pt-24 md:pt-28 lg:pt-20 pb-12 md:pb-16 overflow-hidden min-h-[90vh] flex items-center justify-center">
        {/* Floating Orbs Background */}
        <div className="absolute inset-0 z-0">
          <FloatingOrbs count={4} />
        </div>

        {/* Floating Dots Background */}
        <div className="absolute inset-0 z-0">
          <FloatingDots />
        </div>

        {/* Floating Butterflies Background */}
        <div className="absolute inset-0 z-[1]">
          <FloatingButterflies count={25} />
        </div>



        {/* Main Container - Constrained width, centered */}
        <div className="hero-container w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 relative z-[2]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-6 xl:gap-10 items-center">

            {/* Left Column - Text Content */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left pt-6 lg:pt-0">
              {/* Yale Badge */}
              <div className="yale-badge-wrapper relative inline-flex mb-5 opacity-0 animate-[fadeDown_0.8s_ease_forwards]" style={{ animationDelay: "0.1s" }}>
                <svg className="absolute inset-[-1px] w-[calc(100%+2px)] h-[calc(100%+2px)] pointer-events-none overflow-visible">
                  <rect
                    className="marching-border"
                    x="0.75"
                    y="0.75"
                    rx="20"
                    ry="20"
                    fill="none"
                    stroke="#1e3a5f"
                    strokeWidth="1.5"
                    strokeDasharray="5 5"
                    strokeLinecap="round"
                    style={{
                      width: 'calc(100% - 1.5px)',
                      height: 'calc(100% - 1.5px)',
                    }}
                  />
                </svg>
                <div className="relative inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/5">
                  <svg
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary spinning-diamond"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0L15 9L24 12L15 15L12 24L9 15L0 12L9 9L12 0Z" />
                  </svg>
                  <span className="font-sans text-xs sm:text-sm font-medium text-primary tracking-wide">
                    Grounded in Yale Research
                  </span>
                </div>
              </div>

              {/* Hero Title */}
              <h1 className="hero-title font-sans font-bold leading-[1.08] tracking-[-0.02em] text-primary">
                <span className="block text-xl sm:text-2xl md:text-[1.75rem] font-semibold text-primary/80 mb-2 sm:mb-3 opacity-0 animate-[fadeDown_0.6s_ease_forwards]" style={{ animationDelay: "0.2s" }}>
                  Kids are curious.
                </span>
                <span className="block text-[2.5rem] sm:text-[3.25rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[5rem] leading-[1.02] opacity-0 animate-[fadeDown_0.6s_ease_forwards]" style={{ animationDelay: "0.35s" }}>
                  We protect
                </span>
                <span className="relative inline-block text-[2.5rem] sm:text-[3.25rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[5rem] leading-[1.02] whitespace-nowrap hover:text-primary/80 transition-colors duration-300 cursor-help opacity-0 animate-[fadeDown_0.6s_ease_forwards]" style={{ animationDelay: "0.5s" }}>
                  <TextShimmer duration={4}>their curiosity.</TextShimmer>
                  <span
                    className="absolute left-0 right-0 bottom-[0.05em] h-[0.3em] rounded-full -z-10"
                    style={{
                      background: 'linear-gradient(to right, rgba(107, 78, 113, 0.15), rgba(107, 78, 113, 0.22), rgba(107, 78, 113, 0.15))',
                    }}
                  />
                </span>
              </h1>

              {/* Tagline */}
              <p className="text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.18em] sm:tracking-[0.22em] font-medium text-primary/60 mt-5 md:mt-6 text-center lg:text-left opacity-0 animate-[fadeDown_0.6s_ease_forwards]" style={{ animationDelay: "0.65s" }}>
                Ethical AI that guides, not just blocks
              </p>

              {/* CTA Buttons */}
              <div className="cta-group flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 w-full sm:w-auto opacity-0 animate-[fadeDown_0.6s_ease_forwards]" style={{ animationDelay: "0.8s" }}>
                <Button
                  onClick={() => setIsWaitlistOpen(true)}
                  size="lg"
                  className="btn-primary-premium text-white text-base sm:text-lg px-7 py-3.5 sm:px-8 sm:py-4 h-auto rounded-full w-full sm:w-auto border-0"
                >
                  Join Waitlist
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="btn-secondary-premium text-primary text-base sm:text-lg px-7 py-3.5 sm:px-8 sm:py-4 h-auto rounded-full w-full sm:w-auto"
                >
                  <Link href="mailto:sales@komalkids.com">Talk to Us</Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div
              className="flex justify-center items-center opacity-0"
              style={{ animation: "phoneEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards" }}
            >
              <div className="relative animate-float" style={{ animationDuration: "8s" }}>
                {/* Subtle glow behind image */}
                <div
                  className="absolute inset-0 rounded-full blur-3xl opacity-20"
                  style={{
                    background: "radial-gradient(circle, rgba(107, 78, 113, 0.4) 0%, transparent 70%)",
                    transform: "scale(0.8)",
                  }}
                />
                <Image
                  src="/heroimage.png"
                  alt="Komal Digital Guardian"
                  width={1200}
                  height={1200}
                  className="w-full max-w-[400px] sm:max-w-[450px] md:max-w-[520px] lg:max-w-[580px] xl:max-w-[640px] h-auto relative z-10"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Talk, Don't Tap - Full-width section */}
      <section className="w-full bg-primary py-12 md:py-16 relative overflow-hidden" id="how-it-works">
        {/* Floating orbs for this section */}
        <div className="absolute inset-0 opacity-30">
          <FloatingOrbs count={3} />
        </div>



        <div className="container max-w-[900px] px-8 mx-auto text-center relative z-10">
          {/* Main Headline */}
          <ScrollReveal>
            <h2 className="section-title text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-bold text-white mb-4 tracking-tight text-center leading-[1.15]">
              Talk, Don&apos;t{" "}
              <span className="relative inline-block">
                <span className="tap-bounce inline-block">Tap</span>
                {/* Pointing finger emoji */}
                <span
                  className="tapping-finger absolute -right-2 -bottom-1 sm:-right-3 sm:-bottom-2 text-xl sm:text-2xl md:text-3xl pointer-events-none z-10 select-none"
                  style={{ transformOrigin: 'left top' }}
                >
                  👆
                </span>
                {/* Tap ripple effect */}
                <span className="tap-ripple absolute right-0 bottom-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/40 pointer-events-none" />
              </span>
            </h2>
          </ScrollReveal>

          {/* Tagline */}
          <ScrollReveal delay={0.1}>
            <p className="text-[9px] sm:text-[10px] md:text-[13px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/80 font-medium mb-8 text-center">
              THE WORLD&apos;S FIRST <strong>NON-ADDICTIVE, HANDS-FREE</strong> DIGITAL GUARDIAN
            </p>
          </ScrollReveal>

          {/* Core Value Proposition */}
          <ScrollReveal delay={0.2}>
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-[700px] mx-auto text-center mb-6">
              Traditional apps measure completion, not cognition or feelings.<br /> <span className="text-white font-medium">Komal reads behaviour in real-time</span>—attention patterns, emotional responses, and engagement quality—and adapts instantly.
            </p>
          </ScrollReveal>

          {/* Secondary explanation */}
          <ScrollReveal delay={0.3}>
            <p className="text-sm sm:text-base md:text-lg text-white/70 leading-relaxed max-w-[600px] mx-auto text-center mb-10">
              AI-powered insights delivered daily.
            </p>
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal delay={0.4}>
            <Button asChild size="lg" className="btn-primary-premium-inverted rounded-full px-8 py-3.5 h-auto border-0">
              <Link href="/the-magic">See How It Works</Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>

      {/* Age-Appropriate Access Section */}
      <section className="w-full bg-white py-12 md:py-16" id="content-safety">
        <div className="container max-w-[1100px] px-8 mx-auto">
          {/* Section Header */}
          <ScrollReveal>
            <div className="text-center mb-10">
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4 inline-block">
                Age-Appropriate Access
              </span>
              <h2 className="section-title text-[28px] sm:text-[36px] md:text-[44px] font-bold text-primary mb-4 tracking-tight text-center leading-[1.15]">
                Kids Need the Internet,<br />But Not All of It
              </h2>
              <p className="text-base sm:text-lg text-text-dim leading-relaxed max-w-[700px] mx-auto text-center">
                What is fine for an adult can be confusing, scary, or harmful for a child. Komal applies age-based access across content types, using clear rules and context rather than blanket bans.
              </p>
            </div>
          </ScrollReveal>

          {/* Three Principles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <ScrollReveal delay={0}>
              <div className="bg-[#F5F0FF] rounded-2xl p-6 text-center h-full hover:scale-[1.02] hover:shadow-lg transition-all duration-500">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">MINDFULNESS</h3>
                <p className="text-sm text-text-dim">Context-aware filtering that understands the difference between education and harm.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="bg-[#E8F5E9] rounded-2xl p-6 text-center h-full hover:scale-[1.02] hover:shadow-lg transition-all duration-500">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">MODERATION</h3>
                <p className="text-sm text-text-dim">Not binary—Block, Gate, or Allow based on age, context, and parent preferences.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="bg-[#FFF8E1] rounded-2xl p-6 text-center h-full hover:scale-[1.02] hover:shadow-lg transition-all duration-500">
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">MEANINGFUL</h3>
                <p className="text-sm text-text-dim">Growing access as children grow, keeping parents informed and in control.</p>
              </div>
            </ScrollReveal>
          </div>

          {/* Block / Gate / Allow Visual */}
          <ScrollReveal delay={0.2}>
            <div className="bg-[#F5F5F7] rounded-3xl p-6 md:p-8 mb-8">
              <h3 className="text-xl md:text-2xl font-semibold text-primary text-center mb-6">Instead of Binary Blocking</h3>
              <div className="grid grid-cols-3 gap-3 md:gap-6">
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center hover:scale-105 hover:shadow-lg hover:shadow-red-200/50 transition-all duration-500 cursor-default">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-float" style={{ animationDelay: "0s" }}>
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-red-600 text-sm md:text-base mb-1">BLOCK</h4>
                  <p className="text-xs md:text-sm text-text-dim">Content not accessible</p>
                </div>
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-center hover:scale-105 hover:shadow-lg hover:shadow-amber-200/50 transition-all duration-500 cursor-default">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-float" style={{ animationDelay: "0.5s" }}>
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 9v4" />
                      <circle cx="12" cy="17" r="1" fill="currentColor" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-amber-600 text-sm md:text-base mb-1">GATE</h4>
                  <p className="text-xs md:text-sm text-text-dim">Warning, delay, or parent approval</p>
                </div>
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center hover:scale-105 hover:shadow-lg hover:shadow-green-200/50 transition-all duration-500 cursor-default">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-float" style={{ animationDelay: "1s" }}>
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-green-600 text-sm md:text-base mb-1">ALLOW</h4>
                  <p className="text-xs md:text-sm text-text-dim">Unrestricted access</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal delay={0.3}>
            <div className="text-center">
              <Button asChild size="lg" className="btn-primary-premium text-white rounded-full px-8 py-3.5 h-auto border-0">
                <Link href="/content-safety">See Full Content Guide</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Komal: Your Best Section */}
      <KomalYourBestSection />

      {/* Key Features Section */}
      <section className="features-section py-12 md:py-16 bg-white">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 text-center">
            {/* Feature 1: 100% Hands-Free */}
            <ScrollReveal delay={0} direction="up">
              <div className="flex flex-col items-center group">
                <div className="flex gap-1 mb-4 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-5 h-5 text-primary animate-pulse" style={{ animationDuration: "3s" }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                  </svg>
                  <svg className="w-5 h-5 text-primary animate-pulse" style={{ animationDuration: "3s", animationDelay: "0.5s" }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-primary mb-2">
                  100% Hands-Free
                </h3>
                <p className="text-sm md:text-base text-text-dim leading-relaxed text-center">
                  Minimal clicks; just talk.<br />
                  Behavioural infra at scale.
                </p>
              </div>
            </ScrollReveal>

            {/* Feature 2: Dynamic Content */}
            <ScrollReveal delay={0.15} direction="up">
              <div className="flex flex-col items-center group">
                <div className="flex gap-1 mb-4 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-5 h-5 text-primary animate-pulse" style={{ animationDuration: "3s" }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                  </svg>
                  <svg className="w-5 h-5 text-primary animate-pulse" style={{ animationDuration: "3s", animationDelay: "0.3s" }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                  </svg>
                  <svg className="w-5 h-5 text-primary animate-pulse" style={{ animationDuration: "3s", animationDelay: "0.6s" }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-primary mb-2">
                  Dynamic Content
                </h3>
                <p className="text-sm md:text-base text-text-dim leading-relaxed text-center">
                  First child-safe LLM to meet<br />
                  the child where they are.
                </p>
              </div>
            </ScrollReveal>

            {/* Feature 3: Longitudinal AI */}
            <ScrollReveal delay={0.3} direction="up">
              <div className="flex flex-col items-center group">
                <div className="flex gap-1 mb-4 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-5 h-5 text-primary animate-pulse" style={{ animationDuration: "3s" }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                  </svg>
                  <svg className="w-5 h-5 text-primary animate-pulse" style={{ animationDuration: "3s", animationDelay: "0.5s" }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-primary mb-2">
                  Longitudinal AI
                </h3>
                <p className="text-sm md:text-base text-text-dim leading-relaxed text-center">
                  Learn milestones missed,<br />
                  partially hit, and risks identified.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Sleek divider line */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-violet-200/60 to-transparent" />

      {/* Partners Section - Trust through Institutional Legitimacy */}
      <section className="partners-section pt-4 pb-0 md:py-12 bg-white overflow-hidden relative">
        <div className="partners-container max-w-[1400px] mx-auto px-6 md:px-16">
          <ScrollReveal>
            <h2 className="partners-title text-[22px] sm:text-[24px] md:text-[28px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#1e3a5f] mb-8 md:mb-16 font-semibold text-center">OUR ECOSYSTEM</h2>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <PartnersCarousel />
          </ScrollReveal>

        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials mt-0 md:mt-4 py-10 md:py-16 bg-white relative overflow-hidden">
        {/* Background Image with padding and curved borders */}
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none p-4 md:p-6">
          <div className="w-full h-full max-w-[1400px] overflow-hidden rounded-3xl">
            <Image
              src="/hero-kids.jpg"
              alt=""
              width={1400}
              height={900}
              className="w-full h-full object-cover object-bottom"
            />
          </div>
        </div>
        <div className="container text-center max-w-[1240px] px-8 mx-auto relative z-10">
          {/* Text heading */}
          <ScrollReveal>
            <div className="relative w-full mt-4 mb-6">
              <h2
                className="section-title font-sans text-[22vw] sm:text-[12vw] md:text-[9vw] lg:text-[8vw] font-bold leading-[1.1] tracking-[-0.02em] text-center w-full text-white"
              >What Parents Love</h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <TestimonialsCarousel testimonials={testimonials} />
          </ScrollReveal>
        </div>
      </section>


      {/* Phone Showcase Section - HIDDEN FOR NOW
      <section className="phone-showcase py-16 md:py-24 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
        <div className="container max-w-[1400px] px-4 mx-auto">
          <div className="relative flex justify-center items-end h-[400px] sm:h-[500px] md:h-[600px]">
            <div
              className="absolute w-[160px] sm:w-[200px] md:w-[240px] h-[340px] sm:h-[420px] md:h-[500px] overflow-hidden rounded-[24px] sm:rounded-[32px] shadow-2xl transition-transform duration-300 hover:scale-105"
              style={{
                left: 'calc(50% - 280px)',
                bottom: '-80px',
                transform: 'translateX(-50%)',
                zIndex: 1,
                clipPath: 'inset(0 0 25% 0)',
              }}
            >
              <Image
                src="/finaliphone.png"
                alt="Komal App Screenshot"
                width={400}
                height={800}
                className="w-full h-auto object-cover object-top"
              />
            </div>
            <div
              className="absolute w-[160px] sm:w-[200px] md:w-[240px] h-[360px] sm:h-[450px] md:h-[540px] overflow-hidden rounded-[24px] sm:rounded-[32px] shadow-2xl transition-transform duration-300 hover:scale-105"
              style={{
                left: 'calc(50% - 140px)',
                bottom: '-40px',
                transform: 'translateX(-50%)',
                zIndex: 3,
                clipPath: 'inset(0 0 25% 0)',
              }}
            >
              <Image
                src="/finaliphone.png"
                alt="Komal App Screenshot"
                width={400}
                height={800}
                className="w-full h-auto object-cover object-top"
              />
            </div>
            <div
              className="absolute w-[180px] sm:w-[220px] md:w-[280px] h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden rounded-[24px] sm:rounded-[32px] shadow-2xl transition-transform duration-300 hover:scale-105"
              style={{
                left: '50%',
                bottom: '0',
                transform: 'translateX(-50%)',
                zIndex: 5,
                clipPath: 'inset(0 0 25% 0)',
              }}
            >
              <Image
                src="/finaliphone.png"
                alt="Komal App Screenshot"
                width={400}
                height={800}
                className="w-full h-auto object-cover object-top"
              />
            </div>
            <div
              className="absolute w-[160px] sm:w-[200px] md:w-[240px] h-[360px] sm:h-[450px] md:h-[540px] overflow-hidden rounded-[24px] sm:rounded-[32px] shadow-2xl transition-transform duration-300 hover:scale-105"
              style={{
                left: 'calc(50% + 140px)',
                bottom: '-40px',
                transform: 'translateX(-50%)',
                zIndex: 3,
                clipPath: 'inset(0 0 25% 0)',
              }}
            >
              <Image
                src="/finaliphone.png"
                alt="Komal App Screenshot"
                width={400}
                height={800}
                className="w-full h-auto object-cover object-top"
              />
            </div>
            <div
              className="absolute w-[160px] sm:w-[200px] md:w-[240px] h-[340px] sm:h-[420px] md:h-[500px] overflow-hidden rounded-[24px] sm:rounded-[32px] shadow-2xl transition-transform duration-300 hover:scale-105"
              style={{
                left: 'calc(50% + 280px)',
                bottom: '-80px',
                transform: 'translateX(-50%)',
                zIndex: 1,
                clipPath: 'inset(0 0 25% 0)',
              }}
            >
              <Image
                src="/finaliphone.png"
                alt="Komal App Screenshot"
                width={400}
                height={800}
                className="w-full h-auto object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>
      */}

      {/* Advisors Section */}
      <AdvisorsSection />

      {/* For Schools & Therapists */}
      <section className="enterprise-cta pt-8 pb-12 md:py-16 bg-primary text-white text-center relative overflow-hidden" id="for-schools">
        {/* Ambient floating orbs */}
        <div className="absolute inset-0 opacity-20">
          <FloatingOrbs count={3} />
        </div>
        <div className="container max-w-[900px] px-8 mx-auto text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-[24px] sm:text-3xl md:text-[36px] lg:text-4xl font-sans font-bold mb-6 text-center">For Schools, Daycares, <br /> and Paediatric Practices</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-lg opacity-90 leading-relaxed mb-8  text-center">
              Komal integrates seamlessly into your existing workflow. No new systems to learn—just plug into the insights
              parents already trust. Get classroom-level analytics, SEL compliance dashboards, and early risk identification
              without disrupting your current processes.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="flex gap-4 justify-center flex-wrap mt-8">
              <Button asChild size="lg" className="btn-primary-premium-inverted rounded-full px-8 py-3.5 h-auto border-0">
                <Link href="mailto:sales@komalkids.com">Request Demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="btn-secondary-premium-inverted rounded-full px-8 py-3.5 h-auto">
                <Link href="mailto:sales@komalkids.com">Learn More</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>



      <div className="section-divider h-3 w-full bg-primary" />

      {/* FAQ */}
      <section className="faq py-8 md:py-16 bg-surface">
        <div className="container max-w-[1240px] px-8 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-12 lg:gap-24 items-start">
          <div className="lg:col-span-5">
            <ScrollReveal direction="left">
              <h2 className="section-title font-sans text-[24px] sm:text-[32px] md:text-[38px] lg:text-[42px] font-bold mb-4 md:mb-6 leading-[1.15] tracking-[-0.02em] text-primary text-left">Frequently Asked Questions</h2>
              <p className="section-description text-lg text-text-dim mb-2 md:mb-8 leading-relaxed text-left">
                Let Komal take the drudgery out of parenting.
              </p>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-7">
            <ScrollReveal direction="right" delay={0.1}>
              <FaqAccordion items={faqs} defaultOpen={0} />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta py-10 md:py-20 text-center bg-primary text-white text-center relative overflow-hidden">
        {/* Ambient floating orbs */}
        <div className="absolute inset-0 opacity-15">
          <FloatingOrbs count={4} />
        </div>
        <div className="container max-w-[1240px] px-8 mx-auto text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-[24px] sm:text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-6 text-center">
              <TextShimmer duration={4}>Ready to Understand Your Child Better?</TextShimmer>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-xl opacity-90 mb-10 text-center ">Start your free trial today—no credit card required.</p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <Button
              onClick={() => setIsWaitlistOpen(true)}
              size="lg"
              className="btn-primary-premium-inverted text-lg px-8 py-5 h-auto rounded-full border-0"
            >
              Join Waitlist
            </Button>
          </ScrollReveal>
        </div>
      </section>
      <ScrollReveal>
        <div className="my-6 text-center">
          <p className="text-text-dim/60 text-[10px] leading-relaxed  mx-auto">
            Disclaimer: All logos, trademarks, and brand names displayed on this website are the property of their respective owners. Their use does not imply any affiliation with, endorsement by, or sponsorship of Komal (ChildCog Private Limited).
          </p>
        </div>
      </ScrollReveal>

      {/* Waitlist Modal */}
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </>
  );
}
