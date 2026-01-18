"use client";

import { SignIn } from "@clerk/nextjs";
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
              Sign in to access your dashboard and saved reports
            </p>
          </div>

          {/* Clerk Sign In Component */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
            <SignIn
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none p-0 bg-transparent",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "border-2 border-gray-200 hover:border-primary/50 hover:bg-primary/5 rounded-xl transition-all",
                  socialButtonsBlockButtonText: "font-medium text-gray-700",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-500 text-sm",
                  formFieldLabel: "text-sm font-medium text-gray-700 mb-1",
                  formFieldInput: "border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 transition-colors px-4 py-3",
                  formButtonPrimary: "bg-primary hover:bg-primary/90 rounded-xl py-3 text-base font-medium transition-colors",
                  footerActionLink: "text-primary hover:text-primary/80 font-medium",
                  identityPreviewEditButton: "text-primary",
                  formFieldInputShowPasswordButton: "text-gray-500 hover:text-primary",
                  otpCodeFieldInput: "border-2 border-gray-200 rounded-lg focus:border-primary",
                  footer: "hidden",
                },
                layout: {
                  socialButtonsPlacement: "top",
                  showOptionalFields: false,
                },
              }}
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/dashboard"
            />
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-dim">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Link */}
          <div className="mt-4 text-center">
            <Link
              href="/demo"
              className="text-sm text-text-dim hover:text-primary transition-colors"
            >
              Or try our free demo without signing in →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
