"use client";

import Link from "next/link";
import Image from "next/image";
import FaqAccordion, { FaqItem } from "@/components/FaqAccordion";

const gettingStartedFaqs: FaqItem[] = [
  {
    question: "How do I analyze a website?",
    answer:
      "Simply go to your Dashboard, enter a URL or keyword in the search bar, and click 'Analyze'. KOMAL will scan the site and provide a detailed safety report within seconds.",
  },
  {
    question: "What types of content does KOMAL detect?",
    answer:
      "KOMAL uses AI to detect unsafe language, explicit content, violence, hate speech, cyberbullying, gambling, drugs, and other harmful content categories. It also performs visual analysis on images and multimedia scanning.",
  },
  {
    question: "Can I analyze keywords instead of URLs?",
    answer:
      "Yes! If you type a keyword (like 'violence' or 'gambling') instead of a URL, KOMAL will perform a keyword-based safety analysis using direct pattern matching and search intelligence.",
  },
];

const reportsFaqs: FaqItem[] = [
  {
    question: "How do I read the safety score?",
    answer:
      "The safety score ranges from 0-100. Scores above 75 are generally safe (green), 50-75 require caution (amber), and below 50 indicate unsafe content (red). The score is calculated across multiple analysis dimensions including text, visual, and multimedia content.",
  },
  {
    question: "What do BLOCK, GATE, and ALLOW mean?",
    answer:
      "BLOCK means the content is not appropriate for that age group and should be restricted. GATE means parental supervision is recommended. ALLOW means the content is generally safe for that age group.",
  },
  {
    question: "How are reports saved?",
    answer:
      "Reports are automatically saved to your account when you run an analysis. You can access them anytime from the sidebar in your Dashboard. You can also download reports as PDF or send them via email.",
  },
];

const billingFaqs: FaqItem[] = [
  {
    question: "How many free reports do I get?",
    answer:
      "Free plan users get 5 reports. After that, you'll need to upgrade to a paid plan to continue generating reports. Visit the Pricing page to see available plans.",
  },
  {
    question: "How do I upgrade my plan?",
    answer:
      "Go to the Pricing page and click on the plan you'd like. You'll be redirected to a secure Stripe checkout page to complete your payment. Your account will be upgraded immediately after payment.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes, you can cancel anytime from the Billing page. Your subscription will remain active until the end of your current billing period. After that, your account will revert to the free plan.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, American Express) through our secure payment partner Stripe. UPI and other local payment methods may also be available depending on your region.",
  },
];

const contactFaqs: FaqItem[] = [
  {
    question: "How do I contact support?",
    answer:
      "You can reach us at play@komalkids.com for any questions, feedback, or support needs. We typically respond within 24 hours.",
  },
  {
    question: "I found a bug. How do I report it?",
    answer:
      "Please email play@komalkids.com with details about the issue, including what you were doing, what you expected to happen, and what actually happened. Screenshots are helpful too!",
  },
];

export default function HelpPage() {
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
          Help Center
        </h1>
        <p className="text-text-dim text-center mb-12 max-w-[600px] mx-auto">
          Find answers to common questions about using KOMAL to keep your children safe online.
        </p>

        {/* Getting Started */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-4">Getting Started</h2>
          <FaqAccordion items={gettingStartedFaqs} />
        </section>

        {/* Understanding Reports */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-4">Understanding Reports</h2>
          <FaqAccordion items={reportsFaqs} />
        </section>

        {/* Subscription & Billing */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-4">Subscription & Billing</h2>
          <FaqAccordion items={billingFaqs} />
        </section>

        {/* Contact Support */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-4">Contact Support</h2>
          <FaqAccordion items={contactFaqs} />
        </section>

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
