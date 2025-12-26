"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            await fetch(
                "https://script.google.com/macros/s/AKfycbzM4_VX7m9Qg2oQYkaxZC0AfS6Ho8GTDiE_lJ8VpYXYaY7HNrPZIAvfBZNWXEJDhlnO/exec",
                {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, email }),
                }
            );

            // With no-cors mode, we can't read the response, but the request goes through
            setIsSubmitting(false);
            setIsSubmitted(true);

            // Reset form after 2 seconds and close
            setTimeout(() => {
                setIsSubmitted(false);
                setEmail("");
                setName("");
                onClose();
            }, 2000);
        } catch (err) {
            setIsSubmitting(false);
            setError("Something went wrong. Please try again.");
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
                <div
                    className="relative w-full max-w-md transform rounded-3xl bg-white p-8 shadow-2xl transition-all duration-300 animate-[modalPop_0.3s_ease-out]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Content */}
                    <div className="text-center">
                        {/* Decorative logo */}
                        <div className="mb-4 w-16 h-16 mx-auto">
                            <Image
                                src="/komaliconnobg.png"
                                alt="KOMAL Logo"
                                width={64}
                                height={64}
                                className="object-contain"
                            />
                        </div>

                        <h2 className="text-2xl font-bold text-primary mb-2">
                            Join the Waitlist
                        </h2>
                        <p className="text-text-dim mb-6">
                            Be among the first to experience Komal when we launch. We&apos;ll notify you!
                        </p>

                        {isSubmitted ? (
                            <div className="py-8">
                                <div className="text-5xl mb-4">🎉</div>
                                <h3 className="text-xl font-semibold text-primary mb-2">
                                    You&apos;re on the list!
                                </h3>
                                <p className="text-text-dim">
                                    We&apos;ll be in touch soon.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full rounded-full border border-gray-200 px-5 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full rounded-full border border-gray-200 px-5 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full rounded-full bg-primary text-white py-6 text-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Joining...
                                        </span>
                                    ) : (
                                        "Join Waitlist"
                                    )}
                                </Button>
                                {error && (
                                    <p className="text-red-500 text-sm mt-2">{error}</p>
                                )}
                            </form>
                        )}

                        <p className="mt-4 text-xs text-text-dim/70">
                            We respect your privacy. No spam, ever.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @keyframes modalPop {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
        </>
    );
}
