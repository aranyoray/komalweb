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
      <section className="hero-section relative pt-8 md:pt-12 pb-12 overflow-hidden min-h-[75vh] flex flex-col justify-center">
        {/* Floating Dots Background - Behind butterflies */}
        <div className="absolute inset-0 z-0">
          <FloatingDots />
        </div>



        {/* Floating Butterflies Background */}
        <div className="absolute inset-0 z-[1]">
          <FloatingButterflies count={25} />
        </div>


        <div className="hero-container w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-center relative z-[2] px-8 md:px-16 lg:px-24">
          {/* Left Column - Text Content */}
          <div className="hero-content flex flex-col items-center lg:items-start justify-center text-center lg:text-left order-1 lg:order-1 pt-16 lg:pt-0 pb-0 px-4 lg:p-12">
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
              <span className="whitespace-nowrap">The{' '}
                <span className="font-semibold hover:animate-[wiggle_0.3s_ease-in-out] cursor-pointer hero-highlight hero-highlight-1">
                  learning companion
                </span></span>
              <br />
              <span className="whitespace-nowrap">that adapts to how</span>
              <br />
              <span className="whitespace-nowrap">children{' '}
                <span className="font-semibold hover:animate-[vibrate_0.5s_ease-in-out] cursor-pointer hero-highlight hero-highlight-2">
                  feel.
                </span></span>
            </h1>

            {/* CTA Buttons */}
            <div className="cta-group flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mt-8 w-full sm:w-auto animate-[fadeDown_1s_ease_forwards]" style={{ animationDelay: "0.2s" }}>
              <Button
                onClick={() => setIsWaitlistOpen(true)}
                size="lg"
                className="bg-primary hover:bg-primary/90 hover:scale-105 text-white text-xl sm:text-lg md:text-xl lg:text-2xl px-8 py-4 sm:px-6 sm:py-3 md:px-8 md:py-4 h-auto rounded-full shadow-lg transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] w-full sm:w-auto"
              >
                Join Waitlist
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/5 hover:scale-105 text-primary text-xl sm:text-lg md:text-xl lg:text-2xl px-8 py-4 sm:px-6 sm:py-3 md:px-8 md:py-4 h-auto rounded-full transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] w-full sm:w-auto"
              >
                <Link href="mailto:sales@komalkids.com">Talk to Us</Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="hero-image flex justify-center items-center order-2 lg:order-2 pt-0 pb-0 lg:py-0" style={{ animation: "phoneEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
            <Image
              src="/heroimage.png"
              alt="Komal Learning Companion"
              width={1200}
              height={1200}
              className="w-full max-w-[500px] sm:max-w-[550px] md:max-w-[700px] lg:max-w-[800px] xl:max-w-[900px] h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* Talk, Don't Tap - Full-width section */}
      <section className="w-full bg-primary py-12 md:py-16" id="how-it-works">
        <div className="container max-w-[900px] px-8 mx-auto text-center">
          {/* Main Headline */}
          <h2 className="section-title text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-bold text-white mb-4 tracking-tight text-center leading-[1.15]">
            Talk, Don&apos;t Tap
          </h2>

          {/* Tagline */}
          <p className="text-[9px] sm:text-[10px] md:text-[13px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/80 font-medium mb-8 text-center">
            THE WORLD&apos;S FIRST <strong>NON-ADDICTIVE, HANDS-FREE</strong> CHILD COMPANION
          </p>

          {/* Core Value Proposition */}
          <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-[700px] mx-auto text-center mb-6">
            Traditional apps measure completion, not cognition or feelings.<br /> <span className="text-white font-medium">Komal reads behaviour in real-time</span>—attention patterns, emotional responses, and engagement quality—and adapts instantly.
          </p>

          {/* Secondary explanation */}
          <p className="text-sm sm:text-base md:text-lg text-white/70 leading-relaxed max-w-[600px] mx-auto text-center mb-10">
            AI-powered insights delivered daily.
          </p>

          {/* CTA */}
          <Button asChild size="lg" className="rounded-full px-8 bg-white text-primary hover:bg-white/90">
            <Link href="/the-magic">See How It Works</Link>
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
                partially hit, and risks identified.
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
          <div className="relative w-full mt-4 mb-6">
            <h2
              className="section-title font-sans text-[22vw] sm:text-[12vw] md:text-[9vw] lg:text-[8vw] font-bold leading-[1.1] tracking-[-0.02em] text-center w-full text-white"
            >What Parents Love</h2>
          </div>
          <TestimonialsCarousel testimonials={testimonials} />
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
            <h2 className="section-title font-sans text-[24px] sm:text-[32px] md:text-[38px] lg:text-[42px] font-bold mb-4 md:mb-6 leading-[1.15] tracking-[-0.02em] text-primary text-left">Frequently Asked Questions</h2>
            <p className="section-description text-lg text-text-dim mb-2 md:mb-8 leading-relaxed text-left">
              Let Komal take the drudgery out of parenting.
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
