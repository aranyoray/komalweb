"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface TeamMember {
    name: string;
    role: string;
    credentials: string[];
    image: string;
    description: string;
    tagline?: string;
    website?: string;
}

// Core Team Members — ordered: CEO, CTO, Growth & Operations
const coreTeam: TeamMember[] = [
    {
        name: "Saarthak Kumar",
        role: "CEO",
        credentials: ["MPA (STEM), Columbia University", "MPA, London School of Economics"],
        image: "/sarthakwhitebg.png",
        description: "Saarthak holds an MPA (STEM) from Columbia University (Quant GPA: 3.8) and an MPA from the London School of Economics. He served as Advisor to the Permanent Mission of India at the United Nations, where he negotiated 6 multilateral resolutions and built AI-driven diplomatic tools. At the U.S. Department of Commerce, he led an AI early warning system for trade enforcement, improving monitoring efficiency by ~25%. A National Topper in Economics (Rank 5, India) with a 334/340 GRE, he brings rigorous quantitative skills and institutional credibility. At Komal, he leads distribution, partnerships, and go-to-market execution.",
        tagline: "Leading strategy for global impact",
        website: "https://www.saarthakkumar.com",
    },
    {
        name: "Aranyo Ray",
        role: "CTO",
        credentials: ["Yale University", "Wu Tsai Institute Research Fellow"],
        image: "/aranyowhitebg.png",
        description: "Aranyo holds a degree from Yale University, where he was a Wu Tsai Institute Research Fellow studying attitude formation and implicit bias using novel eye-tracking methods. He won 1st Place from the American Psychological Association at ISEF for a culturally relevant autism risk-assessment app used across 5 special schools, and is published in Harvard's Journal of Emerging Investigators. He has built and shipped products at SaaS startups including Graymatics (won US SBIR Phase I Grant, Bangalore Metro pilot with ~700K daily riders) and Commenda. At Komal, he leads technology, product development, and AI architecture.",
        tagline: "Building the future of child development",
        website: "https://aranyoing.com",
    },
    {
        name: "Raviraj Kumar",
        role: "Founding Engineer",
        credentials: ["Fellow @Delta II (The Residency, SF)", "Graduate, Founders Ashram", "Graduate, No Cap Accelerator"],
        image: "/raviraj-kumar.png",
        description: "Raviraj leads early technology development at Komal, building the child content filtration and blocking algorithms that power the platform. He architects and ships across the full stack — web apps in Next.js and Node.js, native Android (Kotlin), and iOS (Swift) — and manages the entire cloud and DevOps infrastructure across GCP and AWS. A Top 10 Finalist at IIT(ISM) Dhanbad's AAVISHKAR 2.0 and Top 1000 India (College Youth Ideathon) at IIT Delhi, he is a Founders Ashram Graduate and nc/acc cohort 1 member. He founded Provoke Developers and also leads product development for IoT wearables serving the visually impaired. At Komal, he owns the end-to-end engineering pipeline from content safety models to production deployment.",
        tagline: "Engineering child safety from stack to scale",
        website: "https://raviraj.lol",
    },
    {
        name: "Yudhajit Ain, MSc",
        role: "Research Engineer",
        credentials: ["PhD Candidate, Internal Attention Lab, UCalgary", "IISER BS-MS Neuroscience"],
        image: "/yudhajit-ain-phd-research-advisor-komalkids-canada.png",
        description: "Yudhajit is a PhD Candidate in computational psychology at the Internal Attention Lab, UCalgary, where he has developed novel algorithms for attention tracking. He is first-author on 6+ papers, including research on ADHD in the Journal of Attention Disorders and mindfulness in Psychol. Aging. A Gold Medallist from the IISER BS-MS Neuroscience program.",
        tagline: "Decoding attention, one algorithm at a time",
    },
    {
        name: "Joy Cai",
        role: "Head of US GTM",
        credentials: ["BA Economics, University of Pennsylvania", "Founder, Solis Health"],
        image: "/joy-cai.png",
        description: "Joy holds a B.A. in Economics from the University of Pennsylvania. She founded Solis Health, a telehealth nutrition practice scaled to 15+ medical specialties with 20+ clinic partnerships. Previously, as Chief of Staff at Flagler Health, she helped close a $4M+ seed round, enrolled 3,000+ patients in AI-powered remote therapeutic monitoring, and built clinical data pipelines. She has raised and deployed $4M+ in capital across ventures and launched 20+ partnership channels. At Komal, she leads growth, partnerships, and operations.",
        tagline: "Driving growth and strategic partnerships",
        website: "https://joycai.vercel.app",
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
    website?: string;
}

const advisors: Advisor[] = [
    {
        name: "Linda Yu, MBA",
        role: "President",
        credentials: ["Canada Sunshine Foundation"],
        image: "/advisor-canada-parent-advocate-gtm.png",
        description: "Linda is the President of Canada Sunshine Foundation. A non-profit leader and parent advocate, she advises Komal on parent trust and community-led distribution, and has led large-scale fundraising for children's programs, including initiatives benefiting UNICEF and the Red Cross.",
        tagline: "President, Canada Sunshine Foundation",
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
        name: "Dr. (Prof) Om Prakash Singh, MD, FRCP",
        role: "Editor-in-Chief",
        credentials: ["Indian Journal of Psychiatry", "MD, FRCP"],
        image: "/dr-professor-om-prakash-singh-md-psychiatrist-research-advisor-president-national-psychiatric-society-bangalore.png",
        description: "Dr. Singh is a senior psychiatrist with three decades of clinical, academic, and leadership experience, shaping psychiatric education, research standards, and policy in South Asia. He specializes in child and adolescent mental health, community psychiatry, ethics, and access to care, authoring 140+ peer-reviewed articles and 2 books. He holds an MD from Lady Hardinge Medical College, is a Fellow of the Royal College of Physicians (Edinburgh) and International Distinguished Fellow of the APA, and served as President of the Indian Psychiatric Society (East Zone). At Komal, he advises our de-addiction strategy and psychosocial framework for children's digital experiences.",
        tagline: "Three decades shaping child mental health",
    },
    {
        name: "Bratati Sinha Ray, MSc, MS",
        role: "Consultant Psychologist",
        credentials: ["22+ years experience", "Apollo Clinic"],
        image: "/balaji.png",
        description: "Bratati is a Consultant Psychologist and Psychotherapist at Apollo Clinic with 22+ years of experience in child psychology, working pan-India across cultural boundaries with clients aged 5-85. She specializes in supporting children and adolescents with ADHD, learning disorders, ASD, OCD, anxiety, depression, and addiction. She holds a Masters in Clinical Psychology, PGDs in Psychological Counseling and Clinical Psychology, and is a certified Trauma Healer.",
        tagline: "22+ years healing young minds",
    },
    {
        name: "Soham Poddar, PhD (PMRF)",
        role: "Technical Advisor",
        credentials: ["PhD, IIT Kharagpur", "460+ citations"],
        image: "/soham-poddar-phd-technical-advisor-microsoft-komal.jpg",
        description: "NLP, social computing & green AI researcher with 460+ citations (h-index: 9) at AAAI, SIGIR, and NAACL. Soham has published on LLM efficiency and misinformation detection; prev: HPE Labs. He advises Komal on child-safe LLM architecture, on-device inference optimization, and content safety classifiers. Soham holds a PhD in Computer Science from IIT Kharagpur, where he studied the structure and dynamics of large networked systems at the Complex Networks Research Group.",
        tagline: "Child-safe AI architecture expert",
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
    const objectPos = member.name.includes('Linda')
        ? 'center top'
        : member.name.includes('Brian')
            ? 'center 5%'
            : member.name.includes('Om')
                ? 'center 5%'
                : member.name.includes('Bratati')
                    ? 'center 5%'
                    : member.name.includes('Raviraj')
                        ? 'center 20%'
                        : 'center 10%';

    const memberWebsite = 'website' in member ? member.website : undefined;

    const imageElement = (
        <div className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 overflow-hidden rounded-full shadow-inner bg-white p-1 md:p-2 ${isEven ? 'border border-primary/10' : 'border-2 border-primary/30'}`}>
            <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                style={{
                    objectPosition: objectPos,
                    transform: member.name.includes('Raviraj') ? 'scale(0.8)' : undefined,
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
    );

    const nameElement = (
        <h3 className="text-sm sm:text-lg md:text-2xl font-bold text-primary tracking-tight text-center leading-tight">
            {member.name}
        </h3>
    );

    return (
        <div
            className={`group flex flex-row items-start justify-between gap-3 md:gap-10 py-4 md:py-6 transition-colors duration-300 rounded-2xl md:rounded-3xl px-3 md:px-24 ${isEven ? 'bg-purple-100 flex-row-reverse md:flex-row-reverse' : 'bg-white'}`}
        >
            {/* PFP + Name Column */}
            <div className={`flex flex-col items-center ${isEven ? 'items-end' : 'items-start'} shrink-0 w-[100px] sm:w-[160px] md:w-[220px]`}>
                <div className="relative mb-2 sm:mb-12">
                    {/* Decorative elements */}
                    <div className="hidden md:block">
                        <DecorativeElements index={index} />
                    </div>

                    {/* Image - wrapped in invisible link for SEO if website exists */}
                    {memberWebsite ? (
                        <a href={memberWebsite} target="_blank" rel="noopener noreferrer" className="block text-inherit no-underline">
                            {imageElement}
                        </a>
                    ) : (
                        imageElement
                    )}

                    {/* Tagline badge (Speech bubble style) - Hidden on smallest screens to save space/clutter */}
                    {member.tagline && (
                        <div className={`hidden sm:block absolute -bottom-8 ${isEven ? '-right-4' : '-left-4'} bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 max-w-[140px] md:max-w-[180px] transform ${isEven ? 'rotate-2' : '-rotate-2'}`}>
                            <p className="text-[9px] md:text-[10px] text-primary/80 font-medium italic leading-tight">
                                &ldquo;{member.tagline}&rdquo;
                            </p>
                        </div>
                    )}
                </div>

                {/* Name under image - wrapped in invisible link for SEO if website exists */}
                {memberWebsite ? (
                    <a href={memberWebsite} target="_blank" rel="noopener noreferrer" className="text-inherit no-underline" style={{ color: 'inherit', textDecoration: 'none' }}>
                        {nameElement}
                    </a>
                ) : (
                    nameElement
                )}
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
        <section className="team-section pt-8 md:pt-12 pb-12 md:pb-24 bg-white" id="team">
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
                            <TeamMemberCard key={index} member={advisor} index={index + 4} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
