"use client";

import Image from "next/image";
import FloatingOrbs from "@/components/FloatingOrbs";
import ScrollReveal from "@/components/ScrollReveal";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const DetailItem = ({ title, content }: { title: string; content: string }) => {
    return (
        <AccordionItem value={title} className="border-b border-gray-100 last:border-0 mb-1">
            <AccordionTrigger className="hover:no-underline hover:bg-gray-50/50 py-3 px-2 rounded-lg text-sm md:text-base font-medium text-gray-700 hover:text-primary transition-colors text-left [&[data-state=open]]:text-primary decoration-transparent">
                <div className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" opacity="0.5" />
                        </svg>
                    </span>
                    {title}
                </div>
            </AccordionTrigger>
            <AccordionContent className="text-gray-500 text-sm pl-10 pr-4 pb-4">
                {content}
            </AccordionContent>
        </AccordionItem>
    );
};

export default function WhyPage() {
    return (
        <main className="min-h-screen bg-[#F9F9FB] relative overflow-hidden">
            {/* Subtle Background Elements */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <FloatingOrbs count={3} />
            </div>

            {/* Spacer */}
            <div className="h-16 md:h-24" />

            {/* Article content */}
            <article className="relative z-10 max-w-[720px] mx-auto px-6 pb-20">
                <ScrollReveal>
                    <div className="relative">
                        {/* Top violet accent line */}
                        <div className="w-full h-1.5 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20 opacity-80 mb-10 rounded-full" />

                        {/* Date */}
                        <p className="text-xs tracking-widest text-primary/60 uppercase mb-8 font-medium">
                            September 2025
                        </p>

                        {/* Main Title */}
                        <h1 className=" text-primary/70 text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] leading-[1.1] font-bold  tracking-tight mb-10">
                            Introducing

                            <span className="text-primary text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] leading-[1.1] font-bold  tracking-tight mb-10">
                                {' '}AgileWeb.
                            </span>
                        </h1>

                        {/* Content */}
                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-7">
                            <p className="text-xl font-medium text-primary/80">
                                AgileWeb is the world&apos;s first AI digital guardian that reads how a child feels, not just what they click.
                            </p>

                            <p>
                                Traditional parental controls operate on a simple binary: block or allow. They build walls. But walls don't teach—they just restrict. We believe children learn by exploring, questioning, and sometimes stumbling. They need a guide that understands context, not a gatekeeper that follows rigid rules.
                            </p>

                            <p>
                                That&apos;s why we built AgileWeb. It uses real-time behavioral AI to understand your child&apos;s engagement—detecting frustration, hesitation, or delight—and adapts the digital experience instantly. We don&apos;t just filter content; we nurture curiosity while keeping them safe.
                            </p>

                            <h2 className="text-2xl font-bold text-primary mt-12 mb-5 flex items-center gap-3">
                                <span className="w-8 h-1 bg-primary/20 rounded-full inline-block" />
                                Our Answer
                            </h2>

                            <p>
                                We&apos;re a team of researchers and parents building the next generation of child-safe AI. We believe technology should amplify a parent&apos;s intuition, not replace it. We believe in transparency over black boxes. And we believe every child deserves to explore safely.
                            </p>

                            <div className="pt-8 mt-12 border-b pb-4 border-dashed border-primary/20">
                                <p className="font-semibold text-primary  text-right italic">
                                    — The AgileWeb Team
                                </p>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Bottom subtle text */}

            </article>

            {/* ═══════════════════════════════════════════════════════════════════════════
               INVESTOR SECTIONS
               ═══════════════════════════════════════════════════════════════════════════ */}

            {/* The Deck & Business Plan Section */}
            <section className="relative z-10 max-w-[720px] mx-auto px-6 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* The Deck */}
                    <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="bg-blue-50/80 text-xl font-bold text-gray-900 px-4 py-2 mb-4 -mx-4 -mt-4 rounded-t-lg">
                            The deck
                        </h3>
                        <div className="flex items-center gap-4">
                            <span className="w-8 h-8 text-primary shrink-0">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                </svg>
                            </span>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                Our <strong>confidential investor deck</strong> is available, password-protected on Docsend. Email us for access with your professional email address.
                            </p>
                        </div>
                    </div>

                    {/* The Business Plan */}
                    <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="bg-blue-50/80 text-xl font-bold text-gray-900 px-4 py-2 mb-4 -mx-4 -mt-4 rounded-t-lg">
                            The business plan
                        </h3>
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 text-primary shrink-0">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="20" x2="12" y2="10" />
                                    <line x1="18" y1="20" x2="18" y2="4" />
                                    <line x1="6" y1="20" x2="6" y2="16" />
                                    <polyline points="22 4 12 14 9 11 2 18" />
                                </svg>
                            </span>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                Our <strong>confidential business plan</strong> includes detailed financial projections, go-to-market strategy, and clinical validation roadmap. Contact us for access.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Access Note */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6 flex items-center gap-3">
                    <span className="w-6 h-6 text-amber-600 shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed">
                        Please email <strong>aranyo@komalkids.com</strong> to request access to our confidential materials. We respond within 24 hours to verified investor inquiries. A password-protected link will be provided—please use your professional email to access.
                    </p>
                </div>
            </section>

            {/* Investor FAQ Section */}
            <section className="relative z-10 max-w-[720px] mx-auto px-6 mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8">Investor FAQ</h2>

                <div className="bg-orange-50/50 border border-orange-100 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 text-red-500 shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </span>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            We want investor meetings to be as productive as possible. Below you'll find answers to the most common questions about AgileWeb's technology, market approach, and traction. Reviewing these before our call lets us dive deeper into strategic fit and partnership opportunities.
                        </p>
                    </div>

                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <p className="text-gray-800 font-medium mb-2">
                        Talk to our AI Diligence Assistant (trained on our fundraising materials):
                    </p>
                    <p className="text-gray-500 text-sm italic">
                        Coming soon: An AI assistant trained on our product documentation, clinical results, and investor deck. Request early access via email.
                    </p>
                </div>
            </section>

            {/* Contact Us Section */}
            <section className="relative z-10 max-w-[720px] mx-auto px-6 mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8">Contact us</h2>

                <div className="grid grid-cols-1">
                    {/* Founder 1 */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                        <div className="flex items-center gap-4">
                            <span className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <div>
                                <p className="font-bold text-gray-900 text-lg">Aranyo Ray</p>
                                <p className="text-gray-500 text-sm">CEO & Founder</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-1.5">
                            <p className="text-gray-600 font-medium">+91 76670 70012</p>
                            <p className="text-gray-900 font-medium">aranyo@komalkids.com</p>
                            <a href="https://linkedin.com/in/aranyoray" className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
                                LinkedIn Profile
                                <svg className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M7 17L17 7" />
                                    <path d="M7 7h10v10" />
                                </svg>
                            </a>
                        </div>
                    </div>


                </div>
            </section>

            {/* Detailed Content Section */}
            <section className="relative z-10 max-w-[720px] mx-auto px-6 pb-24 md:pb-32">
                <div className="border-t border-gray-200 pt-10 mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12">Detailed content</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                        {/* Column 1 */}
                        <div className="space-y-12">
                            {/* Our Thesis Group */}
                            <div>
                                <h3 className="bg-blue-50/80 text-2xl font-bold text-gray-900 px-4 py-2 mb-4 -mx-4 rounded-sm">
                                    Our Thesis
                                </h3>
                                <Accordion type="single" collapsible className="w-full">
                                    <DetailItem
                                        title="Our Manifesto"
                                        content="AgileWeb is building the world's first non-addictive AI digital guardian for children ages 3-12. We read behavior—gaze patterns, touch interactions, emotional responses—not just clicks. Every child deserves technology that understands them, protects their curiosity, and grows with them."
                                    />
                                    <DetailItem
                                        title="The pain"
                                        content="Parents face an impossible choice: give children unrestricted internet access and risk exposure to harmful content, or lock everything down and stifle curiosity. Current parental controls are reactive, rigid, and create friction. Children need guidance, not gates."
                                    />
                                    <DetailItem
                                        title="Team & Culture"
                                        content="Our team includes AI engineers, child psychologists, and clinical validators. We're backed by institutional investors who believe in patient capital for breakthrough technology."
                                    />
                                    <DetailItem
                                        title="Cap table & financing"
                                        content="Pre-seed and grant funding from Y Combinator, institutional VCs, and Yale Innovation grants. Current raise: $2M seed round to expand clinical validation, scale behavioral AI infrastructure, and launch beta in 500 families."
                                    />
                                    <DetailItem
                                        title="Use of funds"
                                        content="70% R&D (behavioral AI models, edge computing infrastructure), 20% clinical validation (Yale partnership, longitudinal studies), 10% go-to-market (beta program, parent community building)."
                                    />
                                </Accordion>
                            </div>

                            {/* Tech & Product Group */}
                            <div>
                                <h3 className="bg-blue-50/80 text-2xl font-bold text-gray-900 px-4 py-2 mb-4 -mx-4 rounded-sm">
                                    Tech & Product
                                </h3>
                                <Accordion type="single" collapsible className="w-full">
                                    <DetailItem
                                        title="Product demo, Features & Data collection"
                                        content="AgileWeb processes multi-modal behavioral signals (gaze tracking, touch patterns, micro-expressions) in real-time (<200ms latency). All AI processing happens on-device using edge ML. Parents receive weekly plain-language insights via push notifications and email. Zero biometric data stored in cloud."
                                    />
                                    <DetailItem
                                        title="Product roadmap"
                                        content="Q1 2026: Beta launch (500 families). Q2: Parent insights dashboard with psychologist-approved language. Q3: School integration API for classroom analytics. Q4: Multi-child support and family profiles. 2027: Cross-platform expansion (tablets, smart displays)."
                                    />
                                    <DetailItem
                                        title="System architecture"
                                        content="Edge-first ML architecture: Behavioral models run on Apple Neural Engine and Android NNAPI. Cloud sync only for anonymized aggregate analytics (parent opt-in). Three-tier filtering: Block (harmful content), Gate (parent approval required), Allow (age-appropriate). COPPA & GDPR-K compliant by design."
                                    />
                                    <DetailItem
                                        title="(Optional) Product vision"
                                        content="AgileWeb becomes the default OS layer for childhood—an adaptive AI guardian that works across every app, website, and digital experience. Every child gets a personalized learning companion that protects curiosity without surveillance, guides without gatekeeping."
                                    />
                                    <DetailItem
                                        title="Security & Compliance"
                                        content="COPPA, GDPR-K, and CCPA compliant. Third-party penetration testing by Trail of Bits. Zero-knowledge encryption for all behavioral data. Parents can export or delete all child data instantly. Independent privacy audit by Mozilla Foundation (Q2 2026)."
                                    />
                                </Accordion>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-12">
                            {/* The Market Group */}
                            <div>
                                <h3 className="bg-blue-50/80 text-2xl font-bold text-gray-900 px-4 py-2 mb-4 -mx-4 rounded-sm">
                                    The Market
                                </h3>
                                <Accordion type="single" collapsible className="w-full">
                                    <DetailItem
                                        title="Historical data"
                                        content="Global screen time has increased 400% since 2010. Child mental health concerns (anxiety, ADHD diagnoses) have doubled. Yet safety tools remain unchanged: keyword filters from the 2000s, rigid time limits, reactive blocking. Parents want understanding, not surveillance."
                                    />
                                    <DetailItem
                                        title="Market size"
                                        content="$56B global EdTech market growing at 18% CAGR. Parental control segment: $2.1B (2025), projected $4.8B by 2030. TAM: 380M children ages 3-12 with internet-connected devices globally. Primary markets: US, India, UK, Australia."
                                    />
                                    <DetailItem
                                        title="GTM strategy"
                                        content="Phase 1: Direct-to-consumer (beta families). Phase 2: B2B2C partnerships with pediatric practices and daycares. Phase 3: School district pilots for classroom behavioral analytics. Phase 4: API licensing for content platforms (Netflix Kids, YouTube Kids) to integrate our safety layer."
                                    />
                                    <DetailItem
                                        title="Competitive landscape"
                                        content="Competitors (Bark, Qustodio, Google Family Link) focus on blocking and surveillance. AgileWeb focuses on understanding and guidance. Our behavioral AI is 5+ years ahead of competitors. Closest analog: no one is building real-time emotional intelligence for child safety."
                                    />
                                    <DetailItem
                                        title="Pricing"
                                        content="Freemium: Basic behavioral insights free. Premium ($12/mo): Advanced analytics, multi-child support, psychologist consultations. Enterprise ($199/mo per classroom): School dashboards, SEL compliance reporting, parent integration."
                                    />
                                    <DetailItem
                                        title="Revenue expansion"
                                        content="API licensing to content platforms: Netflix Kids, YouTube Kids, educational app developers can integrate AgileWeb's behavioral safety layer. Estimated $0.50 per child per month recurring revenue from platform partners. Projected 2M licensed children by 2028."
                                    />
                                </Accordion>
                            </div>

                            {/* Testimonials Group */}
                            <div>
                                <h3 className="bg-blue-50/80 text-2xl font-bold text-gray-900 px-4 py-2 mb-4 -mx-4 rounded-sm">
                                    Testimonials
                                </h3>
                                <Accordion type="single" collapsible className="w-full">
                                    <DetailItem
                                        title="Testimonials"
                                        content="'For the first time, I understand when my daughter is actually struggling versus when she's just being playful. The weekly reports are clear and actionable.' — Priya S., Parent of two. 'My son's therapist loves the reports. She can see patterns between sessions that we never noticed before.' — Rajesh K., Mumbai."
                                    />

                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Background Gradient Blob for more violet hint */}
            <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 blur-3xl rounded-full pointer-events-none -z-10" />
            <div className="fixed bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/3 blur-3xl rounded-full pointer-events-none -z-10" />
        </main >
    );
}
