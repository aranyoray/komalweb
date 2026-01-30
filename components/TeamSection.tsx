"use client";

import Image from "next/image";
import { useState } from "react";

interface TeamMember {
    name: string;
    role: string;
    credentials: string[];
    image: string;
    description: string;
    tagline?: string;
}

// Core Team Members
const coreTeam: TeamMember[] = [
    {
        name: "Aranyo Ray",
        role: "Co-Founder & CEO",
        credentials: ["Wu Tsai Scholar, Yale University", "Ex-Graymatics, Commenda"],
        image: "/aranyowhitebg.png",
        description: "Aranyo built edtech products and worked at pioneering SaaS startups like Graymatics and Commenda. A Wu Tsai Scholar at Yale investigating implicit bias in multicultural learning, he won 1st Place from the APA at ISEF for his culturally relevant game app and is published in Harvard's Journal of Emerging Investigators. At Komal, he leads overall execution and expansion.",
        tagline: "Building the future of child development",
    },
    // {
    //     name: "Jvalaj Pandey",
    //     role: "Co-Founder & CTO",
    //     credentials: ["Ex-Delta Air Lines", "Final Year Undergrad in CS @ USF", "Green & Gold Scholar"],
    //     image: "/komaljvalaj.png",
    //     description: "Jvalaj previously built Grid, which garnered a 400+ user waitlist. He brings technical expertise from internships at Delta and Nucor Steel, leading the platform's core implementation. He is a Green & Gold Scholar at USF.",
    //     tagline: "Engineering solutions that matter",
    // },
    // {
    //     name: "Yudhajit Ain",
    //     role: "Research Lead",
    //     credentials: ["PhD Candidate, Internal Attention Lab, UCalgary", "IISER BS-MS Neuroscience"],
    //     image: "/yudhajit-ain-phd-research-advisor-komalkids-canada.png",
    //     description: "Yudhajit is a PhD Candidate in computational psychology at the Internal Attention Lab, UCalgary, where he has developed novel algorithms for attention tracking. He is first-author on 6+ papers, including research on ADHD in the Journal of Attention Disorders and mindfulness in Psychol. Aging. A Gold Medallist from the IISER BS-MS Neuroscience program.",
    //     tagline: "Decoding attention, one algorithm at a time",
    // },
    {
        name: "Jvalaj Pandey",
        role: "Co-Founder & CTO",
        credentials: ["Ex-Delta Air Lines, Nucor", "BS CS @ USF (Honors)", "Full Stack Engineer"],
        image: "/komaljvalaj.png",
        description: "Jvalaj is a Full Stack Engineer and Designer specializing in high-performance web interfaces and AI-driven design. With experience at Delta Air Lines and Nucor Steel, he leads Komal's technical implementation. He previously built AI tools like GRID and VS Chat, combining artistic vision with scalable engineering to build the future of child safety.",
        tagline: "Engineering solutions that matter",
    },

    // {
    //     name: "Dale Lee",
    //     role: "GTM Lead",
    //     credentials: ["US and Korea Markets"],
    //     image: "/l.png",
    //     description: "Dale leads Komal's go-to-market strategy for the US and Korea markets. He brings extensive expertise in cross-cultural business development and global market expansion to help Komal reach international audiences.",
    //     tagline: "Bridging cultures, opening markets",
    // },
    {
        name: "Saarthak Kumar",
        role: "Policy Lead",
        credentials: ["MPA, Columbia & LSE", "Ex-UN Advisor"],
        image: "/sarthakwhitebg.png",
        description: "Saarthak holds MPAs from Columbia and LSE in economic policy and quantitative analysis. He served as an Advisor to the Permanent Mission of India at the UN, bringing expertise in international policy and development economics.",
        tagline: "Policy expertise for global impact",
    },

];

// Advisory Board
interface Advisor {
    name: string;
    role: string;
    credentials: string[];
    image: string;
    description: string;
    tagline?: string;
}

