"use client";

import Image from 'next/image';
import RotatingText from './RotatingText';

const roles = [
    "Buddy",
    "Companion",
    "Friend",
    "Peer",
    "Confidant",
    "Playmate",
    "Trainer",
    "Supporter",
    "Cheerleader",
];

export default function KomalYourBestSection() {
    return (
        <section className="komal-roles-section py-8 md:py-24 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                    src="/landscape.png"
                    alt=""
                    fill
                    className="object-cover"
                />
            </div>
            <div className="container px-4 mx-auto flex flex-col items-center relative z-10">
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-primary tracking-tight inline-flex items-baseline justify-center gap-1 sm:gap-2 md:gap-3 mb-3 md:mb-4 w-full pl-8 md:pl-16">
                    <span className="whitespace-nowrap">Meet your best</span>
                    <span className="inline-block w-[150px] sm:w-[220px] md:w-[320px] text-center">
                        <RotatingText
                            texts={roles}
                            mainClassName="text-primary font-bold py-1 sm:py-1.5 md:py-2 text-center whitespace-nowrap"
                            staggerFrom="last"
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "-120%", opacity: 0 }}
                            staggerDuration={0}
                            splitBy="words"
                            splitLevelClassName="pb-0.5 sm:pb-1 md:pb-1 whitespace-nowrap"
                            elementLevelClassName="whitespace-nowrap"
                            transition={{ type: "spring", damping: 30, stiffness: 400 }}
                            rotationInterval={2000}
                        />
                    </span>
                </h2>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-grey-200 text-center drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)] backdrop-blur-sm px-3 sm:px-6 py-1.5 sm:py-2 rounded-full">
                    Learn via Play. Track Social, Speech & Emotional Skills with AI.
                </p>
            </div>
        </section>
    );
}
