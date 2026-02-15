"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingOrbs from "@/components/FloatingOrbs";
import TextShimmer from "@/components/TextShimmer";
import NoiseOverlay from "@/components/NoiseOverlay";
import ParticleField from "@/components/ParticleField";
import FaqAccordion from "@/components/FaqAccordion";
import Script from "next/script";
import { ShieldIcon, BrainIcon, ActivityIcon, ChartIcon } from "@/components/Icons";

const benefits = [
  {
    title: "Reduce Parenting Stress",
    description:
      "Employees get real-time peace of mind about their children's digital safety. When parents know their kids are guided online, they focus better at work.",
    icon: BrainIcon,
    color: "from-blue-400 to-indigo-500",
  },
  {
    title: "Improve Retention",
    description:
      "Family-focused benefits increase employee loyalty and reduce turnover. Companies that invest in working parents see measurably higher engagement and retention.",
    icon: ChartIcon,
    color: "from-violet-400 to-purple-500",
  },
  {
    title: "Easy Deployment",
    description:
      "Bulk enrollment, no IT overhead, works on any device. HR teams can onboard hundreds of families in minutes with a simple invite link.",
    icon: ActivityIcon,
    color: "from-emerald-400 to-teal-500",
  },
  {
    title: "Privacy-First",
    description:
      "COPPA and GDPR-K compliant. No employee data collection, only child safety. On-device processing means sensitive data never leaves the family's device.",
    icon: ShieldIcon,
    color: "from-amber-400 to-orange-500",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Add to Benefits Package",
    description:
      "Your HR or benefits team adds Komal to your employee benefits catalog. We provide all the materials you need: enrollment guides, employee-facing explainers, and internal comms templates.",
  },
  {
    step: "02",
    title: "Employees Enroll Families",
    description:
      "Employees sign up through a dedicated company portal or invite link. Each parent creates a family account and adds their children's devices in under five minutes.",
  },
  {
    step: "03",
    title: "Parents Get Insights",
    description:
      "Parents receive real-time guidance and weekly wellbeing reports on their children's digital engagement. No employer access to family data. Parents stay informed, employees stay focused.",
  },
];

const whoOffersKomal = [
  {
    title: "Insurance Companies",
    description:
      "Offer Komal as a digital mental health benefit add-on to family plans. A natural extension of child and adolescent wellness coverage.",
  },
  {
    title: "Corporate HR Departments",
    description:
      "Add Komal to your employee benefits package alongside EAP, childcare, and wellness programs. Support the whole family, not just the employee.",
  },
  {
    title: "Employee Benefits Providers",
    description:
      "Integrate Komal into your benefits marketplace. Give employers a differentiated family-focused offering that drives enrollment and satisfaction.",
  },
  {
    title: "Telehealth Platforms",
    description:
      "Complement virtual pediatric and family therapy services with between-session digital wellbeing insights that clinicians and parents can review together.",
  },
  {
    title: "Therapy Networks",
    description:
      "Recommend Komal to families in your network. Therapists get useful context on children's digital engagement patterns to inform treatment conversations.",
  },
];

const faqs = [
  {
    question: "How does Komal work as an employee benefit?",
    answer:
      "Komal is offered as a voluntary family benefit. Your HR team adds it to your benefits catalog, employees enroll their families through a dedicated portal, and parents receive real-time guidance and weekly reports on their children's digital engagement. No IT integration is required and there is zero employer access to family data.",
  },
  {
    question: "What does deployment look like for HR teams?",
    answer:
      "Deployment is lightweight. We provide a dedicated enrollment link for your organization, employee-facing communication templates, and an onboarding guide. There is no software to install on company devices. Employees set up Komal on their family's personal devices. Most organizations go live within a week.",
  },
  {
    question: "Does the employer see any employee or family data?",
    answer:
      "No. Komal is strictly a family-facing tool. Employers receive only aggregate, anonymized adoption and engagement metrics (e.g., enrollment rate, active families). No individual employee data, no child data, and no family activity data is ever shared with the employer.",
  },
  {
    question: "How is Komal priced for employers?",
    answer:
      "Komal offers per-employee-per-month pricing with volume discounts for organizations with 500+ enrolled employees. We also support employer-subsidized and employer-paid models. Contact us for a custom quote based on your organization's size and structure.",
  },
  {
    question: "What compliance standards does Komal meet?",
    answer:
      "Komal is COPPA compliant and designed with GDPR-K standards in mind. Data is processed on-device. We do not store child-identifiable information in the cloud. For organizations with specific compliance requirements (SOC 2, HIPAA-adjacent), we can provide detailed documentation of our privacy architecture.",
  },
  {
    question: "How is this different from parental control apps?",
    answer:
      "Parental control apps block and monitor. Komal guides and develops. Instead of surveillance, Komal uses a peer-avatar companion that helps children build self-regulation and digital judgment. Parents receive wellbeing insights rather than activity logs. This approach reduces family conflict and builds lasting digital literacy skills.",
  },
  {
    question: "Can Komal integrate with our existing benefits platform?",
    answer:
      "Yes. Komal integrates with major benefits platforms and HRIS systems through standard SSO and enrollment APIs. We also support standalone enrollment via invite link for organizations that prefer a simpler setup. Our team handles the technical integration at no additional cost.",
  },
  {
    question: "What ROI can we expect from offering Komal?",
    answer:
      "Organizations that offer family-focused benefits see measurable improvements in retention, engagement, and absenteeism. Working parents who report lower stress about their children's digital lives are more focused and productive. We provide quarterly impact reports with anonymized adoption and satisfaction metrics specific to your organization.",
  },
];

