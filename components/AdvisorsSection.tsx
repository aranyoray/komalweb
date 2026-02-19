"use client";

import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

interface Advisor {
    name: string;
    title: string;
    company: string;
    description: string;
    image: string;
}

const advisors: Advisor[] = [
    {
        name: "Linda Yu, MBA",
        title: "PRESIDENT",
        company: "@ CANADA SUNSHINE FOUNDATION",
        description: "Linda is the President of Canada Sunshine Foundation. A non-profit leader and parent advocate, she advises Komal on parent trust and community-led distribution, and has led large-scale fundraising for children's programs, including initiatives benefiting UNICEF and the Red Cross.",
        image: "/advisor-canada-parent-advocate-gtm.png",
    },
    {
        name: "Audrey Wisch",
        title: "CEO",
        company: "@ CURIOUS CARDINALS",
        description: "Audrey is the Co-Founder & CEO of Curious Cardinals, a leading mentorship platform for students. A Forbes 30 Under 30 honoree, she brings expertise in education technology and youth engagement, helping Komal scale its mission to families worldwide.",
        image: "/audrey.png",
    },

    {
        name: "Prof (Dr.) Om Prakash Singh, MD, FRCP",
        title: "EDITOR-IN-CHIEF",
        company: "@ INDIAN JOURNAL OF PSYCHIATRY",
        description: "Dr. Singh is a senior psychiatrist with 30 years of clinical and academic experience. He leads the Indian Journal of Psychiatry and advises Komal on de-addiction strategies and our psychosocial mental health framework.",
        image: "/dr-professor-om-prakash-singh-md-psychiatrist-research-advisor-president-national-psychiatric-society-bangalore.png",
    },
    {
        name: "Soham Poddar, PhD (PMRF)",
        title: "TECHNICAL ADVISOR",
        company: "@ IIT KHARAGPUR",
        description: "NLP, social computing & green AI researcher with 460+ citations (h-index: 9) at AAAI, SIGIR, and NAACL. He advises Komal on child-safe LLM architecture, on-device inference optimization, and content safety classifiers.",
        image: "/soham-poddar-phd-technical-advisor-microsoft-komal.jpg",
    },
    {
        name: "Bratati Sinha Ray, MSc, MS",
        title: "CONSULTANT PSYCHOLOGIST",
        company: "@ APOLLO CLINIC",
        description: "Bratati is a Consultant Psychologist at Apollo Clinic with 22+ years of experience in child psychology. A certified Trauma Healer, she specializes in clinical counseling and provides deep expertise in adolescent mental health.",
        image: "/balaji.png",
    },
];

export default function AdvisorsSection() {
    return (
        <section className="advisors-section py-8 md:py-12 bg-white" id="advisors">
            <div className="container max-w-[1240px] px-6 md:px-8 mx-auto">
                {/* Our Advisors - Horizontal Layout */}
                <ScrollReveal>
                    <h2 className="section-title font-sans text-[24px] sm:text-[32px] md:text-[38px] lg:text-[42px] font-bold mb-8 md:mb-12 leading-[1.15] tracking-[-0.02em] text-primary text-center">
                        Advised by the Best
                    </h2>
                </ScrollReveal>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
                    {advisors.map((advisor, index) => (
                        <ScrollReveal key={index} delay={index * 0.1} direction="up">
                            <div className="advisor-card group">
                                {/* Square Image - Reduced height */}
                                <div className="aspect-square w-full mb-3 md:mb-4 overflow-hidden bg-white rounded-xl group-hover:shadow-xl transition-all duration-500">
                                    <Image
                                        src={advisor.image}
                                        alt={advisor.name}
                                        width={300}
                                        height={300}
                                        className="w-full h-full transition-all duration-500 group-hover:scale-105 object-cover"
                                        style={{
                                            objectPosition: 'center top',
                                        }}
                                    />
                                </div>

                                {/* Name */}
                                <h4 className="text-xs sm:text-sm md:text-lg font-semibold text-primary mb-1 leading-tight">
                                    {advisor.name}
                                </h4>

                                {/* Title & Company */}
                                <p className="text-[8px] sm:text-[9px] md:text-xs uppercase tracking-wide text-primary/70 font-medium leading-tight mb-2">
                                    {advisor.title} {advisor.company}
                                </p>

                                {/* Description - Always visible */}
                                <p className="text-[9px] sm:text-[10px] md:text-xs text-text-dim leading-relaxed line-clamp-4 md:line-clamp-none">
                                    {advisor.description}
                                </p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
