"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import FloatingParticles from "@/components/FloatingParticles";
import { Button } from "@/components/ui/button";

// Abstract SVG Icons for "Anatomy of Komal" section
const CoreIdentityIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" stroke="#1A1A1A" strokeWidth="2" fill="white" />
    <circle cx="24" cy="24" r="14" stroke="#1A1A1A" strokeWidth="2" fill="white" />
    <circle cx="24" cy="24" r="8" stroke="#1A1A1A" strokeWidth="2" fill="#1A1A1A" />
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Lazy load the image when it comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect(); // Stop observing once visible
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before it enters viewport
        threshold: 0.1
      }
    );

    if (imageContainerRef.current) {
      observer.observe(imageContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
              We use frontier AI  <span className="inline-flex items-center align-middle mx-1">
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
              </span> to understand your child and deliver{" "}

              {" "} personalised insights to help them thrive.
            </h1>
          </div>

          {/* App Screenshot Showcase */}
          <div className="relative mt-8 mb-4 flex justify-center">
            <div
              ref={imageContainerRef}
              className="rounded-[2.5rem] overflow-hidden shadow-2xl bg-white/50 max-w-4xl w-full relative"
            >
              {/* Loading skeleton - only show while loading or before in view */}
              {(!isInView || !imageLoaded) && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#E8E0F5] via-[#F5F0FF] to-[#E8E0F5] animate-pulse flex items-center justify-center min-h-[300px] md:min-h-[500px]">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#D4C8ED] animate-bounce" />
                    <div className="text-primary/60 text-sm font-medium">Loading magic...</div>
                  </div>
                </div>
              )}
              <div className="relative z-10 w-full h-full">
                {/* Only load the image when container is in viewport */}
                {isInView && (
                  <img
                    src="/elephanthand.png"
                    alt="Komal Elephant"
                    className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                  />
                )}
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Why Choose KOMAL - Comparison Table */}
      <section className="pt-6 md:pt-10 pb-12 md:pb-16 bg-[#F5F5F7] relative overflow-hidden">
        {/* Floating Particles Background */}
        <div className="absolute inset-0 z-0">
          <FloatingParticles count={25} />
        </div>
        <div className="max-w-[1100px] mx-auto px-6 md:px-16 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-sans text-[36px] md:text-[48px] font-semibold text-primary mb-4 tracking-[-0.02em] text-center">
              Why Komal?
            </h2>

          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-300">
            {/* Table Header */}
            <div className="grid grid-cols-3 border-b border-gray-300">
              <div className="py-3 px-2 md:py-6 md:px-6 bg-[#F5F0FF] flex items-center justify-center border-r border-gray-300">
                <span className="font-bold text-primary text-[18px] md:text-2xl">KOMAL</span>
              </div>
              <div className="py-3 px-2 md:py-6 md:px-6 flex items-center justify-center border-r border-gray-300">
                <span className="font-bold text-text-dim text-[14px] md:text-lg">Traditional Apps</span>
              </div>
              <div className="py-3 px-2 md:py-6 md:px-6 flex items-center justify-center">
                <span className="font-bold text-text-dim text-[14px] md:text-lg">Standard Screen Time</span>
              </div>
            </div>

            {/* Row 1: Real-time behavioural AI */}
            <div className="grid grid-cols-3 border-b border-gray-300">
              <div className="py-1 px-2 md:py-3 md:px-6 bg-[#F5F0FF] flex items-center gap-1 md:gap-3 border-r border-gray-300">
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="text-primary font-medium text-[11px] md:text-base">Real-time behavioural AI</span>
              </div>
              <div className="py-1 px-2 md:py-3 md:px-6 flex items-center justify-center gap-1 md:gap-2 border-r border-gray-300">
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="text-text-dim text-[10px] md:text-sm">Click-based tracking only</span>
              </div>
              <div className="py-1 px-2 md:py-3 md:px-6 flex items-center justify-center gap-1 md:gap-2">
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span className="text-text-dim text-[10px] md:text-sm">No learning insights</span>
              </div>
            </div>

            {/* Row 2: Emotional state detection */}
            <div className="grid grid-cols-3 border-b border-gray-300">
              <div className="py-1 px-2 md:py-3 md:px-6 bg-[#F5F0FF] flex items-center gap-1 md:gap-3 border-r border-gray-300">
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="text-primary font-medium text-[11px] md:text-base">Emotional state detection</span>
              </div>
              <div className="py-1 px-2 md:py-3 md:px-6 flex items-center justify-center gap-1 md:gap-2 border-r border-gray-300">
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span className="text-text-dim text-[10px] md:text-sm">No emotional awareness</span>
              </div>
              <div className="py-1 px-2 md:py-3 md:px-6 flex items-center justify-center gap-1 md:gap-2">
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span className="text-text-dim text-[10px] md:text-sm">No emotional support</span>
              </div>
            </div>

            {/* Row 3: On-device privacy */}
            <div className="grid grid-cols-3 border-b border-gray-300">
              <div className="py-1 px-2 md:py-3 md:px-6 bg-[#F5F0FF] flex items-center gap-1 md:gap-3 border-r border-gray-300">
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="text-primary font-medium text-[11px] md:text-base">On-device privacy</span>
              </div>
              <div className="py-1 px-2 md:py-3 md:px-6 flex items-center justify-center gap-1 md:gap-2 border-r border-gray-300">
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="text-text-dim text-[10px] md:text-sm">Cloud data collection</span>
              </div>
              <div className="py-1 px-2 md:py-3 md:px-6 flex items-center justify-center gap-1 md:gap-2">
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span className="text-text-dim text-[10px] md:text-sm">Data shared with ads</span>
              </div>
            </div>

            {/* Row 4: Instant adaptation */}
            <div className="grid grid-cols-3 border-b border-gray-300">
              <div className="py-1 px-2 md:py-3 md:px-6 bg-[#F5F0FF] flex items-center gap-1 md:gap-3 border-r border-gray-300">
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="text-primary font-medium text-[11px] md:text-base">Instant adaptation (&lt;200ms)</span>
              </div>
              <div className="py-1 px-2 md:py-3 md:px-6 flex items-center justify-center gap-1 md:gap-2 border-r border-gray-300">
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="text-text-dim text-[10px] md:text-sm">Session-based changes</span>
              </div>
              <div className="py-1 px-2 md:py-3 md:px-6 flex items-center justify-center gap-1 md:gap-2">
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span className="text-text-dim text-[10px] md:text-sm">Static content</span>
              </div>
            </div>

            {/* Row 5: Parent-friendly insights */}
            <div className="grid grid-cols-3 border-b border-gray-300">
              <div className="py-1 px-2 md:py-3 md:px-6 bg-[#F5F0FF] flex items-center gap-1 md:gap-3 border-r border-gray-300">
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="text-primary font-medium text-[11px] md:text-base">Parent-friendly insights</span>
              </div>
              <div className="py-1 px-2 md:py-3 md:px-6 flex items-center justify-center gap-1 md:gap-2 border-r border-gray-300">
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="text-text-dim text-[10px] md:text-sm">Basic progress reports</span>
              </div>
              <div className="py-1 px-2 md:py-3 md:px-6 flex items-center justify-center gap-1 md:gap-2">
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span className="text-text-dim text-[10px] md:text-sm">No parent visibility</span>
              </div>
            </div>

            {/* Row 6: Non-addictive by design */}
            <div className="grid grid-cols-3">
              <div className="py-1 px-2 md:py-3 md:px-6 bg-[#F5F0FF] flex items-center gap-1 md:gap-3 border-r border-gray-300">
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="text-primary font-medium text-[11px] md:text-base">Non-addictive by design</span>
              </div>
              <div className="py-1 px-2 md:py-3 md:px-6 flex items-center justify-center gap-1 md:gap-2 border-r border-gray-300">
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span className="text-text-dim text-[10px] md:text-sm">Gamification hooks</span>
              </div>
              <div className="py-1 px-2 md:py-3 md:px-6 flex items-center justify-center gap-1 md:gap-2">
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span className="text-text-dim text-[10px] md:text-sm">Designed for engagement</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Anatomy of Komal - Inspired by reference image */}
      <section className="py-6 md:py-10 bg-[#F5F0FF]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-16">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-6">
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-sans text-[36px] md:text-[42px] font-semibold text-primary mb-4">
                The anatomy of <span className="font-bold">companionship</span>
              </h2>
              <p className="text-lg text-text-dim leading-relaxed max-w-[800px]">
                Komal incorporates the key signals of development and engagement, to turn each child’s distinct patterns into a system that adapts to how they think, learn, and grow.
              </p>
            </div>
            {/* Elephant Mascot */}
            <div className="hidden md:block w-32 h-40 shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-[#E8E0F5] to-[#D4C8ED]">
              <img
                src="/sittingelephant.png"
                alt="KOMAL Elephant Mascot - Your child's friendly learning companion"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

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
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-[900px] mx-auto px-6 md:px-8">
          <h2 className="font-sans text-[32px] md:text-[42px] font-semibold text-primary mb-6 tracking-[-0.02em]">
            The Big Idea
          </h2>
          <p className="text-lg text-text-dim leading-relaxed mb-5">
            Most learning apps are blindfolded—they only see if your child got the answer right or wrong. Komal is different. We watch how your child engages, not just what they click. We use <span className="font-semibold">gaze, speech,</span> and <span className="font-semibold">microexpressions</span> to study <span className="font-semibold">behaviour</span> instead of bombarding them with buttons.
          </p>
          <p className="text-lg text-text-dim leading-relaxed">
            It&apos;s like a teacher who notices when your child hesitates, when they&apos;re getting frustrated, or when they&apos;re genuinely excited. Komal is <span className="font-bold">(child-first, game-second)</span>.
          </p>
        </div>
      </section>

      {/* Where the Magic Happens */}
      <section className="py-8 md:py-12 bg-[#F5F5F7] relative overflow-hidden">
        {/* Floating Particles Background */}
        <div className="absolute inset-0 z-0">
          <FloatingParticles count={30} />
        </div>
        <div className="max-w-[1100px] text-center mx-auto px-6 md:px-16 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-sans text-center text-[36px] md:text-[48px] font-semibold text-primary mb-4 tracking-[-0.02em]">
              Where the Magic Happens
            </h2>
            <p className="text-lg text-center text-text-dim leading-relaxed max-w-[700px] mx-auto">
              All the smart stuff happens right on your device—like having a tiny parent assistant living in your phone, laptop, or PC.
            </p>
          </div>

          {/* Single Row of Violet Cards */}
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {/* Card 1: Instant Adaptation */}
            <div className="bg-[#E8E0F5] rounded-2xl md:rounded-3xl p-3 md:p-6 flex flex-col items-center justify-between min-h-[100px] md:min-h-[180px]">
              <span className="text-[18px] sm:text-[24px] md:text-[42px] font-bold text-primary flex-1 flex items-center">&lt;200ms</span>
              <p className="text-xs md:text-base text-primary font-medium text-center">Instant<br />Adaptation</p>
            </div>

            {/* Card 2: Learning Over Time - with graph icon */}
            <div className="bg-[#E8E0F5] rounded-2xl md:rounded-3xl p-3 md:p-6 flex flex-col items-center justify-between min-h-[100px] md:min-h-[180px]">
              {/* Simple bar chart SVG */}
              <svg className="w-16 sm:w-20 md:w-28 h-10 sm:h-12 md:h-16 flex-1" viewBox="0 0 120 60" fill="none">
                <rect x="0" y="45" width="12" height="15" fill="#270263" opacity="0.4" rx="2" />
                <rect x="16" y="40" width="12" height="20" fill="#270263" opacity="0.5" rx="2" />
                <rect x="32" y="35" width="12" height="25" fill="#270263" opacity="0.6" rx="2" />
                <rect x="48" y="28" width="12" height="32" fill="#270263" opacity="0.7" rx="2" />
                <rect x="64" y="20" width="12" height="40" fill="#270263" opacity="0.8" rx="2" />
                <rect x="80" y="15" width="12" height="45" fill="#270263" opacity="0.9" rx="2" />
                <rect x="96" y="8" width="12" height="52" fill="#270263" rx="2" />
                <path d="M6 42 L22 38 L38 32 L54 25 L70 18 L86 12 L102 6" stroke="#270263" strokeWidth="2" strokeDasharray="3 3" fill="none" />
              </svg>
              <p className="text-xs md:text-base text-primary font-medium text-center">Learning<br />Over Time</p>
            </div>

            {/* Card 3: On-Device Processing - with sync icon */}
            <div className="bg-[#E8E0F5] rounded-2xl md:rounded-3xl p-3 md:p-6 flex flex-col items-center justify-between min-h-[100px] md:min-h-[180px]">
              {/* Circular sync icon */}
              <div className="relative flex-1 flex items-center">
                <svg className="w-10 sm:w-14 md:w-20 h-10 sm:h-14 md:h-20" viewBox="0 0 100 100" fill="none">
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
              <p className="text-xs md:text-base text-primary font-medium text-center">On-Device<br />Processing</p>
            </div>

            {/* Card 4: Better Every Week */}
            <div className="bg-[#E8E0F5] rounded-2xl md:rounded-3xl p-3 md:p-6 flex flex-col items-center justify-between min-h-[100px] md:min-h-[180px]">
              <span className="text-[28px] sm:text-[40px] md:text-[64px] font-bold text-primary flex-1 flex items-center">∞</span>
              <p className="text-xs md:text-base text-primary font-medium text-center">Better<br />Every Week</p>
            </div>
          </div>

          {/* Descriptions below cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <h4 className="text-lg text-center font-semibold text-primary mb-2 flex items-center justify-center gap-2">
                <span></span> Instant Adaptation
              </h4>
              <p className="text-text-dim text-[15px] leading-relaxed text-center">
                When your child shows frustration, Komal adapts in less than a blink of an eye. It might slow down the activity or introduce a calming mini-game—all automatically.
              </p>
            </div>
            <div className="text-center">
              <h4 className="text-lg text-center font-semibold text-primary mb-2 flex items-center justify-center gap-2">
                <span></span> Learning Over Time
              </h4>
              <p className="text-text-dim text-[15px] leading-relaxed text-center">
                Komal gets smarter about your child the more they play. It learns their unique patterns and adapts personalisation every week.
              </p>
            </div>
            <div className="text-center">
              <h4 className="text-lg text-center font-semibold text-primary mb-2 flex items-center justify-center gap-2">
                <span></span> Understanding, Not Data
              </h4>
              <p className="text-text-dim text-[15px] leading-relaxed text-center">
                We translate complex <span className="font-semibold">behavioural signals</span> into simple insights. Instead of jargon, you see &quot;Your child showed strong focus today!&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience the App - Showcase Section */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-[1100px] mx-auto px-6 md:px-16">
          <div className="text-center mb-12">
            <h2 className="font-sans text-center text-[36px] md:text-[48px] font-semibold text-primary mb-4 tracking-[-0.02em]">
              Experience the App
            </h2>
            <p className="text-lg text-center text-text-dim leading-relaxed max-w-[700px] mx-auto">
              See how KOMAL creates a personalised journey for every child with intuitive interfaces and actionable insights.
            </p>
          </div>

          {/* Four Card Showcase Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {/* Card 1: Personalization */}
            <div className="bg-[#F5F0FF] rounded-2xl p-4 md:p-6">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                ✨ Personalization
              </span>
              <h3 className="text-lg md:text-xl font-semibold text-primary mt-4 mb-2">
                Made for Them
              </h3>
              <p className="text-text-dim text-sm mb-4 hidden md:block">
                Adapts to their unique personality and style.
              </p>
              {/* Phone mockup */}
              <div className="flex justify-center">
                <div className="relative bg-[#1A1A1A] rounded-[1.5rem] p-1 shadow-xl">
                  <div className="bg-black rounded-[1.25rem] overflow-hidden">
                    <img
                      src="/komal-personalize-your-profile.jpeg"
                      alt="KOMAL Profile Personalization"
                      className="w-full h-auto max-w-[180px] md:max-w-[200px]"
                    />
                  </div>
                </div>
              </div>
            </div>



            {/* Card 3: Learner Profile */}
            <div className="bg-[#E8F5E9] rounded-2xl p-4 md:p-6">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                👤 Profile
              </span>
              <h3 className="text-lg md:text-xl font-semibold text-primary mt-4 mb-2">
                Know Your Child
              </h3>
              <p className="text-text-dim text-sm mb-4 hidden md:block">
                Track their unique behavioural patterns.
              </p>
              {/* Phone mockup */}
              <div className="flex justify-center">
                <div className="relative bg-[#1A1A1A] rounded-[1.5rem] p-1 shadow-xl">
                  <div className="bg-black rounded-[1.25rem] overflow-hidden">
                    <img
                      src="/komal-learner-profile.jpeg"
                      alt="KOMAL Learner Profile"
                      className="w-full h-auto max-w-[180px] md:max-w-[200px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Session Reports */}
            <div className="bg-[#F5F5F7] rounded-2xl p-4 md:p-6">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                📊 Reports
              </span>
              <h3 className="text-lg md:text-xl font-semibold text-primary mt-4 mb-2">
                Detailed Insights
              </h3>
              <p className="text-text-dim text-sm mb-4 hidden md:block">
                Understand their progress and growth.
              </p>
              {/* Phone mockup */}
              <div className="flex justify-center">
                <div className="relative bg-[#1A1A1A] rounded-[1.5rem] p-1 shadow-xl">
                  <div className="bg-black rounded-[1.25rem] overflow-hidden">
                    <img
                      src="/komal-session-report-extended.jpeg"
                      alt="KOMAL Session Report"
                      className="w-full h-auto max-w-[180px] md:max-w-[200px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Companion - Marquee with Magnetic Effect */}
      <section className="py-10 md:py-16 bg-[#F5F5F7] overflow-hidden">
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .marquee-track {
              display: flex;
              animation: marquee 40s linear infinite;
            }
            .marquee-track:hover {
              animation-play-state: paused;
            }
            .animal-item {
              flex-shrink: 0;
              transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
              cursor: pointer;
            }
            .animal-item:hover {
              z-index: 10;
            }
            .animal-circle {
              border-radius: 50%;
              overflow: hidden;
              background: linear-gradient(135deg, #F5F5F7 0%, #E8E0F5 100%);
              box-shadow: 0 4px 20px rgba(39, 2, 99, 0.15);
              transition: transform 0.3s ease, box-shadow 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .animal-item:hover .animal-circle {
              transform: scale(1.15);
              box-shadow: 0 8px 35px rgba(39, 2, 99, 0.25);
            }
            .animal-circle img {
              mix-blend-mode: multiply;
              width: 100%;
              height: 100%;
              object-fit: cover;
              object-position: center 20% !important;
            }
          `
        }} />
        <div className="max-w-[1100px] mx-auto px-6 md:px-16">
          <div className="text-center mb-10">
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4 inline-block">
              50+ Unique Avatar
            </span>
            <h2 className="font-sans text-center text-[32px] md:text-[42px] font-semibold text-primary tracking-[-0.02em]">
              Choose Your Companion
            </h2>

          </div>

          {/* Marquee Container */}
          <div
            className="relative py-8"
            onMouseMove={(e) => {
              const container = e.currentTarget;
              const items = container.querySelectorAll('.animal-item') as NodeListOf<HTMLElement>;
              const rect = container.getBoundingClientRect();
              const mouseX = e.clientX - rect.left;
              const mouseY = e.clientY - rect.top;

              items.forEach((item) => {
                const itemRect = item.getBoundingClientRect();
                const itemCenterX = itemRect.left - rect.left + itemRect.width / 2;
                const itemCenterY = itemRect.top - rect.top + itemRect.height / 2;

                const distX = mouseX - itemCenterX;
                const distY = mouseY - itemCenterY;
                const distance = Math.sqrt(distX * distX + distY * distY);

                const maxDistance = 150;
                const maxMove = 25;

                if (distance < maxDistance) {
                  const force = (maxDistance - distance) / maxDistance;
                  const moveX = (distX / distance) * force * maxMove;
                  const moveY = (distY / distance) * force * maxMove;
                  item.style.transform = `translate(${moveX}px, ${moveY}px)`;
                } else {
                  item.style.transform = 'translate(0, 0)';
                }
              });
            }}
            onMouseLeave={(e) => {
              const items = e.currentTarget.querySelectorAll('.animal-item') as NodeListOf<HTMLElement>;
              items.forEach((item) => {
                item.style.transform = 'translate(0, 0)';
              });
            }}
          >


            {/* Scrolling Track */}
            <div className="marquee-track gap-6 md:gap-10">
              {/* First set of animals */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                <div key={`a-${num}`} className="animal-item px-3 md:px-4">
                  <div className="animal-circle w-20 h-20 md:w-28 md:h-28">
                    <img
                      src={`/animal${num}.png`}
                      alt={`Animal Companion ${num}`}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center 90%' }}
                    />
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                <div key={`b-${num}`} className="animal-item px-3 md:px-4">
                  <div className="animal-circle w-20 h-20 md:w-28 md:h-28">
                    <img
                      src={`/animal${num}.png`}
                      alt={`Animal Companion ${num}`}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center 90%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>
      </section>

      {/* The Science */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-[1100px] text-center mx-auto px-6 md:px-16">
          <div className="text-center mb-12">
            <h2 className="font-sans text-center text-[36px] md:text-[48px] font-semibold text-primary mb-4 tracking-[-0.02em]">
              The Science, Simply Said
            </h2>

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
                      <circle cx="12" cy="8" r="4" />
                      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                    </svg>
                  </div>
                  <div className="h-2 bg-[#E8E0F5] rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-[#E8E0F5] rounded w-1/2"></div>
                </div>
                <div className="bg-white rounded-xl p-4 flex-1 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div className="h-2 bg-[#E8E0F5] rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-[#E8E0F5] rounded w-1/2"></div>
                </div>
                <div className="bg-white rounded-xl p-4 flex-1 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-[#E8E0F5] flex items-center justify-center mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#270263" strokeWidth="2">
                      <line x1="12" y1="20" x2="12" y2="10" />
                      <line x1="18" y1="20" x2="18" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="16" />
                    </svg>
                  </div>
                  <div className="h-2 bg-[#E8E0F5] rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-[#E8E0F5] rounded w-1/2"></div>
                </div>
              </div>

              <p className="text-primary font-medium mb-2">Federated Learning</p>
              <p className="text-text-dim text-[15px] leading-relaxed">
                We improve our <span className="font-semibold">models </span> by learning from many children without ever seeing their individual data. It&apos;s like learning from a crowd whilst respecting everyone&apos;s privacy.
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
                  <h3 className="font-sans text-[36px] md:text-[42px] font-semibold text-primary mb-4">
                    Fairness & Ethics
                  </h3>
                  <p className="text-text-dim leading-relaxed mb-6">
                    Komal works equally well for all children, regardless of age, background, or learning style. We audit for bias and fix issues before they become problems.
                  </p>
                  <div className="flex justify-start">
                    <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
                      <Link href="/privacy">Learn More</Link>
                    </Button>
                  </div>
                </div>

                {/* Right side: Nested cards grid */}
                <div className="flex flex-col gap-3">
                  <div className="bg-primary rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                      <span>⚖️</span>
                    </div>
                    <p className="text-white text-base font-medium">Bias Audits</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#270263" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    </div>
                    <p className="text-primary text-base font-medium">Global Standards</p>
                  </div>
                  <div className="bg-primary rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#270263" strokeWidth="2">
                        <circle cx="12" cy="8" r="3" />
                        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                      </svg>
                    </div>
                    <p className="text-white text-base font-medium">Age Inclusive</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                      <span className="text-primary">✓</span>
                    </div>
                    <p className="text-primary text-base font-medium">Verified Fair</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* What Komal Sees & What Parents See - Side by Side */}
      <section className="py-8 md:py-12 bg-[#F5F5F7]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - What Komal Sees */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-border/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#E8E0F5] flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-primary">What Komal Sees</h3>
              </div>

              <p className="text-text-dim mb-3 text-[15px]">Komal reads behavioural signals in real-time:</p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-[#F5F5F7] rounded-xl p-3">
                  <h4 className="text-[15px] font-medium text-primary mb-1">Eye Gaze Patterns</h4>
                  <p className="text-text-dim text-[13px]">Reveals their attention and focus</p>
                </div>
                <div className="bg-[#F5F5F7] rounded-xl p-3">
                  <h4 className="text-[15px] font-medium text-primary mb-1">Touch Patterns</h4>
                  <p className="text-text-dim text-[13px]">Shows their confidence through interaction</p>
                </div>
                <div className="bg-[#F5F5F7] rounded-xl p-3">
                  <h4 className="text-[15px] font-medium text-primary mb-1">Emotional Cues</h4>
                  <p className="text-text-dim text-[13px]">Tiny expressions reveal their mood</p>
                </div>
                <div className="bg-[#F5F5F7] rounded-xl p-3">
                  <h4 className="text-[15px] font-medium text-primary mb-1">Voice Tone</h4>
                  <p className="text-text-dim text-[13px]">Reveals their emotional state</p>
                </div>
              </div>

              <div className="pt-3 border-t border-border/50">
                <p className="text-[14px] text-text-dim mb-2">What we don&apos;t see:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-[#E8E0F5] text-primary text-[13px] px-3 py-1.5 rounded-full">No video storage</span>
                  <span className="bg-[#E8E0F5] text-primary text-[13px] px-3 py-1.5 rounded-full">No tracking</span>
                  <span className="bg-[#E8E0F5] text-primary text-[13px] px-3 py-1.5 rounded-full">No ads</span>
                </div>
              </div>
            </div>

            {/* Right Column - What Parents See */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-border/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#E8E0F5] flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4" />
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-primary">What You See</h3>
              </div>

              <p className="text-text-dim mb-3 text-[15px]">Every week, you get a friendly report that tells you:</p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-[#F5F5F7] rounded-xl p-3">
                  <h4 className="text-[15px] font-medium text-primary mb-1">Focus Area</h4>
                  <p className="text-text-dim text-[13px]">What they worked on and their engagement level</p>
                </div>
                <div className="bg-[#F5F5F7] rounded-xl p-3">
                  <h4 className="text-[15px] font-medium text-primary mb-1">Quality Score</h4>
                  <p className="text-text-dim text-[13px]">How well they connected with activities</p>
                </div>
                <div className="bg-[#F5F5F7] rounded-xl p-3">
                  <h4 className="text-[15px] font-medium text-primary mb-1">Skills Practiced</h4>
                  <p className="text-text-dim text-[13px]">Specific learning skills developed</p>
                </div>
                <div className="bg-[#F5F5F7] rounded-xl p-3">
                  <h4 className="text-[15px] font-medium text-primary mb-1">Highlights</h4>
                  <p className="text-text-dim text-[13px]">A positive moment to celebrate</p>
                </div>
              </div>

              <div className="pt-3 border-t border-border/50">
                <p className="text-[14px] text-text-dim mb-2">Each report includes:</p>
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
      <section className="py-12 md:py-16 bg-[#F5F0FF] relative overflow-hidden">
        {/* Floating Particles Background */}
        <div className="absolute inset-0 z-0">
          <FloatingParticles count={15} />
        </div>
        <div className="max-w-[1100px] mx-auto px-6 md:px-16 relative z-10">
          <h2 className="font-sans text-center text-[28px] md:text-[36px] font-semibold text-primary mb-6 tracking-[-0.02em]">
            Privacy &amp; Safety: Our Non-Negotiables
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <h3 className="text-lg font-medium text-primary">
                  Privacy First, Always
                </h3>
              </div>
              <p className="text-text-dim text-sm leading-relaxed mb-4">
                <strong className="text-primary">Parental consent is mandatory.</strong> You control everything—disable camera or voice analysis anytime.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">No Ads</span>
                <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">No Tracking</span>
                <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">Easy Delete</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <circle cx="12" cy="10" r="2" />
                  <path d="M12 12v3" />
                </svg>
                <h3 className="text-lg font-medium text-primary">
                  Child Safety Built-In
                </h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="text-text-dim"><strong className="text-primary">No open chat:</strong> Only safe avatar responses</li>
                <li className="text-text-dim"><strong className="text-primary">Bounded interactions:</strong> Scripted and safe</li>
                <li className="text-text-dim"><strong className="text-primary">No identity inference:</strong> Learning patterns only</li>
                <li className="text-text-dim"><strong className="text-primary">No diagnosis claims:</strong> Insights, not labels</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M9 15l2 2 4-4" />
                </svg>
                <h3 className="text-lg font-medium text-primary">
                  Compliance &amp; Ethics
                </h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="text-text-dim"><strong className="text-primary">COPPA compliant:</strong> US children's privacy</li>
                <li className="text-text-dim"><strong className="text-primary">GDPR-K compliant:</strong> EU data protection</li>
                <li className="text-text-dim"><strong className="text-primary">HIPAA-aligned:</strong> Healthcare standards</li>
                <li className="text-text-dim"><strong className="text-primary">Regular audits:</strong> Third-party verified</li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* The Vision */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[900px] mx-auto px-6 md:px-8">
          <h2 className="font-sans text-[32px] md:text-[42px] font-semibold text-primary mb-6 tracking-[-0.02em] flex items-center gap-3">
            Our Bigger Vision
            <svg className="w-8 h-8 md:w-10 md:h-10 text-primary" viewBox="0 0 24 24" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.3" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
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
          <p className="text-xl text-center opacity-90 mb-10 max-w-[600px] mx-auto">
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
