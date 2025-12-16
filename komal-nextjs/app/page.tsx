import Link from "next/link";
import Script from "next/script";

export default function Home() {
  return (
    <>
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "KOMAL",
            applicationCategory: "EducationalApplication",
            operatingSystem: "iOS, Android",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "1250",
            },
            description:
              "The world's first AI companion that reads how a child feels, not just what they click. Hyper-personalized learning platform for children ages 3-12.",
            screenshot: "https://komal.ai/screenshot.jpg",
            featureList:
              "Real-time behavioral AI, Personalized learning, Parent insights, Privacy-first design",
          }),
        }}
      />

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Feel, Don't Click</h1>
            <p className="hero-subtitle">The World&apos;s First Non-Addictive, Hands-Free Child Companion</p>
            <p className="hero-description">
              KOMAL understands your child through behavior, not buttons. A learning companion for ages 3-12 that adapts
              in real-time to emotions, attention, and engagement patterns. Simple insights delivered weekly.
            </p>
            <div className="hero-cta">
              <Link href="#" className="btn-primary">
                Start Free Trial
              </Link>
              <Link href="#how-it-works" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Value Proposition */}
      <section className="value-prop" id="how-it-works">
        <div className="container">
          <h2 className="section-title">Understanding Beyond Clicks</h2>
          <p className="section-description">
            Traditional apps measure completion, not cognition. KOMAL reads behavior in real-time—attention patterns,
            emotional responses, engagement quality—and adapts instantly.
          </p>
          <Link href="#" className="btn-primary">
            See How It Works
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features" id="for-parents">
        <div className="container">
          <h2 className="section-title">What Makes KOMAL Different</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Behavioral Understanding</h3>
              <p>
                KOMAL learns how your child engages through gaze, touch, and expression patterns. Tracks attention,
                emotional responses, and confidence levels in real-time.
              </p>
              <ul className="feature-list">
                <li>Tracks gaze, touch, and micro-expressions</li>
                <li>Understands emotional states in real-time</li>
                <li>Builds a unique behavioral fingerprint</li>
              </ul>
            </div>
            <div className="feature-card">
              <h3>Instant Adaptation</h3>
              <p>
                The app adapts to your child&apos;s needs in real-time. Adjusts difficulty, pacing, and engagement based
                on behavioral signals—all automatically.
              </p>
              <ul className="feature-list">
                <li>Adapts difficulty moment-by-moment</li>
                <li>Responds to emotional cues instantly</li>
                <li>Personalizes pacing for each child</li>
              </ul>
            </div>
            <div className="feature-card">
              <h3>Simple Insights</h3>
              <p>
                Parents receive weekly reports in plain language. Clear explanations of what we observed and actionable
                next steps.
              </p>
              <ul className="feature-list">
                <li>Weekly parent reports in plain language</li>
                <li>Actionable insights, not just data</li>
                <li>Share with teachers and therapists easily</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Principles */}
      <section className="principles">
        <div className="container">
          <h2 className="section-title">Built on Trust and Privacy</h2>
          <p className="section-description">
            We&apos;ve built KOMAL on principles that put your child&apos;s wellbeing first. Every feature is designed with
            privacy, trust, and ethical AI at its core.
          </p>
          <div className="principles-grid">
            <div className="principle-card">
              <h3>Privacy-First Design</h3>
              <p>
                All processing happens on-device. Your child&apos;s data never leaves your device without explicit consent.
                We use the same privacy standards as FaceID and baby monitors—technology parents already trust.
              </p>
            </div>
            <div className="principle-card">
              <h3>No Diagnosis, Just Understanding</h3>
              <p>
                KOMAL provides insights, not diagnoses. We help you understand your child&apos;s learning patterns and
                emotional responses—we never label or categorize. This is behavioral understanding, not medical
                assessment.
              </p>
            </div>
            <div className="principle-card">
              <h3>Child-Specific Learning</h3>
              <p>
                Every child is unique. KOMAL builds a personalized behavioral fingerprint for your child over time,
                learning their specific patterns, preferences, and responses. The more they use it, the better it
                understands them.
              </p>
            </div>
            <div className="principle-card">
              <h3>Secure and Transparent</h3>
              <p>
                Your child&apos;s data is encrypted and secure. Parents have full control over what&apos;s shared and with whom.
                We&apos;re transparent about how our AI works—no black boxes, just clear explanations.
              </p>
            </div>
            <div className="principle-card">
              <h3>Works Offline</h3>
              <p>
                Core learning features work without internet. Real-time adaptation happens on-device using advanced
                mobile GPUs. Your child&apos;s privacy and learning never depend on connectivity.
              </p>
            </div>
            <div className="principle-card">
              <h3>Parent-Controlled Sharing</h3>
              <p>
                You decide who sees your child&apos;s insights. Share reports with teachers, therapists, or family members
                with one click. Every share is parent-initiated and parent-controlled.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Parents Are Saying</h2>
          <p className="section-description">Real stories from families who use KOMAL to understand their children better.</p>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-quote">
                &quot;For the first time, I understand when my daughter is actually struggling versus when she&apos;s just being
                playful. The weekly reports are clear and actionable.&quot;
              </p>
              <p className="testimonial-author">Sarah M.</p>
              <p className="testimonial-role">Parent</p>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-quote">
                &quot;My son&apos;s therapist loves the reports. She can see patterns between sessions that we never noticed
                before.&quot;
              </p>
              <p className="testimonial-author">Michael R.</p>
              <p className="testimonial-role">Parent</p>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-quote">
                &quot;As a teacher, I&apos;ve seen many learning apps. KOMAL is different—it actually adapts to each child in
                real-time.&quot;
              </p>
              <p className="testimonial-author">Jennifer L.</p>
              <p className="testimonial-role">Elementary School Teacher</p>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-quote">
                &quot;The privacy features give me peace of mind. Everything stays on our device, and I control exactly who
                sees the insights.&quot;
              </p>
              <p className="testimonial-author">David K.</p>
              <p className="testimonial-role">Parent</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing" id="pricing">
        <div className="container">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-description">Start free, upgrade when you&apos;re ready. No hidden fees, no surprises.</p>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Free</h3>
              <div className="price">$0</div>
              <p className="price-period">/month</p>
              <p className="pricing-balance">Perfect for trying KOMAL</p>
              <ul className="pricing-features">
                <li>Basic learning activities</li>
                <li>Weekly parent report</li>
                <li>Real-time adaptation</li>
                <li>Privacy-first design</li>
                <li>Up to 2 children</li>
              </ul>
              <Link href="#" className="btn-pricing">
                Start Free
              </Link>
            </div>
            <div className="pricing-card featured">
              <div className="popular-badge">Most Popular</div>
              <h3>Family</h3>
              <div className="price">$9</div>
              <p className="price-period">/month</p>
              <p className="pricing-balance">Best for families</p>
              <ul className="pricing-features">
                <li>Everything in Free</li>
                <li>Advanced personalization</li>
                <li>Detailed weekly insights</li>
                <li>Share reports with teachers</li>
                <li>Unlimited children</li>
                <li>Priority support</li>
              </ul>
              <Link href="#" className="btn-pricing">
                Start Free Trial
              </Link>
            </div>
            <div className="pricing-card">
              <h3>School</h3>
              <div className="price">$25</div>
              <p className="price-period">/child/month</p>
              <p className="pricing-balance">For schools & districts</p>
              <ul className="pricing-features">
                <li>Everything in Family</li>
                <li>Classroom dashboards</li>
                <li>SEL compliance tracking</li>
                <li>Anonymized trend analysis</li>
                <li>Early risk identification</li>
                <li>Dedicated support</li>
              </ul>
              <Link href="#" className="btn-pricing">
                Contact Sales
              </Link>
            </div>
            <div className="pricing-card">
              <h3>Therapy</h3>
              <div className="price">$40</div>
              <p className="price-period">/child/month</p>
              <p className="pricing-balance">For therapy centers</p>
              <ul className="pricing-features">
                <li>Everything in School</li>
                <li>Async session summaries</li>
                <li>Between-session tracking</li>
                <li>Objective engagement signals</li>
                <li>Progress visualization</li>
                <li>HIPAA-compliant</li>
              </ul>
              <Link href="#" className="btn-pricing">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Schools & Therapists */}
      <section className="enterprise-cta" id="for-schools">
        <div className="container">
          <h2>For Schools and Therapy Centers</h2>
          <p>
            KOMAL integrates seamlessly into your existing workflow. No new systems to learn—just plug into the insights
            parents already trust. Get classroom-level analytics, SEL compliance dashboards, and early risk identification
            without disrupting your current processes.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginTop: "32px" }}>
            <Link href="#contact" className="btn-primary">
              Request Demo
            </Link>
            <Link href="#for-therapists" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* For Therapists Section */}
      <section className="value-prop" id="for-therapists" style={{ background: "var(--bg-light)" }}>
        <div className="container">
          <h2 className="section-title">For Therapists: Objective Insights Between Sessions</h2>
          <p className="section-description">
            Get async session summaries, between-session progress tracking, and objective engagement signals. KOMAL
            provides data-backed insights that complement your clinical expertise, helping you understand how children
            engage outside the therapy room.
          </p>
          <Link href="#contact" className="btn-primary">
            Contact Our Therapy Team
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="value-prop" id="about" style={{ background: "var(--bg-white)" }}>
        <div className="container">
          <h2 className="section-title">Why We Built KOMAL</h2>
          <p className="section-description">
            We&apos;re not building another kids app. We&apos;re building the first AI system that understands children the way
            a good educator does—at global scale, on consumer devices, with trust.
          </p>
          <div style={{ maxWidth: "800px", margin: "40px auto", textAlign: "left" }}>
            <p style={{ marginBottom: "20px", color: "var(--text-secondary)", lineHeight: "1.8" }}>
              Children&apos;s learning apps are blind. They measure completion, not cognition. Points, streaks, and levels
              miss the real signal: attention drift, emotional overload, avoidance, hesitation.
            </p>
            <p style={{ marginBottom: "20px", color: "var(--text-secondary)", lineHeight: "1.8" }}>
              KOMAL flips the stack—from content-driven to signal-driven learning. We use real-time behavioral AI to read
              how your child feels, not just what they click. This creates a personalized learning experience that adapts
              moment-by-moment, just like a great teacher would.
            </p>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}>
              Our vision is to become the standard behavioral interface for childhood learning. Any learning experience can
              plug into KOMAL&apos;s signal layer to understand: Is the child engaged? Is this too hard? Is this helping? That
              is a platform outcome, not just an app outcome.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-description">Everything you need to know about KOMAL, privacy, and how it works.</p>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>What is KOMAL?</h3>
              <p>
                KOMAL is a hyper-personalized learning companion for children ages 3-12 that uses real-time behavioral AI
                to understand how your child feels and learns. Unlike traditional apps that only track clicks, KOMAL reads
                gaze patterns, touch interactions, and micro-expressions to adapt learning moment-by-moment.
              </p>
            </div>
            <div className="faq-item">
              <h3>How does KOMAL protect my child&apos;s privacy?</h3>
              <p>
                Privacy is our top priority. All AI processing happens on-device—your child&apos;s data never leaves your
                device without explicit consent. We use the same privacy standards as FaceID and baby monitors. Parents
                have full control over what&apos;s shared and with whom. We never sell data or use it for advertising.
              </p>
            </div>
            <div className="faq-item">
              <h3>Does KOMAL diagnose my child?</h3>
              <p>
                No. KOMAL provides insights and understanding, not medical or psychological diagnoses. We help you
                understand your child&apos;s learning patterns and emotional responses. We never label, categorize, or make
                diagnostic claims. This is behavioral understanding, not medical assessment.
              </p>
            </div>
            <div className="faq-item">
              <h3>What age is KOMAL designed for?</h3>
              <p>
                KOMAL is designed for children ages 3-12. The AI adapts to each child&apos;s developmental stage, learning
                style, and individual needs. Younger children get simpler interactions and more visual cues, while older
                children engage with more complex learning activities.
              </p>
            </div>
            <div className="faq-item">
              <h3>How does the real-time adaptation work?</h3>
              <p>
                KOMAL uses advanced mobile GPUs to process behavioral signals in real-time (under 200ms latency). When your
                child hesitates, shows frustration, or loses attention, the app instantly adapts by slowing down, changing
                tone, adjusting difficulty, or introducing calming micro-games—all automatically.
              </p>
            </div>
            <div className="faq-item">
              <h3>What do the parent reports include?</h3>
              <p>
                Every week, you receive a simple 1-minute report in plain language. It explains what KOMAL observed about
                your child&apos;s learning patterns, emotional responses, and engagement levels. Reports include actionable
                insights like &quot;Your child shows more confidence with visual tasks&quot; or &quot;They may benefit from shorter
                sessions.&quot;
              </p>
            </div>
            <div className="faq-item">
              <h3>Can I share reports with my child&apos;s teacher or therapist?</h3>
              <p>
                Yes, absolutely. You control who sees your child&apos;s insights. With one click, you can share reports via
                email or WhatsApp with teachers, therapists, or family members. Every share is parent-initiated and
                parent-controlled.
              </p>
            </div>
            <div className="faq-item">
              <h3>Does KOMAL work offline?</h3>
              <p>
                Yes. Core learning features work without internet. Real-time adaptation happens entirely on-device. You
                only need internet to receive weekly reports and sync data across devices (if you choose to).
              </p>
            </div>
            <div className="faq-item">
              <h3>How is KOMAL different from other learning apps?</h3>
              <p>
                Most apps measure completion (points, streaks, levels) but miss real signals like attention drift,
                emotional overload, or growing confidence. KOMAL flips this—we&apos;re signal-driven, not content-driven. We
                read behavior in real-time and adapt instantly, like a great teacher would.
              </p>
            </div>
            <div className="faq-item">
              <h3>Is there a free trial?</h3>
              <p>
                Yes. Our Free plan lets you try KOMAL with basic features. You can upgrade to Family plan ($9/month)
                anytime for advanced personalization and detailed insights. No credit card required to start.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="container">
          <h2>Ready to Understand Your Child Better?</h2>
          <p>Start your free trial today—no credit card required.</p>
          <Link href="#" className="btn-primary" style={{ background: "var(--bg-white)", color: "var(--text-primary)" }}>
            Start Free Trial
          </Link>
    </div>
      </section>
    </>
  );
}
