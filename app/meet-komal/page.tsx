import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meet KOMAL - About Our Platform | KOMAL",
  description:
    "Meet KOMAL - A comprehensive guide to our hyperpersonalized SEL platform with virtual humans, behavioral tracking, and detailed progress analytics for children ages 3-12.",
  robots: "index, follow",
};

export default function MeetKomal() {
  return (
    <>
      <style>{`
        .meet-page {
          padding: 120px 0 80px;
          background: linear-gradient(180deg, var(--bg-white) 0%, var(--color-bg-soft) 100%);
        }
        .meet-page .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 24px;
        }
        @media (min-width: 768px) {
          .meet-page .container {
            padding: 0 32px;
          }
        }
        .meet-header {
          text-align: center;
          max-width: 900px;
          margin: 0 auto 80px;
        }
        .meet-header h1 {
          font-family: var(--font-serif);
          font-size: 56px;
          font-weight: 600;
          margin-bottom: 24px;
          color: var(--text-primary);
          -webkit-background-clip: text;
          background-clip: text;
          line-height: 1.2;
        }
        .meet-header .subtitle {
          font-size: 24px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }
        .meet-header p {
          font-size: 18px;
          color: var(--text-secondary);
          line-height: 1.8;
          text-align: left;
          max-width: 800px;
          margin: 0 auto;
        }
        .section-block {
          margin-bottom: 80px;
        }
        .section-block h2 {
          font-family: var(--font-serif);
          font-size: 36px;
          font-weight: 600;
          margin-bottom: 24px;
          color: var(--text-primary);
          border-bottom: 3px solid var(--accent-color);
          padding-bottom: 12px;
          line-height: 1.3;
          text-align: left;
        }
        .section-block h3 {
          font-size: 24px;
          font-weight: 700;
          margin: 32px 0 16px;
          color: var(--accent-color);
          line-height: 1.4;
          text-align: left;
        }
        .section-block p {
          text-align: left;
          line-height: 1.8;
        }
        .section-block li {
          text-align: left;
          line-height: 1.8;
        }
        .info-box {
          background: var(--bg-white);
          border: 2px solid var(--border-color);
          border-radius: 16px;
          padding: 32px;
          margin: 24px 0;
          box-shadow: var(--shadow-sm);
        }
        .info-box h4 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--text-primary);
          line-height: 1.3;
          text-align: left;
        }
        .info-box p {
          text-align: left;
          line-height: 1.8;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin: 32px 0;
        }
        .feature-item {
          background: var(--bg-light);
          padding: 24px;
          border-radius: 12px;
          border-left: 4px solid var(--accent-color);
        }
        .feature-item h4 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 12px;
          color: var(--text-primary);
          line-height: 1.3;
          text-align: left;
        }
        .feature-item p {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.8;
          margin: 0;
          text-align: left;
        }
        .metrics-table {
          width: 100%;
          border-collapse: collapse;
          margin: 24px 0;
          background: var(--bg-white);
          border-radius: 12px;
          overflow: hidden;
        }
        .metrics-table th {
          background: var(--color-slate);
          color: white;
          padding: 16px;
          text-align: left;
          font-weight: 600;
          font-size: 16px;
          line-height: 1.5;
        }
        .metrics-table td {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-size: 15px;
          text-align: left;
          line-height: 1.7;
        }
        .metrics-table tr:last-child td {
          border-bottom: none;
        }
        .metrics-table tr:hover {
          background: var(--bg-light);
        }
        .checklist {
          list-style: none;
          padding: 0;
        }
        .checklist li {
          padding: 12px 0;
          padding-left: 32px;
          position: relative;
          color: var(--text-secondary);
          line-height: 1.8;
          text-align: left;
        }
        .checklist li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: var(--accent-color);
          font-weight: 700;
          font-size: 18px;
        }
        .flow-diagram {
          background: var(--bg-light);
          padding: 32px;
          border-radius: 12px;
          margin: 24px 0;
        }
        .flow-step {
          padding: 16px;
          margin: 12px 0;
          background: var(--bg-white);
          border-radius: 8px;
          border-left: 4px solid var(--accent-color);
        }
        .flow-step p {
          text-align: left;
          line-height: 1.8;
        }
        .flow-step strong {
          color: var(--accent-color);
          font-size: 16px;
          text-align: left;
        }
        .flow-step ul {
          text-align: left;
        }
        .flow-step li {
          text-align: left;
          line-height: 1.8;
        }
        .badge {
          display: inline-block;
          background: var(--bg-light);
          color: var(--text-primary);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          margin: 4px 4px 4px 0;
        }
        .badge-primary {
          background: var(--accent-color);
          color: white;
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
        .highlight-box {
          background: rgba(50, 184, 198, 0.10);
          border-left: 4px solid var(--accent-color);
          padding: 24px;
          border-radius: 8px;
          margin: 24px 0;
        }
        .highlight-box p {
          margin: 0;
          color: var(--text-primary);
          font-weight: 500;
          text-align: left;
          line-height: 1.8;
        }
      `}</style>

      <section className="meet-page">
        <div className="container">
          <Link href="/" className="back-link">
            ← Back to Home
          </Link>

          <div className="meet-header">
            <h1>Meet KOMAL</h1>
            <p className="subtitle">Knowledge-Oriented Mental-Health & Affective Learning</p>
            <p>
              A mobile and web-based application with hyperpersonalized virtual humans for social-emotional learning
              (SEL) for users aged 3 to 12. The platform features virtual avatars inspired by social robotics research
              and socially assistive technologies for children with neurodiverse conditions.
            </p>
          </div>

          {/* Platform Overview */}
          <section className="section-block">
            <h2>Platform Overview</h2>
            <div className="info-box">
              <h4>Core Capabilities</h4>
              <div className="feature-grid">
                <div className="feature-item">
                  <h4>🎮 AI-Based Games & Modules</h4>
                  <p>
                    Deliver interactive modules that support attention, concentration, emotional regulation, and social
                    skills through engaging gameplay.
                  </p>
                </div>
                <div className="feature-item">
                  <h4>📊 Behavioral Tracking</h4>
                  <p>
                    Allow parents/guardians to track behavioral and engagement metrics using eye-tracking, touch-tracking,
                    and micro-expression analysis.
                  </p>
                </div>
                <div className="feature-item">
                  <h4>📈 Progress Dashboards</h4>
                  <p>
                    Provide comprehensive dashboards and reports that summarize a child&apos;s interaction, engagement
                    patterns, and progress over time.
                  </p>
                </div>
                <div className="feature-item">
                  <h4>👤 Virtual Avatars</h4>
                  <p>
                    Hyperpersonalized virtual humans that adapt to each child&apos;s learning style, emotional state, and
                    developmental needs.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Development Components */}
          <section className="section-block">
            <h2>Development Components</h2>
            <div className="info-box">
              <h4>Key Technical Features</h4>
              <ul className="checklist">
                <li>
                  <strong>Virtual Avatars / Virtual Humans:</strong> AI-powered characters that adapt in real-time to
                  each child&apos;s needs
                </li>
                <li>
                  <strong>Game Logic:</strong> Sophisticated algorithms that adjust difficulty and pacing based on
                  behavioral signals
                </li>
                <li>
                  <strong>Parent/Guardian Dashboards:</strong> Comprehensive reporting interfaces with actionable insights
                </li>
                <li>
                  <strong>Tracking Interfaces:</strong> Attention, eye, touch, and micro-expression tracking with advanced
                  analytics
                </li>
              </ul>
            </div>
          </section>

          {/* User Experience Flow */}
          <section className="section-block">
            <h2>User Experience Flow</h2>

            <h3>Authentication & Onboarding</h3>
            <div className="flow-diagram">
              <div className="flow-step">
                <strong>Sign In / Sign Up</strong>
                <p>
                  Phone number authentication (English, Bengali, Hindi support) • Email or Apple Sign In • Password or
                  Face ID
                </p>
              </div>
              <div className="flow-step">
                <strong>Use as Guest</strong>
                <p>Permission-based guest access for trial experience</p>
              </div>
              <div className="flow-step">
                <strong>Development Test / Placement Test</strong>
                <p>Initial assessment to understand child&apos;s baseline capabilities</p>
              </div>
              <div className="flow-step">
                <strong>Create Profile</strong>
                <ul className="checklist" style={{ marginTop: "12px" }}>
                  <li>Name</li>
                  <li>Date of Birth (age displayed automatically)</li>
                  <li>Gender</li>
                  <li>
                    Focus Areas (multi-select):
                    <span className="badge">Social Skills</span>
                    <span className="badge">Language Skills</span>
                    <span className="badge">Cognitive Development</span>
                    <span className="badge">Emotional Skills</span>
                    <span className="badge">Life Skills</span>
                  </li>
                  <li>Sounds (volume bar) - sensitivity adjustment</li>
                  <li>Animations (OFF, MED, HIGH) - sensitivity adjustment</li>
                </ul>
              </div>
              <div className="flow-step">
                <strong>Permissions</strong>
                <p>Camera, microphone, and media access requests with clear explanations</p>
              </div>
            </div>

            <h3>Profile Management</h3>
            <div className="info-box">
              <h4>Smart Profile Access</h4>
              <ul className="checklist">
                <li>
                  <strong>If login == true && time_delay &lt; 20 mins:</strong> Learner profile opens automatically (NO
                  PIN required, defaults to last opened learner)
                </li>
                <li>
                  <strong>Parent profile:</strong> Always requires PIN or Face ID
                </li>
                <li>
                  <strong>Other scenarios:</strong> Learner requires PIN, select learner if multiple learners exist;
                  Parent requires PIN
                </li>
              </ul>
            </div>

            <h3>Main Interface</h3>
            <div className="feature-grid">
              <div className="feature-item">
                <h4>🎭 Play/Avatar</h4>
                <p>Content area with virtual human interactions</p>
              </div>
              <div className="feature-item">
                <h4>🏠 Home Screen</h4>
                <p>Central hub with emoji checker (5 options: 😢 crying, 😔 sad, 😐 neutral, 😊 happy, 😂 laugh)</p>
              </div>
              <div className="feature-item">
                <h4>📚 Learning Modules</h4>
                <p>Social / Language / Cognitive / Emotional / Life (ordered based on sign-up selection)</p>
              </div>
              <div className="feature-item">
                <h4>🔒 Account</h4>
                <p>PIN/Face ID required • Profile management • Members • Settings (screen time limit) • Log Out</p>
              </div>
            </div>
          </section>

          {/* Assessment Parameters */}
          <section className="section-block">
            <h2>Assessment Parameters & Analytics</h2>

            <h3>1. Eye-Tracking Analytics</h3>
            <div className="info-box">
              <p>
                <strong>Visual engagement + selective attention tracking</strong>
              </p>
              <table className="metrics-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Meaning</th>
                    <th>Interpretation Examples</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Attention Score</strong>
                      <br />
                      (fixation % on relevant content)
                    </td>
                    <td>Sustained task focus</td>
                    <td>Higher → stronger engagement with task and avatar cues</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Concentration Stability</strong>
                      <br />
                      (micro-saccade frequency)
                    </td>
                    <td>Ability to maintain gaze without distraction</td>
                    <td>A drop → more external distraction or anxiety</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Exploration vs. Avoidance Ratio</strong>
                    </td>
                    <td>Comfort with uncertain/triggering stimuli</td>
                    <td>High avoidance → fear/frustration during certain prompts</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Social Gaze Index</strong>
                      <br />
                      (eye contact with avatar&apos;s face/eyes)
                    </td>
                    <td>Social reciprocity + comfort</td>
                    <td>Increase over sessions → reduced communication anxiety</td>
                  </tr>
                </tbody>
              </table>
              <div className="highlight-box">
                <p>
                  <strong>Nuanced Notes:</strong> Which scenes triggered gaze aversion? Does gaze hunting increase before
                  task switching?
                </p>
              </div>
            </div>

            <h3>2. Facial Expression / Micro-Emotions</h3>
            <div className="info-box">
              <p>
                <strong>Emotional regulation + reactivity analysis</strong>
              </p>
              <table className="metrics-table">
                <thead>
                  <tr>
                    <th>Output</th>
                    <th>Tracks</th>
                    <th>Interpretation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Affect Diversity Score</strong>
                    </td>
                    <td>Range of detectable emotions</td>
                    <td>Low range → masking or flat affect</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Positive-Affect Activation</strong>
                    </td>
                    <td>Joy, pride during success</td>
                    <td>↑ means improved self-confidence</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Frustration Tolerance Index</strong>
                    </td>
                    <td>Time to recover from negative affect</td>
                    <td>↓ recovery time = resilience growing</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Empathy Response</strong>
                    </td>
                    <td>Reaction to avatar distress</td>
                    <td>↑ signals improvement in social awareness</td>
                  </tr>
                </tbody>
              </table>
              <div className="highlight-box">
                <p>
                  <strong>Pattern Analysis:</strong> Does distress appear before or after task difficulty?
                </p>
              </div>
            </div>

            <h3>3. Gesture & Touch Pattern Analytics</h3>
            <div className="info-box">
              <p>
                <strong>Motor intent + frustration indicators</strong>
              </p>
              <table className="metrics-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Interpretation Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Goal-Directed Accuracy</strong>
                    </td>
                    <td>Successfully selected elements vs. random tapping</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Hesitation Taps</strong>
                    </td>
                    <td>Anxiety, doubt, or compulsive checking</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Force Variability</strong> (if device supports)
                    </td>
                    <td>Impulsivity vs. control</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Self-Soothing Gestures</strong>
                    </td>
                    <td>Stress-reduction behaviours emerging naturally</td>
                  </tr>
                </tbody>
              </table>
              <div className="highlight-box">
                <p>
                  <strong>Interpretation:</strong> ↑ accuracy + ↓ random taps → improved executive control • Rapid force
                  spikes → emotional overwhelm
                </p>
              </div>
            </div>

            <h3>4. Response Pattern Dynamics</h3>
            <div className="info-box">
              <p>
                <strong>Cognitive processing + communication readiness</strong>
              </p>
              <table className="metrics-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Reflects</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Response Initiation Latency</strong>
                    </td>
                    <td>Confidence + decisiveness</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Retry Count</strong>
                    </td>
                    <td>Avoidance vs. persistence</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Conversational Turn-Taking Score</strong>
                    </td>
                    <td>Social reciprocity</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Error Correction Profile</strong>
                    </td>
                    <td>Growth mindset vs. helplessness</td>
                  </tr>
                </tbody>
              </table>
              <div className="highlight-box">
                <p>
                  <strong>Interpretive Flags:</strong> Long latency + no retries → freeze mode • Short latency + many
                  retries → impulsive guessing • Gradual decrease in retries → healthy risk-taking
                </p>
              </div>
            </div>
          </section>

          {/* Parent Reports */}
          <section className="section-block">
            <h2>Parent Reports & Dashboards</h2>

            <h3>Session Snapshot (Concise Parent Report)</h3>
            <div className="info-box">
              <h4>Quick Overview</h4>
              <div className="flow-diagram">
                <div className="flow-step">
                  <strong>Focus Area:</strong> [Attention / Emotional Control / Social Skills]
                  <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                    <li>Completed: ___ / ___ tasks</li>
                    <li>Engagement Quality: ⭐⭐⭐⭐☆ (4/10)</li>
                    <li>Key Skill Practised: &quot;Managing frustration calmly&quot;</li>
                    <li>Highlight: Started conversation with avatar without prompt 🎉</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3>Quick Metrics Dashboard</h3>
            <div className="feature-grid">
              <div className="feature-item">
                <h4>1️⃣ Attention & Concentration</h4>
                <p>
                  <strong>Attention Score:</strong> 72% ⬆️
                  <br />
                  <strong>Social Gaze:</strong> Good comfort with avatar 😊
                  <br />→ Stayed focused even during harder activities
                </p>
              </div>
              <div className="feature-item">
                <h4>2️⃣ Emotion & Expression</h4>
                <p>
                  <strong>Positive expressions:</strong> ↑<br />
                  <strong>Frustration episodes:</strong> ↓ (from last session)
                  <br />→ Great recovery after challenges
                </p>
              </div>
              <div className="feature-item">
                <h4>3️⃣ Touch & Motor Behavior</h4>
                <p>
                  <strong>Accurate touches:</strong> ↑<br />
                  <strong>Hesitation taps:</strong> few
                  <br />→ Improved confidence in choices
                </p>
              </div>
              <div className="feature-item">
                <h4>4️⃣ Response Pattern</h4>
                <p>
                  <strong>Initiation delay:</strong> shorter
                  <br />
                  <strong>Retry attempts:</strong> healthy persistence
                  <br />→ Reduced anxiety before responding
                </p>
              </div>
            </div>

            <h3>Interpretation & Action Items</h3>
            <div className="info-box">
              <h4>What This Means</h4>
              <p>
                Your child is becoming more confident, staying focused longer, and handling tricky moments better.
              </p>

              <h4 style={{ marginTop: "24px" }}>Small Home Practice</h4>
              <p>
                Ask: &quot;What helped you keep going when it got a little hard?&quot;
                <br />→ Reinforces coping strategies practiced in the app
              </p>

              <h4 style={{ marginTop: "24px" }}>Next Tiny Goal</h4>
              <p>Maintain eye contact with the avatar during conversation moments.</p>
            </div>

            <h3>Extended Progress Report Features</h3>
            <div className="info-box">
              <h4>Structured Interpretation Framework</h4>
              <ul className="checklist">
                <li>Child Name & Session Block tracking</li>
                <li>Avatar Mode selection (Animal/Human)</li>
                <li>Primary SEL Focus identification</li>
                <li>Comprehensive analytics across all tracking parameters</li>
                <li>Outcome Summary with human-readable insights</li>
                <li>Recommended Home Strategies (automatically customized)</li>
                <li>Clinician Review Zone with escalation flags</li>
              </ul>
            </div>
          </section>

          {/* SEL Framework */}
          <section className="section-block">
            <h2>SEL Progress Dashboard (Harvard Framework)</h2>
            <div className="info-box">
              <p>
                <strong>Quantitative + qualitative blended assessment</strong>
              </p>
              <table className="metrics-table">
                <thead>
                  <tr>
                    <th>Domain</th>
                    <th>Score Trend</th>
                    <th>Interpretation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Self-Awareness</strong>
                    </td>
                    <td>↑ / → / ↓</td>
                    <td>Labeling feelings, noticing triggers</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Self-Management</strong>
                    </td>
                    <td>↑ / → / ↓</td>
                    <td>Using coping tools (breathing, pauses)</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Social Awareness</strong>
                    </td>
                    <td>↑ / → / ↓</td>
                    <td>Recognizing avatar emotions/cues</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Relationship Skills</strong>
                    </td>
                    <td>↑ / → / ↓</td>
                    <td>Repair after mistakes, positive engagement</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Responsible Decision-Making</strong>
                    </td>
                    <td>↑ / → / ↓</td>
                    <td>Better choices under uncertainty</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Sharing & Export */}
          <section className="section-block">
            <h2>Sharing & Export Features</h2>
            <div className="info-box">
              <h4>Report Sharing Options</h4>
              <ul className="checklist">
                <li>
                  <strong>Share Option:</strong> Text, Email, SMS, WhatsApp
                </li>
                <li>
                  <strong>&quot;Email Me the Report&quot; Button:</strong> If no email, asks for email (supports multiple emails),
                  stores previous emails
                </li>
                <li>
                  <strong>Default Email:</strong> komalforkids@gmail.com
                </li>
                <li>
                  <strong>Current Week View:</strong> Last 7 days chart (slideable)
                </li>
              </ul>

              <h4 style={{ marginTop: "32px" }}>Interface Controls</h4>
              <ul className="checklist">
                <li>Top right corner: Child emoji ↔ Parent emoji toggle</li>
                <li>Sound control: Mute/unmute button</li>
                <li>Every app open: Child or Guardian selection (with emojis)</li>
                <li>Guardian access: 4-digit PIN or Face ID required</li>
              </ul>
            </div>
          </section>

          {/* Clinician Features */}
          <section className="section-block">
            <h2>Clinician Review Zone</h2>
            <div className="info-box">
              <h4>Escalation Flags & Alerts</h4>
              <ul className="checklist">
                <li>
                  <strong>Escalate if:</strong> Avoidance spikes for 3 consecutive sessions
                </li>
                <li>
                  <strong>Flag if:</strong> Neutral/flat affect dominates &gt;80% of session
                </li>
                <li>
                  <strong>Strengthen ERP if:</strong> Child is comfortable with current difficulty tiers
                </li>
              </ul>

              <h4 style={{ marginTop: "32px" }}>Outcome Summary Components</h4>
              <ul className="checklist">
                <li>What improved?</li>
                <li>What remains hard?</li>
                <li>Where to support at home?</li>
                <li>Any trigger patterns emerging?</li>
              </ul>
            </div>
          </section>

          {/* Technical Infrastructure */}
          <section className="section-block">
            <h2>Technical Infrastructure</h2>
            <div className="info-box">
              <h4>Cloud & Storage</h4>
              <ul className="checklist">
                <li>
                  <strong>AWS Infrastructure:</strong> Secure, scalable cloud hosting
                </li>
                <li>
                  <strong>Region-Locked Storage:</strong> Data stored in compliance with local regulations
                </li>
                <li>
                  <strong>Encrypted at Rest:</strong> All data encrypted for maximum security
                </li>
                <li>
                  <strong>Raw Video:</strong> Optional, opt-in only, short TTL (Time To Live)
                </li>
              </ul>
            </div>
          </section>

          {/* CTA */}
          <section
            className="section-block"
            style={{
              textAlign: "center",
              padding: "60px 0",
              background: "var(--bg-light)",
              borderRadius: "16px",
              marginTop: "80px",
            }}
          >
            <h2 style={{ border: "none", marginBottom: "24px" }}>Ready to Experience KOMAL?</h2>
            <p
              style={{
                maxWidth: "600px",
                margin: "0 auto 32px",
                fontSize: "18px",
                color: "var(--text-secondary)",
              }}
            >
              See how our comprehensive assessment and reporting system can help understand your child&apos;s learning
              journey.
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

