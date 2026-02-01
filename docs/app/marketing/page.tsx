"use client";

import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";

export default function MarketingPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-16">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-text">
              Download KOMAL Today
            </h1>
            <p className="text-xl md:text-2xl text-text-dim max-w-3xl mx-auto mb-8">
              Your child's digital guardian is just one tap away. Experience AI-powered safety, 
              real-time adaptation, and peace of mind.
            </p>
          </div>
        </ScrollReveal>

        {/* App Store Buttons */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href="https://apps.apple.com/app/komal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-text text-surface px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-[11px] leading-none opacity-80">Download on the</span>
                <span className="text-base font-semibold leading-tight">App Store</span>
              </div>
            </Link>
            <Link
              href="https://play.google.com/store/apps/details?id=com.komalkids.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-text text-surface px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-[11px] leading-none opacity-80">GET IT ON</span>
                <span className="text-base font-semibold leading-tight">Google Play</span>
              </div>
            </Link>
          </div>
        </ScrollReveal>

        {/* Features Grid */}
        <ScrollReveal delay={0.2}>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 rounded-lg bg-surface/50 border border-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text">AI-Powered Safety</h3>
              <p className="text-text-dim">
                Real-time behavioral AI adapts to your child's needs, ensuring safe and age-appropriate content.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-surface/50 border border-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text">Privacy First</h3>
              <p className="text-text-dim">
                All processing happens on-device. Your child's data never leaves your device without your consent.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-surface/50 border border-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text">Weekly Insights</h3>
              <p className="text-text-dim">
                Get clear, actionable reports about your child's learning patterns and engagement.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Why Download Section */}
        <ScrollReveal delay={0.3}>
          <div className="bg-surface/30 rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-text">
              Why Parents Choose KOMAL
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-text">COPPA & GDPR-K Compliant</h3>
                  <p className="text-text-dim">Built with child privacy at its core, meeting the highest safety standards.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-text">Real-Time Adaptation</h3>
                  <p className="text-text-dim">The app adapts in under 200ms to your child's emotional and learning state.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-text">20+ Years of Research</h3>
                  <p className="text-text-dim">Built on extensive research and analysis of ~2 billion played sessions.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-text">Share with Caregivers</h3>
                  <p className="text-text-dim">Easily share insights with teachers and therapists with one click.</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* CTA Section */}
        <ScrollReveal delay={0.4}>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-text-dim mb-8 max-w-2xl mx-auto">
              Join thousands of parents who trust KOMAL to keep their children safe online.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="https://apps.apple.com/app/komal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-text text-surface px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-[11px] leading-none opacity-80">Download on the</span>
                  <span className="text-base font-semibold leading-tight">App Store</span>
                </div>
              </Link>
              <Link
                href="https://play.google.com/store/apps/details?id=com.komalkids.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-text text-surface px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-[11px] leading-none opacity-80">GET IT ON</span>
                  <span className="text-base font-semibold leading-tight">Google Play</span>
                </div>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
