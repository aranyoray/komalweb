"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FloatingOrbs from "@/components/FloatingOrbs";
import FloatingButterflies from "@/components/FloatingButterflies";
import FloatingDots from "@/components/FloatingDots";
import NoiseOverlay from "@/components/NoiseOverlay";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle, Mail, Lock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const { signIn, user } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !success) {
      router.push("/dashboard");
    }
  }, [user, success, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
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
      await signIn(formData.email, formData.password);
      setSuccess(true);

      // Redirect after showing success animation
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      // Parse Firebase error messages
      if (errorMessage.includes("user-not-found")) {
        setError("No account found with this email");
      } else if (errorMessage.includes("wrong-password") || errorMessage.includes("invalid-credential")) {
        setError("Incorrect email or password");
      } else if (errorMessage.includes("too-many-requests")) {
        setError("Too many failed attempts. Please try again later");
      } else if (errorMessage.includes("invalid-email")) {
        setError("Invalid email address");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
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
              Welcome back, explorer!
            </h1>
            <p className="text-sm sm:text-base text-text-dim">
              Sign in to keep your little ones safe
            </p>
          </motion.div>

          {/* Sign In Form / Success State */}
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
                  Welcome Back!
                </h2>
                <p className="text-text-dim">
                  Taking you to your dashboard...
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
                <form onSubmit={handleSubmit} className="space-y-5">
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
                        placeholder="Enter your password"
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
                        Signing In...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  <span className="text-xs text-text-dim font-medium">or</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                </div>

                {/* Sign Up Link */}
                <p className="text-center text-text-dim text-sm">
                  New to KOMAL?{" "}
                  <Link
                    href="/sign-up"
                    className="text-primary font-semibold hover:underline"
                  >
                    Create an account
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
