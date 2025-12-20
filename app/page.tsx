"use client";

import { useRef } from "react";
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
import KomalYourBestSection from "@/components/KomalYourBestSection";
import SplitText from "@/components/SplitText";

export default function Home() {

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
        "As a teacher, I've seen many learning apps. KOMAL is different—it actually adapts to each child in real-time.",
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
      question: "What is KOMAL?",
      answer:
        "KOMAL is a hyper-personalized learning companion for children ages 3-12 that uses real-time behavioral AI to understand how your child feels and learns. Unlike traditional apps that only track clicks, KOMAL reads gaze patterns, touch interactions, and micro-expressions to adapt learning moment-by-moment.",
    },
    {
      question: "How does KOMAL protect my child's privacy?",
      answer:
        "All AI processing happens on-device—your child's data never leaves your device without explicit consent. Parents control what’s shared, and we never sell data or use it for advertising.",
    },
    {
      question: "Does KOMAL diagnose my child?",
      answer:
        "No. KOMAL provides insights and understanding, not medical or psychological diagnoses. We never label, categorize, or make diagnostic claims.",
    },
    {
      question: "What age is KOMAL designed for?",
      answer:
        "KOMAL is designed for children ages 3-12. The AI adapts to each child's developmental stage, learning style, and individual needs.",
    },
    {
      question: "How does the real-time adaptation work?",
      answer:
        "KOMAL processes behavioral signals in real-time (under ~200ms). When your child hesitates, shows frustration, or loses attention, the app adapts pacing, tone, and difficulty automatically.",
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
      question: "Does KOMAL work offline?",
      answer: "Yes. Core learning features and real-time adaptation work offline; internet is only needed for syncing and report delivery (if you enable it).",
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
              "The world's first AI companion that reads how a child feels, not just what they click. Hyper-personalized learning platform for children ages 3-12.",
            screenshot: "https://komal.ai/screenshot.jpg",
            featureList:
              "Real-time behavioral AI, Personalized learning, Parent insights, Privacy-first design",
          }),
        }}
      />

      {/* Hero Section */}
      <section className="hero-section relative pt-32 pb-16 px-6 md:px-16 overflow-hidden">
        {/* Aurora Background */}
        <div className="absolute inset-0 z-0">
          <FloatingButterflies count={25} />
        </div>
        {/* White gradient overlay at bottom for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent z-[1]" />

        <div className="hero-container max-w-[1200px] mx-auto flex flex-col items-center relative z-[2]">
          {/* Text Content - Above Image */}
          <div className="hero-content text-center mb-12 md:mb-16">
            {/* Yale Scientists Badge */}
            <style dangerouslySetInnerHTML={{
              __html: `
              @keyframes marchDash {
                to { stroke-dashoffset: -20; }
              }
              @keyframes spinDiamond {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              .marching-border {
                animation: marchDash 1s linear infinite;
              }
              .spinning-diamond {
                animation: spinDiamond 3s linear infinite;
              }
            `}} />
            <div className="yale-badge-wrapper relative inline-flex mb-6 animate-[fadeDown_0.8s_ease_forwards]">
              {/* Marching Dotted Border - SVG overlay */}
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
              <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5">
                {/* Spinning 4-pointed Diamond/Sparkle SVG */}
                <svg
                  className="w-3.5 h-3.5 text-primary spinning-diamond"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0L15 9L24 12L15 15L12 24L9 15L0 12L9 9L12 0Z" />
                </svg>
                {/* Badge Text */}
                <span className="font-sans text-sm font-medium text-primary tracking-wide">
                  Grounded in Yale Research
                </span>
              </div>
            </div>

            <h1 className="hero-title font-sans text-[42px] sm:text-[48px] md:text-[60px] lg:text-[72px] font-light leading-[1.2] tracking-[-0.02em] text-primary normal-case flex flex-col items-center text-center">
              {/* Line 1: A learning companion */}
              <span className="flex flex-wrap justify-center items-baseline gap-x-[0.25em]">
                <SplitText
                  text="A"
                  tag="span"
                  className="inline-block"
                  delay={50}
                  duration={0.6}
                  ease="power3.out"
                  splitType="words"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  initialDelay={0}
                />
                <span className="text-primary font-semibold inline-block hover:animate-[wiggle_0.3s_ease-in-out] cursor-pointer hero-highlight hero-highlight-1">
                  <SplitText
                    text="learning companion"
                    tag="span"
                    className="inline-block"
                    delay={50}
                    duration={0.6}
                    ease="power3.out"
                    splitType="words"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    staggerChildren={0.1}
                    initialDelay={0.1}
                  />
                </span>
              </span>
              {/* Line 2: that understands how children feel. */}
              <span className="flex flex-wrap justify-center items-baseline gap-x-[0.25em]">
                <SplitText
                  text="that understands how"
                  tag="span"
                  className="inline-block"
                  delay={50}
                  duration={0.6}
                  ease="power3.out"
                  splitType="words"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  staggerChildren={0.1}
                  initialDelay={0.35}
                />
              </span>
              {/* Line 3: children feel. */}
              <span className="flex flex-wrap justify-center items-baseline gap-x-[0.25em]">
                <SplitText
                  text="children"
                  tag="span"
                  className="inline-block"
                  delay={50}
                  duration={0.6}
                  ease="power3.out"
                  splitType="words"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  initialDelay={0.6}
                />
                <span className="text-primary font-semibold inline-block hover:animate-[vibrate_0.5s_ease-in-out] cursor-pointer hero-highlight hero-highlight-2">
                  <SplitText
                    text="feel."
                    tag="span"
                    className="inline-block"
                    delay={50}
                    duration={0.6}
                    ease="power3.out"
                    splitType="words"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    initialDelay={0.7}
                  />
                </span>
              </span>
            </h1>

            {/* CTA Buttons */}
            <div className="cta-group flex gap-4 justify-center mt-8 animate-[fadeDown_1s_ease_forwards]" style={{ animationDelay: "0.2s" }}>
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 hover:scale-105 text-white text-sm sm:text-base md:text-lg px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 h-auto rounded-full shadow-lg transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]"
              >
                <Link href="#">Get Free AI Report</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/5 hover:scale-105 text-primary text-sm sm:text-base md:text-lg px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 h-auto rounded-full transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]"
              >
                <Link href="#contact">Talk to Us</Link>
              </Button>
            </div>
          </div>

          {/* Image Gallery - Below Text with Scroll Animation */}
          <HeroImageGallery />
        </div>
      </section>

      {/* Core Explainer Section - Talk, Don't Tap + Understanding Beyond Clicks (merged) */}
      <section className="core-explainer pt-4 pb-16 bg-gradient-to-b from-white via-gray-50 to-white" id="how-it-works">
        <div className="container max-w-[900px] px-8 mx-auto text-center">
          {/* Main Headline */}
          <h2 className="section-title text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-light text-primary mb-4 tracking-tight text-center leading-[1.15]">
            Talk, Don&apos;t Tap
          </h2>

          {/* Tagline */}
          <p className="text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-secondary font-medium mb-8 text-center">
            THE WORLD&apos;S FIRST NON-ADDICTIVE, HANDS-FREE CHILD COMPANION
          </p>

          {/* Core Value Proposition */}
          <p className="text-base sm:text-lg md:text-xl text-text-dim leading-relaxed max-w-[700px] mx-auto text-center mb-6">
            Traditional apps measure completion, not cognition.<br /> <span className="text-primary font-medium">KOMAL reads behavior in real-time</span>—attention patterns, emotional responses, and engagement quality—and adapts instantly.
          </p>

          {/* Secondary explanation */}
          <p className="text-sm sm:text-base md:text-lg text-text-dim/80 leading-relaxed max-w-[600px] mx-auto text-center mb-10">
            AI-powered insights delivered daily.
          </p>

          {/* CTA */}
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="#">See How It Works</Link>
          </Button>
        </div>
      </section>

      {/* Komal: Your Best Section */}
      <KomalYourBestSection />

      {/* Partners Section - Trust through Institutional Legitimacy */}
      <section className="partners-section py-20 md:py-20 bg-white overflow-hidden relative">
        <div className="partners-container max-w-[1400px] mx-auto px-6 md:px-16">
          <h2 className="partners-title text-[22px] sm:text-[24px] md:text-[28px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#1e3a5f] mb-8 md:mb-16 font-semibold text-center animate-[fadeDown_1s_ease_forwards]">OUR ECOSYSTEM</h2>

          <PartnersCarousel />

        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials py-14 bg-white relative overflow-hidden">
        {/* Background Image with padding and curved borders */}
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none p-4 md:p-6">
          <div className="w-full h-full max-w-[1400px] overflow-hidden rounded-3xl">
            <Image
              src="/hero-kids.jpg"
              alt=""
              width={1400}
              height={900}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="container text-center max-w-[1240px] px-8 mx-auto relative z-10">
          <h2 className="section-title font-sans text-[26px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-normal mb-6 leading-[1.15] tracking-[-0.02em] text-white text-center drop-shadow-lg bg-primary px-6 py-3 rounded-full inline-block mx-auto">What Parents Love</h2>
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>


      {/* Advisors Section */}
      <AdvisorsSection />

      {/* For Schools & Therapists */}
      <section className="enterprise-cta py-24 bg-primary text-white text-center" id="for-schools">
        <div className="container max-w-[900px] px-8 mx-auto text-center">
          <h2 className="text-[24px] sm:text-3xl md:text-[36px] lg:text-4xl font-sans font-light mb-6 text-center">For Schools, Daycares, and Paediatric Practices</h2>
          <p className="text-lg opacity-90 leading-relaxed mb-8  text-center">
            KOMAL integrates seamlessly into your existing workflow. No new systems to learn—just plug into the insights
            parents already trust. Get classroom-level analytics, SEL compliance dashboards, and early risk identification
            without disrupting your current processes.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mt-8">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8">
              <Link href="#contact">Request Demo</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white rounded-full px-8">
              <Link href="#for-therapists">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>



      <div className="section-divider h-3 w-full bg-primary" />

      {/* FAQ */}
      <section className="faq py-24 bg-surface">
        <div className="container max-w-[1240px] px-8 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          <div className="lg:col-span-5">
            <h2 className="section-title font-sans text-[24px] sm:text-[32px] md:text-[38px] lg:text-[42px] font-normal mb-6 leading-[1.15] tracking-[-0.02em] text-primary text-left">Frequently Asked Questions</h2>
            <p className="section-description text-lg text-text-dim mb-8 leading-relaxed text-left">
              Explore your data, build your dashboard, bring your team together.
            </p>
          </div>
          <div className="lg:col-span-7">
            <FaqAccordion items={faqs} defaultOpen={0} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta py-32  text-center bg-primary text-white text-center">
        <div className="container max-w-[1240px] px-8 mx-auto text-center">
          <h2 className="text-[24px] sm:text-3xl md:text-4xl lg:text-5xl font-sans font-light mb-6 text-center">Ready to Understand Your Child Better?</h2>
          <p className="text-xl opacity-90 mb-10 text-center ">Start your free trial today—no credit card required.</p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto rounded-full">
            <Link href="#">Start Free Trial</Link>
          </Button>
        </div>
      </section>
      <div className="my-6 text-center">
        <p className="text-text-dim/60 text-[10px] leading-relaxed  mx-auto">
          Disclaimer: All logos, trademarks, and brand names displayed on this website are the property of their respective owners. Their use does not imply any affiliation with, endorsement by, or sponsorship of KOMAL (ChildCog Private Limited).
        </p>
      </div>
    </>
  );
}
