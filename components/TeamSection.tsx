"use client";

import Image from "next/image";

interface TeamMember {
    name: string;
    role: string;
    credentials: string[];
    image: string;
    bio?: string;
}

// Core Team Members
const coreTeam: TeamMember[] = [
    {
        name: "Aranyo Ray",
        role: "Co-Founder & CEO",
        credentials: ["Yale University '24", "Formerly at Graymatics and Bain"],
        image: "/aranyo-ray-yale-ceo-komalkids-india-mumbai.png",
        bio: "Co-Founder & CEO with a background from Yale University. Previously worked at Graymatics and Bain, bringing strategic vision and leadership to Komal.",
    },
    {
        name: "Saarthak Kumar, MPA",
        role: "Growth and Partnerships",
        credentials: [
            "Columbia University — MPA (Quantitative Concentration), '25",
            "Former Advisor, Permanent Mission of India to the United Nations",
            "London School of Economics — MPP (2024)",
        ],
        image: "/saarthak-kumar-mpa-ms-cofounder-coo-bangalore.png",
        bio: "Finance & Strategy Advisor with extensive experience in international policy and quantitative analysis. Former advisor at the Permanent Mission of India to the United Nations.",
    },
    {
        name: "Jvalaj Pandey",
        role: "UI Engineer",
        credentials: [
            "Prev SWE Intern @ Delta Air Lines, Nucor Steel",
            "University of South Florida '26",
        ],
        image: "/komaljvalaj.png",
        bio: "Software Engineer with internship experience at Delta Air Lines and Nucor Steel. Currently pursuing studies at University of South Florida, graduating in 2026.",
    },
    {
        name: "Anwesha Das",
        role: "Research Advisor (Computational Neuroscience)",
        credentials: ["PhD Candidate, Princeton University", "Caltech (2025)"],
        image: "/anwesha-das-phd-princeton-research-advisor-komalkids-usa.png",
        bio: "Research Advisor in Computational Neuroscience. PhD candidate at Princeton University with expertise from Caltech, bringing cutting-edge research insights to Komal.",
    },
    {
        name: "Md Zahirul Haque",
        role: "Senior Software Engineer",
        credentials: ["ex-Engineer, Speech Therapy Ai"],
        image: "/md-zahirul-haque-senior-software-engineer-komalkids-india.png",
        bio: "Senior Software Engineer with experience in Speech Therapy AI. Brings technical expertise to Komal's development team.",
    },
    {
        name: "Yudhajit Ain, MS",
        role: "Research Advisor (Neuroscience)",
        credentials: [
            "PhD Candidate, Neuropsychology",
            "Internal Attention Lab, University of Calgary",
            "Formerly at NBRC",
            "IISER Bhopal — MS-BS (2021, Gold Medallist)",
        ],
        image: "/yudhajit-ain-phd-research-advisor-komalkids-canada.png",
        bio: "Research Advisor specialising in Neuroscience. PhD candidate in Neuropsychology at the Internal Attention Lab, University of Calgary. Gold Medallist from IISER Bhopal.",
    },
];

// Advisory Board - New format with images and descriptions
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
        name: "Dr Om Prakash Singh, MD",
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
        image: "/professor-brian-scassellati-phd-research-advisor-new-york.jpg",
    },
];

export default function TeamSection() {
    return (
        <section className="team-section pt-24 pb-16 md:pb-24 bg-white" id="team">
            <div className="container max-w-[1240px] px-6 md:px-8 mx-auto">
                {/* Core Team */}
                <h2 className="section-title font-sans text-3xl md:text-[52px] font-bold mb-8 md:mb-12 leading-[1.1] tracking-[-0.02em] text-primary text-center animate-[fadeDown_0.8s_ease_forwards]">
                    Meet The Team
                </h2>

                {/* Grid Layout - 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {coreTeam.map((member, index) => (
                        <div
                            key={index}
                            className="group relative"
                        >
                            {/* Image Container with Hover Effect */}
                            <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square bg-white">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    style={{
                                        objectPosition: member.name.includes('Saarthak') ? 'center top' : 'center 15%',
                                    }}
                                />

                                {/* Bio Overlay on Hover */}
                                {member.bio && (
                                    <div className="absolute inset-0 bg-primary/95 text-white p-6 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-y-auto">
                                        <p className="text-sm leading-relaxed">{member.bio}</p>
                                    </div>
                                )}
                            </div>

                            {/* Name and Role */}
                            <div className="text-left">
                                <h3 className="text-xl md:text-2xl font-bold text-primary mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-sm font-semibold text-primary mb-2">
                                    {member.role}
                                </p>
                                {member.credentials.slice(0, 2).map((cred, i) => (
                                    <p key={i} className="text-xs text-text-dim leading-relaxed">
                                        {cred}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Advisors Section */}
                <div className="mt-16 md:mt-24">
                    <h2 className="section-title font-sans text-3xl md:text-[52px] font-semibold mb-8 md:mb-12 leading-[1.1] tracking-[-0.02em] text-primary text-center">
                        Our Advisors
                    </h2>

                    {/* Grid Layout - 3 columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {advisors.map((advisor, index) => (
                            <div
                                key={index}
                                className="group relative"
                            >
                                {/* Image Container with Hover Effect */}
                                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square bg-white">
                                    <Image
                                        src={advisor.image}
                                        alt={advisor.name}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        style={{
                                            objectPosition: 'center 20%',
                                        }}
                                    />

                                    {/* Bio Overlay on Hover */}
                                    <div className="absolute inset-0 bg-primary/95 text-white p-6 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-y-auto">
                                        <p className="text-sm font-semibold mb-2">{advisor.title}</p>
                                        <p className="text-xs mb-3 opacity-90">{advisor.company}</p>
                                        <p className="text-sm leading-relaxed">{advisor.description}</p>
                                    </div>
                                </div>

                                {/* Name and Title */}
                                <div className="text-left">
                                    <h3 className="text-xl md:text-2xl font-bold text-primary mb-1">
                                        {advisor.name}
                                    </h3>
                                    <p className="text-sm font-semibold text-primary mb-2">
                                        {advisor.title}
                                    </p>
                                    <p className="text-xs text-text-dim">
                                        {advisor.company}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