const advisors: Advisor[] = [
    {
        name: "Linda Xu",
        role: "Parent Advocacy & Community Growth",
        credentials: ["MBA", "Sunshine Foundation", "Canadian Women's Federation"],
        image: "/advisor-canada-parent-advocate-gtm.png",
        description: "Linda Xu is a nonprofit leader and parent advocate with experience across major community and public welfare organizations. She advises Komal on parent trust and community-led distribution, helping shape go-to-market strategy starting in Canada. She has held senior leadership roles with the Sunshine Foundation, the Canadian Women's Federation, and the United Global Chinese Women's Association of Canada, supporting initiatives in youth development, education access, and family wellbeing. Linda has led large-scale fundraising efforts totaling $250k+ in support of children, families, and healthcare initiatives, including programs benefiting UNICEF and the Red Cross.",
        tagline: "Parent trust and community-led distribution",
    },
    {
        name: "Audrey Wisch",
        role: "CEO",
        credentials: ["Co-Founder & CEO, Curious Cardinals", "Forbes 30u30"],
        image: "/audrey.png",
        description: "Audrey is the Co-Founder & CEO of Curious Cardinals, a leading mentorship platform connecting students with inspiring role models. A Forbes 30 Under 30 honoree, she brings deep expertise in education technology, youth engagement, and scaling mission-driven startups to help Komal reach families worldwide.",
        tagline: "Empowering the next generation of learners",
    },

    {
        name: "Prof Om Prakash Singh",
        role: "Editor-in-Chief",
        credentials: ["Indian Journal of Psychiatry", "MD, FRCP"],
        image: "/dr-professor-om-prakash-singh-md-psychiatrist-research-advisor-president-national-psychiatric-society-bangalore.png",
        description: "Dr. Singh is a senior psychiatrist with three decades of clinical, academic, and leadership experience, shaping psychiatric education, research standards, and policy in South Asia. He specializes in child and adolescent mental health, community psychiatry, ethics, and access to care, authoring 140+ peer-reviewed articles and 2 books. He holds an MD from Lady Hardinge Medical College, is a Fellow of the Royal College of Physicians (Edinburgh) and International Distinguished Fellow of the APA, and served as President of the Indian Psychiatric Society (East Zone). At Komal, he advises our de-addiction strategy and psychosocial framework for children's digital experiences.",
        tagline: "Three decades shaping child mental health",
    },
    {
        name: "Bratati Sinha Ray",
        role: "Consultant Psychologist",
        credentials: ["22+ years experience", "Apollo Clinic"],
        image: "/balaji.png",
        description: "Bratati is a Consultant Psychologist and Psychotherapist at Apollo Clinic with 22+ years of experience in child psychology, working pan-India across cultural boundaries with clients aged 5-85. She specializes in supporting children and adolescents with ADHD, learning disorders, ASD, OCD, anxiety, depression, and addiction. She holds a Masters in Clinical Psychology, PGDs in Psychological Counselling and Clinical Psychology, and is a certified Trauma Healer.",
        tagline: "22+ years healing young minds",
    },
    {
        name: "Shreya Jain",
        role: "CEO",
        credentials: ["The Stack", "MBA"],
        image: "/shreya-jain-mba-business-gtm-advisor-india.png",
        description: "Shreya is the Founder of The Stack and Reservoir Neurodiversity. Formerly at BYJU'S, she is an expert in go-to-market strategy and neurodiversity, helping Komal reach and support diverse communities through growth.",
        tagline: "Champion of neurodiversity initiatives",
    },
];

// Decorative SVG elements
const DecorativeElements = ({ index }: { index: number }) => {
    const elements = [
        // Zigzag lines
        <svg key="zigzag" className="absolute -top-2 -left-4 w-6 h-6 md:w-8 md:h-8 text-primary/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 12 L6 8 L10 12 L14 8 L18 12 L22 8" />
        </svg>,
        // Circle
        <svg key="circle" className="absolute -top-1 -right-3 w-4 h-4 md:w-6 md:h-6 text-primary/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="8" />
        </svg>,
        // Parenthesis
        <svg key="paren" className="absolute top-1/2 -right-6 w-3 h-6 md:w-5 md:h-10 text-primary/50" viewBox="0 0 10 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 2 Q2 10 8 18" />
        </svg>,
    ];

    return (
        <>
            {elements[index % 3]}
            {elements[(index + 1) % 3]}
        </>
    );
};

