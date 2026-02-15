"use client";

import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingOrbs from "@/components/FloatingOrbs";
import FloatingDots from "@/components/FloatingDots";
import TextShimmer from "@/components/TextShimmer";
import NoiseOverlay from "@/components/NoiseOverlay";
import ParticleField from "@/components/ParticleField";
import FaqAccordion from "@/components/FaqAccordion";
import { ShieldIcon, BrainIcon, ActivityIcon, ChartIcon } from "@/components/Icons";

const forChildrenBenefits = [
  {
    title: "Mentor & Lead",
    description:
      "Help younger kids (ages 4-14) build Safe Digital Journeys using Komal's peer-avatar (pavatar) technology. Lead peer support groups and workshops that teach digital navigation skills.",
    icon: BrainIcon,
    color: "from-violet-400 to-purple-500",
  },
  {
    title: "Build Your Portfolio",
    description:
      "Earn a Komal Digital Leadership Certificate and build a CV that stands out to universities and scholarship committees. Document your mentorship hours, workshop facilitation, and ethical AI literacy.",
    icon: ChartIcon,
    color: "from-blue-400 to-indigo-500",
  },
  {
    title: "Shape the Technology",
    description:
      "Get early access to features like Mindful Surfing and provide direct feedback to our R&D team. Your perspective as a young person directly influences what we build.",
    icon: ActivityIcon,
    color: "from-emerald-400 to-teal-500",
  },
  {
    title: "Join a Global Community",
    description:
      "Connect with like-minded young people across India, the US, UK, Singapore, and beyond who believe the internet should be a place for learning and meaningful connection.",
    icon: ShieldIcon,
    color: "from-amber-400 to-orange-500",
  },
];

const forParentsBenefits = [
  {
    title: "Co-Learn with Your Child",
    description:
      "The Pioneer Program isn't just for young people. Parents join as co-learners, building digital literacy alongside their children and modeling healthy digital habits.",
  },
  {
    title: "Early Access to Clinical-Grade Reports",
    description:
      "Pioneer families get first access to longitudinal developmental reports that identify engagement patterns and milestones, often months before they show up in traditional assessments.",
  },
  {
    title: "Connect with Experts",
    description:
      "Join a community of parents and leading child psychologists sharing evidence-based strategies for raising digitally resilient children.",
  },
  {
    title: "Guilt-Free Parenting Strategies",
    description:
      "Access research-backed approaches to screen time that move beyond fear and guilt. Learn what actually works, grounded in developmental science.",
  },
];

const steps = [
  {
    step: "1",
    title: "Apply Online",
    description:
      "Fill out a short application. Children need parental consent. Parents can apply for themselves and/or their child.",
  },
  {
    step: "2",
    title: "Use Code SUNSHINE50",
    description:
      "Enter the code SUNSHINE50 during your application to join the Pioneer Program at the founding rate of $19.99 (lifetime), a 50% discount from the standard $39.99.",
  },
  {
    step: "3",
    title: "Complete Onboarding",
    description:
      "A short orientation introduces you to Komal's tools, the Pioneer community, and your first mentorship or learning pathway.",
  },
  {
    step: "4",
    title: "Start Leading",
    description:
      "Begin mentoring, facilitating workshops, testing new features, or co-learning with your family. Track your progress toward your Digital Leadership Certificate.",
  },
];

