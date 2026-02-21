"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ChevronDown, Sparkles, Phone, MapPin, Gift, User, Camera, X } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { countries } from "@/lib/countries";
import FloatingOrbs from "@/components/FloatingOrbs";
import FloatingButterflies from "@/components/FloatingButterflies";
import FloatingDots from "@/components/FloatingDots";
import NoiseOverlay from "@/components/NoiseOverlay";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading, getIdToken, refreshUserData } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("US");
  const [country, setCountry] = useState("");
  const [referralCode, setReferralCode] = useState("");

  // Profile photo
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New profile fields
  const [city, setCity] = useState("");
  const [grade, setGrade] = useState("");
  const [bio, setBio] = useState("");

  // Social media
  const [linkedIn, setLinkedIn] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");

  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [phoneSearch, setPhoneSearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const phoneDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Prefill from existing userData
  useEffect(() => {
    if (userData?.name) {
      const parts = userData.name.split(" ");
      if (parts.length >= 2) {
        setFirstName(parts[0]);
        setLastName(parts.slice(1).join(" "));
      } else if (parts.length === 1) {
        setFirstName(parts[0]);
      }
    }
  }, [userData?.name]);

  // Auth guards
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/sign-in");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!authLoading && user && userData?.onboardingCompleted === true && !submitted) {
      router.push("/dashboard");
    }
  }, [authLoading, user, userData, submitted, router]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (phoneDropdownRef.current && !phoneDropdownRef.current.contains(e.target as Node)) {
        setPhoneDropdownOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setCountryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedPhoneCountry = countries.find((c) => c.code === phoneCountryCode);

  const filteredPhoneCountries = useMemo(() => {
    if (!phoneSearch.trim()) return countries;
    const q = phoneSearch.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [phoneSearch]);

  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return countries;
    const q = countrySearch.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [countrySearch]);

  const selectedCountry = countries.find((c) => c.code === country);

  // Phone number max digits per country (common standards)
  const phoneMaxDigits: Record<string, number> = {
    US: 10, CA: 10, GB: 10, AU: 9, IN: 10, CN: 11, JP: 10, KR: 10,
    DE: 11, FR: 9, IT: 10, ES: 9, BR: 11, MX: 10, RU: 10, ZA: 9,
    NG: 10, KE: 10, PK: 10, BD: 10, PH: 10, ID: 12, MY: 10, SG: 8,
    TH: 9, VN: 10, AE: 9, SA: 9, EG: 10, TR: 10, PL: 9, NL: 9,
    SE: 10, NO: 8, DK: 8, FI: 10, CH: 10, AT: 10, BE: 9, IE: 9,
    PT: 9, GR: 10, CZ: 9, HU: 9, RO: 10, NZ: 10, AR: 10, CL: 9,
    CO: 10, PE: 9,
  };
  const currentMaxDigits = phoneMaxDigits[phoneCountryCode] || 15;

  const handlePhoneChange = (value: string) => {
    // Allow only digits
    const digitsOnly = value.replace(/\D/g, "");
    // Enforce max length
    setPhone(digitsOnly.slice(0, currentMaxDigits));
  };

  // Resize image to max 200x200 and return as base64 data URL
  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX = 200;
          let w = img.width;
          let h = img.height;
          if (w > h) {
            if (w > MAX) { h = (h * MAX) / w; w = MAX; }
          } else {
            if (h > MAX) { w = (w * MAX) / h; h = MAX; }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB.");
      return;
    }

    try {
      const resized = await resizeImage(file);
      setPhotoFile(file);
      setPhotoPreview(resized);
      setError("");
    } catch {
      setError("Failed to process image.");
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadPhoto = async (): Promise<string> => {
    if (!photoPreview || !user) return "";

    setUploadingPhoto(true);
    try {
      const token = await getIdToken();
      if (!token) return "";

      const res = await fetch("/api/upload-photo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ photoData: photoPreview }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      return data.photoURL || "";
    } catch (err) {
      console.error("Photo upload error:", err);
      return "";
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }
    if (!country) {
      setError("Please select your country of residence.");
      return;
    }
    if (!city.trim()) {
      setError("Please enter your city.");
      return;
    }
    if (!grade.trim()) {
      setError("Please enter your grade.");
      return;
    }

    setSubmitting(true);
    try {
      // Upload photo first if selected
      let photoURL = "";
      if (photoFile) {
        photoURL = await uploadPhoto();
      }

      const token = await getIdToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          phoneCountryCode,
          country,
          referralCode: referralCode.trim(),
          photoURL,
          linkedIn: linkedIn.trim(),
          instagram: instagram.trim(),
          twitter: twitter.trim(),
          city: city.trim(),
          grade: grade.trim(),
          bio: bio.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      // Mark as submitted before refreshing to prevent the skip-guard
      // useEffect from redirecting to /dashboard before ambassador check
      setSubmitted(true);
      await refreshUserData();

      // Ambassador redirect for Canada (CA) or China (CN)
      if (data.country === "CA" || data.country === "CN") {
        router.push("/ambassador");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-purple-50/30 to-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-text-dim">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <NoiseOverlay opacity={0.025} />

      <section className="min-h-screen pt-24 pb-12 md:pt-28 md:pb-16 bg-gradient-to-b from-white via-purple-50/40 to-white relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-20 z-0">
          <FloatingOrbs count={4} />
        </div>
        <div className="absolute inset-0 z-0">
          <FloatingDots />
        </div>
        <div className="absolute inset-0 z-[1]">
          <FloatingButterflies count={10} />
        </div>

        <div className="container max-w-[520px] px-4 sm:px-6 mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
              <Image
                src="/komaliconnobg.png"
                alt="KOMAL"
                width={44}
                height={44}
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <span className="text-2xl font-bold text-primary">KOMAL</span>
            </Link>

            <div className="flex justify-center gap-1.5 mb-4">
              <svg className="w-4 h-4 text-primary/40 animate-pulse" style={{ animationDuration: "3s" }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L15 9L24 12L15 15L12 24L9 15L0 12L9 9L12 0Z" />
              </svg>
              <svg className="w-3 h-3 text-primary/30 animate-pulse" style={{ animationDuration: "3s", animationDelay: "0.5s" }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L15 9L24 12L15 15L12 24L9 15L0 12L9 9L12 0Z" />
              </svg>
              <svg className="w-4 h-4 text-primary/40 animate-pulse" style={{ animationDuration: "3s", animationDelay: "1s" }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L15 9L24 12L15 15L12 24L9 15L0 12L9 9L12 0Z" />
              </svg>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2 tracking-tight">
              Complete Your Profile
            </h1>
            <p className="text-sm sm:text-base text-text-dim">
              Tell us a bit about yourself to get started
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/40 p-6 sm:p-8 ring-1 ring-primary/5"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Photo */}
              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">
                  Profile Photo <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {photoPreview ? (
                      <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary/20">
                        <Image
                          src={photoPreview}
                          alt="Profile preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={submitting}
                        className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 bg-white/60 flex flex-col items-center justify-center gap-1 hover:border-primary/40 hover:bg-primary/5 transition-all"
                      >
                        <Camera className="w-5 h-5 text-primary/40" />
                        <span className="text-[10px] text-text-dim">Upload</span>
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </div>
                  {!photoPreview && (
                    <p className="text-xs text-text-dim">
                      JPG, PNG or WebP. Max 5MB.
                    </p>
                  )}
                </div>
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/60 transition-all text-sm"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/60 transition-all text-sm"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  {/* Phone Country Code Dropdown */}
                  <div className="relative" ref={phoneDropdownRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneDropdownOpen(!phoneDropdownOpen);
                        setPhoneSearch("");
                      }}
                      className="flex items-center gap-1.5 px-3 py-3.5 border-2 border-gray-200 rounded-2xl bg-white/60 hover:border-primary/40 transition-all text-sm min-w-[100px]"
                      disabled={submitting}
                    >
                      <span>{selectedPhoneCountry?.flag}</span>
                      <span className="text-text-main font-medium">{selectedPhoneCountry?.dialCode}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </button>

                    {phoneDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-2xl shadow-xl border border-primary/10 z-50 overflow-hidden">
                        <div className="p-2 border-b border-gray-100">
                          <input
                            type="text"
                            value={phoneSearch}
                            onChange={(e) => setPhoneSearch(e.target.value)}
                            placeholder="Search country or code..."
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {filteredPhoneCountries.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setPhoneCountryCode(c.code);
                                setPhoneDropdownOpen(false);
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-primary/5 transition-colors text-left ${
                                c.code === phoneCountryCode ? "bg-primary/10 text-primary font-medium" : "text-text-main"
                              }`}
                            >
                              <span>{c.flag}</span>
                              <span className="flex-1 truncate">{c.name}</span>
                              <span className="text-text-dim text-xs">{c.dialCode}</span>
                            </button>
                          ))}
                          {filteredPhoneCountries.length === 0 && (
                            <div className="px-3 py-4 text-sm text-text-dim text-center">No results</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone Input */}
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="Phone number"
                      maxLength={currentMaxDigits}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/60 transition-all text-sm"
                      disabled={submitting}
                    />
                  </div>
                </div>
                {phone && (
                  <p className="text-xs text-text-dim mt-1 ml-1">
                    {phone.length}/{currentMaxDigits} digits
                  </p>
                )}
              </div>

              {/* Country of Residence */}
              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">
                  Country of Residence <span className="text-red-500">*</span>
                </label>
                <div className="relative" ref={countryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setCountryDropdownOpen(!countryDropdownOpen);
                      setCountrySearch("");
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3.5 border-2 border-gray-200 rounded-2xl bg-white/60 hover:border-primary/40 transition-all text-sm text-left"
                    disabled={submitting}
                  >
                    <MapPin className="w-5 h-5 text-primary/40 flex-shrink-0" />
                    {selectedCountry ? (
                      <span className="flex items-center gap-2 flex-1">
                        <span>{selectedCountry.flag}</span>
                        <span className="text-text-main">{selectedCountry.name}</span>
                      </span>
                    ) : (
                      <span className="text-gray-400 flex-1">Select your country</span>
                    )}
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </button>

                  {countryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-primary/10 z-50 overflow-hidden">
                      <div className="p-2 border-b border-gray-100">
                        <input
                          type="text"
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          placeholder="Search country..."
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredCountries.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setCountry(c.code);
                              setCountryDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-primary/5 transition-colors text-left ${
                              c.code === country ? "bg-primary/10 text-primary font-medium" : "text-text-main"
                            }`}
                          >
                            <span>{c.flag}</span>
                            <span className="flex-1">{c.name}</span>
                          </button>
                        ))}
                        {filteredCountries.length === 0 && (
                          <div className="px-3 py-4 text-sm text-text-dim text-center">No results</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Your city"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/60 transition-all text-sm"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Grade */}
              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">
                  Grade <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="e.g. 10th Grade, University Freshman"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/60 transition-all text-sm"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">
                  Bio <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 200))}
                  placeholder="Tell us a little about yourself..."
                  rows={2}
                  maxLength={200}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/60 transition-all text-sm resize-none"
                  disabled={submitting}
                />
                {bio && (
                  <p className="text-xs text-text-dim mt-1 ml-1">
                    {bio.length}/200 characters
                  </p>
                )}
              </div>

              {/* Social Media Section */}
              <div>
                <label className="block text-sm font-semibold text-text-main mb-3">
                  Social Media <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="space-y-3">
                  {/* LinkedIn */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={linkedIn}
                      onChange={(e) => setLinkedIn(e.target.value)}
                      placeholder="LinkedIn profile URL"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/60 transition-all text-sm"
                      disabled={submitting}
                    />
                  </div>

                  {/* Instagram */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="Instagram username or URL"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/60 transition-all text-sm"
                      disabled={submitting}
                    />
                  </div>

                  {/* X (Twitter) */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="X (Twitter) username or URL"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/60 transition-all text-sm"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              {/* Referral Code */}
              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">
                  Referral Code <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40">
                    <Gift className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="Enter referral code"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/60 transition-all text-sm"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || uploadingPhoto}
                className="w-full py-3.5 btn-primary-premium text-white rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base border-0"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {uploadingPhoto ? "Uploading photo..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Continue
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
}
