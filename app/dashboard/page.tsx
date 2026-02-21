"use client";

import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  MessageSquare,
  Mail,
  Calendar,
  X,
  Video,
  Music,
  ShieldAlert,
  ShieldCheck,
  FileDown,
  History,
  Trash2,
  ChevronRight,
  Plus,
  Save,
  Clock,
  ExternalLink,
  Menu,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  LogOut,
  CreditCard,
  HelpCircle,
  ChevronDown,
  Tag,
  Brain,
  Activity,
  Ear,
  LinkIcon,
  Cloud,
} from "lucide-react";
import { generateSafetyReportPDF } from "@/lib/generatePDF";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingOrbs from "@/components/FloatingOrbs";
import FloatingButterflies from "@/components/FloatingButterflies";
import FloatingDots from "@/components/FloatingDots";
import NoiseOverlay from "@/components/NoiseOverlay";

interface ScanResult {
  url: string;
  overallScore: number;
  ageGroupScores: {
    [ageGroup: string]: {
      score: number;
      action: "BLOCK" | "GATE" | "ALLOW";
      reason: string;
      risks: string[];
    };
  };
  contentAnalysis: {
    textAnalysis: {
      sentiment: string;
      keyTopics: string[];
      languageScore: number;
      entities?: string[];
      unsafeKeywordsFound: string[];
      safeKeywordsFound: string[];
    };
    visualAnalysis: {
      detectedObjects: string[];
      safetyScore: number;
      concerns: string[];
      labels?: string[];
    };
    multimediaAnalysis?: {
      videoDetected: boolean;
      audioDetected: boolean;
      mediaTypes: string[];
      mediaSafetyScore: number;
      mediaConcerns: string[];
    };
    metadata?: {
      title?: string;
      description?: string;
      keywords?: string[];
      imageCount: number;
      linkCount: number;
      videoCount: number;
      audioCount: number;
    };
  };
  childSafetyAnalysis: {
    overallRisk: "safe" | "caution" | "unsafe" | "dangerous";
    riskCategories: {
      category: string;
      severity: string;
      matchCount: number;
      matchedKeywords: string[];
      contextSnippets: string[];
    }[];
    depthAnalysis: {
      titleSafe: boolean;
      metadataSafe: boolean;
      contentSafe: boolean;
      mediaSafe: boolean;
    };
  };
  timestamp: string;
  analysisMethod?: "live" | "demo";
  usedSearchFallback?: boolean;
  performanceMetrics?: {
    totalTimeMs: number;
    steps: {
      name: string;
      durationMs: number;
      details?: string;
    }[];
  };
  pythonDebug?: any;

  // SafetyReport unified fields
  overallsafetyscore?: number;
  languageSafetyScore?: number;
  visualSafetyScore?: number;
  audioSafetyScore?: number;
  ageActions?: {
    [key: string]: {
      action: "BLOCK" | "GATE" | "ALLOW";
      score: number;
      reason: string;
      risks: string[];
    };
  };
  majorCategories?: {
    name: string;
    probability: number;
    subcategories: {
      name: string;
      probability: number;
    }[];
  }[];
  contextType?: string;
  topicTags?: string[];
  flags?: {
    bodyAnxiety: boolean;
    selfHarm: boolean;
    fraudOrScam: boolean;
    extremism: boolean;
  };
  decisionSource?: {
    [signal: string]: {
      used: boolean;
      confidence: number;
    };
  };
}

interface SavedReport {
  id: string;
  url: string;
  overallScore: number;
  overallRisk: string;
  timestamp: string;
  title?: string;
  fullReport: ScanResult;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-purple-50/30 to-white">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const { user, userData, loading: authLoading, logout, getIdToken, refreshUserData } = useAuth();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const searchParams = useSearchParams();

  // Modal states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showBookDemoModal, setShowBookDemoModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [demoForm, setDemoForm] = useState({
    name: "",
    email: "",
    organization: "",
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [submittingDemo, setSubmittingDemo] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [modalMessage, setModalMessage] = useState({ type: "", text: "" });

  const reportRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const safeKeywords =
    result?.contentAnalysis.textAnalysis.safeKeywordsFound ?? [];

