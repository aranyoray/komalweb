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
    "Partner-in-Crime"
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
            <div className="container px-4 mx-auto flex justify-center relative z-10">
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-primary tracking-tight inline-flex items-baseline gap-1 sm:gap-2 md:gap-3">
                    <span className="whitespace-nowrap">Meet your best</span>
                    <span className="inline-block min-w-[150px] sm:min-w-[220px] md:min-w-[450px]">
                        <RotatingText
                            texts={roles}
                            mainClassName="text-primary font-bold py-1 sm:py-1.5 md:py-2 text-left whitespace-nowrap"
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
            </div>
        </section>
    );
}
