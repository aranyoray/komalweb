"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import Script from "next/script";

export default function SafetyTrustPage() {
  return (
    <>
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Safety & Trust at Komal Kids",
            "description": "Learn how Komal Kids designs AI safely for children with transparency, ethics, and trust at the core. Safety by design, not add-on moderation.",
            "url": "https://komalkids.com/safety-trust"
          }),
        }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How does Komal Kids ensure child safety?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Komal Kids is built with safety-by-design architecture, not add-on moderation. The system uses age-appropriate responses, predictable conversational boundaries, intentional limitations on scope, and child-first defaults. Safety is embedded in the foundation."
                }
              },
              {
                "@type": "Question",
                "name": "What makes Komal Kids different from generic AI?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Komal Kids is optimized for children and safety, with bounded design, safety-first defaults, predictable responses, and safety embedded in architecture. Generic AI is optimized for breadth and capability, with open-ended interaction and engagement-maximizing design."
                }
              },
              {
                "@type": "Question",
                "name": "How does Komal Kids protect children's privacy?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "All AI processing happens on-device. No data leaves the device without explicit parental consent. The system is COPPA, GDPR-K, and CCPA compliant by design, with transparent behavior that parents and institutions can audit and verify."
                }
              }
            ]
          }),
        }}
      />
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
          <ScrollReveal>
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text">
                Safety & Trust at Komal Kids
              </h1>
              <p className="text-xl text-text-dim max-w-3xl mx-auto">
                Learn how Komal Kids designs AI safely for children with transparency, ethics, and trust at the core.
              </p>
            </header>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">Why Child Safety Is Different</h2>
              <div className="prose prose-lg max-w-none text-text-dim leading-relaxed space-y-4">
                <p>
                  Children are not small adults. AI systems designed for adults assume judgment, context, and emotional 
                  maturity that children are still developing. <Link href="/about-komal" className="text-primary hover:underline font-semibold">Komal Kids</Link> starts from this reality.
                </p>
                <p>
                  When an adult interacts with AI, they can evaluate responses, recognize inappropriate content, and 
                  exercise judgment. Children are still building these capabilities. They're learning to understand context, 
                  regulate emotions, and navigate social interactions. AI designed for children must account for these 
                  developmental realities.
                </p>
                <p>
                  This isn't about limiting children's experiences—it's about creating experiences that support their 
                  development while protecting them from harm. Safety for children isn't a feature; it's a foundation.
                </p>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">Safety by Design (Not Add-On Moderation)</h2>
              <div className="prose prose-lg max-w-none text-text-dim leading-relaxed space-y-4">
                <p>
                  Many AI systems are built for adults and then adapted for children through content filters and moderation 
                  rules. This approach treats safety as an afterthought—something added on top of an existing system.
                </p>
                <p>
                  Komal Kids is built with safety embedded in its architecture:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Age-appropriate responses:</strong> The system understands developmental stages and adapts 
                  language, concepts, and interaction patterns accordingly</li>
                  <li><strong>Predictable conversational boundaries:</strong> The AI operates within defined domains 
                  (learning, curiosity, emotional support) rather than attempting to handle any possible query</li>
                  <li><strong>Intentional limitations on scope:</strong> The system is designed to say "I don't know" or 
                  redirect rather than attempt to answer inappropriate queries</li>
                  <li><strong>Child-first defaults:</strong> All responses are filtered and validated for age-appropriateness 
                  before generation</li>
                </ul>
                <p className="mt-4">
                  This is fundamentally different from adapting adult AI systems for children. Safety isn't a layer added 
                  on top—it's built into the foundation.
                </p>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">For Parents</h2>
              <div className="prose prose-lg max-w-none text-text-dim leading-relaxed space-y-4">
                <p>
                  As a parent, you need clear expectations of what Komal Kids can and cannot do. You need transparency 
                  over behavior. And you need design choices that prioritize wellbeing over engagement.
                </p>
                <h3 className="text-2xl font-semibold mb-3 text-text mt-6">Clear Expectations</h3>
                <p>
                  Komal Kids is designed to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Support your child's learning and curiosity</li>
                  <li>Adapt to your child's emotional state and learning needs</li>
                  <li>Provide insights that help you understand your child better</li>
                  <li>Maintain appropriate boundaries in all interactions</li>
                </ul>
                <p className="mt-4">
                  Komal Kids is not designed to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Replace parenting or human relationships</li>
                  <li>Maximize screen time or engagement</li>
                  <li>Provide medical or psychological diagnoses</li>
                  <li>Engage with inappropriate or harmful topics</li>
                </ul>
                <h3 className="text-2xl font-semibold mb-3 text-text mt-6">Transparency</h3>
                <p>
                  You have complete visibility into how Komal Kids works:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Weekly reports showing your child's learning patterns and engagement</li>
                  <li>Clear explanations of how the AI adapts to your child</li>
                  <li>Full control over what data is shared and with whom</li>
                  <li>Access to all safety mechanisms and boundaries</li>
                </ul>
                <h3 className="text-2xl font-semibold mb-3 text-text mt-6">Wellbeing Over Engagement</h3>
                <p>
                  Komal Kids is designed to support healthy engagement patterns, not maximize screen time. The system 
                  recognizes when your child needs a break, adapts difficulty to prevent frustration, and encourages 
                  natural transitions to other activities.
                </p>
                <p className="mt-4">
                  <strong>Komal is meant to support curiosity—not replace parenting.</strong> It's a tool that helps you 
                  understand and support your child, not a replacement for your relationship with them.
                </p>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">For Schools & Educators</h2>
              <div className="prose prose-lg max-w-none text-text-dim leading-relaxed space-y-4">
                <p>
                  Educational environments need AI that aligns with learning goals, is suitable for supervised environments, 
                  and is designed to encourage thinking, not dependency.
                </p>
                <h3 className="text-2xl font-semibold mb-3 text-text mt-6">Aligned with Learning Goals</h3>
                <p>
                  Komal Kids supports educational objectives by:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encouraging critical thinking and exploration</li>
                  <li>Adapting to each student's developmental stage and learning style</li>
                  <li>Providing insights that help teachers personalize instruction</li>
                  <li>Supporting social-emotional learning frameworks</li>
                </ul>
                <h3 className="text-2xl font-semibold mb-3 text-text mt-6">Suitable for Supervised Environments</h3>
                <p>
                  Komal Kids works best when educators can guide and support student interaction. It's designed to enhance 
                  instruction, not replace it. Classroom dashboards provide aggregate insights while maintaining individual 
                  student privacy.
                </p>
                <h3 className="text-2xl font-semibold mb-3 text-text mt-6">Encouraging Thinking, Not Dependency</h3>
                <p>
                  The system is designed to support thinking, not replace it. When students ask questions, Komal Kids asks 
                  follow-up questions, provides hints, and encourages exploration. It celebrates effort and curiosity, not 
                  just correct answers.
                </p>
                <p className="mt-4">
                  <strong>Komal works with educators, not around them.</strong> It's a tool that supports teaching and 
                  learning, not a replacement for human instruction.
                </p>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">For Technical & Institutional Stakeholders</h2>
              <div className="prose prose-lg max-w-none text-text-dim leading-relaxed space-y-4">
                <p>
                  IT leaders, product managers, and trust & safety professionals need systems with constrained interaction 
                  models, reduced risk surface area, predictable system behavior, and governance-friendly design.
                </p>
                <h3 className="text-2xl font-semibold mb-3 text-text mt-6">Constrained Interaction Models</h3>
                <p>
                  Komal Kids operates within defined domains rather than attempting to handle any possible query. This 
                  bounded scope reduces risk and increases predictability.
                </p>
                <h3 className="text-2xl font-semibold mb-3 text-text mt-6">Reduced Risk Surface Area</h3>
                <p>
                  The system has intentional limitations that prevent inappropriate outputs. It's designed to default to safe 
                  responses when uncertain, rather than attempting to answer potentially harmful queries.
                </p>
                <h3 className="text-2xl font-semibold mb-3 text-text mt-6">Predictable System Behavior</h3>
                <p>
                  System responses are deterministic within safety parameters. This predictability makes the system auditable, 
                  testable, and verifiable—essential for institutional deployment.
                </p>
                <h3 className="text-2xl font-semibold mb-3 text-text mt-6">Governance-Friendly Design</h3>
                <p>
                  Komal Kids is architected for governance:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>On-device processing ensures data privacy and reduces attack surface</li>
                  <li>Transparent behavior allows for audit and verification</li>
                  <li>Compliance with COPPA, GDPR-K, and educational data privacy requirements</li>
                  <li>Clear documentation of system behavior, limitations, and safety mechanisms</li>
                </ul>
                <p className="mt-4">
                  <strong>Safety is architectural, not policy-only.</strong> The system's design enforces safety, making it 
                  easier to govern and trust over time.
                </p>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.6}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">How Komal Differs From Generic AI</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-4 text-text">Generic AI</h3>
                  <ul className="list-disc pl-6 space-y-2 text-text-dim">
                    <li>Optimized for breadth and capability</li>
                    <li>Open-ended interaction</li>
                    <li>Engagement-maximizing design</li>
                    <li>Unpredictable outputs</li>
                    <li>Safety added through moderation</li>
                    <li>Assumes adult judgment</li>
                  </ul>
                </div>
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-4 text-text">Komal Kids</h3>
                  <ul className="list-disc pl-6 space-y-2 text-text-dim">
                    <li>Optimized for children and safety</li>
                    <li>Bounded by design</li>
                    <li>Safety-first by default</li>
                    <li>Predictable, constrained responses</li>
                    <li>Safety embedded in architecture</li>
                    <li>Designed for child development</li>
                  </ul>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.7}>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-text">Our Long-Term Commitment</h2>
              <div className="prose prose-lg max-w-none text-text-dim leading-relaxed space-y-4">
                <p>
                  Trust is earned over time. Komal Kids is built for longevity, responsibility, and transparency.
                </p>
                <p>
                  We commit to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Continuous improvement:</strong> Safety mechanisms evolve as we learn more about child 
                  development and AI safety</li>
                  <li><strong>Transparent development:</strong> Clear documentation of system behavior, limitations, and 
                  safety mechanisms</li>
                  <li><strong>Regulatory alignment:</strong> Architecture that aligns with current and emerging child 
                  protection regulations</li>
                  <li><strong>Institutional partnership:</strong> Working with schools, clinics, and institutions to 
                  ensure responsible AI adoption</li>
                  <li><strong>Long-term thinking:</strong> Design choices that support healthy development over years, not 
                  just immediate engagement</li>
                </ul>
                <p className="mt-4">
                  Safety and trust aren't features we add—they're principles we build with. Every design decision, every 
                  architectural choice, every interaction is evaluated through the lens of child safety and wellbeing.
                </p>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.8}>
            <section className="bg-surface/50 p-6 rounded-lg border border-border">
              <h2 className="text-2xl font-bold mb-4 text-text">Learn More</h2>
              <div className="space-y-3">
                <Link href="/about-komal" className="block text-primary hover:underline">
                  About Komal Kids →
                </Link>
                <Link href="/for-schools" className="block text-primary hover:underline">
                  Komal Kids for Schools →
                </Link>
                <Link href="/for-clinics" className="block text-primary hover:underline">
                  Komal Kids for Clinics →
                </Link>
                <Link href="/blog/is-ai-safe-for-kids-parent" className="block text-primary hover:underline">
                  Is AI Safe for Kids? (Parent Guide) →
                </Link>
              </div>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
