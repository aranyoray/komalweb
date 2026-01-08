"use client";

import Image from "next/image";

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
        image: "/aranyo-ray-yale-ceo-komalkids-india-mumbai.png",
        description: "Aranyo has built pioneering edtech and SaaS solutions. A Wu Tsai Scholar at Yale investigating implicit bias, he won 1st Place from the APA at ISEF and is published in Harvard's Journal of Emerging Investigators.",
        tagline: "Building the future of child development",
    },
    {
        name: "Jvalaj Pandey",
        role: "Co-Founder & CTO",
        credentials: ["Ex-Delta Air Lines", "Final Year Undergrad in CS @ USF", "Green & Gold Scholar"],
        image: "/komaljvalaj.png",
        description: "Jvalaj previously built Grid, which garnered a 400+ user waitlist. He brings technical expertise from internships at Delta and Nucor Steel, leading the platform's core implementation. He is a Green & Gold Scholar at USF.",
        tagline: "Engineering solutions that matter",
    },
    {
        name: "Yudhajit Ain",
        role: "Research Lead",
        credentials: ["PhD Candidate, Internal Attention Lab, UCalgary", "IISER BS-MS Neuroscience"],
        image: "/yudhajit-ain-phd-research-advisor-komalkids-canada.png",
        description: "Yudhajit is a PhD Candidate in computational psychology at UCalgary. A neuroscience Gold Medallist, he has authored 6+ papers on ADHD and mindfulness, developing novel algorithms for precision attention tracking.",
        tagline: "Decoding attention, one algorithm at a time",
    },
  
    {
        name: "Dale Lee",
        role: "GTM Lead",
        credentials: ["US and Korea Markets"],
        image: "/l.png",
        description: "Dale leads Komal's go-to-market strategy for the US and Korea markets. He brings extensive expertise in cross-cultural business development and global market expansion to help Komal reach international audiences.",
        tagline: "Bridging cultures, opening markets",
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
        name: "Doris E. V.",
        role: "Research Advisor",
        credentials: ["UC Berkeley", "PhD"],
        image: "/doris.png",
        description: "Dr. Doris holds a PhD in Integrative Biology from UC Berkeley. She brings deep expertise in biological systems and research methodology to Komal, ensuring our scientific approach is both rigorous and sound.",
        tagline: "Deep expertise in biological systems",
    },
    {
        name: "Prof Brian Scassellati",
        role: "Principal Investigator",
        credentials: ["Yale Social Robotics Lab"],
        image: "/brian2.png",
        description: "Prof Scassellati is the Principal Investigator at Yale Social Robotics Lab and Professor at Yale University. He is a leading global expert in social robotics, guiding Komal's human-robot interaction and design.",
        tagline: "Leading the future of human-robot interaction",
    },
    {
        name: "Prof Om Prakash Singh",
        role: "Editor-in-Chief",
        credentials: ["Indian Journal of Psychiatry", "MD, FRCP"],
        image: "/dr-professor-om-prakash-singh-md-psychiatrist-research-advisor-president-national-psychiatric-society-bangalore.png",
        description: "Dr. Singh is a senior psychiatrist with 30 years of clinical and academic experience. He leads the Indian Journal of Psychiatry and advises Komal on de-addiction strategies and our psychosocial mental health framework.",
        tagline: "Three decades shaping child mental health",
    },
    {
        name: "Bratati Sinha Ray",
        role: "Consultant Psychologist",
        credentials: ["22+ years experience", "Apollo Clinic"],
        image: "/balaji.png",
        description: "Bratati is a Consultant Psychologist at Apollo Clinic with 22+ years of experience. She specializes in child psychology and trauma healing, supporting adolescents with ADHD, learning disorders, and neurodiversity.",
        tagline: "22+ years healing young minds",
    },
    {
        name: "Shreya Jain",
        role: "GTM Advisor",
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
        <svg key="zigzag" className="absolute -top-2 -left-4 w-8 h-8 text-primary/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 12 L6 8 L10 12 L14 8 L18 12 L22 8" />
        </svg>,
        // Circle
        <svg key="circle" className="absolute -top-1 -right-3 w-6 h-6 text-primary/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="8" />
        </svg>,
        // Parenthesis
        <svg key="paren" className="absolute top-1/2 -right-6 w-5 h-10 text-primary/50" viewBox="0 0 10 20" fill="none" stroke="currentColor" strokeWidth="1.5">
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

export default function TeamSection() {
    return (
        <section className="team-section pt-24 pb-16 md:pb-24 bg-white" id="team">
            <div className="container max-w-[1200px] px-6 md:px-8 mx-auto">
                {/* Core Team */}
                <h2 className="section-title font-sans text-2xl md:text-4xl font-bold mb-10 md:mb-12 leading-[1.1] tracking-[-0.02em] text-primary text-center">
                    Meet The Team
                </h2>

                {/* Horizontal Row Layout for each member */}
                <div className="space-y-4">
                    {coreTeam.map((member, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div
                                key={index}
                                className={`group flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 py-4 md:py-6 border-b border-gray-100 last:border-b-0 transition-colors duration-300 rounded-3xl px-6 md:px-12 ${isEven ? 'bg-gray-50/80 md:flex-row-reverse' : 'bg-white'}`}
                            >
                                {/* PFP + Name Column */}
                                <div className={`flex flex-col items-center ${isEven ? 'md:items-end' : 'md:items-start'} shrink-0`}>
                                    <div className="relative mb-2">
                                        {/* Decorative elements */}
                                        <DecorativeElements index={index} />
                                        
                                        {/* Image with halftone/dotted effect */}
                                        <div className="relative w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-full border border-primary/10 shadow-inner">
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                style={{
                                                    objectPosition: 'center 20%',
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

                                        {/* Tagline badge (Speech bubble style) */}
                                        {member.tagline && (
                                            <div className={`absolute -bottom-1 ${isEven ? '-right-4' : '-left-4'} bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 max-w-[140px] md:max-w-[180px] transform ${isEven ? 'rotate-2' : '-rotate-2'}`}>
                                                <p className="text-[9px] md:text-[10px] text-primary/80 font-medium italic leading-tight">
                                                    &ldquo;{member.tagline}&rdquo;
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Name under image - Centered for uniformity */}
                                    <h3 className="text-xl md:text-2xl font-bold text-primary tracking-tight text-center">
                                        {member.name}
                                    </h3>
                                </div>

                                {/* Role, Credentials & Description Column */}
                                <div className={`flex flex-col justify-center max-w-[600px] ${isEven ? 'text-left items-start' : 'md:text-right md:items-end'}`}>
                                    <div className={`mb-1 flex flex-col ${isEven ? 'items-start' : 'md:items-end'}`}>
                                        <p className="text-xs md:text-sm font-bold text-primary mb-0.5 uppercase tracking-wider">
                                            {member.role}
                                        </p>
                                        <p className={`text-[10px] md:text-xs text-text-dim font-medium mb-2 ${isEven ? 'text-left' : 'md:text-right'}`}>
                                            {member.credentials.join(" • ")}
                                        </p>
                                    </div>
                                    <p className={`text-[11px] md:text-[13px] text-text-dim leading-relaxed ${isEven ? 'text-left' : 'md:text-right'}`}>
                                        {member.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Advisors Section */}
                <div className="mt-16 md:mt-24">
                    <h2 className="section-title font-sans text-2xl md:text-4xl font-bold mb-10 md:mb-12 leading-[1.1] tracking-[-0.02em] text-primary text-center">
                        Our Advisors
                    </h2>

                    {/* Horizontal Row Layout for each advisor */}
                    <div className="space-y-2">
                        {advisors.map((advisor, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <div
                                    key={index}
                                    className={`group flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 py-4 md:py-6 border-b border-gray-100 last:border-b-0 transition-colors duration-300 rounded-3xl px-6 md:px-12 ${isEven ? 'bg-gray-50/80 md:flex-row-reverse' : 'bg-white'}`}
                                >
                                    {/* PFP + Name Column */}
                                    <div className={`flex flex-col items-center ${isEven ? 'md:items-end' : 'md:items-start'} shrink-0`}>
                                        <div className="relative mb-2">
                                            {/* Decorative elements */}
                                            <DecorativeElements index={index + 3} />
                                            
                                            {/* Image with halftone/dotted effect */}
                                            <div className="relative w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-full border border-primary/10 shadow-inner">
                                                <Image
                                                    src={advisor.image}
                                                    alt={advisor.name}
                                                    fill
                                                    className={`transition-transform duration-300 group-hover:scale-105 ${
                                                        advisor.name.includes('Brian') || advisor.name.includes('Doris')
                                                            ? 'object-contain'
                                                            : 'object-cover'
                                                    }`}
                                                    style={{
                                                        objectPosition: advisor.name.includes('Shreya') 
                                                            ? 'center top' 
                                                            : 'center 20%',
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

                                            {/* Tagline badge */}
                                            {advisor.tagline && (
                                                <div className={`absolute -bottom-1 ${isEven ? '-right-4' : '-left-4'} bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 max-w-[140px] md:max-w-[200px] transform ${isEven ? 'rotate-2' : '-rotate-2'}`}>
                                                    <p className="text-[9px] md:text-[10px] text-primary/80 font-medium italic leading-tight">
                                                        &ldquo;{advisor.tagline}&rdquo;
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Name under image */}
                                        <h3 className="text-xl md:text-2xl font-bold text-primary tracking-tight text-center">
                                            {advisor.name}
                                        </h3>
                                    </div>

                                    {/* Role, Credentials & Description Column */}
                                    <div className={`flex flex-col justify-center max-w-[600px] ${isEven ? 'text-left items-start' : 'md:text-right md:items-end'}`}>
                                        <div className={`mb-1 flex flex-col ${isEven ? 'items-start' : 'md:items-end'}`}>
                                            <p className="text-xs md:text-sm font-bold text-primary mb-0.5 uppercase tracking-wider">
                                                {advisor.role}
                                            </p>
                                            <p className={`text-[10px] md:text-xs text-text-dim font-medium mb-2 ${isEven ? 'text-left' : 'md:text-right'}`}>
                                                {advisor.credentials.join(" • ")}
                                            </p>
                                        </div>
                                        <p className={`text-[11px] md:text-[13px] text-text-dim leading-relaxed ${isEven ? 'text-left' : 'md:text-right'}`}>
                                            {advisor.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
