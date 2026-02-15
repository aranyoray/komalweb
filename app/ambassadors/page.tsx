"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, X, MapPin, ExternalLink } from "lucide-react";
import FloatingOrbs from "@/components/FloatingOrbs";
import FloatingDots from "@/components/FloatingDots";
import NoiseOverlay from "@/components/NoiseOverlay";
import ScrollReveal from "@/components/ScrollReveal";
import { countries } from "@/lib/countries";

interface Pioneer {
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  grade: string;
  bio: string;
  photoURL: string;
  linkedIn: string;
  instagram: string;
  twitter: string;
}

function getCountryFlag(code: string): string {
  return countries.find((c) => c.code === code)?.flag || "";
}

function getCountryName(code: string): string {
  return countries.find((c) => c.code === code)?.name || code;
}

function normalizeSocialUrl(platform: "linkedin" | "instagram" | "twitter", value: string): string {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  const username = value.replace(/^@/, "");
  switch (platform) {
    case "linkedin":
      return `https://linkedin.com/in/${username}`;
    case "instagram":
      return `https://instagram.com/${username}`;
    case "twitter":
      return `https://x.com/${username}`;
  }
}

function getInitials(first: string, last: string): string {
  return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
}

export default function PioneersPage() {
  const [pioneers, setPioneers] = useState<Pioneer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Pioneer | null>(null);

  useEffect(() => {
    async function fetchPioneers() {
      try {
        const res = await fetch("/api/ambassadors");
        if (!res.ok) throw new Error("Failed to load pioneers");
        const data = await res.json();
        setPioneers(data.ambassadors || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchPioneers();
  }, []);

  return (
    <>
      <NoiseOverlay opacity={0.025} />

      <section className="min-h-screen pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-white via-purple-50/40 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 z-0">
          <FloatingOrbs count={5} />
        </div>
        <div className="absolute inset-0 z-0">
          <FloatingDots />
        </div>

        <div className="container max-w-6xl px-4 sm:px-6 mx-auto relative z-10">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Our Pioneers
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-3 tracking-tight">
                Meet the KOMAL Pioneers
              </h1>
              <p className="text-base sm:text-lg text-text-dim max-w-2xl mx-auto">
                Youth leaders and digital role models making a difference in their communities
              </p>
            </div>
          </ScrollReveal>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-text-dim">Loading pioneers...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && pioneers.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg text-text-dim">No pioneers yet. Check back soon!</p>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && pioneers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pioneers.map((amb, i) => (
                <ScrollReveal key={i} delay={i * 0.05}>
                  <button
                    onClick={() => setSelected(amb)}
                    className="w-full text-left bg-white/70 backdrop-blur-xl rounded-[1.5rem] shadow-lg border border-white/40 ring-1 ring-primary/5 p-6 hover:shadow-xl hover:ring-primary/15 hover:-translate-y-1 transition-all duration-300 group"
                  >
                    {/* Avatar + Name */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20 overflow-hidden shrink-0">
                        {amb.photoURL ? (
                          <Image
                            src={amb.photoURL}
                            alt={`${amb.firstName} ${amb.lastName}`}
                            width={56}
                            height={56}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-lg font-bold text-primary">
                            {getInitials(amb.firstName, amb.lastName)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-text-main truncate group-hover:text-primary transition-colors">
                          {amb.firstName} {amb.lastName}
                        </h3>
                        {amb.grade && (
                          <p className="text-sm text-text-dim truncate">{amb.grade}</p>
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    {(amb.city || amb.country) && (
                      <div className="flex items-center gap-1.5 text-sm text-text-dim mb-3">
                        <MapPin className="w-3.5 h-3.5 text-primary/40 shrink-0" />
                        <span className="truncate">
                          {[amb.city, amb.country ? `${getCountryFlag(amb.country)} ${getCountryName(amb.country)}` : ""].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}

                    {/* Social icons */}
                    <div className="flex items-center gap-2">
                      {amb.linkedIn && (
                        <span className="w-8 h-8 rounded-full bg-[#0A66C2]/10 flex items-center justify-center">
                          <svg className="w-4 h-4 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </span>
                      )}
                      {amb.instagram && (
                        <span className="w-8 h-8 rounded-full bg-[#E4405F]/10 flex items-center justify-center">
                          <svg className="w-4 h-4 text-[#E4405F]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                          </svg>
                        </span>
                      )}
                      {amb.twitter && (
                        <span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                          <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </span>
                      )}
                    </div>
                  </button>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-6 sm:p-8 relative ring-1 ring-primary/5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            {/* Avatar */}
            <div className="flex justify-center mb-5">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20 overflow-hidden">
                {selected.photoURL ? (
                  <Image
                    src={selected.photoURL}
                    alt={`${selected.firstName} ${selected.lastName}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    {getInitials(selected.firstName, selected.lastName)}
                  </span>
                )}
              </div>
            </div>

            {/* Name & Grade */}
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-text-main">
                {selected.firstName} {selected.lastName}
              </h2>
              {selected.grade && (
                <p className="text-sm text-text-dim mt-1">{selected.grade}</p>
              )}
            </div>

            {/* Location */}
            {(selected.city || selected.country) && (
              <div className="flex items-center justify-center gap-1.5 text-sm text-text-dim mb-4">
                <MapPin className="w-4 h-4 text-primary/40" />
                <span>
                  {[selected.city, selected.country ? `${getCountryFlag(selected.country)} ${getCountryName(selected.country)}` : ""].filter(Boolean).join(", ")}
                </span>
              </div>
            )}

            {/* Bio */}
            {selected.bio && (
              <p className="text-sm text-text-dim text-center mb-5 line-clamp-2">
                {selected.bio}
              </p>
            )}

            {/* Social Links */}
            {(selected.linkedIn || selected.instagram || selected.twitter) && (
              <div className="flex items-center justify-center gap-3">
                {selected.linkedIn && (
                  <Link
                    href={normalizeSocialUrl("linkedin", selected.linkedIn)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A66C2]/10 text-[#0A66C2] text-sm font-medium hover:bg-[#0A66C2]/20 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
                {selected.instagram && (
                  <Link
                    href={normalizeSocialUrl("instagram", selected.instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#E4405F]/10 text-[#E4405F] text-sm font-medium hover:bg-[#E4405F]/20 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                    Instagram
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
                {selected.twitter && (
                  <Link
                    href={normalizeSocialUrl("twitter", selected.twitter)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 text-black text-sm font-medium hover:bg-black/10 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    X
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
