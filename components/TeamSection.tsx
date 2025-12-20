"use client";

import Image from "next/image";

interface TeamMember {
    name: string;
    role: string;
    credentials: string[];
    image: string;
}

// Core Team Members
const coreTeam: TeamMember[] = [
    {
        name: "Aranyo Ray",
        role: "Co-Founder & CEO",
        credentials: ["Yale University '24", "Formerly at Graymatics and Bain"],
        image: "/man.png",
    },
    {
        name: "Saarthak Kumar",
        role: "Finance & Strategy Advisor",
        credentials: [
            "Columbia University — MPA (Quantitative Concentration), '25",
            "Former Advisor, Permanent Mission of India to the United Nations",
            "London School of Economics — MPP (2024)",
        ],
        image: "/man.png",
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
        image: "/man.png",
    },
    {
        name: "Anwesha Das",
        role: "Research Advisor (Computational Neuroscience)",
        credentials: ["PhD Candidate, Princeton University", "Caltech (2025)"],
        image: "/girl.png",
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
        name: "Richard Vidal-Dorsch",
        title: "SENIOR SOFTWARE ENGINEER",
        company: "@ AURA",
        description: "MS in Computer Science (2005). Technical advisor providing guidance on software architecture and engineering best practices.",
        image: "/man.png",
    },
    {
        name: "Doris E. V.",
        title: "RESEARCH ADVISOR",
        company: "@ UC BERKELEY",
        description: "PhD in Integrative Biology from University of California, Berkeley (2001). Brings deep expertise in biological systems and research methodology.",
        image: "/girl.png",
    },
    {
        name: "Dr Om Prakash Singh, MD",
        title: "CLINICAL ADVISOR",
        company: "@ INDIAN PSYCHIATRIC SOCIETY",
        description: "Incoming National President, Indian Psychiatric Society. Guides our clinical approach and mental health protocols.",
        image: "/man.png",
    },
    {
        name: "Dr Moumita Roy",
        title: "CHILD PSYCHOLOGIST",
        company: "@ NORTH 24 PARGANAS DISTRICT HOSPITAL",
        description: "Child Psychologist at North 24 Parganas District Hospital, the largest district in India by population. Expert in child development.",
        image: "/girl.png",
    },
    {
        name: "Amit Goenka",
        title: "BUSINESS ADVISOR",
        company: "@ ZEE ENTERTAINMENT",
        description: "Chief Executive, International Broadcast at Zee Entertainment Enterprises. Head of Z5 Global & Zee Learn. Guides our business strategy.",
        image: "/man.png",
    },
    {
        name: "Shreya Jain, MBA",
        title: "GTM ADVISOR",
        company: "@ THE STACK",
        description: "Founder of The Stack and Reservoir Neurodiversity. Formerly at BYJU'S. Expert in go-to-market strategy and neurodiversity initiatives.",
        image: "/girl.png",
    },
];

export default function TeamSection() {
    const renderTeamMember = (member: TeamMember, index: number) => (
        <div
            key={index}
            className="team-member-row relative border-t border-gray-200 py-5 md:py-6"
        >
            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-3 items-center">
                {/* Left Column: Role & Credentials */}
                <div className="text-left">
                    <p className="text-sm font-semibold  text-primary mb-1">
                        {member.role}
                    </p>
                    {member.credentials.slice(0, 2).map((cred, i) => (
                        <p key={i} className="text-xs text-text-dim leading-relaxed">
                            {cred}
                        </p>
                    ))}
                </div>

                {/* Center Column: Name */}
                <div className="text-left">
                    <h3 className="text-2xl md:text-3xl font-bold text-primary">
                        {member.name}
                    </h3>
                </div>

                {/* Right Column: Image */}
                <div className="flex justify-end">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                        <Image
                            src={member.image}
                            alt={member.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Layout: Icon left, Text right-aligned */}
            <div className="md:hidden flex items-center gap-4">
                {/* Left: Icon */}
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                    <Image
                        src={member.image}
                        alt={member.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right: Name & Details aligned left */}
                <div className="flex-1 text-left">
                    <h3 className="text-lg font-bold text-primary">
                        {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-primary mb-0.5">
                        {member.role}
                    </p>
                    {member.credentials.slice(0, 1).map((cred, i) => (
                        <p key={i} className="text-[10px] text-text-dim">
                            {cred}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <section className="team-section py-16 md:py-24 bg-white" id="team">
            <div className="container max-w-[1240px] px-6 md:px-8 mx-auto">
                {/* Core Team */}
                <h2 className="section-title font-sans text-3xl md:text-[52px] font-normal mb-8 md:mb-12 leading-[1.1] tracking-[-0.02em] text-primary text-center">
                    Meet The Team
                </h2>

                <div className="team-list">
                    {coreTeam.map((member, index) => renderTeamMember(member, index))}
                    <div className="border-t border-gray-200" />
                </div>
            </div>
        </section>
    );
}
