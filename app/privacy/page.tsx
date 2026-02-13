"use client";

import Link from "next/link";
import Image from "next/image";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
      {/* Header */}
      <div className="pt-8 pb-4 text-center">
        <Link href="/" className="inline-flex items-center gap-3 group mb-8">
          <Image
            src="/komaliconnobg.png"
            alt="KOMAL"
            width={40}
            height={40}
            className="group-hover:scale-110 transition-transform duration-300"
          />
          <span className="text-xl font-bold text-primary">KOMAL</span>
        </Link>
      </div>

      <div className="container max-w-[800px] px-6 mx-auto pb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary text-center mb-4 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-text-dim text-center mb-12">
          Last updated: February 2026
        </p>

        <div className="space-y-8">
          {/* Introduction */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-sm">
            <h2 className="text-lg font-bold text-primary mb-3">Introduction</h2>
            <p className="text-sm text-text-dim leading-relaxed">
              KOMAL (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting the privacy of our users, especially children and families. This Privacy Policy explains how we collect, use, store, and protect your information when you use our child safety analysis platform.
            </p>
          </section>

          {/* Data Collection */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-sm">
            <h2 className="text-lg font-bold text-primary mb-3">Data We Collect</h2>
            <ul className="text-sm text-text-dim leading-relaxed space-y-2 list-disc list-inside">
              <li><strong>Account Information:</strong> Name, email address, and authentication credentials when you create an account.</li>
              <li><strong>Usage Data:</strong> URLs and keywords you analyze, report history, and usage counts.</li>
              <li><strong>Payment Information:</strong> Processed securely by Stripe. We do not store credit card numbers on our servers.</li>
              <li><strong>Device Information:</strong> Browser type, IP address, and general location (country-level) for currency display purposes.</li>
            </ul>
          </section>

          {/* How We Use Data */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-sm">
            <h2 className="text-lg font-bold text-primary mb-3">How We Use Your Data</h2>
            <ul className="text-sm text-text-dim leading-relaxed space-y-2 list-disc list-inside">
              <li>To provide website safety analysis and generate reports.</li>
              <li>To save and manage your report history.</li>
              <li>To process subscription payments and manage your account.</li>
              <li>To improve our analysis algorithms and service quality.</li>
              <li>To send important account notifications (e.g., subscription changes).</li>
            </ul>
          </section>

          {/* Data Storage */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-sm">
            <h2 className="text-lg font-bold text-primary mb-3">Data Storage & Security</h2>
            <p className="text-sm text-text-dim leading-relaxed mb-2">
              We use industry-standard security measures to protect your data:
            </p>
            <ul className="text-sm text-text-dim leading-relaxed space-y-2 list-disc list-inside">
              <li>All data is encrypted in transit using TLS/SSL.</li>
              <li>User data is stored in Google Cloud Firestore with strict access controls.</li>
              <li>Authentication is handled by Firebase Auth with industry-standard security.</li>
              <li>Payment processing is handled entirely by Stripe (PCI DSS compliant).</li>
              <li>We do not store raw media (images, videos) from analyzed websites.</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-sm">
            <h2 className="text-lg font-bold text-primary mb-3">Your Rights</h2>
            <ul className="text-sm text-text-dim leading-relaxed space-y-2 list-disc list-inside">
              <li><strong>Access:</strong> You can view all your data through the Dashboard and Billing pages.</li>
              <li><strong>Deletion:</strong> You can delete individual reports. Contact us to delete your entire account.</li>
              <li><strong>Portability:</strong> You can download your reports as PDF files.</li>
              <li><strong>Correction:</strong> Contact us to update any incorrect personal information.</li>
              <li><strong>Opt-out:</strong> You can cancel your subscription and stop using the service at any time.</li>
            </ul>
          </section>

          {/* DPDP Act */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-sm">
            <h2 className="text-lg font-bold text-primary mb-3">DPDP Act Compliance</h2>
            <p className="text-sm text-text-dim leading-relaxed">
              We are committed to compliance with the Digital Personal Data Protection Act (DPDP Act) of India. We process personal data only for lawful purposes, with appropriate consent, and implement reasonable security safeguards to protect your data.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-sm">
            <h2 className="text-lg font-bold text-primary mb-3">Contact Us</h2>
            <p className="text-sm text-text-dim leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us at{" "}
              <a href="mailto:play@komalkids.com" className="text-primary hover:underline font-medium">
                play@komalkids.com
              </a>
            </p>
          </section>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-12">
          <Link
            href="/dashboard"
            className="inline-block bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-full transition-all duration-300"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
