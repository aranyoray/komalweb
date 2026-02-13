"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FloatingOrbs from "@/components/FloatingOrbs";
import FloatingButterflies from "@/components/FloatingButterflies";
import FloatingDots from "@/components/FloatingDots";
import NoiseOverlay from "@/components/NoiseOverlay";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle, Mail, Lock, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, signInWithApple, user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "apple" | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !success) {
      router.push("/onboarding");
    }
  }, [user, success, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.name);
      setSuccess(true);

      // Redirect after showing success animation
      setTimeout(() => {
        router.push("/onboarding");
      }, 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      // Parse Firebase error messages
      if (errorMessage.includes("email-already-in-use")) {
        setError("An account with this email already exists");
      } else if (errorMessage.includes("weak-password")) {
        setError("Password is too weak");
      } else if (errorMessage.includes("invalid-email")) {
        setError("Invalid email address");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
    setError("");
    setSocialLoading(provider);
    try {
      if (provider === "google") {
        await signInWithGoogle();
      } else {
        await signInWithApple();
      }
      setSuccess(true);
      setTimeout(() => {
        router.push("/onboarding");
      }, 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      if (errorMessage.includes("popup-closed-by-user")) {
        setError("Sign-up was cancelled");
      } else if (errorMessage.includes("account-exists-with-different-credential")) {
        setError("An account already exists with this email using a different sign-in method");
      } else {
        setError(errorMessage);
      }
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <>
      <NoiseOverlay opacity={0.025} />

      <section className="min-h-screen pt-24 pb-12 md:pt-28 md:pb-16 bg-gradient-to-b from-white via-purple-50/40 to-white relative overflow-hidden flex items-center justify-center">
        {/* Background effects matching homepage */}
        <div className="absolute inset-0 opacity-20 z-0">
          <FloatingOrbs count={4} />
        </div>
        <div className="absolute inset-0 z-0">
          <FloatingDots />
        </div>
        <div className="absolute inset-0 z-[1]">
          <FloatingButterflies count={10} />
        </div>

        <div className="container max-w-[480px] px-4 sm:px-6 mx-auto relative z-10">
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

            {/* Sparkle decoration */}
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
              Join the adventure!
            </h1>
            <p className="text-sm sm:text-base text-text-dim">
              Create your account to protect curious minds
            </p>
          </motion.div>

          {/* Sign Up Form / Success State */}
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: [0, -5, 5, -5, 5, 0],
                }}
                transition={{
                  duration: 0.5,
                  rotate: {
                    duration: 0.5,
                    delay: 0.2,
                  },
                }}
                className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-green-100/50 p-8 text-center ring-1 ring-green-200/30"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/10"
                >
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </motion.div>
                <h2 className="text-xl font-bold text-primary mb-2">
                  Account Created!
                </h2>
                <p className="text-text-dim">
                  Welcome aboard, {formData.name}! Setting things up...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/40 p-6 sm:p-8 ring-1 ring-primary/5"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-text-main mb-2"
                    >
                      Your Name
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="What should we call you?"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/60 transition-all text-sm"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-text-main mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="parent@example.com"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/60 transition-all text-sm"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-text-main mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="At least 6 characters"
                        className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/60 transition-all text-sm"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary/60 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-semibold text-text-main mb-2"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your password"
                        className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/60 transition-all text-sm"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary/60 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 btn-primary-premium text-white rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base border-0"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Create Account
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  <span className="text-xs text-text-dim font-medium">or continue with</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin("google")}
                    disabled={loading || socialLoading !== null}
                    className="w-full py-3.5 bg-white border-2 border-gray-200 rounded-full font-semibold transition-all hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm text-text-main"
                  >
                    {socialLoading === "google" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                    )}
                    Continue with Google
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin("apple")}
                    disabled={loading || socialLoading !== null}
                    className="w-full py-3.5 bg-black text-white rounded-full font-semibold transition-all hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm"
                  >
                    {socialLoading === "apple" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                    )}
                    Continue with Apple
                  </button>
                </div>

                {/* Sign In Link */}
                <p className="text-center text-text-dim text-sm mt-6">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="text-primary font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Demo Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-text-dim text-sm mb-2">
              Just curious?
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline text-sm"
            >
              Try our free demo
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
