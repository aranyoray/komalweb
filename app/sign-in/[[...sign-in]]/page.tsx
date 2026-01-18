"use client";

import FloatingOrbs from "@/components/FloatingOrbs";
import NoiseOverlay from "@/components/NoiseOverlay";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function SignInPage() {
  return (
    <>
      <NoiseOverlay opacity={0.025} />

      <section className="min-h-screen pt-24 pb-12 md:pt-28 md:pb-16 bg-gradient-to-b from-white via-purple-50/30 to-white relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <FloatingOrbs count={3} />
        </div>

        <div className="container max-w-[500px] px-4 sm:px-6 mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-primary">KOMAL</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
              Welcome Back
            </h1>
            <p className="text-sm sm:text-base text-text-dim">
              Sign in is currently disabled. Try our demo.
            </p>
          </div>

          {/* Sign In Component Placeholder */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 text-center text-text-dim">
            Auth is currently disabled.
          </div>

          {/* Demo Link */}
          <div className="mt-8 text-center">
            <Link
              href="/demo"
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-medium inline-block"
            >
              Try our free demo instead →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
