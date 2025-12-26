"use client";

import Image from "next/image";

interface Advisor {
    name: string;
    title: string;
    company: string;
    description: string;
    image: string;
}

const advisors: Advisor[] = [
    {
        name: "Richard Vidal-Dorsch, MS",
        title: "SENIOR SOFTWARE ENGINEER",
        company: "@ AURA",
        description: "MS in Computer Science (2005). Technical advisor providing guidance on software architecture and engineering best practices.",
        image: "/richard-dorsch-ms-technical-advisor-komalkids-san-francisco.png",
    },
    {
        name: "Doris E. V., PhD",
        title: "RESEARCH ADVISOR",
        company: "@ UC BERKELEY",
        description: "PhD in Integrative Biology from University of California, Berkeley (2001). Brings deep expertise in biological systems and research methodology.",
        image: "/doris-vidal-dorsch-phd-technical-advisor-los-angeles.png",
    },
    {
        name: "Dr (Prof) Om Prakash Singh, MD",
        title: "CLINICAL ADVISOR",
        company: "@ INDIAN PSYCHIATRIC SOCIETY",
        description: "Incoming National President, Indian Psychiatric Society. Guides our clinical approach and mental health protocols.",
        image: "/dr-professor-om-prakash-singh-md-psychiatrist-research-advisor-president-national-psychiatric-society-bangalore.png",
    },
    {
        name: "Shreya Jain, MBA",
        title: "GTM ADVISOR",
        company: "@ THE STACK",
        description: "Founder of The Stack and Reservoir Neurodiversity. Formerly at BYJU'S. Expert in go-to-market strategy and neurodiversity initiatives.",
        image: "/shreya-jain-mba-business-gtm-advisor-india.png",
    },
    {
        name: "Dr Brian Scassellati, PhD",
        title: "PRINCIPAL INVESTIGATOR",
        company: "@ YALE SOCIAL ROBOTICS LAB",
        description: "Principal Investigator at Yale Social Robotics Lab and Professor of Computer Science & Engineering at Yale University. Leading expert in social robotics and human-robot interaction.",
        image: "/briannobg.png",
    },
];

export default function AdvisorsSection() {
    return (
        <section className="advisors-section py-8 md:py-12 bg-white" id="advisors">
            <div className="container max-w-[1240px] px-6 md:px-8 mx-auto">
                {/* Our Advisors - Horizontal Layout */}
                <h2 className="section-title font-sans text-[24px] sm:text-[32px] md:text-[38px] lg:text-[42px] font-bold mb-8 md:mb-12 leading-[1.15] tracking-[-0.02em] text-primary text-center">
                    Advised by the Best
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                    {advisors.map((advisor, index) => (
                        <div key={index} className="advisor-card">
                            {/* Portrait Image */}
                            <div className="aspect-[3/4] w-full mb-3 md:mb-4 overflow-hidden bg-white">
                                <Image
                                    src={advisor.image}
                                    alt={advisor.name}
                                    width={300}
                                    height={400}
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                    style={{
                                        objectPosition: 'center 15%',
                                    }}
                                />
                            </div>

                            {/* Name */}
                            <h4 className="text-xs sm:text-sm md:text-xl font-medium text-primary mb-1 leading-tight">
                                {advisor.name}
                            </h4>

                            {/* Title & Company */}
                            <p className="text-[7px] sm:text-[8px] md:text-xs uppercase tracking-wide text-text-dim font-medium leading-tight mb-1 md:mb-2">
                                {advisor.title} {advisor.company}
                            </p>

                            {/* Description - Hidden on mobile, shown on desktop */}
                            <p className="hidden md:block text-xs text-text-dim leading-relaxed">
                                {advisor.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
