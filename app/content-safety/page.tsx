"use client";

import { useState } from "react";
import Link from "next/link";
import FloatingParticles from "@/components/FloatingParticles";
import { Button } from "@/components/ui/button";

// Content category data based on the document
const contentCategories = [
    {
        name: "Violence & Disturbing Content",
        items: [
            { label: "Graphic violence", definition: "Realistic depictions of blood, gore, injury, or death", under10: "Block", age10_13: "Block", age13_16: "Block", age16plus: "Gate" },
            { label: "Non-graphic violence", definition: "Cartoon or stylized violence without realistic harm", under10: "Block/Gate", age10_13: "Gate/Allow", age13_16: "Gate/Allow", age16plus: "Allow" },
            { label: "Heavy fighting (WWE, contact sports)", definition: "Professional wrestling, MMA, boxing, and similar combat sports", under10: "Block/Gate", age10_13: "Gate", age13_16: "Allow", age16plus: "Allow" },
            { label: "Horror / paranormal / jumpscares", definition: "Scary content, ghosts, monsters, or sudden frightening moments", under10: "Block/Gate", age10_13: "Gate", age13_16: "Gate", age16plus: "Allow" },
            { label: "Crime / news footage", definition: "Real-world crime coverage, accident footage, or disturbing news", under10: "Block/Gate", age10_13: "Gate", age13_16: "Gate", age16plus: "Allow" },
        ],
    },
    {
        name: "Explicit & Body-Related Content",
        items: [
            { label: "Explicit sexual content", definition: "Pornography or sexually explicit material", under10: "Block", age10_13: "Block", age13_16: "Block", age16plus: "Block" },
            { label: "Sexual education (medical, educational)", definition: "Age-appropriate content about puberty, reproduction, or health", under10: "Block/Gate", age10_13: "Gate", age13_16: "Gate/Allow", age16plus: "Allow" },
            { label: "Indecent clothing or speech", definition: "Revealing outfits, suggestive poses, or inappropriate language", under10: "Block/Gate", age10_13: "Gate", age13_16: "Gate", age16plus: "Allow" },
            { label: "Body modification (tattoos, piercings)", definition: "Content featuring or promoting tattoos, piercings, or body art", under10: "Block/Gate", age10_13: "Gate", age13_16: "Gate", age16plus: "Allow" },
            { label: "Beauty & appearance filters", definition: "Face filters, body editing apps, or unrealistic beauty standards", under10: "Block/Gate", age10_13: "Gate", age13_16: "Gate", age16plus: "Allow" },
        ],
    },
    {
        name: "Substances & Addictive Behavior",
        items: [
            { label: "Alcohol content", definition: "Depictions of alcohol use, drinking culture, or bar scenes", under10: "Block/Gate", age10_13: "Gate", age13_16: "Gate", age16plus: "Allow" },
            { label: "Drugs & cigarettes", definition: "Content showing drug use, smoking, vaping, or substance abuse", under10: "Block/Gate", age10_13: "Block/Gate", age13_16: "Gate", age16plus: "Allow" },
            { label: "Gambling & betting / Loot boxes", definition: "Casino games, sports betting, or randomized in-game purchases", under10: "Block/Gate", age10_13: "Block/Gate", age13_16: "Gate", age16plus: "Allow" },
            { label: "Parasocial & manipulative content", definition: "Creators exploiting emotional bonds or using manipulative tactics", under10: "Block/Gate", age10_13: "Gate", age13_16: "Gate", age16plus: "Allow" },
            { label: "Self-optimization / body anxiety", definition: "Extreme fitness, diet culture, or content promoting body insecurity", under10: "Block/Gate", age10_13: "Block/Gate", age13_16: "Block/Gate", age16plus: "Block/Gate" },
        ],
    },
    {
        name: "Financial & Commercial Content",
        items: [
            { label: "Crypto / speculative finance", definition: "Cryptocurrency, NFTs, meme stocks, or high-risk investments", under10: "Block/Gate", age10_13: "Gate", age13_16: "Gate", age16plus: "Allow" },
            { label: "Get-rich-quick schemes", definition: "Promises of easy money, MLMs, or unrealistic financial claims", under10: "Block/Gate", age10_13: "Gate", age13_16: "Gate", age16plus: "Allow" },
            { label: "Influencer financial advice", definition: "Non-professional money tips from social media personalities", under10: "Block/Gate", age10_13: "Gate", age13_16: "Gate", age16plus: "Allow" },
            { label: "Subscription / purchase pages", definition: "Paywalls, in-app purchases, or subscription prompts", under10: "Block/Gate", age10_13: "Gate", age13_16: "Gate", age16plus: "Allow" },
        ],
    },
    {
        name: "Media & Platform-Native Risks",
        items: [
            { label: "Short-form videos (<10 sec)", definition: "Highly addictive rapid-scroll content designed for endless viewing", under10: "Block/Gate", age10_13: "Gate", age13_16: "Gate", age16plus: "Allow" },
            { label: "Live streams", definition: "Unmoderated real-time broadcasts with unpredictable content", under10: "Block/Gate", age10_13: "Gate", age13_16: "Gate", age16plus: "Allow" },
            { label: "Gaming content (videos, poker, rummy)", definition: "Game streams, let's plays, or skill-based gambling games", under10: "Gate", age10_13: "Gate", age13_16: "Allow", age16plus: "Allow" },
            { label: "AI-generated content", definition: "Deepfakes, AI art, or synthetic media that may mislead", under10: "Block/Gate", age10_13: "Gate", age13_16: "Gate", age16plus: "Allow" },
        ],
    },
    {
        name: "Social & Cultural Topics",
        items: [
            { label: "Religion", definition: "Religious teachings, practices, or faith-based discussions", under10: "Gate", age10_13: "Allow", age13_16: "Allow", age16plus: "Allow" },
            { label: "Immigration", definition: "Content about migration, borders, or refugee topics", under10: "Gate", age10_13: "Allow", age13_16: "Allow", age16plus: "Allow" },
            { label: "Discrimination & hate speech", definition: "Content containing slurs, prejudice, or targeting groups", under10: "Block/Gate", age10_13: "Block/Gate", age13_16: "Gate", age16plus: "Allow" },
            { label: "Guns & weapons", definition: "Firearms, knives, or weapon-related content", under10: "Block/Gate", age10_13: "Block/Gate", age13_16: "Gate", age16plus: "Allow" },
            { label: "Extremist orgs / propaganda", definition: "Terrorist groups, radical ideologies, or recruitment material", under10: "Block", age10_13: "Block", age13_16: "Block", age16plus: "Block" },
        ],
    },
];