const faqs = [
  {
    question: "Who can become a Komal Pioneer?",
    answer:
      "Any child, teenager, or parent worldwide can apply. Children under 13 need parental consent. There are no minimum grades, test scores, or prior experience required. We're looking for curiosity, empathy, and a willingness to lead by example in digital spaces.",
  },
  {
    question: "What is the time commitment?",
    answer:
      "Pioneers typically commit 2-4 hours per month. This includes participating in one peer circle or workshop session, providing feedback on features, and engaging with the Pioneer community. The program is designed to fit around school, extracurriculars, and family life.",
  },
  {
    question: "How does the Digital Leadership Certificate work?",
    answer:
      "The certificate documents your mentorship hours, workshop facilitation, feature testing contributions, and ethical AI literacy milestones. It is designed to be substantive enough for college applications and scholarship portfolios. Pioneers receive their certificate after completing the core program pathway.",
  },
  {
    question: "What does a parent Pioneer do?",
    answer:
      "Parent Pioneers co-learn alongside their children, participate in expert webinars on digital wellbeing, share parenting strategies with the community, and help shape Komal's product direction through feedback. It's a way to actively engage with your child's digital development rather than passively monitoring it.",
  },
  {
    question: "Is the Pioneer Program free?",
    answer:
      "The founding rate is $19.99 (lifetime access) using code SUNSHINE50, which is a 50% discount from the standard $39.99. This covers full program access, community membership, certificate eligibility, and early access to new Komal features.",
  },
  {
    question: "How does this help with college admissions?",
    answer:
      "The Pioneer Program provides documented community service in digital wellbeing, a growing area of interest for admissions committees. Pioneers can point to specific mentorship hours, workshop facilitation, and ethical AI literacy, all verified by Komal. This is substantively different from typical extracurriculars.",
  },
  {
    question: "Can schools or clubs run Pioneer circles?",
    answer:
      "Yes. Schools, digital literacy clubs, libraries, community centers, after-school programs, and religious schools can partner with Komal to run Pioneer circles. Contact us to set up a group program with customized onboarding and institutional support.",
  },
  {
    question: "What countries is the Pioneer Program available in?",
    answer:
      "The Pioneer Program is available globally. Our initial community includes families from India, the US, UK, Singapore, UAE, Canada, and beyond. All program activities are conducted in English, with localization planned for additional languages.",
  },
];

