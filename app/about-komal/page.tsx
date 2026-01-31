"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import Script from "next/script";

export default function AboutKomalPage() {
  return (
    <>
      {/* Comprehensive Structured Data for Knowledge Panel */}
      <Script
        id="about-komal-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Komal Kids",
            "alternateName": ["Komal", "Komal – Your Digital Buddy", "KomalKids"],
            "url": "https://komalkids.com",
            "logo": "https://komalkids.com/komaliconnobg.png",
            "description": "Komal Kids (also known as Komal, Komal – Your Digital Buddy) is an AI-powered digital guardian for children ages 3-12. Using real-time behavioral AI, Komal adapts to each child's emotional and learning state, providing safe, age-appropriate digital experiences while protecting privacy through on-device processing.",
            "foundingDate": "2024",
            "founders": [
              {
                "@type": "Person",
                "name": "Aranyo Ray",
                "jobTitle": "Co-Founder & CEO",
                "alumniOf": "Yale University",
                "award": "1st Place, APA at ISEF"
              },
              {
                "@type": "Person",
                "name": "Jvalaj Pandey",
                "jobTitle": "Co-Founder & CTO",
                "alumniOf": "University of South Florida"
              }
            ],
            "sameAs": [
              "https://play.google.com/store/apps/details?id=com.komalkids.app",
              "https://apps.apple.com/app/komal",
              "https://www.linkedin.com/company/komalkids/",
              "https://x.com/komalforkids",
              "https://www.instagram.com/komalforkids",
              "https://www.youtube.com/@komalforkids"
            ],
            "areaServed": {
              "@type": "Place",
              "name": "Global"
            },
            "audience": {
              "@type": "PeopleAudience",
              "audienceType": "Parents, Children, Educators, Pediatric Clinics"
            },
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "iOS, Android"
          }),
        }}
      />
      <Script
        id="about-komal-software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Komal Kids",
            "alternateName": ["Komal", "Komal – Your Digital Buddy"],
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "iOS, Android",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "500"
            },
            "screenshot": "https://komalkids.com/heroimage.png",
            "featureList": [
              "Real-time behavioral AI adaptation",
              "On-device privacy processing",
              "Weekly parent insights",
              "COPPA & GDPR-K compliant",
              "Age-appropriate content filtering",
              "Screen time management"
            ]
          }),
        }}
      />

      <div className="min-h-screen pt-20">
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
          {/* Header */}
          <ScrollReveal>
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text">
                About Komal Kids
              </h1>
              <p className="text-xl text-text-dim leading-relaxed">
                <strong>Komal Kids</strong> (also known as <strong>Komal</strong>, <strong>Komal – Your Digital Buddy</strong>) 
                is the world's first AI-powered digital guardian that reads how a child feels, not just what they click.
              </p>
            </header>
          </ScrollReveal>

          {/* What is Komal */}
          <ScrollReveal delay={0.1}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-text">What is Komal Kids?</h2>
              <div className="prose prose-lg max-w-none text-text-dim leading-relaxed space-y-4">
                <p>
                  Komal Kids is an AI-powered digital guardian designed for children ages 3-12. Unlike traditional 
                  parental control apps that operate on simple block-or-allow rules, Komal uses real-time behavioral 
                  AI to understand your child's emotional state, engagement level, and learning patterns through 
                  gaze tracking, touch interactions, and micro-expressions.
                </p>
                <p>
                  The platform adapts the digital experience instantly—detecting frustration, hesitation, or delight—and 
                  adjusts content pacing, difficulty, and tone in under 200 milliseconds. This real-time adaptation 
                  ensures children receive age-appropriate, safe content while nurturing their curiosity and learning.
                </p>
                <p>
                  All AI processing happens on-device, meaning your child's data never leaves your device without 
                  explicit parental consent. Komal is COPPA and GDPR-K compliant, built on 20+ years of research and 
                  analysis of approximately 2 billion played sessions.
                </p>
              </div>
            </section>
          </ScrollReveal>

          {/* Founding Team */}
          <ScrollReveal delay={0.2}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-text">Founding Team</h2>
              <div className="space-y-8">
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-2 text-text">Aranyo Ray</h3>
                  <p className="text-sm text-text-dim mb-3">Co-Founder & CEO</p>
                  <p className="text-text-dim leading-relaxed">
                    Aranyo built edtech products and worked at pioneering SaaS startups like Graymatics and Commenda. 
                    A Wu Tsai Scholar at Yale University investigating implicit bias in multicultural learning, he won 
                    1st Place from the American Psychological Association (APA) at ISEF for his culturally relevant 
                    game app and is published in Harvard's Journal of Emerging Investigators. At Komal, he leads 
                    overall execution and expansion.
                  </p>
                  <p className="text-sm text-text-dim mt-2">
                    <strong>Credentials:</strong> Wu Tsai Scholar, Yale University | Ex-Graymatics, Commenda | 
                    Published in Harvard's Journal of Emerging Investigators
                  </p>
                </div>

                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-2 text-text">Jvalaj Pandey</h3>
                  <p className="text-sm text-text-dim mb-3">Co-Founder & CTO</p>
                  <p className="text-text-dim leading-relaxed">
                    Jvalaj is a Full Stack Engineer and Designer specializing in high-performance web interfaces and 
                    AI-driven design. With experience at Delta Air Lines and Nucor Steel, he leads Komal's technical 
                    implementation. He previously built AI tools like GRID and VS Chat, combining artistic vision 
                    with scalable engineering to build the future of child safety.
                  </p>
                  <p className="text-sm text-text-dim mt-2">
                    <strong>Credentials:</strong> Ex-Delta Air Lines, Nucor | BS CS @ USF (Honors) | Full Stack Engineer
                  </p>
                </div>

                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-2 text-text">Saarthak Kumar</h3>
                  <p className="text-sm text-text-dim mb-3">Policy Lead</p>
                  <p className="text-text-dim leading-relaxed">
                    Saarthak holds MPAs from Columbia University and the London School of Economics in economic 
                    policy and quantitative analysis. He served as an Advisor to the Permanent Mission of India 
                    at the United Nations, bringing expertise in international policy and development economics.
                  </p>
                  <p className="text-sm text-text-dim mt-2">
                    <strong>Credentials:</strong> MPA, Columbia & LSE | Ex-UN Advisor
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Advisory Board */}
          <ScrollReveal delay={0.3}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-text">Advisory Board</h2>
              <div className="space-y-6">
                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-2 text-text">Dr. Doris E. V., PhD</h3>
                  <p className="text-sm text-text-dim mb-3">Research Advisor | UC Berkeley</p>
                  <p className="text-text-dim leading-relaxed">
                    Dr. Doris holds a PhD in Integrative Biology from UC Berkeley. She brings deep expertise in 
                    biological systems and research methodology to Komal, ensuring our scientific approach is both 
                    rigorous and sound.
                  </p>
                </div>

                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-2 text-text">Audrey Wisch</h3>
                  <p className="text-sm text-text-dim mb-3">GTM Advisor | Co-Founder & CEO, Curious Cardinals | Forbes 30u30</p>
                  <p className="text-text-dim leading-relaxed">
                    Audrey is the Co-Founder & CEO of Curious Cardinals, a leading mentorship platform connecting 
                    students with inspiring role models. A Forbes 30 Under 30 honoree, she brings deep expertise in 
                    education technology, youth engagement, and scaling mission-driven startups to help Komal reach 
                    families worldwide.
                  </p>
                </div>

                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-2 text-text">Prof. (Dr.) Om Prakash Singh, MD, FRCP</h3>
                  <p className="text-sm text-text-dim mb-3">Editor-in-Chief, Indian Journal of Psychiatry</p>
                  <p className="text-text-dim leading-relaxed">
                    Dr. Singh is a senior psychiatrist with three decades of clinical, academic, and leadership experience, 
                    shaping psychiatric education, research standards, and policy in South Asia. He specializes in child 
                    and adolescent mental health, community psychiatry, ethics, and access to care, authoring 140+ 
                    peer-reviewed articles and 2 books. He holds an MD from Lady Hardinge Medical College, is a Fellow of 
                    the Royal College of Physicians (Edinburgh) and International Distinguished Fellow of the APA. At Komal, 
                    he advises our de-addiction strategy and psychosocial framework for children's digital experiences.
                  </p>
                </div>

                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-2 text-text">Bratati Sinha Ray</h3>
                  <p className="text-sm text-text-dim mb-3">Consultant Psychologist | Apollo Clinic | 22+ years experience</p>
                  <p className="text-text-dim leading-relaxed">
                    Bratati is a Consultant Psychologist and Psychotherapist at Apollo Clinic with 22+ years of experience 
                    in child psychology, working pan-India across cultural boundaries with clients aged 5-85. She specializes 
                    in supporting children and adolescents with ADHD, learning disorders, ASD, OCD, anxiety, depression, and 
                    addiction. She holds a Masters in Clinical Psychology, PGDs in Psychological Counselling and Clinical 
                    Psychology, and is a certified Trauma Healer.
                  </p>
                </div>

                <div className="bg-surface/50 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-2 text-text">Shreya Jain, MBA</h3>
                  <p className="text-sm text-text-dim mb-3">GTM Advisor | Founder, The Stack | Formerly at BYJU'S</p>
                  <p className="text-text-dim leading-relaxed">
                    Shreya is the Founder of The Stack and Reservoir Neurodiversity. Formerly at BYJU'S, she is an expert 
                    in go-to-market strategy and neurodiversity, helping Komal reach and support diverse communities through 
                    strategic growth.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Research Foundation */}
          <ScrollReveal delay={0.4}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-text">Research Foundation</h2>
              <div className="prose prose-lg max-w-none text-text-dim leading-relaxed space-y-4">
                <p>
                  Komal Kids is built on 20+ years of extensive research and analysis of approximately 2 billion played 
                  sessions. Our approach is grounded in evidence-based practices from child psychology, developmental 
                  neuroscience, and educational technology.
                </p>
                <p>
                  The platform incorporates insights from leading research institutions including Yale University, UC Berkeley, 
                  and the University of Calgary's Internal Attention Lab. Our advisory board includes experts from the 
                  American Psychological Association, Indian Journal of Psychiatry, and leading pediatric psychology clinics.
                </p>
                <p>
                  Komal's real-time behavioral AI is informed by research on attention tracking, ADHD detection, mindfulness 
                  interventions, and culturally relevant learning frameworks. All methodologies are peer-reviewed and 
                  published in leading academic journals.
                </p>
              </div>
            </section>
          </ScrollReveal>

          {/* Privacy & Compliance */}
          <ScrollReveal delay={0.5}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-text">Privacy & Compliance</h2>
              <div className="prose prose-lg max-w-none text-text-dim leading-relaxed space-y-4">
                <p>
                  Komal Kids is fully compliant with COPPA (Children's Online Privacy Protection Act) and GDPR-K 
                  (General Data Protection Regulation for Kids). All AI processing happens on-device, meaning no raw 
                  video, audio, or biometric identifiers are stored or transmitted.
                </p>
                <p>
                  Only de-identified scores are used for long-term analyses. Raw media is automatically deleted after 
                  24 hours or if the app is uninstalled. Parents maintain full control over what data is shared and with 
                  whom, including the ability to share reports with teachers and therapists via one-click sharing.
                </p>
                <p>
                  Komal never sells data or uses it for advertising purposes. Our privacy-first approach ensures that 
                  children can explore safely while parents maintain complete transparency and control.
                </p>
              </div>
            </section>
          </ScrollReveal>

          {/* Download Links */}
          <ScrollReveal delay={0.6}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-text">Download Komal Kids</h2>
              <div className="flex flex-wrap items-center justify-center gap-4">
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
            </section>
          </ScrollReveal>

          {/* Contact & Links */}
          <ScrollReveal delay={0.7}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-text">Connect With Us</h2>
              <div className="flex flex-wrap gap-4">
                <Link href="https://www.linkedin.com/company/komalkids/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  LinkedIn
                </Link>
                <Link href="https://x.com/komalforkids" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Twitter/X
                </Link>
                <Link href="https://www.instagram.com/komalforkids" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Instagram
                </Link>
                <Link href="https://www.youtube.com/@komalforkids" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  YouTube
                </Link>
              </div>
            </section>
          </ScrollReveal>
        </article>
      </div>
    </>
  );
}
