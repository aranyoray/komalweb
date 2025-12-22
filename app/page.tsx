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
        "Komal is a hyper-personalised learning companion for children ages 3-12 that uses real-time behavioural AI to understand how your child feels and learns. Unlike traditional apps that only track clicks, Komal reads gaze patterns, touch interactions, and micro-expressions to adapt learning moment-by-moment.",
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
              "The world's first AI companion that reads how a child feels, not just what they click. Hyper-personalised learning platform for children ages 3-12.",
            screenshot: "https://komal.ai/screenshot.jpg",
            featureList:
              "Real-time behavioural AI, Personalised learning, Parent insights, Privacy-first design",
          }),
        }}
      />

      {/* Hero Section */}
      <section className="hero-section relative pt-24 md:pt-32 pb-16 px-6 md:px-16 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        {/* Floating Dots Background - Behind butterflies */}
        <div className="absolute inset-0 z-0">
          <FloatingDots />
        </div>

        {/* Gradient fade overlay - fades dots to white at bottom */}
        <div
          className="absolute inset-0 z-[0] pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,0.85) 85%, white 100%)'
          }}
        />

        {/* Floating Butterflies Background */}
        <div className="absolute inset-0 z-[1]">
          <FloatingButterflies count={25} />
        </div>


        <div className="hero-container max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-8 items-start relative z-[2] w-full px-8 lg:px-16">
          {/* Left Column - Text Content */}
          <div className="hero-content text-center lg:text-left order-1 lg:order-1 pt-0 lg:pt-12 flex flex-col items-center lg:items-start">
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
              <div className="relative inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/5">
                {/* Spinning 4-pointed Diamond/Sparkle SVG */}
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary spinning-diamond"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0L15 9L24 12L15 15L12 24L9 15L0 12L9 9L12 0Z" />
                </svg>
                {/* Badge Text */}
                <span className="font-sans text-xs sm:text-sm font-medium text-primary tracking-wide">
                  Grounded in Yale Research
                </span>
              </div>
            </div>

            <h1 className="hero-title font-sans text-[38px] sm:text-[36px] md:text-[40px] lg:text-[48px] xl:text-[56px] font-bold leading-[1.15] tracking-[-0.02em] text-primary">
              <span className="whitespace-nowrap">A{' '}
                <span className="font-semibold hover:animate-[wiggle_0.3s_ease-in-out] cursor-pointer hero-highlight hero-highlight-1">
                  learning companion
                </span></span>
              <br />
              <span className="whitespace-nowrap">that understands how</span>
              <br />
              <span className="whitespace-nowrap">children{' '}
                <span className="font-semibold hover:animate-[vibrate_0.5s_ease-in-out] cursor-pointer hero-highlight hero-highlight-2">
                  feel.
                </span></span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-text-dim leading-relaxed mt-6 max-w-[500px] text-center lg:text-left animate-[fadeDown_1s_ease_forwards]" style={{ animationDelay: "0.1s" }}>
              The world&apos;s first AI companion that reads how a child feels, not just what they click.
            </p>

            {/* CTA Buttons */}
            <div className="cta-group flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mt-8 w-full sm:w-auto animate-[fadeDown_1s_ease_forwards]" style={{ animationDelay: "0.2s" }}>
              <Button
                onClick={() => setIsWaitlistOpen(true)}
                size="lg"
                className="bg-primary hover:bg-primary/90 hover:scale-105 text-white text-lg sm:text-base md:text-lg px-8 py-4 sm:px-6 sm:py-3 md:px-8 md:py-4 h-auto rounded-full shadow-lg transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] w-full sm:w-auto"
              >
                Join Waitlist
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/5 hover:scale-105 text-primary text-lg sm:text-base md:text-lg px-8 py-4 sm:px-6 sm:py-3 md:px-8 md:py-4 h-auto rounded-full transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] w-full sm:w-auto"
              >
                <Link href="mailto:sales@komalkids.com">Talk to Us</Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Phone Image */}
          <div className="hero-image flex justify-center lg:justify-center order-2 lg:order-2 mt-12 sm:mt-2 lg:-mt-12" style={{ animation: "phoneEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
            <div className="relative">
              {/* Purple accent blob behind phone */}
              <div className="absolute -right-8 -bottom-8 w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-[#270263] rounded-full blur-3xl opacity-25 z-0" />

              {/* Phone wrapper */}
              <div className="relative inline-block">

                <Image
                  src="/newfloatingphone.png"
                  alt="Komal App on Phone"
                  width={350}
                  height={420}
                  className="relative z-10 w-[260px] sm:w-[280px] md:w-[300px] lg:w-[330px] xl:w-[350px] h-auto drop-shadow-2xl"
                  priority
                />
              </div>

              {/* Sketch Card 1 - Top Left */}
              <div className="sketch-card absolute left-[-40px] lg:left-[-60px] top-[5%] z-30" style={{ animation: "cardPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s both" }}>
                <div className="rounded-xl p-3 lg:p-4 -rotate-3 w-[130px] lg:w-[150px] bg-[#FFFBEB] border-2 border-dashed border-amber-300" style={{ boxShadow: "2px 2px 0px #FCD34D" }}>
                  <h4 className="text-amber-900 font-medium text-xs lg:text-sm mb-1">they talk to it</h4>
                  <p className="text-amber-700/90 text-[9px] lg:text-[10px] leading-snug italic">no tapping, just chatting</p>
                </div>
              </div>

              {/* Sketch Card 2 - Top Right */}
              <div className="sketch-card absolute right-[-55px] lg:right-[-75px] top-[18%] z-30" style={{ animation: "cardPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.55s both" }}>
                <div className="rounded-xl p-3 lg:p-4 rotate-2 w-[125px] lg:w-[145px] bg-[#FDF2F8] border-2 border-dashed border-pink-300" style={{ boxShadow: "2px 2px 0px #F9A8D4" }}>
                  <h4 className="text-pink-900 font-medium text-xs lg:text-sm mb-1">not addictive</h4>
                  <p className="text-pink-700/90 text-[9px] lg:text-[10px] leading-snug italic">bonds like a real buddy</p>
                </div>
              </div>

              {/* Sketch Card 3 - Bottom Left */}
              <div className="sketch-card absolute left-[-45px] lg:left-[-65px] bottom-[22%] z-30" style={{ animation: "cardPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s both" }}>
                <div className="rounded-xl p-3 lg:p-4 rotate-1 w-[135px] lg:w-[155px] bg-[#ECFDF5] border-2 border-dashed border-emerald-300" style={{ boxShadow: "2px 2px 0px #6EE7B7" }}>
                  <h4 className="text-emerald-900 font-medium text-xs lg:text-sm mb-1">a whole village</h4>
                  <p className="text-emerald-700/90 text-[9px] lg:text-[10px] leading-snug italic">40+ characters</p>
                </div>
              </div>

              {/* Sketch Card 4 - Bottom Right */}
              <div className="sketch-card absolute right-[-50px] lg:right-[-70px] bottom-[12%] z-30" style={{ animation: "cardPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.85s both" }}>
                <div className="rounded-xl p-3 lg:p-4 -rotate-2 w-[130px] lg:w-[150px] bg-[#F5F3FF] border-2 border-dashed border-purple-300" style={{ boxShadow: "2px 2px 0px #C4B5FD" }}>
                  <h4 className="text-purple-900 font-medium text-xs lg:text-sm mb-1">fewer tantrums</h4>
                  <p className="text-purple-700/90 text-[9px] lg:text-[10px] leading-snug italic">calmer evenings</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Talk, Don't Tap - Now part of hero section */}
        <div className="container max-w-[900px] px-8 mx-auto text-center mt-16 relative z-[2]" id="how-it-works">
          {/* Main Headline */}
          <h2 className="section-title text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-bold text-primary mb-4 tracking-tight text-center leading-[1.15]">
            Talk, Don&apos;t Tap
          </h2>

          {/* Tagline */}
          <p className="text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-secondary font-medium mb-8 text-center">
            THE WORLD&apos;S FIRST NON-ADDICTIVE, HANDS-FREE CHILD COMPANION
          </p>

          {/* Core Value Proposition */}
          <p className="text-base sm:text-lg md:text-xl text-text-dim leading-relaxed max-w-[700px] mx-auto text-center mb-6">
            Traditional apps measure completion, not cognition.<br /> <span className="text-primary font-medium">Komal reads behaviour in real-time</span>—attention patterns, emotional responses, and engagement quality—and adapts instantly.
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

      {/* Key Features Section */}
      <section className="features-section py-12 md:py-16 bg-white">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 text-center">
            {/* Feature 1: 100% Hands-Free */}
            <div className="flex flex-col items-center">
              <div className="flex gap-1 mb-4">
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
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

            {/* Feature 2: Dynamic Content */}
            <div className="flex flex-col items-center">
              <div className="flex gap-1 mb-4">
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
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

            {/* Feature 3: Longitudinal AI */}
            <div className="flex flex-col items-center">
              <div className="flex gap-1 mb-4">
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-primary mb-2">
                Longitudinal AI
              </h3>
              <p className="text-sm md:text-base text-text-dim leading-relaxed text-center">
                Learn milestones missed,<br />
                partially hit, and risks identified<br />
                through our proprietary <span className="font-bold">Kurriculum</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sleek divider line */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-violet-200/60 to-transparent" />

      {/* Partners Section - Trust through Institutional Legitimacy */}
      <section className="partners-section pt-4 pb-0 md:py-12 bg-white overflow-hidden relative">
        <div className="partners-container max-w-[1400px] mx-auto px-6 md:px-16">
          <h2 className="partners-title text-[22px] sm:text-[24px] md:text-[28px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#1e3a5f] mb-8 md:mb-16 font-semibold text-center animate-[fadeDown_1s_ease_forwards]">OUR ECOSYSTEM</h2>

          <PartnersCarousel />

        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials mt-0 md:mt-4 py-4 md:py-8 bg-white relative overflow-hidden">
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
          <h2 className="section-title font-sans text-[24px] sm:text-[32px] md:text-[38px] lg:text-[42px] font-bold mt-4 mb-6 leading-[1.15] tracking-[-0.02em] text-primary text-center drop-shadow-lg bg-white px-6 py-3 rounded-full inline-block mx-auto">What Parents Love</h2>
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>


      {/* Advisors Section */}
      <AdvisorsSection />

      {/* For Schools & Therapists */}
      <section className="enterprise-cta pt-8 pb-12 md:py-16 bg-primary text-white text-center" id="for-schools">
        <div className="container max-w-[900px] px-8 mx-auto text-center">
          <h2 className="text-[24px] sm:text-3xl md:text-[36px] lg:text-4xl font-sans font-bold mb-6 text-center">For Schools, Daycares, <br /> and Paediatric Practices</h2>
          <p className="text-lg opacity-90 leading-relaxed mb-8  text-center">
            Komal integrates seamlessly into your existing workflow. No new systems to learn—just plug into the insights
            parents already trust. Get classroom-level analytics, SEL compliance dashboards, and early risk identification
            without disrupting your current processes.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mt-8">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8">
              <Link href="mailto:sales@komalkids.com">Request Demo</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white rounded-full px-8">
              <Link href="mailto:sales@komalkids.com">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>



      <div className="section-divider h-3 w-full bg-primary" />

      {/* FAQ */}
      <section className="faq py-8 md:py-16 bg-surface">
        <div className="container max-w-[1240px] px-8 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-12 lg:gap-24 items-start">
          <div className="lg:col-span-5">
            <h2 className="section-title font-sans text-[24px] sm:text-[32px] md:text-[38px] lg:text-[42px] font-normal mb-4 md:mb-6 leading-[1.15] tracking-[-0.02em] text-primary text-left">Frequently Asked Questions</h2>
            <p className="section-description text-lg text-text-dim mb-2 md:mb-8 leading-relaxed text-left">
              Explore your data, build your dashboard, bring your team together.
            </p>
          </div>
          <div className="lg:col-span-7">
            <FaqAccordion items={faqs} defaultOpen={0} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta py-10 md:py-20 text-center bg-primary text-white text-center">
        <div className="container max-w-[1240px] px-8 mx-auto text-center">
          <h2 className="text-[24px] sm:text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-6 text-center">Ready to Understand Your Child Better?</h2>
          <p className="text-xl opacity-90 mb-10 text-center ">Start your free trial today—no credit card required.</p>
          <Button
            onClick={() => setIsWaitlistOpen(true)}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto rounded-full"
          >
            Join Waitlist
          </Button>
        </div>
      </section>
      <div className="my-6 text-center">
        <p className="text-text-dim/60 text-[10px] leading-relaxed  mx-auto">
          Disclaimer: All logos, trademarks, and brand names displayed on this website are the property of their respective owners. Their use does not imply any affiliation with, endorsement by, or sponsorship of Komal (ChildCog Private Limited).
        </p>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </>
  );
}