// Tooltip component for content type definitions
const ContentTypeLabel = ({ label, definition }: { label: string; definition: string }) => {
    return (
        <div className="flex items-center gap-1.5 group/tooltip relative">
            <span className="text-sm text-primary font-medium">{label}</span>
            <div className="relative">
                <svg 
                    className="w-3.5 h-3.5 text-text-dim/50 hover:text-primary cursor-help transition-colors" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-primary text-white text-xs rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 shadow-lg w-[240px] text-center leading-relaxed">
                    {definition}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-primary"></div>
                </div>
            </div>
        </div>
    );
};

const ActionBadge = ({ action }: { action: string }) => {
    const getColorClasses = (action: string) => {
        if (action === "Block") return "bg-red-100 text-red-700 border-red-200";
        if (action === "Gate") return "bg-amber-100 text-amber-700 border-amber-200";
        if (action === "Allow") return "bg-green-100 text-green-700 border-green-200";
        if (action.includes("Block") && action.includes("Gate")) return "bg-orange-100 text-orange-700 border-orange-200";
        if (action.includes("Gate") && action.includes("Allow")) return "bg-lime-100 text-lime-700 border-lime-200";
        return "bg-gray-100 text-black border-gray-200";
    };

    return (
        <span className={`px-2 py-0.5 text-[10px] md:text-xs font-medium rounded-full border ${getColorClasses(action)}`}>
            {action}
        </span>
    );
};

