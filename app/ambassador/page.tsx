"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, CheckCircle, Sparkles, Shield, Users, BarChart3, Share2, Heart, Award, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import FloatingOrbs from "@/components/FloatingOrbs";
import FloatingButterflies from "@/components/FloatingButterflies";
import FloatingDots from "@/components/FloatingDots";
import NoiseOverlay from "@/components/NoiseOverlay";
import ScrollReveal from "@/components/ScrollReveal";

const pioneerPerks = [
  {
    icon: Shield,
    title: "Everything in Essentials",
    description: "Full access to all core safety analysis features",
  },
  {
    icon: Sparkles,
    title: "Deeper Personalization",
    description: "Personalized insights across every session",
  },
  {
    icon: BarChart3,
    title: "Expanded Weekly Insights",
    description: "Detailed weekly progress reports and trends",
  },
  {
    icon: Share2,
    title: "Share Reports",
    description: "Share safety reports with caregivers and teachers",
  },
  {
    icon: Users,
    title: "Unlimited Child Profiles",
    description: "Create profiles for all your children",
  },
  {
    icon: Heart,
    title: "Priority Parent Support",
    description: "Get help when you need it, fast",
  },
  {
    icon: Award,
    title: "Pioneer Community Badge",
    description: "Exclusive badge recognizing your commitment",
  },
];

export default function AmbassadorPage() {
  const router = useRouter();
  const { user, loading: authLoading, getIdToken } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/sign-in");
    }
  }, [authLoading, user, router]);

  const handleJoin = async () => {
    setError("");
    setCheckoutLoading(true);

    try {
      const token = await getIdToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priceId: "ambassador" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create checkout");

      if (data.url && typeof data.url === 'string' && data.url.startsWith('https://')) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-purple-50/30 to-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-text-dim">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <NoiseOverlay opacity={0.025} />

      <section className="min-h-screen pt-24 pb-12 md:pt-28 md:pb-16 bg-gradient-to-b from-white via-purple-50/40 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 z-0">
          <FloatingOrbs count={4} />
        </div>
        <div className="absolute inset-0 z-0">
          <FloatingDots />
        </div>
        <div className="absolute inset-0 z-[1]">
          <FloatingButterflies count={10} />
        </div>

        <div className="container max-w-[700px] px-4 sm:px-6 mx-auto relative z-10">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-10">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
                <Image
                  src="/komaliconnobg.png"
                  alt="KOMAL"
                  width={48}
                  height={48}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-2xl font-bold text-primary">KOMAL</span>
              </Link>

              <div className="flex justify-center gap-1.5 mb-4">
                <svg className="w-4 h-4 text-primary/40 animate-pulse" style={{ animationDuration: "3s" }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L15 9L24 12L15 15L12 24L9 15L0 12L9 9L12 0Z" />
                </svg>
                <svg className="w-3 h-3 text-primary/30 animate-pulse" style={{ animationDuration: "3s", animationDelay: "0.5s" }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L15 9L24 12L15 15L12 24L9 15L0 12L9 9L12 0Z" />
                </svg>
                <svg className="w-4 h-4 text-primary/40 animate-pulse" style={{ animationDuration: "3s", animationDelay: "1s" }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L15 9L24 12L15 15L12 24L9 15L0 12L9 9L12 0Z" />
                </svg>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 font-medium text-xs sm:text-sm mb-4 ring-1 ring-amber-200/50">
                <Award className="w-4 h-4" />
                <span>Exclusive Invitation</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 tracking-tight leading-tight">
                Welcome to the KOMAL
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10">Pioneer Community</span>
                  <span
                    className="absolute left-0 right-0 bottom-[0.1em] h-[0.3em] rounded-full -z-0"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(107, 78, 113, 0.15), rgba(107, 78, 113, 0.25), rgba(107, 78, 113, 0.15))",
                    }}
                  />
                </span>
              </h1>
              <p className="text-sm sm:text-base text-text-dim max-w-[500px] mx-auto">
                As a valued community member, you&apos;re invited to join our Pioneer program
                with exclusive perks and premium features to help keep your children safe online.
              </p>
            </div>
          </ScrollReveal>

          {/* Perks Card */}
          <ScrollReveal delay={0.15}>
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/40 p-6 sm:p-8 ring-1 ring-primary/5 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Pioneer Benefits
              </h2>

              <div className="space-y-4">
                {pioneerPerks.map((perk, idx) => (
                  <motion.div
                    key={perk.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.08 }}
                    className="flex items-start gap-3 p-3 rounded-2xl hover:bg-primary/5 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <perk.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text-main flex items-center gap-2">
                        {perk.title}
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      </h3>
                      <p className="text-xs text-text-dim mt-0.5">{perk.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal delay={0.3}>
            <div className="bg-gradient-to-br from-primary/5 to-violet-50/50 rounded-[2rem] p-6 sm:p-8 ring-1 ring-primary/5">
              <div className="text-center mb-6">
                <p className="text-2xl font-bold text-primary">
                  One-time fee
                </p>
                <p className="text-xs text-text-dim mt-1">
                  Pay once, enjoy Pioneer perks forever. Charged in CAD.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={handleJoin}
                  disabled={checkoutLoading}
                  className="w-full sm:w-auto px-8 py-4 btn-primary-premium text-white rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base border-0 mx-auto"
                >
                  {checkoutLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      <Award className="w-5 h-5" />
                      Join Pioneer Community
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="mt-3 text-sm text-text-dim hover:text-primary transition-colors block mx-auto"
                >
                  Skip for now
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
