"use client";

import PricingSection from "@/components/PricingSection";

export default function PricingPage() {
    const pricingPlans = [
        {
            name: "Essentials",
            priceDisplay: "₹0",
            priceDisplayUSD: "$0",
            periodMonthlyLabel: "/month",
            tagline: "Perfect for getting started",
            cta: "Start Free",
            features: [
                "Core learning and SEL activities",
                "Real-time, on-device adaptation",
                "Weekly parent snapshot",
                "Privacy-first, no raw media storage",
                "Up to 2 child profiles",
            ],
        },
        {
            name: "Grow",
            priceDisplay: "₹99",
            priceDisplayUSD: "$9.99",
            periodMonthlyLabel: "/month",
            tagline: "Built for growing families",
            featured: true,
            cta: "Get FREE AI Report",
            features: [
                "Everything in Essentials, plus:",
                "Deeper personalization across sessions",
                "Expanded weekly progress insights",
                "Share reports with caregivers and teachers",
                "Unlimited child profiles",
                "Priority parent support",
            ],
        },
        {
            name: "Thrive",
            priceDisplay: "₹299",
            priceDisplayUSD: "$14.99",
            periodMonthlyLabel: "per child / month",
            tagline: "For advanced insights",
            cta: "Contact Sales",
            features: [
                "Everything in Grow, plus:",
                "Classroom-level dashboards",
                "SEL framework alignment and reporting",
                "Anonymized engagement trends",
                "Early support indicators (non-diagnostic)",
                "Admin controls and role-based access",
            ],
        },
        {
            name: "Partner",
            priceDisplay: "₹49",
            priceDisplayUSD: "$4.99",
            periodMonthlyLabel: "per child / month",
            tagline: "For therapy and intervention centers",
            cta: "Contact Sales",
            features: [
                "Everything in Thrive, plus:",
                "Between-session progress tracking",
                "Concise async session summaries",
                "Objective engagement and regulation signals",
                "Longitudinal progress visualization",
                "DPDP Act–aligned data handling and consent flows",
            ],
        },
    ];

    return (
        <main className="pt-24 pb-16 bg-white">
            <section className="pricing py-14" id="pricing">
                <div className="container max-w-[1240px] px-8 mx-auto">
                    <h1 className="section-title font-sans text-[26px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-bold mb-6 leading-[1.15] tracking-[-0.02em] text-primary text-center animate-[fadeDown_0.8s_ease_forwards]">
                        Pick Your Perfect Plan
                    </h1>
                    <p className="section-description text-lg text-text-dim mb-12 max-w-[700px] mx-auto leading-relaxed text-center">
                        Start free, upgrade when you&apos;re ready. No hidden fees, no surprises.
                    </p>
                    <PricingSection plans={pricingPlans} />

                    {/* Sales Contact CTA */}
                    <div className="mt-12 text-center">
                        <p className="text-text-dim text-center mb-4">Don&apos;t find a plan that works?</p>
                        <a
                            href="mailto:sales@komalkids.com"
                            className="inline-block bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-full transition-all duration-300"
                        >
                            Email sales@komalkids.com
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