export default function ContentSafetyPage() {
    const [expandedCategory, setExpandedCategory] = useState<number | null>(0);

    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-20 md:pt-32 pb-12 px-6 md:px-16 overflow-hidden bg-white">
                <div className="absolute inset-0 z-0">
                    <FloatingParticles count={40} />
                </div>

                <div className="max-w-[1100px] mx-auto relative z-[2]">
                    <div className="text-center mb-12 animate-[fadeDown_0.8s_ease_forwards]">
                        <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6 inline-block">
                            Age-Appropriate Access
                        </span>
                        <h1 className="font-sans text-[28px] md:text-[48px] lg:text-[56px] font-bold leading-[1.2] tracking-[-0.02em] text-primary mb-6">
                            Content Safety for<br />Your Growing Child
                        </h1>
                        <p className="text-lg md:text-xl text-text-dim leading-relaxed max-w-[700px] mx-auto">
                            Kids need the internet, but not all of it, and not all at once. Komal applies age-based access across content types, using clear rules and context rather than blanket bans.
                        </p>
                    </div>
                </div>
            </section>

            {/* The Problem Section */}
            <section className="py-12 md:py-16 bg-[#F5F5F7]">
                <div className="max-w-[900px] mx-auto px-6 md:px-8">
                    <h2 className="font-sans text-center text-[32px] md:text-[42px] font-semibold text-primary mb-6 tracking-[-0.02em]">
                        The Problem with Parental Controls
                    </h2>
                    <p className="text-lg text-center text-text-dim leading-relaxed mb-8">
                        Most parental control tools either <strong className="text-primary">block too much</strong> or <strong className="text-primary">too little</strong>. They ban entire websites, miss context, or force parents to constantly step in. That creates frustration on both sides.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl p-5 border border-red-100 text-center">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                                <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-primary mb-2">Over-Blocking</h3>
                            <p className="text-sm text-text-dim">Bans entire websites, including educational content</p>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-amber-100 text-center">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                                <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 9v4" />
                                    <circle cx="12" cy="17" r="1" fill="currentColor" />
                                    <circle cx="12" cy="12" r="10" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-primary mb-2">Missing Context</h3>
                            <p className="text-sm text-text-dim">Treats news the same as glorification</p>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-purple-100 text-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 6v6l4 2" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-primary mb-2">Constant Intervention</h3>
                            <p className="text-sm text-text-dim">Forces parents to step in for every decision</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Solution - Block/Gate/Allow */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-[1100px] mx-auto px-6 md:px-16">
                    <div className="text-center  mb-12">
                        <h2 className="font-sans text-center text-[32px] md:text-[42px] font-semibold text-primary mb-4 tracking-[-0.02em]">
                            A Calmer Approach
                        </h2>
                        <p className="text-lg text-center text-text-dim leading-relaxed max-w-[700px] mx-auto">
                            Komal uses three actions instead of binary blocking. The goal is not to control children, but to guide them as they grow, while keeping parents in charge.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {/* Block */}
                        <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200 text-center">
                            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-red-600 mb-2 text-center">BLOCK</h3>
                            <p className="text-text-dim mb-4">Content not accessible</p>
                            <p className="text-sm text-text-dim/80">
                                Used for content that is clearly harmful regardless of context—explicit material, extremist propaganda, etc.
                            </p>
                        </div>

                        {/* Gate */}
                        <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-200 text-center">
                            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 9v4" />
                                    <circle cx="12" cy="17" r="1" fill="currentColor" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-amber-600 mb-2 text-center">GATE</h3>
                            <p className="text-text-dim mb-4">Warning, delay, or parent approval</p>
                            <p className="text-sm text-text-dim/80">
                                The middle ground—content is paused with a warning or requires parent approval. Parents stay informed.
                            </p>
                        </div>

                        {/* Allow */}
                        <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200 text-center">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-green-600 mb-2 text-center">ALLOW</h3>
                            <p className="text-text-dim mb-4">Unrestricted access</p>
                            <p className="text-sm text-text-dim/80">
                                Age-appropriate content that children can access freely without interruption.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section className="py-12 md:py-16 bg-[#F5F0FF]">
                <div className="max-w-[1100px] mx-auto px-6 md:px-16">
                    <div className="text-center mb-12">
                        <h2 className="font-sans text-center text-[32px] md:text-[42px] font-semibold text-primary mb-4 tracking-[-0.02em]">
                            How It Works
                        </h2>
                        <p className="text-lg text-center text-text-dim leading-relaxed max-w-[700px] mx-auto">
                            When a child opens a page, Komal follows a simple flow—all happening quietly in the background.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4">
                        {/* Step 1 */}
                        <div className="bg-white rounded-2xl p-5 text-center relative">
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">1</div>
                            <h3 className="font-semibold text-primary mb-2">Content Scanned</h3>
                            <p className="text-sm text-text-dim">Text, images, video frames, and audio cues are analyzed</p>
                            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                                <svg className="w-6 h-6 text-primary/30" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                </svg>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white rounded-2xl p-5 text-center relative">
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">2</div>
                            <h3 className="font-semibold text-primary mb-2">Context Evaluated</h3>
                            <p className="text-sm text-text-dim">Educational vs promotional, news vs glorification</p>
                            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                                <svg className="w-6 h-6 text-primary/30" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                </svg>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white rounded-2xl p-5 text-center relative">
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">3</div>
                            <h3 className="font-semibold text-primary mb-2">Age Rules Applied</h3>
                            <p className="text-sm text-text-dim">&lt;10, 10–13, 13–16, 16+ with appropriate actions</p>
                            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                                <svg className="w-6 h-6 text-primary/30" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                </svg>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-white rounded-2xl p-5 text-center">
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">4</div>
                            <h3 className="font-semibold text-primary mb-2">Parent Rules Checked</h3>
                            <p className="text-sm text-text-dim">Custom blocks override defaults, notifications sent</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Categories Matrix */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-[1200px] mx-auto px-6 md:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-sans text-center text-[32px] md:text-[42px] font-semibold text-primary mb-4 tracking-[-0.02em]">
                            You Decide What's Best
                        </h2>
                        <p className="text-lg text-center text-text-dim leading-relaxed max-w-[700px] mx-auto">
                            Komal categorizes content real-time and applies age-appropriate rules. Parents can always customize these settings.
                        </p>
                    </div>

                    {/* Accordion-style categories */}
                    <div className="space-y-4">
                        {contentCategories.map((category, idx) => (
                            <div key={idx} className="bg-[#F5F5F7] rounded-2xl overflow-hidden">
                                <button
                                    onClick={() => setExpandedCategory(expandedCategory === idx ? null : idx)}
                                    className="w-full flex items-center justify-between p-5 text-left hover:bg-[#ECECEE] transition-colors"
                                >
                                    <h3 className="font-semibold text-primary text-lg">{category.name}</h3>
                                    <svg
                                        className={`w-5 h-5 text-primary transition-transform ${expandedCategory === idx ? 'rotate-180' : ''}`}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>

                                {expandedCategory === idx && (
                                    <div className="px-5 pb-5">
                                        {/* Table Header */}
                                        <div className="grid grid-cols-5 gap-2 mb-2 text-xs font-medium text-text-dim">
                                            <div className="col-span-1">Content Type</div>
                                            <div className="text-center">&lt;10</div>
                                            <div className="text-center">10–13</div>
                                            <div className="text-center">13–16</div>
                                            <div className="text-center">16+</div>
                                        </div>
                                        {/* Table Rows */}
                                        {category.items.map((item, itemIdx) => (
                                            <div
                                                key={itemIdx}
                                                className="grid grid-cols-5 gap-2 py-3 border-t border-gray-200 items-center"
                                            >
                                                <div className="col-span-1">
                                                    <ContentTypeLabel label={item.label} definition={item.definition} />
                                                </div>
                                                <div className="text-center"><ActionBadge action={item.under10} /></div>
                                                <div className="text-center"><ActionBadge action={item.age10_13} /></div>
                                                <div className="text-center"><ActionBadge action={item.age13_16} /></div>
                                                <div className="text-center"><ActionBadge action={item.age16plus} /></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Analysis Section */}
            <section className="py-12 md:py-16 bg-[#F5F5F7]">
                <div className="max-w-[1100px] mx-auto px-6 md:px-16">
                    <div className="text-center mb-12">
                        <h2 className="font-sans text-center text-[32px] md:text-[42px] font-semibold text-primary mb-4 tracking-[-0.02em]">
                            AI-Powered Analysis
                        </h2>
                        <p className="text-lg text-center text-text-dim leading-relaxed max-w-[700px] mx-auto">
                            Komal uses both language understanding and visual understanding to make decisions. Multiple checks must agree before a category is applied.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Text Analysis */}
                        <div className="bg-white rounded-2xl p-6 border border-border/30">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-[#E8E0F5] rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="16" y1="13" x2="8" y2="13" />
                                        <line x1="16" y1="17" x2="8" y2="17" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-primary">Text & Speech Analysis</h3>
                            </div>
                            <ul className="space-y-2 text-text-dim">
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 mt-1 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>Keywords and phrases detection</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 mt-1 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>Tone and intent analysis</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 mt-1 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>Educational vs promotional language</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 mt-1 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>Slang and coded terms (drugs, violence, hate)</span>
                                </li>
                            </ul>
                        </div>

                        {/* Visual Analysis */}
                        <div className="bg-white rounded-2xl p-6 border border-border/30">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-[#E8E0F5] rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-primary">Image & Video Analysis</h3>
                            </div>
                            <ul className="space-y-2 text-text-dim">
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 mt-1 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>Weapons, blood, fighting detection</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 mt-1 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>Explicit body exposure identification</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 mt-1 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>Drug use, smoking, alcohol recognition</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 mt-1 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>Scary visuals, horror, and jump scares</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 bg-[#E8E0F5] rounded-2xl p-6 text-center">
                        <p className="text-primary text-center font-medium">
                             Multiple signals must agree before a category is applied. This reduces false blocks and avoids overreacting.
                        </p>
                    </div>
                </div>
            </section>

            {/* Parent Controls Section */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-[1100px] mx-auto px-6 md:px-16">
                    <div className="text-center mb-12">
                        <h2 className="font-sans text-center text-[32px] md:text-[42px] font-semibold text-primary mb-4 tracking-[-0.02em]">
                            Custom Parent Controls
                        </h2>
                        <p className="text-lg text-center text-text-dim leading-relaxed max-w-[700px] mx-auto">
                            Parents always have the final say. Customize rules per child profile.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-[#F5F5F7] rounded-2xl p-6 text-center">
                            <div className="flex flex-col items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="15" y1="9" x2="9" y2="15" />
                                        <line x1="9" y1="9" x2="15" y2="15" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-primary">Block Specific Interests</h3>
                            </div>
                            <p className="text-text-dim text-sm">Block topics your child shouldn&apos;t explore yet (e.g., Roblox, cars, specific games)</p>
                        </div>

                        <div className="bg-[#F5F5F7] rounded-2xl p-6 text-center">
                            <div className="flex flex-col items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-primary">Block Specific URLs</h3>
                            </div>
                            <p className="text-text-dim text-sm">Add any website to your block list. It will be inaccessible regardless of other rules.</p>
                        </div>

                        <div className="bg-[#F5F5F7] rounded-2xl p-6 text-center">
                            <div className="flex flex-col items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-primary">Keyword Filters</h3>
                            </div>
                            <p className="text-text-dim text-sm">Block content containing specific words (single-meaning terms recommended)</p>
                        </div>

                        <div className="bg-[#F5F5F7] rounded-2xl p-6 text-center">
                            <div className="flex flex-col items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-primary">Parent Notifications</h3>
                            </div>
                            <p className="text-text-dim text-sm">Get notified when your child attempts to access blocked content</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 md:py-28 bg-primary text-white text-center">
                <div className="max-w-[900px] mx-auto px-6 md:px-8">
                    <h2 className="text-3xl md:text-5xl text-center font-sans font-semibold mb-6">
                        Growing Access, Not Cutting It Off
                    </h2>
                    <p className="text-xl text-center opacity-90 mb-10 max-w-[800px] mx-auto">
                        Komal is about guiding children as they grow, keeping parents informed and in control—without frustration on either side.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto rounded-full"
                        >
                            <Link href="/">Start for free</Link>
                        </Button>
                    
                    </div>
                </div>
            </section>
        </>
    );
}
