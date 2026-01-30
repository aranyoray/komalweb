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
        name: "Linda Xu, MBA",
        title: "PARENT ADVOCACY & COMMUNITY GROWTH",
        company: "@ SUNSHINE FOUNDATION, CANADIAN WOMEN'S FEDERATION",
        description: "Linda Xu is a nonprofit leader and parent advocate with experience across major community and public welfare organizations. She advises Komal on parent trust and community-led distribution, helping shape go-to-market strategy starting in Canada. She has held senior leadership roles with the Sunshine Foundation, the Canadian Women's Federation, and the United Global Chinese Women's Association of Canada, supporting initiatives in youth development, education access, and family wellbeing. Linda has led large-scale fundraising efforts totaling $250k+ in support of children, families, and healthcare initiatives, including programs benefiting UNICEF and the Red Cross.",
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
        name: "Shreya Jain, MBA",
        title: "CEO",
        company: "@ THE STACK",
        description: "Shreya is the Founder of The Stack and Reservoir Neurodiversity. Formerly at BYJU'S, she is an expert in go-to-market strategy and neurodiversity, helping Komal reach and support diverse communities through strategic growth.",
        image: "/shreya-jain-mba-business-gtm-advisor-india.png",
    },
    {
        name: "Bratati Sinha Ray",
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
