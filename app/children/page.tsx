"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingOrbs from "@/components/FloatingOrbs";
import TextShimmer from "@/components/TextShimmer";
import NoiseOverlay from "@/components/NoiseOverlay";
import ParticleField from "@/components/ParticleField";
import { MessageCircleIcon, SparklesIcon, ShieldIcon, HeartIcon, UsersIcon, ZapIcon } from "@/components/Icons";

const digitalBuddies = [
  {
    name: "Leo",
    trait: "Curious Explorer",
    color: "from-amber-400 to-orange-500",
    icon: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-4">
        <defs>
          <linearGradient id="leoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        {/* Lion face */}
        <circle cx="50" cy="45" r="25" fill="url(#leoGrad)" />
        {/* Mane */}
        <circle cx="50" cy="45" r="32" fill="none" stroke="url(#leoGrad)" strokeWidth="8" strokeDasharray="8 4" />
        {/* Eyes */}
        <circle cx="42" cy="42" r="4" fill="#fff" />
        <circle cx="58" cy="42" r="4" fill="#fff" />
        <circle cx="42" cy="42" r="2" fill="#1e3a5f" />
        <circle cx="58" cy="42" r="2" fill="#1e3a5f" />
        {/* Nose */}
        <ellipse cx="50" cy="52" rx="5" ry="3" fill="#1e3a5f" />
        {/* Smile */}
        <path d="M 42 58 Q 50 64 58 58" fill="none" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" />
        {/* Ears */}
        <circle cx="28" cy="35" r="8" fill="url(#leoGrad)" />
        <circle cx="72" cy="35" r="8" fill="url(#leoGrad)" />
      </svg>
    )
  },
  {
    name: "Rockie",
    trait: "Creative Friend",
    color: "from-rose-400 to-pink-500",
    icon: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-4">
        <defs>
          <linearGradient id="rockieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        {/* Rock/star shape */}
        <path d="M50 15 L58 35 L80 35 L62 48 L70 70 L50 55 L30 70 L38 48 L20 35 L42 35 Z" fill="url(#rockieGrad)" />
        {/* Eyes */}
        <circle cx="43" cy="42" r="4" fill="#fff" />
        <circle cx="57" cy="42" r="4" fill="#fff" />
        <circle cx="43" cy="42" r="2" fill="#1e3a5f" />
        <circle cx="57" cy="42" r="2" fill="#1e3a5f" />
        {/* Smile */}
        <path d="M 40 52 Q 50 60 60 52" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: "Sky",
    trait: "Science Buddy",
    color: "from-blue-400 to-indigo-500",
    icon: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-4">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        {/* Rocket body */}
        <ellipse cx="50" cy="50" rx="18" ry="28" fill="url(#skyGrad)" />
        {/* Window */}
        <circle cx="50" cy="40" r="10" fill="#fff" />
        <circle cx="50" cy="40" r="7" fill="#1e3a5f" />
        {/* Fins */}
        <path d="M32 60 L20 80 L35 65 Z" fill="url(#skyGrad)" />
        <path d="M68 60 L80 80 L65 65 Z" fill="url(#skyGrad)" />
        {/* Flame */}
        <path d="M42 78 L50 92 L58 78" fill="#fbbf24" />
        <path d="M45 78 L50 88 L55 78" fill="#f97316" />
        {/* Sparkles */}
        <circle cx="25" cy="25" r="2" fill="#fbbf24" />
        <circle cx="75" cy="20" r="2" fill="#fbbf24" />
        <circle cx="80" cy="35" r="1.5" fill="#fff" />
      </svg>
    )
  },
  {
    name: "Luna",
    trait: "Storyteller",
    color: "from-violet-400 to-purple-500",
    icon: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-4">
        <defs>
          <linearGradient id="lunaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        {/* Moon face */}
        <circle cx="50" cy="45" r="28" fill="url(#lunaGrad)" />
        {/* Crescent accent */}
        <path d="M65 30 Q75 45 65 60" fill="none" stroke="#fff" strokeWidth="3" opacity="0.5" strokeLinecap="round" />
        {/* Eyes */}
        <circle cx="40" cy="42" r="5" fill="#fff" />
        <circle cx="60" cy="42" r="5" fill="#fff" />
        <circle cx="40" cy="42" r="2.5" fill="#1e3a5f" />
        <circle cx="60" cy="42" r="2.5" fill="#1e3a5f" />
        {/* Closed happy mouth */}
        <path d="M 40 56 Q 50 62 60 56" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        {/* Stars around */}
        <path d="M20 20 L22 25 L27 25 L23 28 L25 33 L20 30 L15 33 L17 28 L13 25 L18 25 Z" fill="#fbbf24" />
        <path d="M75 55 L76 58 L79 58 L77 60 L78 63 L75 61 L72 63 L73 60 L71 58 L74 58 Z" fill="#fbbf24" />
      </svg>
    )
  },
  {
    name: "Sunny",
    trait: "Adventure Guide",
    color: "from-yellow-400 to-amber-500",
    icon: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-4">
        <defs>
          <linearGradient id="sunnyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        {/* Sun center */}
        <circle cx="50" cy="50" r="20" fill="url(#sunnyGrad)" />
        {/* Rays */}
        <g stroke="url(#sunnyGrad)" strokeWidth="4" strokeLinecap="round">
          <line x1="50" y1="18" x2="50" y2="25" />
          <line x1="50" y1="75" x2="50" y2="82" />
          <line x1="18" y1="50" x2="25" y2="50" />
          <line x1="75" y1="50" x2="82" y2="50" />
          <line x1="27" y1="27" x2="32" y2="32" />
          <line x1="68" y1="68" x2="73" y2="73" />
          <line x1="73" y1="27" x2="68" y2="32" />
          <line x1="32" y1="68" x2="27" y2="73" />
        </g>
        {/* Face */}
        <circle cx="43" cy="47" r="3" fill="#1e3a5f" />
        <circle cx="57" cy="47" r="3" fill="#1e3a5f" />
        <path d="M 42 56 Q 50 62 58 56" fill="none" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: "River",
    trait: "Nature Expert",
    color: "from-emerald-400 to-teal-500",
    icon: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-4">
        <defs>
          <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
        {/* Leaf shape */}
        <path d="M50 20 Q70 35 70 50 Q70 70 50 80 Q30 70 30 50 Q30 35 50 20" fill="url(#riverGrad)" />
        {/* Vein */}
        <path d="M50 25 Q50 50 50 75" fill="none" stroke="#fff" strokeWidth="2" opacity="0.6" />
        {/* Face */}
        <circle cx="42" cy="48" r="3" fill="#fff" />
        <circle cx="58" cy="48" r="3" fill="#fff" />
        <circle cx="42" cy="48" r="1.5" fill="#1e3a5f" />
        <circle cx="58" cy="48" r="1.5" fill="#1e3a5f" />
        <path d="M 43 58 Q 50 63 57 58" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        {/* Water drops */}
        <ellipse cx="25" cy="70" rx="4" ry="6" fill="#60a5fa" opacity="0.7" />
        <ellipse cx="75" cy="65" rx="3" ry="5" fill="#60a5fa" opacity="0.7" />
      </svg>
    )
  },
];