const TeamMemberCard = ({ member, index }: { member: TeamMember | Advisor, index: number }) => {
    const isEven = index % 2 === 0;
    const [isExpanded, setIsExpanded] = useState(false);

    // Determine object position
    const objectPos = member.name.includes('Shreya')
        ? 'center top'
        : member.name.includes('Linda')
            ? 'center 15%'
            : member.name.includes('Brian')
                ? 'center 5%'
                : member.name.includes('Om')
                    ? 'center 5%'
                    : member.name.includes('Bratati')
                        ? 'center 5%'
                        : 'center 10%';

    return (
        <div
            className={`group flex flex-row items-start justify-between gap-3 md:gap-10 py-4 md:py-6 transition-colors duration-300 rounded-2xl md:rounded-3xl px-3 md:px-24 ${isEven ? 'bg-gray-200 flex-row-reverse md:flex-row-reverse' : 'bg-white'}`}
        >
            {/* PFP + Name Column */}
            <div className={`flex flex-col items-center ${isEven ? 'items-end' : 'items-start'} shrink-0 w-[100px] sm:w-[160px] md:w-[220px]`}>
                <div className="relative mb-2">
                    {/* Decorative elements */}
                    <div className="hidden md:block">
                        <DecorativeElements index={index} />
                    </div>

                    {/* Image with halftone/dotted effect */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 overflow-hidden rounded-full border border-primary/10 shadow-inner bg-white p-1 md:p-2">
                        <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            style={{
                                objectPosition: objectPos,
                            }}
                        />
                        {/* Halftone overlay effect in Violet */}
                        <div
                            className="absolute inset-0 opacity-20 mix-blend-soft-light"
                            style={{
                                backgroundImage: 'radial-gradient(circle, #8b5cf6 1.2px, transparent 1.2px)',
                                backgroundSize: '4px 4px',
                            }}
                        />
                    </div>

                    {/* Tagline badge (Speech bubble style) - Hidden on smallest screens to save space/clutter */}
                    {member.tagline && (
                        <div className={`hidden sm:block absolute -bottom-1 ${isEven ? '-right-4' : '-left-4'} bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 max-w-[140px] md:max-w-[180px] transform ${isEven ? 'rotate-2' : '-rotate-2'}`}>
                            <p className="text-[9px] md:text-[10px] text-primary/80 font-medium italic leading-tight">
                                &ldquo;{member.tagline}&rdquo;
                            </p>
                        </div>
                    )}
                </div>

                {/* Name under image - Centered for uniformity */}
                <h3 className="text-sm sm:text-lg md:text-2xl font-bold text-primary tracking-tight text-center leading-tight">
                    {member.name}
                </h3>
            </div>

            {/* Role, Credentials & Description Column */}
            <div className={`flex flex-col justify-center flex-1 ${isEven ? 'text-left items-start' : 'text-right items-end'}`}>
                <div className={`mb-1 flex flex-col ${isEven ? 'items-start' : 'items-end'}`}>
                    <p className="text-[10px] sm:text-xs md:text-sm font-bold text-primary mb-0.5 uppercase tracking-wider text-wrap sm:text-nowrap">
                        {member.role}
                    </p>
                    <p className={`text-[9px] sm:text-[10px] md:text-xs text-text-dim font-medium mb-1 md:mb-2 ${isEven ? 'text-left' : 'text-right'}`}>
                        {member.credentials.join(" • ")}
                    </p>
                </div>

                <div className="relative">
                    <p className={`text-[9px] sm:text-[11px] md:text-[13px] text-text-dim leading-relaxed ${isEven ? 'text-left' : 'text-right'} ${!isExpanded ? 'line-clamp-4 md:line-clamp-none' : ''}`}>
                        {member.description}
                    </p>
                    {member.description.length > 150 && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={`md:hidden text-[10px] font-bold text-primary mt-1 hover:underline focus:outline-none ${isEven ? 'self-start' : 'self-end'}`}
                        >
                            {isExpanded ? 'Show Less' : 'Read More'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function TeamSection() {
    return (
        <section className="team-section pt-16 md:pt-24 pb-12 md:pb-24 bg-white" id="team">
            <div className="container max-w-[1200px] px-4 md:px-8 mx-auto">
                {/* Core Team */}
                <h2 className="section-title font-sans text-2xl md:text-4xl font-bold mb-8 md:mb-12 leading-[1.1] tracking-[-0.02em] text-primary text-center">
                    Founding Team
                </h2>

                {/* Horizontal Row Layout for each member */}
                <div className="space-y-3">
                    {coreTeam.map((member, index) => (
                        <TeamMemberCard key={index} member={member} index={index} />
                    ))}
                </div>

                {/* Advisors Section */}
                <div className="mt-12 md:mt-24">
                    <h2 className="section-title font-sans text-2xl md:text-4xl font-bold mb-8 md:mb-12 leading-[1.1] tracking-[-0.02em] text-primary text-center">
                        Our Advisors
                    </h2>

                    {/* Horizontal Row Layout for each advisor */}
                    <div className="space-y-3">
                        {advisors.map((advisor, index) => (
                            <TeamMemberCard key={index} member={advisor} index={index + 3} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