  // Redirect to sign-in if not authenticated, or to onboarding if not completed
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/sign-in");
    } else if (!authLoading && user && userData && userData.onboardingCompleted !== true) {
      router.push("/onboarding");
    }
  }, [authLoading, user, userData, router]);

  // Detect payment success and show celebration
  useEffect(() => {
    if (!user) return; // Wait for auth to be ready before verifying payment
    if (searchParams.get('payment') === 'success') {
      const sessionId = searchParams.get('session_id');

      const verifyAndCelebrate = async () => {
        // Verify payment server-side to ensure Firestore is updated
        if (sessionId) {
          try {
            const token = await getIdToken();
            if (token) {
              await fetch('/api/stripe/verify-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ sessionId }),
              });
            }
          } catch (err) {
            console.error('Payment verification error:', err);
          }
        }

        await refreshUserData();
        setShowCelebration(true);

        // Fire confetti
        const duration = 3000;
        const end = Date.now() + duration;
        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#6B4E71', '#9b59b6', '#e74c3c', '#f39c12', '#2ecc71'],
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#6B4E71', '#9b59b6', '#e74c3c', '#f39c12', '#2ecc71'],
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();

        // Auto-dismiss after 5 seconds
        setTimeout(() => setShowCelebration(false), 5000);

        // Remove query params
        router.replace('/dashboard', { scroll: false });
      };

      verifyAndCelebrate();
    }
  }, [user, searchParams, refreshUserData, router, getIdToken]);

  // Fetch saved reports on load
  const fetchReports = useCallback(async () => {
    try {
      setLoadingReports(true);
      const token = await getIdToken();
      if (!token) return;

      const response = await fetch("/api/reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSavedReports(data.reports || []);
      } else {
        const data = await response.json().catch(() => ({}));
        console.error("Failed to fetch reports:", response.status, data);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoadingReports(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchReports();
    }
  }, [authLoading, user, fetchReports]);

  // Auto-save report to Firebase report-history collection
  const autoSaveReport = async (scanResult: ScanResult) => {
    try {
      const token = await getIdToken();
      if (!token) return;

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ report: scanResult }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Failed to save report:", res.status, data?.reason || data?.error);
      }

      // Refresh sidebar history
      fetchReports();
    } catch (error) {
      console.error("Failed to auto-save report:", error);
    }
  };

  // Load a saved report
  const handleLoadReport = (report: SavedReport) => {
    setResult(report.fullReport);
    setUrl(report.url);
    setMobileMenuOpen(false);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Delete a report
  const handleDeleteReport = async (reportId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const token = await getIdToken();
      if (!token) return;

      const response = await fetch(`/api/reports?id=${reportId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchReports();
      }
    } catch (error) {
      console.error("Failed to delete report:", error);
    }
  };

  // Start new analysis
  const handleNewAnalysis = () => {
    setResult(null);
    setUrl("");
    setError("");
  };

  const renderSafeKeywords = () => {
    if (safeKeywords.length === 0) {
      return null;
    }

    return (
      <ScrollReveal delay={0.28}>
        <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl border border-green-100/30 p-4 sm:p-6 ring-1 ring-green-200/20">
          <h3 className="text-base sm:text-lg font-bold text-primary mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            Safe Content Indicators
          </h3>
          <div className="flex flex-wrap gap-2">
            {safeKeywords.map((kw, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </ScrollReveal>
    );
  };

  const handleScan = async () => {
    if (!url.trim()) {
      setError("Please enter a URL or keyword");
      return;
    }

    // Client-side early exit for free limit
    if (userData?.plan === 'free' && (userData?.reportsUsed ?? 0) >= 5) {
      setShowLimitModal(true);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      let input = url.trim();

      // Check if input looks like a URL
      const looksLikeUrl =
        /^(https?:\/\/)?[\w-]+(\.[\w-]+)+/.test(input) ||
        input.includes(".com") ||
        input.includes(".org") ||
        input.includes(".net") ||
        input.includes(".edu") ||
        input.includes(".gov") ||
        input.includes(".io") ||
        input.includes(".co") ||
        input.includes(".in") ||
        input.startsWith("http://") ||
        input.startsWith("https://");

      if (
        looksLikeUrl &&
        !input.startsWith("http://") &&
        !input.startsWith("https://")
      ) {
        input = "https://" + input;
      }

      const token = await getIdToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/scan-url", {
        method: "POST",
        headers,
        body: JSON.stringify({ url: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'FREE_LIMIT_REACHED') {
          setShowLimitModal(true);
          setLoading(false);
          return;
        }
        throw new Error(data.error || "Failed to analyze");
      }

      // Refresh user data to get updated reportsUsed count
      refreshUserData();

      setResult(data);

      // Auto-save to Firebase report-history
      autoSaveReport(data);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

      // Log performance metrics
      if (data.performanceMetrics) {
        const { totalTimeMs, steps } = data.performanceMetrics;
        console.log(
          "\n%c🔍 KOMAL DASHBOARD ANALYSIS",
          "color: #6B4E71; font-weight: bold; font-size: 14px;"
        );
        console.log(`%c📍 Input: ${input}`, "color: #666;");
        console.log(
          `%c⏱️  Total Time: ${(totalTimeMs / 1000).toFixed(3)}s`,
          "color: #2196F3; font-weight: bold;"
        );
        console.table(
          steps.map(
            (step: { name: string; durationMs: number; details?: string }) => ({
              Step: step.name,
              "Duration (ms)": step.durationMs,
              Details: step.details || "-",
            })
          )
        );

        // On-device analysis signals
        if (data.overallsafetyscore !== undefined) {
          console.log('%c\n🧠 On-Device Analysis (SafetyReport):', 'color: #6B4E71; font-weight: bold;');
          console.log(`  Unified Safety Score: ${data.overallsafetyscore} (0-1 scale)`);
          console.log(`  Language Safety: ${data.languageSafetyScore} | Visual Safety: ${data.visualSafetyScore} | Audio Safety: ${data.audioSafetyScore}`);
          console.log(`  Context Type: ${data.contextType || 'general'}`);
          console.log(`  Topic Tags: ${data.topicTags?.join(', ') || 'none'}`);
          if (data.decisionSource) {
            console.log('%c  Decision Sources:', 'font-weight: bold;');
            console.table(Object.entries(data.decisionSource).map(([signal, info]: [string, any]) => ({
              Signal: signal.toUpperCase(),
              Used: info.used ? 'Yes' : 'No',
              Confidence: info.confidence,
            })));
          }
          if (data.majorCategories?.length > 0) {
            console.log('%c  Major Categories:', 'font-weight: bold;');
            console.table(data.majorCategories.map((c: any) => ({
              Category: c.name,
              Probability: c.probability,
            })));
          }
          if (data.ageActions) {
            console.log('%c  Age-Band Actions:', 'font-weight: bold;');
            console.table(Object.entries(data.ageActions).map(([band, info]: [string, any]) => ({
              'Age Band': band,
              Action: info.action,
              Score: info.score,
            })));
          }
        }

        if (data.pythonDebug) {
          console.log('%c\n🐍 Python Hybrid Debug Info:', 'color: #6B4E71; font-weight: bold;');
          console.log(data.pythonDebug);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Email functionality
  const handleSendEmail = async () => {
    if (!emailInput.trim() || !result) return;

    setSendingEmail(true);
    setModalMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput.trim(), report: result }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      setModalMessage({ type: "success", text: "Report sent successfully!" });
      setTimeout(() => {
        setShowEmailModal(false);
        setEmailInput("");
        setModalMessage({ type: "", text: "" });
      }, 2000);
    } catch (err) {
      setModalMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to send email",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  // Book demo functionality
  const handleBookDemo = async () => {
    if (!demoForm.name.trim() || !demoForm.email.trim()) return;

    setSubmittingDemo(true);
    setModalMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/book-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(demoForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      setModalMessage({
        type: "success",
        text: "Demo request submitted! Check your email.",
      });
      setTimeout(() => {
        setShowBookDemoModal(false);
        setDemoForm({ name: "", email: "", organization: "" });
        setModalMessage({ type: "", text: "" });
      }, 2500);
    } catch (err) {
      setModalMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to submit",
      });
    } finally {
      setSubmittingDemo(false);
    }
  };

  // Generate PDF
  const handleGeneratePDF = async () => {
    if (!result) return;

    setGeneratingPDF(true);
    try {
      await generateSafetyReportPDF(result);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setGeneratingPDF(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "BLOCK":
        return <XCircle className="w-5 h-5" />;
      case "GATE":
        return <AlertTriangle className="w-5 h-5" />;
      case "ALLOW":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "BLOCK":
        return "border-red-200 bg-red-50 text-red-600";
      case "GATE":
        return "border-amber-200 bg-amber-50 text-amber-600";
      case "ALLOW":
        return "border-green-200 bg-green-50 text-green-600";
      default:
        return "border-gray-200 bg-gray-50 text-gray-600";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 75) return "bg-gradient-to-br from-green-100 to-emerald-50";
    if (score >= 50) return "bg-gradient-to-br from-amber-100 to-yellow-50";
    return "bg-gradient-to-br from-red-100 to-rose-50";
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "safe":
        return "bg-green-100 text-green-700";
      case "caution":
        return "bg-amber-100 text-amber-700";
      case "unsafe":
        return "bg-orange-100 text-orange-700";
      case "dangerous":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-600 text-white";
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-amber-500 text-white";
      case "low":
        return "bg-yellow-400 text-gray-800";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const isUnder16Blocked =
    result?.childSafetyAnalysis?.overallRisk === "dangerous" ||
    result?.childSafetyAnalysis?.riskCategories?.some(
      (r) => r.severity === "critical"
    );
  const displayOverallScore = result
    ? isUnder16Blocked
      ? 0
      : result.overallScore
    : 0;

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-purple-50/30 to-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-text-dim">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (redirect will happen via useEffect)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-purple-50/30 to-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <NoiseOverlay opacity={0.025} />

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl max-w-md w-full p-6 md:p-8 relative animate-in fade-in zoom-in duration-200 ring-1 ring-primary/5">
            <button
              onClick={() => {
                setShowEmailModal(false);
                setModalMessage({ type: "", text: "" });
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary">
                Send Report via Email
              </h3>
              <p className="text-sm text-text-dim mt-2">
                We&apos;ll send the full safety report to your email
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {modalMessage.text && (
                <div
                  className={`p-3 rounded-2xl text-sm ${modalMessage.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                >
                  {modalMessage.text}
                </div>
              )}

              <Button
                onClick={handleSendEmail}
                disabled={sendingEmail || !emailInput.trim()}
                className="w-full btn-primary-premium text-white py-3.5 h-auto rounded-full border-0"
              >
                {sendingEmail ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Send Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Book Demo Modal */}
      {showBookDemoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl max-w-md w-full p-6 md:p-8 relative animate-in fade-in zoom-in duration-200 ring-1 ring-primary/5">
            <button
              onClick={() => {
                setShowBookDemoModal(false);
                setModalMessage({ type: "", text: "" });
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Calendar className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary">Book a Demo</h3>
              <p className="text-sm text-text-dim mt-2">
                See how KOMAL can protect your children online
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={demoForm.name}
                  onChange={(e) =>
                    setDemoForm({ ...demoForm, name: e.target.value })
                  }
                  placeholder="Your name"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={demoForm.email}
                  onChange={(e) =>
                    setDemoForm({ ...demoForm, email: e.target.value })
                  }
                  placeholder="your@email.com"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Organization{" "}
                  <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={demoForm.organization}
                  onChange={(e) =>
                    setDemoForm({ ...demoForm, organization: e.target.value })
                  }
                  placeholder="Company or school name"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {modalMessage.text && (
                <div
                  className={`p-3 rounded-2xl text-sm ${modalMessage.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                >
                  {modalMessage.text}
                </div>
              )}

              <Button
                onClick={handleBookDemo}
                disabled={
                  submittingDemo ||
                  !demoForm.name.trim() ||
                  !demoForm.email.trim()
                }
                className="w-full btn-primary-premium text-white py-3.5 h-auto rounded-full border-0"
              >
                {submittingDemo ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    Request Demo
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Celebration Modal */}
      {showCelebration && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowCelebration(false)}
        >
          <div
            className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl max-w-md w-full p-6 md:p-8 relative animate-in fade-in zoom-in duration-200 ring-1 ring-primary/5 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-primary mb-2">
              Welcome to {userData?.planName || 'your new plan'}!
            </h3>
            <p className="text-sm text-text-dim mb-4">
              Your subscription is now active. Enjoy unlimited reports!
            </p>
            {userData?.subscriptionEndDate && (
              <p className="text-xs text-text-dim mb-6">
                Renews on {new Date(userData.subscriptionEndDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            )}
            <Button
              onClick={() => setShowCelebration(false)}
              className="btn-primary-premium text-white px-8 py-3 h-auto rounded-full border-0"
            >
              Start Analyzing
            </Button>
          </div>
        </div>
      )}

      {/* Free Limit Reached Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl max-w-md w-full p-6 md:p-8 relative animate-in fade-in zoom-in duration-200 ring-1 ring-primary/5">
            <button
              onClick={() => setShowLimitModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <AlertTriangle className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-primary">
                Free Limit Reached
              </h3>
              <p className="text-sm text-text-dim mt-2">
                You&apos;ve used all 5 free reports. Upgrade to continue analyzing websites and keep your children safe.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => router.push('/pricing')}
                className="w-full btn-primary-premium text-white py-3.5 h-auto rounded-full border-0"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                View Plans
              </Button>
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full text-sm text-text-dim hover:text-primary transition-colors py-2"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Reports Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-primary flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Report History
                </h2>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <button
                onClick={() => {
                  handleNewAnalysis();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 btn-primary-premium text-white rounded-full transition-colors mb-3 border-0"
              >
                <Plus className="w-4 h-4" />
                New Analysis
              </button>

              {loadingReports ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : savedReports.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6 text-primary/40" />
                  </div>
                  <p className="text-sm text-text-dim">
                    No saved reports yet
                  </p>
                  <p className="text-xs text-text-dim/60 mt-1">
                    Analyze a URL to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {savedReports.map((report) => (
                    <div
                      key={report.id}
                      onClick={() => handleLoadReport(report)}
                      className="p-3 rounded-2xl hover:bg-primary/5 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary truncate">
                            {report.title || report.url}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getRiskColor(report.overallRisk)}`}>
                              {report.overallRisk}
                            </span>
                            <span className="text-xs text-text-dim flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(report.timestamp)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDeleteReport(report.id, e)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen flex">
        {/* Sidebar - Desktop */}
        {/* Sidebar Close/Open Tab - Desktop */}
        <div className="hidden lg:block relative z-30">
          {sidebarOpen ? (
            <button
              onClick={() => setSidebarOpen(false)}
              className="fixed top-1/2 -translate-y-1/2 z-30 w-6 h-16 bg-white/90 backdrop-blur-sm border border-l-0 border-primary/10 rounded-r-xl flex items-center justify-center hover:bg-primary/5 transition-all shadow-sm"
              style={{ left: "320px" }}
            >
              <PanelLeftClose className="w-4 h-4 text-primary/60" />
            </button>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="fixed top-1/2 -translate-y-1/2 left-0 z-30 w-6 h-16 bg-white/90 backdrop-blur-sm border border-l-0 border-primary/10 rounded-r-xl flex items-center justify-center hover:bg-primary/5 transition-all shadow-sm"
            >
              <PanelLeft className="w-4 h-4 text-primary/60" />
            </button>
          )}
        </div>
        <aside
          className={`hidden lg:flex flex-col bg-white/80 backdrop-blur-xl border-r border-primary/10 transition-all duration-300 ${sidebarOpen ? "w-80" : "w-0"
            } overflow-hidden`}
        >
          <div className="flex-1 overflow-y-auto pt-6">
            {/* User Info */}
            <div className="p-4 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-transparent relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-violet-200 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                  {(userData?.name || user?.email || "U").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary truncate">
                    {userData?.name || user?.email || "User"}
                  </p>
                  <p className="text-xs text-text-dim">
                    {userData?.planName || 'Free'} Plan
                  </p>
                </div>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <ChevronDown className={`w-4 h-4 text-primary transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute left-4 right-4 top-full mt-1 bg-white rounded-2xl shadow-xl border border-primary/10 py-2 z-50">
                  <Link
                    href="/billing"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 transition-colors"
                  >
                    <CreditCard className="w-4 h-4 text-primary/60" />
                    Billing
                  </Link>
                  <Link
                    href="/help"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-primary/60" />
                    Help
                  </Link>
                  <Link
                    href="/privacy"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-primary/60" />
                    Privacy
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* New Analysis Button */}
            <div className="p-4">
              <button
                onClick={handleNewAnalysis}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 btn-primary-premium text-white rounded-full transition-colors border-0"
              >
                <Plus className="w-4 h-4" />
                New Analysis
              </button>
            </div>

            {/* Reports History */}
            <div className="px-4 pb-4">
              <h3 className="text-xs font-semibold text-text-dim uppercase tracking-wider mb-3 flex items-center gap-2">
                <History className="w-4 h-4" />
                Report History
              </h3>

              {loadingReports ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : savedReports.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6 text-primary/40" />
                  </div>
                  <p className="text-sm text-text-dim">
                    No saved reports yet
                  </p>
                  <p className="text-xs text-text-dim/60 mt-1">
                    Analyze a URL to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {savedReports.map((report) => (
                    <div
                      key={report.id}
                      onClick={() => handleLoadReport(report)}
                      className="p-3 rounded-2xl hover:bg-primary/5 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary truncate">
                            {report.title || report.url}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${getRiskColor(
                                report.overallRisk
                              )}`}
                            >
                              {report.overallRisk}
                            </span>
                            <span className="text-xs text-text-dim flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(report.timestamp)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDeleteReport(report.id, e)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 relative overflow-hidden bg-gradient-to-b from-white via-purple-50/20 to-white">
          <div className="absolute inset-0 opacity-15 z-0">
            <FloatingOrbs count={4} />
          </div>
          <div className="absolute inset-0 z-0">
            <FloatingDots />
          </div>
          <div className="absolute inset-0 z-[1]">
            <FloatingButterflies count={8} />
          </div>

          <div className="relative z-10 min-h-screen pt-6 pb-8 md:pt-8 md:pb-16">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-primary/10 z-30 px-4 py-2.5 flex items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 hover:bg-primary/5 rounded-xl transition-colors"
              >
                <Menu className="w-5 h-5 text-primary" />
              </button>
              <div className="flex-1 flex justify-center">
                <Link href="/" className="inline-flex items-center gap-2 group">
                  <Image
                    src="/komaliconnobg.png"
                    alt="KOMAL"
                    width={32}
                    height={32}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="text-lg font-bold text-primary">KOMAL</span>
                </Link>
              </div>
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <ChevronDown className={`w-4 h-4 text-primary transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-primary/10 py-2 z-50">
                    <Link
                      href="/billing"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 transition-colors"
                    >
                      <CreditCard className="w-4 h-4 text-primary/60" />
                      Billing
                    </Link>
                    <Link
                      href="/help"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-primary/60" />
                      Help
                    </Link>
                    <Link
                      href="/privacy"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-primary/60" />
                      Privacy
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>


            {/* Centered Logo */}
            <div className="flex items-center justify-center pt-16 lg:pt-6 pb-4">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <Image
                  src="/komaliconnobg.png"
                  alt="KOMAL"
                  width={48}
                  height={48}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-2xl font-bold text-primary">KOMAL</span>
              </Link>
            </div>

            <div className="container max-w-[1100px] px-4 sm:px-6 md:px-8 mx-auto">
              {/* Header */}
              <ScrollReveal>
                <div className="text-center mb-8 md:mb-12">
                  {/* Badge like homepage Yale badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary font-medium text-xs sm:text-sm mb-4 sm:mb-6 ring-1 ring-primary/10">
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Your Safety Dashboard</span>
                  </div>

                  {/* Sparkle decoration like homepage */}
                  <div className="flex justify-center gap-1.5 mb-3">
                    <svg className="w-4 h-4 text-primary/30 animate-pulse" style={{ animationDuration: "3s" }} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0L15 9L24 12L15 15L12 24L9 15L0 12L9 9L12 0Z" />
                    </svg>
                    <svg className="w-3 h-3 text-primary/20 animate-pulse" style={{ animationDuration: "3s", animationDelay: "0.5s" }} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0L15 9L24 12L15 15L12 24L9 15L0 12L9 9L12 0Z" />
                    </svg>
                    <svg className="w-4 h-4 text-primary/30 animate-pulse" style={{ animationDuration: "3s", animationDelay: "1s" }} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0L15 9L24 12L15 15L12 24L9 15L0 12L9 9L12 0Z" />
                    </svg>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-primary mb-3 md:mb-4 leading-tight px-2 tracking-tight">
                    Child Safety
                    <br />
                    <span className="relative inline-block">
                      <span className="relative z-10">Analysis Dashboard</span>
                      <span
                        className="absolute left-0 right-0 bottom-[0.1em] h-[0.3em] rounded-full -z-0"
                        style={{
                          background:
                            "linear-gradient(to right, rgba(107, 78, 113, 0.15), rgba(107, 78, 113, 0.25), rgba(107, 78, 113, 0.15))",
                        }}
                      />
                    </span>
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-text-dim max-w-[700px] mx-auto px-2">
                    Analyze any website and keep your reports safe.
                    Your history is always just a click away.
                  </p>
                </div>
              </ScrollReveal>

              {/* Input Section */}
              <ScrollReveal delay={0.1}>
                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/40 p-4 sm:p-6 md:p-8 mb-6 md:mb-8 ring-1 ring-primary/5">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex-1 relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40">
                        <Search className="w-5 h-5" />
                      </div>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => {
                          setUrl(e.target.value);
                          setError("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !loading) {
                            handleScan();
                          }
                        }}
                        placeholder="Enter URL or keyword (e.g., example.com or violence)"
                        className="w-full pl-14 pr-4 sm:pr-6 py-3.5 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/60 transition-colors"
                        disabled={loading}
                      />
                    </div>
                    <Button
                      onClick={handleScan}
                      disabled={loading || !url.trim()}
                      size="lg"
                      className="btn-primary-premium text-white px-6 sm:px-8 py-3.5 sm:py-4 h-auto rounded-full border-0 whitespace-nowrap w-full sm:w-auto"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Analyze
                        </>
                      )}
                    </Button>
                  </div>
                  {error && (
                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}
                  <div className="mt-3 sm:mt-4 text-xs text-text-dim text-center">
                    Try: youtube.com, wikipedia.org, cnn.com
                  </div>
                </div>
              </ScrollReveal>

              {/* Results Section */}
              {result && (
                <div className="space-y-4 sm:space-y-6" ref={reportRef}>
                  {/* Action Buttons */}
                  <ScrollReveal delay={0.15}>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-2 sm:gap-3">
                      <span className="flex items-center gap-2 px-5 py-2.5 text-sm text-green-600 bg-green-50 rounded-full ring-1 ring-green-200/50">
                        <CheckCircle className="w-4 h-4" />
                        Auto-saved to history
                      </span>
                      <Button
                        onClick={handleGeneratePDF}
                        disabled={generatingPDF}
                        variant="outline"
                        className="border-2 border-green-500/30 text-green-700 hover:bg-green-50 rounded-full px-5 sm:px-6 py-2.5 h-auto text-sm sm:text-base"
                      >
                        {generatingPDF ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <FileDown className="w-4 h-4 mr-2" />
                            Generate PDF
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => setShowEmailModal(true)}
                        variant="outline"
                        className="border-2 border-primary/20 text-primary hover:bg-primary/5 rounded-full px-5 sm:px-6 py-2.5 h-auto text-sm sm:text-base"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Send via Email
                      </Button>
                    </div>
                  </ScrollReveal>

                  {/* Overall Score */}
                  <ScrollReveal delay={0.2}>
                    <div
                      ref={resultsRef}
                      className="bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl border border-white/40 p-6 md:p-8 ring-1 ring-primary/5"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-primary">
                          Overall Safety Score
                        </h2>
                        <div
                          className={`${getScoreBackground(
                            displayOverallScore
                          )} px-6 py-3 rounded-2xl shadow-sm`}
                        >
                          <span
                            className={`text-3xl font-bold ${getScoreColor(
                              displayOverallScore
                            )}`}
                          >
                            {displayOverallScore}
                          </span>
                          <span className="text-gray-600 text-base sm:text-lg">
                            /100
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ease-out rounded-full ${displayOverallScore >= 75
                            ? "bg-gradient-to-r from-green-400 to-emerald-500"
                            : displayOverallScore >= 50
                              ? "bg-gradient-to-r from-amber-400 to-yellow-500"
                              : "bg-gradient-to-r from-red-400 to-rose-500"
                            }`}
                          style={{ width: `${displayOverallScore}%` }}
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <p className="text-xs sm:text-sm text-text-dim break-all">
                          Scanned:{" "}
                          <span className="font-mono text-primary">
                            {result.url}
                          </span>
                        </p>
                        {result.analysisMethod && (
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${result.analysisMethod === "live"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                              }`}
                          >
                            {result.analysisMethod === "live"
                              ? "Live Analysis"
                              : "Demo Mode"}
                          </span>
                        )}
                        {isUnder16Blocked && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                            Flagged: Blocked for under 16
                          </span>
                        )}
                      </div>

                      {/* Depth Analysis */}
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div
                          className={`p-3 rounded-2xl text-center text-xs ${result.childSafetyAnalysis.depthAnalysis.titleSafe
                            ? "bg-green-50 text-green-700 ring-1 ring-green-200/30"
                            : "bg-red-50 text-red-700 ring-1 ring-red-200/30"
                            }`}
                        >
                          <div className="font-semibold">Title</div>
                          <div>
                            {result.childSafetyAnalysis.depthAnalysis.titleSafe
                              ? "Safe"
                              : "Unsafe"}
                          </div>
                        </div>
                        <div
                          className={`p-3 rounded-2xl text-center text-xs ${result.childSafetyAnalysis.depthAnalysis.metadataSafe
                            ? "bg-green-50 text-green-700 ring-1 ring-green-200/30"
                            : "bg-red-50 text-red-700 ring-1 ring-red-200/30"
                            }`}
                        >
                          <div className="font-semibold">Metadata</div>
                          <div>
                            {result.childSafetyAnalysis.depthAnalysis
                              .metadataSafe
                              ? "Safe"
                              : "Unsafe"}
                          </div>
                        </div>
                        <div
                          className={`p-3 rounded-2xl text-center text-xs ${result.childSafetyAnalysis.depthAnalysis.contentSafe
                            ? "bg-green-50 text-green-700 ring-1 ring-green-200/30"
                            : "bg-red-50 text-red-700 ring-1 ring-red-200/30"
                            }`}
                        >
                          <div className="font-semibold">Content</div>
                          <div>
                            {result.childSafetyAnalysis.depthAnalysis.contentSafe
                              ? "Safe"
                              : "Unsafe"}
                          </div>
                        </div>
                        <div
                          className={`p-3 rounded-2xl text-center text-xs ${result.childSafetyAnalysis.depthAnalysis.mediaSafe
                            ? "bg-green-50 text-green-700 ring-1 ring-green-200/30"
                            : "bg-red-50 text-red-700 ring-1 ring-red-200/30"
                            }`}
                        >
                          <div className="font-semibold">Media</div>
                          <div>
                            {result.childSafetyAnalysis.depthAnalysis.mediaSafe
                              ? "Safe"
                              : "Unsafe"}
                          </div>
                        </div>
                      </div>

                      {result.contentAnalysis.metadata && (
                        <div className="mt-3 p-3 bg-primary/5 rounded-2xl text-xs space-y-1">
                          {result.contentAnalysis.metadata.title && (
                            <p className="break-words">
                              <span className="font-semibold">Title:</span>{" "}
                              {result.contentAnalysis.metadata.title}
                            </p>
                          )}
                          {result.contentAnalysis.metadata.description && (
                            <p className="break-words">
                              <span className="font-semibold">Description:</span>{" "}
                              {result.contentAnalysis.metadata.description.substring(
                                0,
                                100
                              )}
                              ...
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </ScrollReveal>

                  {/* Context & Topic Tags */}
                  {(result.contextType || (result.topicTags && result.topicTags.length > 0)) && (
                    <ScrollReveal delay={0.22}>
                      <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl border border-white/40 p-4 sm:p-6 ring-1 ring-primary/5">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          {result.contextType && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold ring-1 ring-violet-200/50">
                              <Tag className="w-3 h-3" />
                              {result.contextType.replace(/_/g, ' ')}
                            </span>
                          )}
                          {result.topicTags?.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-primary/5 text-primary/80 rounded-full text-xs font-medium ring-1 ring-primary/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </ScrollReveal>
                  )}

                  {/* AI Signal Scores & Decision Sources */}
                  {result.overallsafetyscore !== undefined && (
                    <ScrollReveal delay={0.23}>
                      <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl border border-white/40 p-4 sm:p-6 ring-1 ring-primary/5">
                        <h3 className="text-base sm:text-lg font-bold text-primary mb-4 flex items-center gap-2">
                          <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-primary/70" />
                          AI Signal Analysis
                        </h3>

                        {/* Per-signal safety scores */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                          <div className="p-3 rounded-2xl bg-primary/5 text-center ring-1 ring-primary/10">
                            <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Unified</div>
                            <div className={`text-lg font-bold ${(result.overallsafetyscore ?? 0) >= 0.7 ? 'text-green-600' : (result.overallsafetyscore ?? 0) >= 0.4 ? 'text-amber-600' : 'text-red-600'}`}>
                              {((result.overallsafetyscore ?? 0) * 100).toFixed(0)}%
                            </div>
                          </div>
                          <div className="p-3 rounded-2xl bg-blue-50/80 text-center ring-1 ring-blue-200/30">
                            <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Language</div>
                            <div className={`text-lg font-bold ${(result.languageSafetyScore ?? 0) >= 0.7 ? 'text-green-600' : (result.languageSafetyScore ?? 0) >= 0.4 ? 'text-amber-600' : 'text-red-600'}`}>
                              {((result.languageSafetyScore ?? 0) * 100).toFixed(0)}%
                            </div>
                          </div>
                          <div className="p-3 rounded-2xl bg-purple-50/80 text-center ring-1 ring-purple-200/30">
                            <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Visual</div>
                            <div className={`text-lg font-bold ${(result.visualSafetyScore ?? 0) >= 0.7 ? 'text-green-600' : (result.visualSafetyScore ?? 0) >= 0.4 ? 'text-amber-600' : 'text-red-600'}`}>
                              {((result.visualSafetyScore ?? 0) * 100).toFixed(0)}%
                            </div>
                          </div>
                          <div className="p-3 rounded-2xl bg-emerald-50/80 text-center ring-1 ring-emerald-200/30">
                            <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Audio</div>
                            <div className={`text-lg font-bold ${(result.audioSafetyScore ?? 0) >= 0.7 ? 'text-green-600' : (result.audioSafetyScore ?? 0) >= 0.4 ? 'text-amber-600' : 'text-red-600'}`}>
                              {((result.audioSafetyScore ?? 0) * 100).toFixed(0)}%
                            </div>
                          </div>
                        </div>

                        {/* Decision sources */}
                        {result.decisionSource && (
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(result.decisionSource).map(([signal, info]) => (
                              <span
                                key={signal}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${
                                  info.used
                                    ? 'bg-green-50 text-green-700 ring-green-200/50'
                                    : 'bg-gray-50 text-gray-400 ring-gray-200/50'
                                }`}
                              >
                                {signal === 'nlp' && <MessageSquare className="w-3 h-3" />}
                                {signal === 'vision' && <Eye className="w-3 h-3" />}
                                {signal === 'audio' && <Ear className="w-3 h-3" />}
                                {signal === 'links' && <LinkIcon className="w-3 h-3" />}
                                {signal === 'cloud' && <Cloud className="w-3 h-3" />}
                                {signal.toUpperCase()}
                                {info.used && (
                                  <span className="text-[10px] opacity-70">
                                    {(info.confidence * 100).toFixed(0)}%
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </ScrollReveal>
                  )}

                  {/* Major Categories */}
                  {result.majorCategories && result.majorCategories.length > 0 && (
                    <ScrollReveal delay={0.24}>
                      <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl border border-white/40 p-4 sm:p-6 ring-1 ring-primary/5">
                        <h3 className="text-base sm:text-lg font-bold text-primary mb-4 flex items-center gap-2">
                          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary/70" />
                          Content Categories
                        </h3>
                        <div className="space-y-3">
                          {result.majorCategories.map((cat, idx) => (
                            <div key={idx}>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                                <span className={`text-xs font-bold ${cat.probability >= 0.5 ? 'text-red-600' : cat.probability >= 0.2 ? 'text-amber-600' : 'text-gray-500'}`}>
                                  {(cat.probability * 100).toFixed(0)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-700 ${cat.probability >= 0.5 ? 'bg-red-400' : cat.probability >= 0.2 ? 'bg-amber-400' : 'bg-gray-300'}`}
                                  style={{ width: `${Math.min(cat.probability * 100, 100)}%` }}
                                />
                              </div>
                              {cat.subcategories.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {cat.subcategories.map((sub, si) => (
                                    <span key={si} className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full text-[10px] ring-1 ring-gray-200/50">
                                      {sub.name} ({(sub.probability * 100).toFixed(0)}%)
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </ScrollReveal>
                  )}

                  {/* Safety Flags */}
                  {result.flags && (result.flags.bodyAnxiety || result.flags.selfHarm || result.flags.fraudOrScam || result.flags.extremism) && (
                    <ScrollReveal delay={0.25}>
                      <div className="bg-red-50/80 backdrop-blur-sm rounded-[2rem] shadow-xl border border-red-100/50 p-4 sm:p-6 ring-1 ring-red-200/30">
                        <h3 className="text-base sm:text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
                          Safety Flags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.flags.selfHarm && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-xs font-semibold ring-1 ring-red-200">
                              Self-Harm Content
                            </span>
                          )}
                          {result.flags.extremism && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-xs font-semibold ring-1 ring-red-200">
                              Extremism
                            </span>
                          )}
                          {result.flags.fraudOrScam && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold ring-1 ring-amber-200">
                              Fraud / Scam
                            </span>
                          )}
                          {result.flags.bodyAnxiety && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold ring-1 ring-amber-200">
                              Body Anxiety
                            </span>
                          )}
                        </div>
                      </div>
                    </ScrollReveal>
                  )}

                  {/* Risk Categories */}
                  {result.childSafetyAnalysis.riskCategories.length > 0 && (
                    <ScrollReveal delay={0.25}>
                      <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl border border-red-100/30 p-4 sm:p-6 md:p-8 ring-1 ring-red-200/20">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-4 sm:mb-6 flex items-center gap-2">
                          <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                          Safety Risks Detected
                        </h2>
                        <div className="space-y-3">
                          {result.childSafetyAnalysis.riskCategories.map(
                            (risk, idx) => (
                              <div
                                key={idx}
                                className="p-3 sm:p-4 bg-red-50/50 border border-red-100 rounded-2xl"
                              >
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <span
                                    className={`px-2 py-0.5 rounded-lg text-xs font-medium ${getSeverityColor(
                                      risk.severity
                                    )}`}
                                  >
                                    {risk.severity.toUpperCase()}
                                  </span>
                                  <span className="font-semibold text-gray-800">
                                    {risk.category}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ({risk.matchCount} matches)
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {risk.matchedKeywords.map((kw, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 bg-red-100 text-red-700 rounded-lg text-xs"
                                    >
                                      {kw}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </ScrollReveal>
                  )}

                  {/* Safe Keywords */}
                  {renderSafeKeywords()}

                  {/* Age Group Actions */}
                  <ScrollReveal delay={0.4}>
                    <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl border border-white/40 p-6 md:p-8 ring-1 ring-primary/5">
                      <h2 className="text-xl sm:text-2xl font-bold text-primary mb-6">
                        Age-Appropriate Actions
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(result.ageGroupScores).map(
                          ([ageGroup, data]) => {
                            const displayAction = isUnder16Blocked
                              ? "BLOCK"
                              : data.action;
                            const displayScore = isUnder16Blocked
                              ? 0
                              : data.score;
                            const displayReason = isUnder16Blocked
                              ? "Flagged: content is not age-appropriate for under 16."
                              : data.reason;

                            return (
                              <div
                                key={ageGroup}
                                className={`border-2 rounded-[1.5rem] p-5 transition-all hover:scale-105 hover:shadow-lg ${getActionColor(
                                  displayAction
                                )}`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <h3 className="text-lg font-bold">
                                    {ageGroup}
                                  </h3>
                                  {getActionIcon(displayAction)}
                                </div>
                                <div className="mb-3">
                                  <div className="text-2xl font-bold mb-1">
                                    {displayAction}
                                  </div>
                                  <div className="text-sm opacity-75">
                                    Score: {displayScore}/100
                                  </div>
                                </div>
                                <p className="text-xs leading-relaxed opacity-90">
                                  {displayReason}
                                </p>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </ScrollReveal>

                  {/* Info Footer */}
                  <ScrollReveal delay={0.6}>
                    <div className="bg-gradient-to-br from-primary/5 to-violet-50/50 rounded-[2rem] p-4 sm:p-6 text-center ring-1 ring-primary/5">
                      <p className="text-xs sm:text-sm text-text-dim">
                        This analysis uses deep keyword context analysis, Vision
                        AI, NLP, and multimedia scanning to evaluate child
                        safety. Your reports are automatically saved and can be
                        accessed from the sidebar.
                      </p>
                    </div>
                  </ScrollReveal>
                </div>
              )}

              {/* Welcome State */}
              {!result && !loading && (
                <ScrollReveal delay={0.3}>
                  <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/40 p-4 sm:p-6 md:p-8 ring-1 ring-primary/5">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-2 text-center">
                      Welcome, {userData?.name?.split(" ")[0] || "there"}!
                    </h2>
                    <p className="text-sm text-text-dim text-center mb-6">
                      Let&apos;s make the internet safer for your kids
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                      {/* Step 1 */}
                      <div className="text-center flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0 group">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-2xl flex items-center justify-center shrink-0 sm:mx-auto sm:mb-4 shadow-sm group-hover:scale-110 transition-transform">
                          <Search className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                        </div>
                        <div className="text-left sm:text-center">
                          <h3 className="font-bold text-primary text-sm sm:text-base mb-1 sm:mb-2">
                            1. Enter URL
                          </h3>
                          <p className="text-xs sm:text-sm text-text-dim">
                            Analyze any website for child safety
                          </p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="text-center flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0 group">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-100 to-violet-50 rounded-2xl flex items-center justify-center shrink-0 sm:mx-auto sm:mb-4 shadow-sm group-hover:scale-110 transition-transform">
                          <Save className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" />
                        </div>
                        <div className="text-left sm:text-center">
                          <h3 className="font-bold text-primary text-sm sm:text-base mb-1 sm:mb-2">
                            2. Save Reports
                          </h3>
                          <p className="text-xs sm:text-sm text-text-dim">
                            Keep your analysis history organized
                          </p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="text-center flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0 group">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl flex items-center justify-center shrink-0 sm:mx-auto sm:mb-4 shadow-sm group-hover:scale-110 transition-transform">
                          <History className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
                        </div>
                        <div className="text-left sm:text-center">
                          <h3 className="font-bold text-primary text-sm sm:text-base mb-1 sm:mb-2">
                            3. Access Anytime
                          </h3>
                          <p className="text-xs sm:text-sm text-text-dim">
                            Review past reports from sidebar
                          </p>
                        </div>
                      </div>
                    </div>

                    {savedReports.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-primary/10">
                        <h3 className="text-sm font-semibold text-text-dim mb-4 text-center">
                          Recent Reports
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {savedReports.slice(0, 3).map((report) => (
                            <div
                              key={report.id}
                              onClick={() => handleLoadReport(report)}
                              className="p-4 bg-primary/5 rounded-2xl hover:bg-primary/10 cursor-pointer transition-colors ring-1 ring-primary/5"
                            >
                              <p className="text-sm font-medium text-primary truncate">
                                {report.title || report.url}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${getRiskColor(
                                    report.overallRisk
                                  )}`}
                                >
                                  {report.overallRisk}
                                </span>
                                <span className="text-xs text-text-dim">
                                  {formatDate(report.timestamp)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
