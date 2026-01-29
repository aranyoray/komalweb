"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import Script from "next/script";

export default function InvestorsPage() {
  return (
    <>
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Komal Kids | The Trusted AI Platform for Children",
            "description": "Komal Kids is building child-safe AI designed for learning, trust, and long-term impact across homes, schools, and institutions.",
            "url": "https://komalkids.com/investors"
          }),
        }}
      />
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
          <ScrollReveal>
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text">
                Komal Kids — Building the Future of Child-Safe AI
              </h1>
              <p className="text-xl text-text-dim max-w-3xl mx-auto">
                The trusted AI platform for children, designed for learning, trust, and long-term impact across homes, schools, and institutions.
              </p>
            </header>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">The Problem</h2>
              <div className="prose prose-lg max-w-none text-text-dim leading-relaxed space-y-4">
                <p>
                  AI is entering children's lives faster than safety standards can keep up. Most systems were never designed 
                  with children as primary users. They're adapted from adult AI, optimized for engagement, and built with 
                  assumptions about judgment and maturity that children are still developing.
                </p>
                <p>
                  Parents face an impossible choice: give children unrestricted access to AI and risk exposure to inappropriate 
                  content, or lock everything down and stifle curiosity. Schools are evaluating AI tools without clear safety 
                  standards. Institutions are planning long-term child-tech strategies without trusted reference models.
                </p>
                <p>
                  The gap between AI capability and child safety is widening. Something needs to change.
                </p>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">The Opportunity</h2>
              <div className="prose prose-lg max-w-none text-text-dim leading-relaxed space-y-4">
                <p>
                  There is global demand for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Child-safe AI:</strong> Systems built specifically for children, not adapted from adult models</li>
                  <li><strong>Trusted educational tools:</strong> AI that supports learning and development, not just engagement</li>
                  <li><strong>Ethical, compliant systems:</strong> Architecture that meets regulatory requirements and ethical 
                  principles by design</li>
                </ul>
                <p className="mt-4">
                  Parents, schools, and institutions want innovation without risk. They want AI that supports children's 
                  development while protecting their safety and privacy. They want systems they can trust over years, not 
                  just months.
                </p>
                <p>
                  This isn't a niche market—it's a fundamental shift in how children interact with technology. The companies 
                  that build trust today will define the category tomorrow.
                </p>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">The Solution: Komal Kids</h2>
              <div className="prose prose-lg max-w-none text-text-dim leading-relaxed space-y-4">
                <p>
                  <Link href="/about-komal" className="text-primary hover:underline font-semibold">Komal Kids</Link> is an 
                  AI-powered digital buddy designed specifically for children, with:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Safety-by-design architecture:</strong> Safety embedded in the foundation, not added through 
                  moderation</li>
                  <li><strong>Age-appropriate interaction:</strong> Systems that adapt to developmental stages and learning 
                  needs</li>
                  <li><strong>Trust and transparency at the core:</strong> Architecture that parents, educators, and 
                  institutions can understand and verify</li>
                </ul>
                <p className="mt-4">
                  Komal Kids reads how children feel, not just what they click. It uses real-time behavioral AI to understand 
                  emotional state, engagement level, and learning patterns—adapting instantly to support each child's needs.
                </p>
                <p>
                  All processing happens on-device. All data stays private. All interactions are designed to support healthy 
                  development, not maximize engagement.
                </p>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">Why This Is Defensible</h2>
              <div className="prose prose-lg max-w-none text-text-dim leading-relaxed space-y-4">
                <p>
                  Komal Kids isn't just a product—it's a category-defining platform built on defensible foundations:
                </p>
                <h3 className="text-2xl font-semibold mb-3 text-text mt-6">Child-First Design Philosophy</h3>
                <p>
                  The system is built for children from the ground up, not adapted from adult AI. This isn't a limitation—it's 
                  a competitive advantage. General-purpose AI can't match the safety, predictability, and developmental 
                  alignment of child-first design.
                </p>
                <h3 className="text-2xl font-semibold mb-3 text-text mt-6">Architectural Safety Constraints</h3>
                <p>
                  Safety is embedded in the architecture, not added through policy. Constrained interaction models, 
                  deterministic safety layers, and on-device processing create a fundamentally safer system than open-ended 
                  AI adapted for children.
                </p>
                <h3 className="text-2xl font-semibold mb-3 text-text mt-6">Long-Term Trust Moat</h3>
                <p>
                  Trust is earned over time. Komal Kids is built for longevity, transparency, and institutional partnership. 
                  The companies that build trust with parents, schools, and institutions today will have a significant 
                  advantage as the market matures.
                </p>
                <h3 className="text-2xl font-semibold mb-3 text-text mt-6">Aligned with Regulatory and Ethical Trends</h3>
                <p>
                  Child protection regulations are evolving. Ethical AI principles are becoming standard. Komal Kids is 
                  architected to align with these trends, not react to them. This positions the platform for long-term 
                  success as regulatory frameworks mature.
                </p>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">Market Positioning</h2>
              <div className="prose prose-lg max-w-none text-text-dim leading-relaxed space-y-4">
                <p>
                  Komal Kids sits at the intersection of:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>AI:</strong> Advanced behavioral AI that reads emotional state and adapts in real-time</li>
                  <li><strong>Education:</strong> Systems designed to support learning objectives and developmental goals</li>
                  <li><strong>Child wellbeing:</strong> Architecture that prioritizes healthy engagement over maximum screen time</li>
                  <li><strong>Trust & safety:</strong> Governance-friendly design that institutions can audit and verify</li>
                </ul>
                <p className="mt-4">
                  This isn't a feature—it's a category. Child-safe AI isn't a subset of general AI; it's a fundamentally 
                  different product category with different requirements, different constraints, and different value propositions.
                </p>
                <p>
                  The companies that recognize this distinction and build accordingly will define the market. Komal Kids is 
                  positioned to be that company.
                </p>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.6}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">Who It's For</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">Parents</h3>
                  <p className="text-text-dim">
                    Seeking safe AI exposure for their children, with transparency, control, and insights that support 
                    parenting decisions.
                  </p>
                </div>
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">Schools</h3>
                  <p className="text-text-dim">
                    Adopting AI responsibly in educational environments, with alignment to learning goals and governance 
                    that supports institutional needs.
                  </p>
                </div>
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-text">Institutions</h3>
                  <p className="text-text-dim">
                    Planning long-term child-tech strategies, with architecture that supports compliance, auditability, 
                    and responsible AI adoption.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.7}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">The Vision</h2>
              <div className="prose prose-lg max-w-none text-text-dim leading-relaxed space-y-4">
                <p>
                  Komal Kids is building the reference model for how AI should interact with children—globally, responsibly, 
                  and at scale.
                </p>
                <p>
                  We're not just building a product. We're establishing the category. We're setting the standards. We're 
                  creating the foundation for how children will interact with AI throughout their lives.
                </p>
                <p>
                  This is a long-term mission. It requires patient capital, thoughtful development, and commitment to principles 
                  over short-term metrics. It requires building trust with parents, schools, and institutions—one family, one 
                  classroom, one institution at a time.
                </p>
                <p className="mt-4">
                  The companies that build this foundation today will define the future of child-AI interaction. Komal Kids 
                  is positioned to be that company.
                </p>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.8}>
            <section className="bg-surface/50 p-6 rounded-lg border border-border text-center">
              <h2 className="text-2xl font-bold mb-4 text-text">Learn More</h2>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/about-komal" className="text-primary hover:underline">
                  About Komal Kids →
                </Link>
                <Link href="/safety-trust" className="text-primary hover:underline">
                  Safety & Trust →
                </Link>
                <Link href="/for-schools" className="text-primary hover:underline">
                  For Schools →
                </Link>
                <Link href="/why" className="text-primary hover:underline">
                  Our Mission →
                </Link>
              </div>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
