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
import { ChevronDown, UsersIcon } from "lucide-react";
import Aurora from "@/components/Aurora";
import FloatingButterflies from "@/components/FloatingButterflies";
import FloatingDots from "@/components/FloatingDots";
import KomalYourBestSection from "@/components/KomalYourBestSection";
import SplitText from "@/components/SplitText";


// Premium dynamic effects
import FloatingOrbs from "@/components/FloatingOrbs";
import NoiseOverlay from "@/components/NoiseOverlay";
import TextShimmer from "@/components/TextShimmer";
import ScrollReveal from "@/components/ScrollReveal";
import ParticleField from "@/components/ParticleField";


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
        "Komal is a hyper-personalized digital guardian for children ages 3-12 that uses real-time behavioral AI to understand how your child feels and learns. Unlike traditional apps that only track clicks, Komal reads gaze patterns, touch interactions, and micro-expressions to adapt learning moment-by-moment.",
    },
    {
      question: "How does Komal protect my child's privacy?",
      answer:
        "All AI processing happens on-device—your child's data never leaves your device without explicit consent. Parents control what’s shared, and we never sell data or use it for advertising.",
    },
    {
      question: "Does Komal diagnose my child?",
      answer:
        "No. Komal provides insights and understanding, not medical or psychological diagnoses. We never label, categorize, or make diagnostic claims.",
    },
    {
      question: "What age is Komal designed for?",
      answer:
        "Komal is designed for children ages 3-12. The AI adapts to each child's developmental stage, learning style, and individual needs.",
    },
    {
      question: "How does the real-time adaptation work?",
      answer:
        "Komal processes behavioral signals in real-time (under ~200ms). When your child hesitates, shows frustration, or loses attention, the app adapts pacing, tone, and difficulty automatically.",
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
      {/* Enhanced Schema.org Structured Data for SEO */}
      <Script
        id="software-application-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "KOMAL - Child Internet Safety App",
            alternateName: ["KOMAL Kids", "KOMAL Parental Control", "KOMAL Safe Browser"],
            operatingSystem: "Web, iOS, Android",
            applicationCategory: "LifestyleApplication",
            applicationSubCategory: "Parental Control",
            description:
              "AI-powered child internet safety app with smart content filtering, parental controls, and age-appropriate browsing. Protects children ages 3-12 online with real-time behavioral AI. COPPA, GDPR-K compliant.",
            screenshot: "https://komalkids.com/heroimage.png",
            featureList: [
              "Child Internet Safety",
              "Parental Control Dashboard",
              "Age-Appropriate Content Filtering",
              "Real-time Behavioral AI",
              "Safe Browsing for Kids",
              "Screen Time Management",
              "COPPA Compliant",
              "On-Device Privacy Processing",
              "Parent Insights & Reports",
              "Custom Content Rules"
            ],
            audience: {
              "@type": "PeopleAudience",
              suggestedMinAge: "3",
              suggestedMaxAge: "12",
              audienceType: "Children, Parents, Families"
            },
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock"
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "150",
              bestRating: "5",
              worstRating: "1"
            },
            publisher: {
              "@type": "Organization",
              name: "ChildCog Private Limited",
              url: "https://komalkids.com",
              logo: "https://komalkids.com/komaliconnobg.png"
            }
          }),
        }}
      />

      {/* Organization Schema for Brand Recognition */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "KOMAL",
            legalName: "ChildCog Private Limited",
            url: "https://komalkids.com",
            logo: "https://komalkids.com/komaliconnobg.png",
            description: "KOMAL is an AI-powered child internet safety platform that protects children online through smart content filtering and parental controls.",
            foundingDate: "2024",
            founders: [
              {
                "@type": "Person",
                name: "Aranyo Ray",
                jobTitle: "CEO"
              }
            ],
            contactPoint: {
              "@type": "ContactPoint",
              email: "play@komalkids.com",
              contactType: "customer service"
            },
            sameAs: [
              "https://twitter.com/komalkids",
              "https://linkedin.com/company/komalkids"
            ],
            areaServed: ["US", "IN", "CA", "GB", "AU"],
            knowsAbout: [
              "Child Internet Safety",
              "Parental Control Software",
              "Online Child Protection",
              "Content Filtering for Kids",
              "Digital Wellbeing for Children"
            ]
          }),
        }}
      />

      {/* WebSite Schema for Sitelinks Search Box */}
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "KOMAL - Child Internet Safety",
            url: "https://komalkids.com",
            description: "Protect your children online with KOMAL - the AI-powered child internet safety app.",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://komalkids.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }),
        }}
      />

      {/* FAQ Schema for Rich Results */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is Komal?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Komal is a hyper-personalized digital guardian for children ages 3-12 that uses real-time behavioral AI to understand how your child feels and learns. Unlike traditional apps that only track clicks, Komal reads gaze patterns, touch interactions, and micro-expressions to adapt learning moment-by-moment."
                }
              },
              {
                "@type": "Question",
                name: "How does Komal protect my child's privacy?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "All AI processing happens on-device—your child's data never leaves your device without explicit consent. Parents control what's shared, and we never sell data or use it for advertising. KOMAL is COPPA, GDPR-K, and DPDPA compliant."
                }
              },
              {
                "@type": "Question",
                name: "How does Komal filter age-inappropriate content?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Komal uses AI to analyze content across multiple signals—text, images, video, and audio—and matches it to age-appropriate rules. Instead of binary blocking, we use three actions: Block (not accessible), Gate (allowed with warning or approval), and Allow. This creates flexibility where educational content can be treated differently from harmful content."
                }
              },
              {
                "@type": "Question",
                name: "Can I customize what content my child sees?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Parents can block specific interests, URLs, or keywords. You can also adjust the default rules per child profile and receive notifications when blocked content is attempted. Parent rules always override the default settings."
                }
              },
              {
                "@type": "Question",
                name: "What age is Komal designed for?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Komal is designed for children ages 3-12. The AI adapts to each child's developmental stage, learning style, and individual needs."
                }
              },
              {
                "@type": "Question",
                name: "Is Komal a parental control app?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, Komal functions as an advanced parental control app with AI-powered content filtering, screen time management, and real-time child safety monitoring. It goes beyond traditional parental controls by understanding child behavior and adapting content in real-time."
                }
              }
            ]
          }),
        }}
      />

      {/* Global Premium Effects */}
      <NoiseOverlay opacity={0.025} />
      <ParticleField count={35} color="263, 50%, 40%" speed={0.2} connectDistance={80} />

      {/* Hero Section */}
      <section className="hero-section relative pt-24 md:pt-28 lg:pt-20 pb-12 md:pb-16 overflow-hidden min-h-[90vh] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">

        </div>
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
        <div className="hero-container w-full max-w-[1300px] mx-auto px-6 md:px-10 lg:px-12 relative z-[2]">
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
                <span className="relative inline-block text-[2.5rem] sm:text-[3.25rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[5rem] leading-[1.02] whitespace-nowrap hover:text-primary/80 transition-colors duration-300 opacity-0 animate-[fadeDown_0.6s_ease_forwards]" style={{ animationDelay: "0.5s" }}>
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
                  asChild
                  size="lg"
                  className="btn-primary-premium text-white text-base sm:text-lg px-7 py-3.5 sm:px-8 sm:py-4 h-auto rounded-full w-full sm:w-auto border-0"
                >
                  <Link href="mailto:play@komalkids.com">Start for free</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white text-primary border-primary border-2 hover:bg-primary/5 text-base sm:text-lg px-7 py-3.5 sm:px-8 sm:py-4 h-auto rounded-full w-full sm:w-auto transition-colors"
                >
                  <Link href="mailto:play@komalkids.com">Talk to Us</Link>
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
                  alt="Komal Digital Buddy"
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

      {/* Age-Appropriate Access Section */}
      <section className="mx-4 md:mx-10  mb-20 relative text-slate-900 py-12 md:py-16 rounded-[40px] overflow-hidden shadow-2xl ring-1 ring-slate-900/5" id="content-safety">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landingbg.png"
            alt="Section Background"
            fill
            className="object-cover opacity-50"
            quality={70}
          />
        </div>
        <div className="container max-w-[1100px] px-8 mx-auto text-slate-900 relative z-10">
          {/* Section Header */}
          <ScrollReveal>
            <div className=" text-slate-900 text-center mb-10">

              <h2 className="section-title text-[28px] sm:text-[36px] md:text-[44px] font-bold text-slate-900 mb-4 tracking-tight text-center leading-[1.15]">
                Kids Need the Internet,<br />But Not All of It
              </h2>
              <p className="text-slate-700 sm:text-lg leading-relaxed max-w-[700px] mx-auto text-center">
                Online media can be confusing, scary, or harmful for a child. Komal helps you set up age-based access across 30+ content types, with clear rules rather than blanket bans.
              </p>
            </div>
          </ScrollReveal>

        </div>

        {/* Full Width Grid Wrapper */}
        <div className="w-full mb-10 px-4 md:px-8">
          <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(180px,auto)] gap-4 md:gap-6">

            {/* --- Left Column (Span 3) --- */}

            {/* Emotional Safety */}
            <ScrollReveal delay={0.4} className="md:col-span-3 md:row-span-1 h-full">
              <div className="bg-gradient-to-br from-rose-50/90 to-white/60 backdrop-blur-xl rounded-[2rem] p-6 h-full flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(251,113,133,0.15)] transition-all duration-300 border border-rose-100/50 group relative overflow-hidden ring-1 ring-rose-200/30">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-200/20 rounded-full blur-2xl group-hover:bg-rose-300/30 transition-colors"></div>

                <div className="w-12 h-12 bg-white/80 rounded-2xl shadow-sm text-rose-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {/* Heart Pulse Icon */}
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>

                <div className="relative z-10">
                  <h3 className="text-base font-bold text-slate-800 mb-1 leading-tight">Emotional Safety</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">Detects distress & anxiety signals.</p>
                </div>

                <div className="flex gap-1.5 items-end h-4 mt-2 opacity-60">
                  <div className="w-1 bg-rose-400 h-2 rounded-full animate-[pulse_1s_ease-in-out_infinite]"></div>
                  <div className="w-1 bg-rose-400 h-4 rounded-full animate-[pulse_1.2s_ease-in-out_infinite_0.1s]"></div>
                  <div className="w-1 bg-rose-400 h-2 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.2s]"></div>
                  <div className="w-1 bg-rose-400 h-3 rounded-full animate-[pulse_1.1s_ease-in-out_infinite_0.3s]"></div>
                </div>
              </div>
            </ScrollReveal>

            {/* Privacy Box */}
            <ScrollReveal delay={0.45} className="md:col-span-3 md:row-span-1 h-full">
              <div className="bg-gradient-to-br from-emerald-50/90 to-white/60 backdrop-blur-xl rounded-[2rem] p-6 h-full flex flex-col justify-between text-left hover:shadow-[0_8px_30px_rgb(16,185,129,0.15)] transition-all duration-300 border border-emerald-100/50 group relative overflow-hidden ring-1 ring-emerald-200/30">
                <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-emerald-200/20 rounded-full blur-2xl group-hover:bg-emerald-300/30 transition-colors"></div>

                <div className="w-12 h-12 bg-white/80 rounded-2xl shadow-sm text-emerald-600 flex items-center justify-center mb-3 group-hover:rotate-12 transition-transform">
                  <LockIcon className="w-6 h-6" />
                </div>

                <div className="relative z-10">
                  <h3 className="text-base font-bold text-slate-800 mb-2 leading-tight">Privacy First</h3>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <span className="text-xs font-medium text-slate-600">On-device processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <span className="text-xs font-medium text-slate-600">COPPA Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>


            {/* --- Center Hero (Span 6) --- */}

            {/* Mindfulness - Span 6 RowSpan 2 */}
            <ScrollReveal delay={0} className="md:col-span-6 md:row-span-2 h-full">
              <div className="bg-gradient-to-b from-white/80 to-indigo-50/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 h-full flex flex-col justify-between hover:shadow-[0_20px_40px_rgb(99,102,241,0.15)] transition-all duration-500 border border-white/40 group relative overflow-hidden ring-1 ring-indigo-100">
                {/* Patterns */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] opacity-5 pointer-events-none border-[30px] border-indigo-200 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] opacity-5 pointer-events-none border-[15px] border-indigo-300 rounded-full"></div>

                <div className="flex justify-between items-start relative z-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-lg shadow-indigo-500/20 flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
                    <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <span className="bg-white/60 backdrop-blur text-xs font-bold text-slate-600 px-4 py-1.5 rounded-full border border-white/50 uppercase tracking-widest shadow-sm">
                    Adaptive AI
                  </span>
                </div>

                <div className="relative z-10 mt-auto pt-8">
                  <h3 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">Mindfulness</h3>
                  <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-10 max-w-lg font-medium">Context-aware filtering that truly understands content, not just keywords.</p>

                  <div className="space-y-4 max-w-xl">
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <span>Age 5</span>
                      <span className="text-indigo-500">Auto-Adapts</span>
                      <span>Age 14</span>
                    </div>
                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden relative shadow-inner ring-1 ring-slate-200">
                      <div className="absolute inset-y-0 left-0 bg-slate-200"></div>
                      <div className="absolute inset-y-0 left-1/3 bg-indigo-100/50 striped-bg "></div>
                      <div className="absolute inset-y-0 right-0 bg-slate-200"></div>

                      {/* Interactive Knob Visual - Animated */}
                      <div
                        className="absolute top-0 bottom-0 w-10 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/30 flex items-center justify-center border-[3px] border-white cursor-pointer"
                        style={{
                          animation: "sliderMove 4s infinite",
                          left: "calc(45% - 20px)"
                        }}
                      >
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>


            {/* --- Right Column (Span 3) --- */}

            {/* Smart Controls (Merged) - Span 3 */}
            <ScrollReveal delay={0.2} className="md:col-span-3 md:row-span-1 h-full">
              <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 h-full flex flex-col justify-between border border-white/40 group relative ring-1 ring-slate-900/5 hover:shadow-lg transition-all duration-300">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> Smart Controls
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {/* Block */}
                  <div className="flex flex-col items-center p-2 rounded-xl bg-red-50/50 border border-red-100/50 hover:bg-red-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Block</span>
                  </div>

                  {/* Gate */}
                  <div className="flex flex-col items-center p-2 rounded-xl bg-amber-50/50 border border-amber-100/50 hover:bg-amber-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mb-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Gate</span>
                  </div>

                  {/* Allow */}
                  <div className="flex flex-col items-center p-2 rounded-xl bg-green-50/50 border border-green-100/50 hover:bg-green-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Allow</span>
                  </div>

                  {/* Timed */}
                  <div className="flex flex-col items-center p-2 rounded-xl bg-blue-50/50 border border-blue-100/50 hover:bg-blue-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Timed</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Split Family & Insights (Span 3) */}

            {/* Family & Insights Combined Column */}
            <div className="md:col-span-3 md:row-span-1 flex flex-col gap-4 h-full">

              {/* Family */}
              <ScrollReveal delay={0.45} className="flex-1">
                <div className="bg-gradient-to-br from-orange-50/90 to-white/60 backdrop-blur-xl rounded-[2rem] p-5 w-full h-full flex flex-col justify-center text-left hover:shadow-[0_8px_30px_rgb(249,115,22,0.15)] transition-all duration-300 border border-orange-100/50 group relative overflow-hidden ring-1 ring-orange-200/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                      <UsersIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">Family First</h3>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1">
                    <div className="bg-orange-400 h-full w-[98%] rounded-full relative"></div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Privacy Score</span>
                    <span className="text-[10px] text-green-600 font-black">A+</span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Insights */}
              <ScrollReveal delay={0.45} className="flex-1">
                <div className="bg-gradient-to-br from-violet-50/90 to-white/60 backdrop-blur-xl rounded-[2rem] p-5 w-full h-full flex flex-row items-center gap-4 hover:shadow-[0_8px_30px_rgb(139,92,246,0.15)] transition-all duration-300 border border-violet-100/50 group relative overflow-hidden ring-1 ring-violet-200/30">
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 shrink-0">
                    <ActivityIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-tight">Reports</h3>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">Weekly activity digest.</p>
                  </div>
                </div>
              </ScrollReveal>

            </div>

          </div>
        </div>

        <div className="container max-w-[1100px] px-8 mx-auto text-white">
        </div>
      </section >



      {/* Key Features Section */}
      < section className="features-section py-12 md:py-16 bg-white" >
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
                  Behavioral infra at scale.
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
      </section >

      {/* Sleek divider line */}
      < div className="w-full h-[1px] bg-gradient-to-r from-transparent via-violet-200/60 to-transparent" />

      {/* Partners Section - Trust through Institutional Legitimacy */}
      < section className="partners-section pt-4 pb-0 md:py-12 bg-white overflow-hidden relative" >
        <div className="partners-container max-w-[1400px] mx-auto px-6 md:px-16">
          <ScrollReveal>
            <h2 className="partners-title text-[22px] sm:text-[24px] md:text-[28px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#1e3a5f] mb-8 md:mb-16 font-semibold text-center">OUR ECOSYSTEM</h2>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <PartnersCarousel />
          </ScrollReveal>

        </div>
      </section >

      {/* Komal: Your Best Section */}
      < KomalYourBestSection />
      <br />
      <br />
      <br />
      {/* Testimonials */}
      <section className="testimonials mt-12 md:mt-4 py-10 md:py-16 bg-white relative overflow-hidden">
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
                <Link href="mailto:play@komalkids.com">Request Demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="btn-secondary-premium-inverted rounded-full px-8 py-3.5 h-auto">
                <Link href="mailto:play@komalkids.com">Learn More</Link>
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
              asChild
              size="lg"
              className="btn-primary-premium-inverted text-lg px-8 py-5 h-auto rounded-full border-0"
            >
              <Link href="mailto:play@komalkids.com">Start for Free</Link>
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

    </>
  );
}

