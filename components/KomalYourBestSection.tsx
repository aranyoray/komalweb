"use client";

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
        <section className="komal-roles-section py-24 bg-white">
            <div className="container max-w-[1240px] px-8 mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-light text-primary mb-8 tracking-tight text-center flex flex-wrap items-center justify-center gap-2 md:gap-3">
                    <span>KOMAL is your best</span>
                    <RotatingText
                        texts={roles}
                        mainClassName="px-4 sm:px-5 md:px-6 bg-gradient-to-r from-primary/10 via-primary/15 to-primary/10 text-primary overflow-hidden py-1 sm:py-1.5 md:py-2 justify-center rounded-full border border-primary/20 shadow-sm"
                        staggerFrom="last"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        rotationInterval={2000}
                    />
                </h2>
                <p className="text-base md:text-lg text-text-dim leading-relaxed max-w-[700px] mx-auto text-center">
                    Learn via Play. Track Social, Speech & Emotional Skills with AI.
                </p>
            </div>
        </section>
    );
}