export default function PioneerPage() {
  return (
    <>
      <Script
        id="pioneer-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Pioneer Program | Youth Digital Leadership & Citizenship | Komal Kids",
            description:
              "Join the Komal Pioneer Program — youth leadership and digital citizenship for children, teens, and parents globally. Mentor younger kids, earn a Digital Leadership Certificate, and build a standout portfolio for college. Use code SUNSHINE50.",
            url: "https://komalkids.com/pioneer",
          }),
        }}
      />

      <NoiseOverlay opacity={0.025} />
      <ParticleField count={35} color="263, 50%, 40%" speed={0.2} connectDistance={80} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <FloatingOrbs count={4} />
        </div>
        <div className="absolute inset-0 z-0">
          <FloatingDots />
        </div>

        <div className="container max-w-[1300px] px-6 md:px-10 mx-auto relative z-10">
          <div className="text-center">
            <ScrollReveal delay={0.05}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                For Children, Teens &amp; Parents
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="font-sans font-bold leading-[1.1] tracking-tight text-primary text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] mb-6">
                The Komal
                <span className="block">
                  <TextShimmer duration={4}>Pioneer Program</TextShimmer>
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-center text-lg md:text-xl text-text-dim max-w-2xl mx-auto mb-10 leading-relaxed">
                The internet should be a place where we gain knowledge and connect
                with inspiring peers, not just a source of passive scrolling.
                We&apos;re looking for the next generation of leaders to show that
                digital wellbeing is a superpower.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary-premium text-white text-lg px-8 py-4 h-auto rounded-full border-0"
                >
                  <Link href="/sign-up">Apply with Code SUNSHINE50</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white text-primary border-primary border-2 hover:bg-primary/5 text-lg px-8 py-4 h-auto rounded-full"
                >
                  <Link href="#how-to-apply">How It Works</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Why Become a Pioneer */}
      <section className="py-20 bg-gradient-to-b from-white to-amber-50/30 relative">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
                Why Become a Komal Pioneer?
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Pioneers are youth leaders and digital role models who embody Komal&apos;s
                mission of digital wellbeing and safety. This is Model UN meets
                digital citizenship meets building something real. Open to children,
                teens, and parents in India, the US, UK, Singapore, UAE, and beyond.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                stat: "170+",
                label: "Families trust Komal across 5 countries",
              },
              {
                stat: "90+",
                label: "Hours of mindful interaction delivered to kids",
              },
              {
                stat: "6-18 mo",
                label: "Earlier milestone identification through longitudinal insights",
              },
            ].map((item, index) => (
              <ScrollReveal key={item.label} delay={index * 0.1}>
                <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                  <p className="text-4xl font-black text-primary mb-2">{item.stat}</p>
                  <p className="text-text-dim text-sm">{item.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* For Children & Teens */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
                For Children &amp; Teens
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Build future-proof skills: communication, peer mentoring, ethical AI literacy, and digital resilience.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {forChildrenBenefits.map((benefit, index) => (
              <ScrollReveal key={benefit.title} delay={index * 0.1}>
                <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <benefit.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-text-dim leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Do */}
      <section className="py-20 bg-gradient-to-b from-white to-violet-50/30">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                What Pioneers Do
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Lead peer circles for younger children navigating digital spaces",
              "Co-create Safe Digital Journeys using pavatar technology",
              "Test and provide feedback on features like Mindful Surfing",
              "Facilitate digital wellbeing workshops at school or in the community",
              "Share your experience through the Pioneer blog and community channels",
              "Mentor new Pioneers joining the program",
            ].map((activity, index) => (
              <ScrollReveal key={index} delay={index * 0.05}>
                <div className="flex items-start gap-3 bg-white rounded-xl p-6 border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white shrink-0 mt-0.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-text-dim leading-relaxed">{activity}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* For Parents */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
                For Parents
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                The Pioneer Program is open to parents too. Co-learn, co-lead, and model healthy digital habits at home.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {forParentsBenefits.map((benefit, index) => (
              <ScrollReveal key={benefit.title} delay={index * 0.1}>
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                  <h3 className="text-lg font-bold text-primary mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-text-dim leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* For Schools & Clubs */}
      <section className="py-20 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                For Schools &amp; Clubs
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Run Pioneer circles in your school, library, community center, or after-school program.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Student Councils",
                body: "Integrate the Pioneer Program into existing student leadership structures. Pioneers lead digital wellbeing initiatives campus-wide.",
              },
              {
                title: "Digital Literacy Clubs",
                body: "Perfect complement to existing tech and digital literacy programs. Add a wellbeing and ethics dimension to technical skill-building.",
              },
              {
                title: "Libraries & Community Centers",
                body: "Bring the Pioneer Program to public spaces where families gather. Komal provides all materials and onboarding support for institutional partners.",
              },
            ].map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-text-dim leading-relaxed">{item.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates & Portfolio */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1000px] px-8 mx-auto">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-3xl p-10 border border-violet-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                  Certificates, Portfolios &amp; CV Boost
                </h2>
                <p className="text-lg text-text-dim max-w-2xl mx-auto">
                  The Pioneer Program isn&apos;t a participation trophy. It&apos;s a documented leadership credential.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Komal Digital Leadership Certificate with verified mentorship hours",
                  "Portfolio of workshop facilitation and community impact",
                  "Demonstrated ethical AI literacy and digital citizenship",
                  "Recommendation support for college applications and scholarships",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white shrink-0 mt-0.5">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-text-dim leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How to Apply */}
      <section id="how-to-apply" className="py-20 bg-gradient-to-b from-white to-amber-50/30">
        <div className="container max-w-[1000px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
                How to Apply with SUNSHINE50
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Join the Pioneer Program at the founding rate of $19.99 (lifetime), a 50% discount from the standard $39.99.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((item, index) => (
              <ScrollReveal key={item.step} delay={index * 0.1}>
                <div className="flex gap-6 bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-text-dim leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-[800px] px-8 mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
              Pioneer Program FAQ
            </h2>
          </ScrollReveal>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <FloatingOrbs count={4} />
        </div>
        <div className="container max-w-[900px] px-8 mx-auto text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <TextShimmer duration={4}>
                Ready to Step Up?
              </TextShimmer>
            </h2>
            <p className="text-lg opacity-90 mb-4">
              Use code <span className="font-bold">SUNSHINE50</span> to apply for the Pioneer Program and start your journey as a digital role model.
            </p>
            <p className="text-sm opacity-75 mb-10">
              $19.99 lifetime (50% off standard $39.99). Available globally for children, teens, and parents.
            </p>
            <Button
              asChild
              size="lg"
              className="btn-primary-premium-inverted text-lg px-8 py-4 h-auto rounded-full border-0"
            >
              <Link href="/sign-up">Apply Now</Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