const journeyFeatures = [
  {
    title: "Smart Content Filtering",
    description: "We understand what you see, not just words. Keeps you safe from scary or confusing stuff.",
    icon: ShieldIcon,
    color: "from-emerald-400 to-teal-500"
  },
  {
    title: "Talk Freely",
    description: "Ask anything! Your buddies are here to help you learn and explore safely.",
    icon: MessageCircleIcon,
    color: "from-blue-400 to-indigo-500"
  },
  {
    title: "Fun Learning",
    description: "Games, stories, and adventures that grow with you. Never boring, always exciting!",
    icon: SparklesIcon,
    color: "from-violet-400 to-purple-500"
  },
  {
    title: "Feel Supported",
    description: "Buddies who understand when you're happy, sad, or need a little help.",
    icon: HeartIcon,
    color: "from-rose-400 to-pink-500"
  },
];

export default function ChildrenPage() {
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
          <div className="text-center mt-12">
            {/* Badge */}
           
            {/* Main Title */}
            <ScrollReveal delay={0.1}>
              <h1 className="font-sans font-bold leading-[1.1] tracking-tight text-primary text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] mb-6">
                Meet Your
                <span className="block">
                  <TextShimmer duration={4}>Digital Buddies</TextShimmer>
                </span>
              </h1>
            </ScrollReveal>

            {/* Subtitle */}
            <ScrollReveal delay={0.2}>
              <p className="text-lg md:text-xl text-text-dim max-w-2xl mx-auto mb-10 leading-relaxed">
                40+ friendly AI companions ready to guide you on amazing internet adventures. Safe, fun, and always there for you!
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
                  <Link href="mailto:play@komalkids.com">Meet Your Buddies</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white text-primary border-primary border-2 hover:bg-primary/5 text-lg px-8 py-4 h-auto rounded-full"
                >
                  <Link href="/parents">Tell Your Parents</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>

          {/* Digital Buddies Grid */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {digitalBuddies.map((buddy, index) => (
              <ScrollReveal key={buddy.name} delay={0.1 + index * 0.05}>
                <div className="group">
                  <div className={`relative aspect-square rounded-3xl bg-gradient-to-br ${buddy.color} p-1 mb-3 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                    <div className="absolute inset-0 rounded-3xl bg-white/20" />
                    <div className="w-full h-full rounded-3xl bg-white flex items-center justify-center overflow-hidden">
                      {buddy.icon}
                    </div>
                  </div>
                  <p className="text-center font-bold text-primary text-sm">{buddy.name}</p>
                  <p className="text-center text-xs text-text-dim">{buddy.trait}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 relative">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary text-center mb-4">Your Internet Journey</h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                We're here to guide you every step of the way. Explore safely, learn freely!
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {journeyFeatures.map((feature, index) => (
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

      {/* Safety Promise Section */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <FloatingOrbs count={3} />
        </div>
        <div className="container max-w-[900px] px-8 mx-auto text-center relative z-10">
          <ScrollReveal>
            <div className="w-20 h-20 mx-auto mb-6 bg-white/10 rounded-3xl flex items-center justify-center">
              <ShieldIcon className="w-10 h-10" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Our Safety Promise</h2>
            <p className="text-lg opacity-90 leading-relaxed mb-8 text-center">
              Your Digital Buddies never share your secrets. Everything stays between you and your family. We're here to help, not to watch.
            </p>
            <Button
              asChild
              size="lg"
              className="btn-primary-premium-inverted text-lg px-8 py-4 h-auto rounded-full border-0"
            >
              <Link href="mailto:play@komalkids.com">Start Your Adventure</Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>

      {/* More Buddies CTA */}
      <section className="py-20 bg-white">
        <div className="container max-w-[900px] px-8 mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 text-center">40+ Buddies Waiting!</h2>
            <p className="text-lg text-text-dim mb-8 text-center">
              From science wizards to art creators, there's a perfect buddy for everyone. Which one will be your favorite?
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
