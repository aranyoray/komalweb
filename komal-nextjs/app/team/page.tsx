import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team - KOMAL",
  description:
    "Meet the KOMAL team - Founders, engineers, researchers, and advisors building the future of personalized learning for children.",
  robots: "index, follow",
};

export default function Team() {
  return (
    <>
      <style jsx>{`
        .team-page {
          padding: 120px 0 80px;
          background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
        }
        .team-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 80px;
        }
        .team-header h1 {
          font-size: 56px;
          font-weight: 800;
          margin-bottom: 24px;
          background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .team-header p {
          font-size: 20px;
          color: var(--text-secondary);
          line-height: 1.7;
        }
        .team-section {
          margin-bottom: 100px;
        }
        .team-section h2 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 48px;
          text-align: center;
          color: var(--text-primary);
        }
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 32px;
          margin-bottom: 60px;
        }
        .team-card {
          background: var(--bg-white);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s, box-shadow 0.3s;
          border: 1px solid var(--border-color);
        }
        .team-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }
        .team-card .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
          color: white;
        }
        .team-card h3 {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        .team-card .role {
          font-size: 16px;
          font-weight: 600;
          color: var(--accent-color);
          margin-bottom: 16px;
        }
        .team-card .bio {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.7;
        }
        .team-card .education {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }
        .team-card .education-item {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }
        .team-card .education-item:last-child {
          margin-bottom: 0;
        }
        .advisory-section {
          background: var(--bg-light);
          padding: 60px 0;
          border-radius: 16px;
          margin: 60px 0;
        }
        .advisory-category {
          margin-bottom: 60px;
        }
        .advisory-category:last-child {
          margin-bottom: 0;
        }
        .advisory-category h3 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 32px;
          text-align: center;
          color: var(--text-primary);
        }
        .advisory-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .advisory-card {
          background: var(--bg-white);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          border: 1px solid var(--border-color);
        }
        .advisory-card h4 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        .advisory-card .role {
          font-size: 15px;
          font-weight: 600;
          color: var(--accent-color);
          margin-bottom: 12px;
        }
        .advisory-card .bio {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.7;
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
        .founders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 40px;
          margin-bottom: 80px;
        }
        .founder-card {
          background: var(--bg-white);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          border: 2px solid transparent;
          transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
        }
        .founder-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
          border-color: var(--accent-color);
        }
        .founder-card .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          font-weight: 700;
          color: white;
        }
        @media (max-width: 768px) {
          .team-header h1 {
            font-size: 36px;
          }
          .team-grid,
          .founders-grid,
          .advisory-grid {
            grid-template-columns: 1fr;
          }
          .team-section h2 {
            font-size: 28px;
          }
        }
      `}</style>

      <section className="team-page">
        <div className="container">
          <Link href="/" className="back-link">
            ← Back to Home
          </Link>

          <div className="team-header">
            <h1>Our Team</h1>
            <p>
              We&apos;re a diverse team of engineers, researchers, and educators building the future of personalized
              learning for children. Together, we&apos;re creating technology that truly understands how children learn and
              grow.
            </p>
          </div>

          {/* Founders */}
          <section className="team-section">
            <h2>Founders</h2>
            <div className="founders-grid">
              <div className="founder-card">
                <div className="avatar">AR</div>
                <h3>Aranyo Ray</h3>
                <div className="role">Co-Founder & CEO</div>
                <div className="bio">
                  <div className="education">
                    <div className="education-item">Yale University &apos;24</div>
                    <div className="education-item">Formerly at Graymatics and Bain</div>
                  </div>
                </div>
              </div>
              <div className="founder-card">
                <div className="avatar">SS</div>
                <h3>Sania Sinha</h3>
                <div className="role">Co-Founder & CTO</div>
                <div className="bio">
                  <div className="education">
                    <div className="education-item">University of Oxford — MS in Computer Science (2026)</div>
                    <div className="education-item">
                      Michigan State University — BS in Computer Science & AI (2025, summa cum laude)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Core Team */}
          <section className="team-section">
            <h2>Core Team</h2>
            <div className="team-grid">
              <div className="team-card">
                <div className="avatar">UC</div>
                <h3>Udayan Chatterjee</h3>
                <div className="role">Engineering Lead</div>
                <div className="bio">
                  <div className="education">
                    <div className="education-item">IIT (ISM) Dhanbad — BTech (2025)</div>
                    <div className="education-item">Formerly at Accenture</div>
                  </div>
                </div>
              </div>
              <div className="team-card">
                <div className="avatar">AG</div>
                <h3>Aniket Gupta</h3>
                <div className="role">Founding Operations Lead</div>
                <div className="bio">
                  <div className="education">
                    <div className="education-item">IIIT Delhi — BTech in ECE (2025)</div>
                    <div className="education-item">Founder, Tale of Humankind</div>
                  </div>
                </div>
              </div>
              <div className="team-card">
                <div className="avatar">SK</div>
                <h3>Saarthak Kumar</h3>
                <div className="role">Finance & Strategy Advisor</div>
                <div className="bio">
                  <div className="education">
                    <div className="education-item">Columbia University — MPA (Quantitative Concentration), &apos;25</div>
                    <div className="education-item">London School of Economics — MPP (2024)</div>
                    <div className="education-item">
                      Former Advisor, Permanent Mission of India to the United Nations
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Research Advisors */}
          <section className="team-section">
            <h2>Research Advisors</h2>
            <div className="team-grid">
              <div className="team-card">
                <div className="avatar">YA</div>
                <h3>Yudhajit Ain</h3>
                <div className="role">Research Advisor (Neuroscience)</div>
                <div className="bio">
                  <div className="education">
                    <div className="education-item">PhD Candidate, Neuropsychology</div>
                    <div className="education-item">Internal Attention Lab, University of Calgary</div>
                    <div className="education-item">IISER Bhopal — MS-BS (2021, Gold Medallist)</div>
                    <div className="education-item">Formerly at NBRC</div>
                  </div>
                </div>
              </div>
              <div className="team-card">
                <div className="avatar">AD</div>
                <h3>Anwesha Das</h3>
                <div className="role">Research Advisor (Computational Neuroscience)</div>
                <div className="bio">
                  <div className="education">
                    <div className="education-item">PhD Candidate, Princeton University</div>
                    <div className="education-item">Caltech (2025)</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Advisory Board */}
          <section className="advisory-section">
            <div className="container">
              <h2
                style={{
                  fontSize: "36px",
                  fontWeight: 700,
                  marginBottom: "60px",
                  textAlign: "center",
                  color: "var(--text-primary)",
                }}
              >
                Advisory Board
              </h2>

              {/* Technical Advisors */}
              <div className="advisory-category">
                <h3>Technical Advisors</h3>
                <div className="advisory-grid">
                  <div className="advisory-card">
                    <h4>Richard Vidal-Dorsch</h4>
                    <div className="role">Senior Software Engineer, Aura</div>
                    <div className="bio">
                      <div className="education">
                        <div className="education-item">MS in Computer Science (2005)</div>
                      </div>
                    </div>
                  </div>
                  <div className="advisory-card">
                    <h4>Doris E. V.</h4>
                    <div className="role">Research Advisor</div>
                    <div className="bio">
                      <div className="education">
                        <div className="education-item">PhD in Integrative Biology</div>
                        <div className="education-item">University of California, Berkeley (2001)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinical & Research Advisors */}
              <div className="advisory-category">
                <h3>Clinical & Research Advisors</h3>
                <div className="advisory-grid">
                  <div className="advisory-card">
                    <h4>Dr Om Prakash Singh, MD</h4>
                    <div className="role">Clinical Advisor</div>
                    <div className="bio">
                      <div className="education">
                        <div className="education-item">Incoming National President, Indian Psychiatric Society</div>
                      </div>
                    </div>
                  </div>
                  <div className="advisory-card">
                    <h4>Dr Moumita Roy</h4>
                    <div className="role">Child Psychologist</div>
                    <div className="bio">
                      <div className="education">
                        <div className="education-item">North 24 Parganas District Hospital</div>
                        <div className="education-item">(largest district in India by population)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business & GTM Advisors */}
              <div className="advisory-category">
                <h3>Business & GTM Advisors</h3>
                <div className="advisory-grid">
                  <div className="advisory-card">
                    <h4>Amit Goenka</h4>
                    <div className="role">Business Advisor</div>
                    <div className="bio">
                      <div className="education">
                        <div className="education-item">
                          Chief Executive, International Broadcast, Zee Entertainment Enterprises
                        </div>
                        <div className="education-item">Head, Z5 Global & Zee Learn</div>
                      </div>
                    </div>
                  </div>
                  <div className="advisory-card">
                    <h4>Shreya Jain, MBA</h4>
                    <div className="role">GTM Advisor</div>
                    <div className="bio">
                      <div className="education">
                        <div className="education-item">Founder, The Stack</div>
                        <div className="education-item">Founder, Reservoir Neurodiversity</div>
                        <div className="education-item">Formerly at BYJU&apos;S</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section
            className="team-section"
            style={{
              textAlign: "center",
              padding: "60px 0",
              background: "var(--bg-light)",
              borderRadius: "16px",
              marginTop: "80px",
            }}
          >
            <h2 style={{ border: "none", marginBottom: "24px" }}>Join Our Mission</h2>
            <p
              style={{
                maxWidth: "600px",
                margin: "0 auto 32px",
                fontSize: "18px",
                color: "var(--text-secondary)",
              }}
            >
              We&apos;re always looking for talented individuals who share our passion for understanding how children learn.
            </p>
            <Link href="/#contact" className="btn-primary">
              Get in Touch
            </Link>
          </section>
        </div>
      </section>
    </>
  );
}