export default function ForEmployersPage() {
  return (
    <>
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Komal for Employers | Family Digital Wellbeing as an Employee Benefit",
            description:
              "Offer Komal as a family digital wellbeing employee benefit. Support working parents, reduce parenting stress, and improve retention with psychology-informed child digital safety.",
            url: "https://komalkids.com/for-employers",
          }),
        }}
      />

      <NoiseOverlay opacity={0.025} />
      <ParticleField count={30} color="263, 50%, 40%" speed={0.15} connectDistance={80} />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <FloatingOrbs count={3} />
        </div>

        <div className="container max-w-[1300px] px-6 md:px-10 mx-auto relative z-10">
          <div className="text-center">
            <ScrollReveal delay={0.05}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                For Employers &amp; HR Leaders
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="font-sans font-bold leading-[1.1] tracking-tight text-primary text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] mb-6">
                Support Working Parents.
                <span className="block">
                  <TextShimmer duration={4}>Protect Their Kids Online.</TextShimmer>
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-center text-lg md:text-xl text-text-dim max-w-2xl mx-auto mb-10 leading-relaxed">
                Komal is a family digital wellbeing benefit that gives employees peace of mind about their children&apos;s online safety. Reduce parenting stress, improve focus, and increase retention with a benefit families actually use.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary-premium text-white text-lg px-8 py-4 h-auto rounded-full border-0"
                >
                  <Link href="/demo">Learn More</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white text-primary border-primary border-2 hover:bg-primary/5 text-lg px-8 py-4 h-auto rounded-full"
                >
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* The Working Parent Challenge */}
      <section className="py-20 bg-gradient-to-b from-white to-violet-50/30">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                The Working Parent Challenge
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Parents worry about their children&apos;s screen time at work. That worry costs your organization focus, productivity, and talent.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "71% Report Stress",
                body: "71% of working parents report stress about their children's digital lives. That stress follows them to work every day, reducing focus and engagement.",
                label: "The problem",
                labelColor: "text-rose-600 bg-rose-50",
              },
              {
                title: "Distraction at Work",
                body: "Parents check their phones, worry during meetings, and lose productive hours to anxiety about what their kids are seeing and doing online.",
                label: "The cost",
                labelColor: "text-amber-600 bg-amber-50",
              },
              {
                title: "Peace of Mind with Komal",
                body: "Komal gives parents real-time confidence that their children are guided safely online. When parents know their kids are okay, they do their best work.",
                label: "The solution",
                labelColor: "text-emerald-600 bg-emerald-50",
              },
            ].map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 h-full">
                  <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mb-4 ${item.labelColor}`}>
                    {item.label}
                  </span>
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

      {/* Core Benefits */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
                Why Employers Choose Komal
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                A family digital wellbeing benefit that supports employees, protects children, and strengthens your organization.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
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

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                How It Works for Employers
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Three simple steps to offer family digital wellbeing as an employee benefit. No IT overhead required.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <ScrollReveal key={item.step} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 h-full">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-text-dim leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who Offers Komal */}
      <section className="py-20 bg-white">
        <div className="container max-w-[1100px] px-8 mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Who Offers Komal
              </h2>
              <p className="text-lg text-text-dim max-w-2xl mx-auto">
                Komal fits into existing benefits ecosystems across healthcare, corporate, and wellness channels.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whoOffersKomal.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.1}>
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                  <h3 className="text-lg font-bold text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-text-dim leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container max-w-[800px] px-8 mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
              Questions from HR &amp; Benefits Leaders
            </h2>
          </ScrollReveal>
          <FaqAccordion items={faqs} />
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
                Invest in Families. Strengthen Your Workforce.
              </TextShimmer>
            </h2>
            <p className="text-lg opacity-90 mb-10">
              Give working parents the peace of mind they need with a family digital wellbeing benefit their families will actually use. Schedule a conversation to learn how Komal can support your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="btn-primary-premium-inverted text-lg px-8 py-4 h-auto rounded-full border-0"
              >
                <Link href="/demo">Schedule a Conversation</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white border-2 hover:bg-white/10 text-lg px-8 py-4 h-auto rounded-full"
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
