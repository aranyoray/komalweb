import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How KOMAL Works - The Magic Behind Understanding Your Child | KOMAL",
  description:
    "Discover how KOMAL's AI understands your child - explained in simple, parent-friendly terms. Learn about our privacy-first approach and how we make learning personal.",
  robots: "index, follow",
};

export default function HowKomalWorks() {
  return (
    <>
      <style jsx>{`
        .secret-page {
          padding: 120px 0 80px;
          background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
        }
        .secret-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 80px;
        }
        .secret-header h1 {
          font-size: 56px;
          font-weight: 800;
          margin-bottom: 24px;
          background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .secret-header p {
          font-size: 20px;
          color: var(--text-secondary);
          line-height: 1.7;
        }
        .secret-section {
          margin-bottom: 80px;
        }
        .secret-section h2 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 24px;
          color: var(--text-primary);
        }
        .secret-section p {
          font-size: 18px;
          color: var(--text-secondary);
          line-height: 1.8;
          margin-bottom: 20px;
        }
        .magic-box {
          background: var(--bg-white);
          border: 2px solid var(--border-color);
          border-radius: 16px;
          padding: 32px;
          margin: 32px 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .magic-box h3 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--accent-color);
        }
        .magic-list {
          list-style: none;
          padding: 0;
        }
        .magic-list li {
          padding: 12px 0;
          padding-left: 32px;
          position: relative;
          color: var(--text-secondary);
          line-height: 1.7;
        }
        .magic-list li::before {
          content: "✨";
          position: absolute;
          left: 0;
          font-size: 18px;
        }
        .ux-examples {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin: 32px 0;
        }
        .ux-card {
          background: var(--bg-light);
          padding: 24px;
          border-radius: 12px;
          border-left: 4px solid var(--accent-color);
        }
        .ux-card h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        .ux-card p {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }
        .privacy-badge {
          display: inline-block;
          background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin: 8px 8px 8px 0;
        }
        .back-link {
          display: inline-block;
          margin-bottom: 40px;
          color: var(--accent-color);
          text-decoration: none;
          font-weight: 600;
          transition: opacity 0.3s;
        }
        .back-link:hover {
          opacity: 0.8;
        }
        .emoji-large {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
        }
      `}</style>

      <section className="secret-page">
        <div className="container">
          <Link href="/" className="back-link">
            ← Back to Home
          </Link>

          <div className="secret-header">
            <span className="emoji-large">🔮</span>
            <h1>How KOMAL Works</h1>
            <p>
              Ever wondered how KOMAL understands your child so well? Here&apos;s the magic—explained simply, without the
              technical jargon.
            </p>
          </div>

          {/* The Big Idea */}
          <section className="secret-section">
            <h2>The Big Idea</h2>
            <p>
              Most learning apps are like blindfolded teachers—they only see if your child got the answer right or
              wrong. KOMAL is different. We watch how your child engages, not just what they click. It&apos;s like having a
              teacher who notices when your child hesitates, when they&apos;re getting frustrated, or when they&apos;re genuinely
              excited.
            </p>
            <p>
              We use something called &quot;behavioral signals&quot;—tiny clues about how your child is feeling and learning.
              Think of it like reading body language, but for learning. And here&apos;s the best part: everything happens
              instantly, right on your device, keeping your child&apos;s privacy safe.
            </p>
          </section>

          {/* What KOMAL Sees */}
          <section className="secret-section">
            <h2>What KOMAL &quot;Sees&quot; (And What It Doesn&apos;t)</h2>
            <div className="magic-box">
              <h3>👀 The Friendly Observer</h3>
              <p>KOMAL pays attention to how your child interacts, not who they are:</p>
              <ul className="magic-list">
                <li>
                  <strong>Eye gaze patterns:</strong> Where your child looks tells us about their attention and focus
                </li>
                <li>
                  <strong>Touch patterns:</strong> How they tap, swipe, and interact shows us their confidence and
                  hesitation
                </li>
                <li>
                  <strong>Emotional cues:</strong> Tiny expressions help us understand if they&apos;re happy, frustrated, or
                  curious
                </li>
                <li>
                  <strong>Voice tone:</strong> The way they speak (not what they say) gives us clues about their
                  emotional state
                </li>
              </ul>
              <p
                style={{
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop: "1px solid var(--border-color)",
                }}
              >
                <strong>What we DON&apos;T see:</strong> We never store videos without your permission. We don&apos;t listen to
                what your child says—only how they say it. We don&apos;t track them across other apps or websites. And we
                never, ever use this information for advertising.
              </p>
            </div>
          </section>

          {/* The Magic Happens Here */}
          <section className="secret-section">
            <h2>Where the Magic Happens</h2>
            <p>
              All the smart stuff happens right on your device—like having a tiny, super-smart assistant living in your
              phone or tablet. This means:
            </p>
            <div className="magic-box">
              <h3>⚡ Instant Adaptation</h3>
              <p>
                When your child shows frustration, KOMAL adapts in less than a blink of an eye (under 200 milliseconds).
                It might slow down the activity, change the avatar&apos;s tone, or introduce a calming mini-game—all
                automatically.
              </p>
            </div>
            <div className="magic-box">
              <h3>🧠 Learning Over Time</h3>
              <p>
                KOMAL gets smarter about your child the more they play. It learns their unique patterns: maybe they&apos;re
                more focused in the morning, or they need extra encouragement with math but love reading. This
                personalization gets better every week.
              </p>
            </div>
            <div className="magic-box">
              <h3>📊 Understanding, Not Just Data</h3>
              <p>
                Here&apos;s our secret weapon: we don&apos;t just collect data and dump it on you. We translate complex behavioral
                signals into simple insights. Instead of &quot;gaze fixation variance: 0.23,&quot; you see &quot;Your child showed
                strong focus today—great job!&quot;
              </p>
            </div>
          </section>

          {/* What Parents See */}
          <section className="secret-section">
            <h2>What You See: Simple, Clear, Helpful</h2>
            <p>Every week, you get a friendly report that tells you:</p>
            <div className="ux-examples">
              <div className="ux-card">
                <h4>🎯 Focus Area</h4>
                <p>What your child worked on this week and how engaged they were</p>
              </div>
              <div className="ux-card">
                <h4>💚 Engagement Quality</h4>
                <p>How well your child connected with the activities—not just completion, but genuine interest</p>
              </div>
              <div className="ux-card">
                <h4>🌟 Skill Practiced</h4>
                <p>The specific learning skills your child developed, from attention to emotional regulation</p>
              </div>
              <div className="ux-card">
                <h4>✨ One Good Moment</h4>
                <p>A highlight from the week—something positive we noticed that you might want to celebrate</p>
              </div>
            </div>
            <p style={{ marginTop: "32px" }}>Each report includes three simple sections:</p>
            <ul className="magic-list" style={{ maxWidth: "600px" }}>
              <li>
                <strong>&quot;What this means&quot;:</strong> Plain-language explanation of what we observed
              </li>
              <li>
                <strong>&quot;Try this at home&quot;:</strong> Practical tips based on what we learned
              </li>
              <li>
                <strong>&quot;Next tiny goal&quot;:</strong> A small, achievable next step for your child
              </li>
            </ul>
          </section>

          {/* Privacy & Safety */}
          <section className="secret-section">
            <h2>Privacy & Safety: Our Non-Negotiables</h2>
            <div className="magic-box">
              <h3>🔒 Privacy First, Always</h3>
              <p>
                <strong>Parental consent is mandatory.</strong> You control everything. You can turn off any sensor
                anytime. Want to disable the camera? Done. Don&apos;t want voice analysis? No problem. You&apos;re in complete
                control.
              </p>
              <div style={{ marginTop: "24px" }}>
                <span className="privacy-badge">No Ads</span>
                <span className="privacy-badge">No Third-Party Tracking</span>
                <span className="privacy-badge">No Video Storage (by default)</span>
                <span className="privacy-badge">Easy Delete/Export</span>
              </div>
            </div>
            <div className="magic-box">
              <h3>🛡️ Child Safety Built-In</h3>
              <ul className="magic-list">
                <li>
                  <strong>No open chat:</strong> Your child only interacts with our carefully designed avatar responses
                </li>
                <li>
                  <strong>Bounded interactions:</strong> Everything your child sees is scripted and safe—no surprises
                </li>
                <li>
                  <strong>No identity inference:</strong> We don&apos;t try to figure out who your child is beyond learning
                  patterns
                </li>
                <li>
                  <strong>No diagnosis claims:</strong> We provide insights, not medical or psychological labels
                </li>
              </ul>
            </div>
            <div className="magic-box">
              <h3>📋 Compliance & Ethics</h3>
              <p>We follow the strictest standards:</p>
              <ul className="magic-list">
                <li>
                  <strong>COPPA compliant:</strong> Meets all US children&apos;s privacy laws
                </li>
                <li>
                  <strong>GDPR-K compliant:</strong> Follows European children&apos;s data protection rules
                </li>
                <li>
                  <strong>HIPAA-aligned:</strong> When used by therapists, we meet healthcare privacy standards
                </li>
                <li>
                  <strong>Regular audits:</strong> Third-party experts check our systems regularly
                </li>
              </ul>
            </div>
          </section>

          {/* The Science */}
          <section className="secret-section">
            <h2>The Science (Simplified)</h2>
            <p>
              KOMAL is built on research from socially assistive robotics and educational psychology. We use advanced AI
              techniques, but we keep them simple for you:
            </p>
            <div className="magic-box">
              <h3>🧪 How We Learn</h3>
              <p>
                We use something called &quot;federated learning&quot;—which means we improve our AI by learning from many
                children without ever seeing their individual data. It&apos;s like learning from a crowd while respecting
                everyone&apos;s privacy.
              </p>
            </div>
            <div className="magic-box">
              <h3>⚖️ Fairness Matters</h3>
              <p>
                We regularly check our AI to make sure it works equally well for all children, regardless of age,
                background, or learning style. We audit for bias and fix issues before they become problems.
              </p>
            </div>
            <div className="magic-box">
              <h3>💬 Explainability</h3>
              <p>
                If we can&apos;t explain it simply, we don&apos;t use it. Every insight comes with confidence ranges and
                plain-language explanations. No black boxes, no mystery—just clear, understandable insights.
              </p>
            </div>
          </section>

          {/* The Vision */}
          <section className="secret-section">
            <h2>Our Bigger Vision</h2>
            <p>
              We&apos;re not just building an app. We&apos;re building the foundation for how AI can understand and support
              children&apos;s learning. Our goal is to become the &quot;behavioral interface&quot; for childhood learning—meaning any
              educational tool could use KOMAL&apos;s understanding to better adapt to your child.
            </p>
            <p>
              Imagine if every learning app could answer: &quot;Is the child engaged? Is this too hard? Is this helping?&quot;
              That&apos;s the future we&apos;re building—one where technology truly understands children, not just tracks them.
            </p>
          </section>

          {/* CTA */}
          <section
            className="secret-section"
            style={{
              textAlign: "center",
              padding: "60px 0",
              background: "var(--bg-light)",
              borderRadius: "16px",
              marginTop: "80px",
            }}
          >
            <h2 style={{ marginBottom: "24px" }}>Ready to Experience the Magic?</h2>
            <p style={{ maxWidth: "600px", margin: "0 auto 32px" }}>
              See how KOMAL understands your child. Start your free trial today.
            </p>
            <Link href="/#pricing" className="btn-primary">
              Start Free Trial
            </Link>
          </section>
        </div>
      </section>
    </>
  );
}

