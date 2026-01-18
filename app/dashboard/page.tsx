// "use client";

// import { useState, useRef, useEffect, useCallback } from "react";
// //import { useUser, UserButton } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button";
// import {
//   Loader2,
//   Shield,
//   AlertTriangle,
//   CheckCircle,
//   XCircle,
//   Search,
//   Eye,
//   MessageSquare,
//   Mail,
//   Calendar,
//   X,
//   Video,
//   Music,
//   ShieldAlert,
//   ShieldCheck,
//   FileDown,
//   History,
//   Trash2,
//   ChevronRight,
//   Plus,
//   Save,
//   Clock,
//   ExternalLink,
//   Menu,
//   PanelLeftClose,
//   PanelLeft,
// } from "lucide-react";
// import { generateSafetyReportPDF } from "@/lib/generatePDF";
// import ScrollReveal from "@/components/ScrollReveal";
// import FloatingOrbs from "@/components/FloatingOrbs";
// import NoiseOverlay from "@/components/NoiseOverlay";

// interface ScanResult {
//   url: string;
//   overallScore: number;
//   ageGroupScores: {
//     [ageGroup: string]: {
//       score: number;
//       action: "BLOCK" | "GATE" | "ALLOW";
//       reason: string;
//       risks: string[];
//     };
//   };
//   contentAnalysis: {
//     textAnalysis: {
//       sentiment: string;
//       keyTopics: string[];
//       languageScore: number;
//       entities?: string[];
//       unsafeKeywordsFound: string[];
//       safeKeywordsFound: string[];
//     };
//     visualAnalysis: {
//       detectedObjects: string[];
//       safetyScore: number;
//       concerns: string[];
//       labels?: string[];
//     };
//     multimediaAnalysis?: {
//       videoDetected: boolean;
//       audioDetected: boolean;
//       mediaTypes: string[];
//       mediaSafetyScore: number;
//       mediaConcerns: string[];
//     };
//     metadata?: {
//       title?: string;
//       description?: string;
//       keywords?: string[];
//       imageCount: number;
//       linkCount: number;
//       videoCount: number;
//       audioCount: number;
//     };
//   };
//   childSafetyAnalysis: {
//     overallRisk: "safe" | "caution" | "unsafe" | "dangerous";
//     riskCategories: {
//       category: string;
//       severity: string;
//       matchCount: number;
//       matchedKeywords: string[];
//       contextSnippets: string[];
//     }[];
//     depthAnalysis: {
//       titleSafe: boolean;
//       metadataSafe: boolean;
//       contentSafe: boolean;
//       mediaSafe: boolean;
//     };
//   };
//   timestamp: string;
//   analysisMethod?: "live" | "demo";
//   usedSearchFallback?: boolean;
//   performanceMetrics?: {
//     totalTimeMs: number;
//     steps: {
//       name: string;
//       durationMs: number;
//       details?: string;
//     }[];
//   };
//   pythonDebug?: any;
// }

// interface SavedReport {
//   id: string;
//   url: string;
//   overallScore: number;
//   overallRisk: string;
//   timestamp: string;
//   title?: string;
//   fullReport: ScanResult;
// }

// export default function DashboardPage() {
//  // const { user, isLoaded } = useUser();
//   const [url, setUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<ScanResult | null>(null);
//   const [error, setError] = useState("");
//   const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
//   const [loadingReports, setLoadingReports] = useState(true);
//   const [savingReport, setSavingReport] = useState(false);
//   const [currentReportSaved, setCurrentReportSaved] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   // Modal states
//   const [showEmailModal, setShowEmailModal] = useState(false);
//   const [showBookDemoModal, setShowBookDemoModal] = useState(false);
//   const [emailInput, setEmailInput] = useState("");
//   const [demoForm, setDemoForm] = useState({
//     name: "",
//     email: "",
//     organization: "",
//   });
//   const [sendingEmail, setSendingEmail] = useState(false);
//   const [submittingDemo, setSubmittingDemo] = useState(false);
//   const [generatingPDF, setGeneratingPDF] = useState(false);
//   const [modalMessage, setModalMessage] = useState({ type: "", text: "" });

//   const reportRef = useRef<HTMLDivElement>(null);
//   const resultsRef = useRef<HTMLDivElement>(null);
//   const safeKeywords =
//     result?.contentAnalysis.textAnalysis.safeKeywordsFound ?? [];

//   // Fetch saved reports on load
//   const fetchReports = useCallback(async () => {
//     try {
//       setLoadingReports(true);
//       const response = await fetch("/api/reports");
//       if (response.ok) {
//         const data = await response.json();
//         setSavedReports(data.reports || []);
//       }
//     } catch (error) {
//       console.error("Failed to fetch reports:", error);
//     } finally {
//       setLoadingReports(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (isLoaded && user) {
//       fetchReports();
//     }
//   }, [isLoaded, user, fetchReports]);

//   // Save current report
//   const handleSaveReport = async () => {
//     if (!result) return;

//     setSavingReport(true);
//     try {
//       const response = await fetch("/api/reports", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ report: result }),
//       });

//       if (response.ok) {
//         setCurrentReportSaved(true);
//         fetchReports(); // Refresh the list
//       }
//     } catch (error) {
//       console.error("Failed to save report:", error);
//     } finally {
//       setSavingReport(false);
//     }
//   };

//   // Load a saved report
//   const handleLoadReport = (report: SavedReport) => {
//     setResult(report.fullReport);
//     setUrl(report.url);
//     setCurrentReportSaved(true);
//     setMobileMenuOpen(false);
//     setTimeout(() => {
//       resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//     }, 100);
//   };

//   // Delete a report
//   const handleDeleteReport = async (reportId: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     try {
//       const response = await fetch(`/api/reports?id=${reportId}`, {
//         method: "DELETE",
//       });

//       if (response.ok) {
//         fetchReports();
//       }
//     } catch (error) {
//       console.error("Failed to delete report:", error);
//     }
//   };

//   // Start new analysis
//   const handleNewAnalysis = () => {
//     setResult(null);
//     setUrl("");
//     setCurrentReportSaved(false);
//     setError("");
//   };

//   const renderSafeKeywords = () => {
//     if (safeKeywords.length === 0) {
//       return null;
//     }

//     return (
//       <ScrollReveal delay={0.28}>
//         <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6">
//           <h3 className="text-base sm:text-lg font-bold text-primary mb-3 flex items-center gap-2">
//             <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
//             Safe Content Indicators
//           </h3>
//           <div className="flex flex-wrap gap-2">
//             {safeKeywords.map((kw, idx) => (
//               <span
//                 key={idx}
//                 className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm"
//               >
//                 {kw}
//               </span>
//             ))}
//           </div>
//         </div>
//       </ScrollReveal>
//     );
//   };

//   const handleScan = async () => {
//     if (!url.trim()) {
//       setError("Please enter a URL or keyword");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setResult(null);
//     setCurrentReportSaved(false);

//     try {
//       let input = url.trim();

//       // Check if input looks like a URL
//       const looksLikeUrl =
//         /^(https?:\/\/)?[\w-]+(\.[\w-]+)+/.test(input) ||
//         input.includes(".com") ||
//         input.includes(".org") ||
//         input.includes(".net") ||
//         input.includes(".edu") ||
//         input.includes(".gov") ||
//         input.includes(".io") ||
//         input.includes(".co") ||
//         input.includes(".in") ||
//         input.startsWith("http://") ||
//         input.startsWith("https://");

//       if (
//         looksLikeUrl &&
//         !input.startsWith("http://") &&
//         !input.startsWith("https://")
//       ) {
//         input = "https://" + input;
//       }

//       const response = await fetch("/api/scan-url", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ url: input }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to analyze");
//       }

//       setResult(data);

//       setTimeout(() => {
//         resultsRef.current?.scrollIntoView({
//           behavior: "smooth",
//           block: "start",
//         });
//       }, 100);

//       // Log performance metrics
//       if (data.performanceMetrics) {
//         const { totalTimeMs, steps } = data.performanceMetrics;
//         console.log(
//           "\n%c🔍 KOMAL DASHBOARD ANALYSIS",
//           "color: #6B4E71; font-weight: bold; font-size: 14px;"
//         );
//         console.log(`%c📍 Input: ${input}`, "color: #666;");
//         console.log(
//           `%c⏱️  Total Time: ${(totalTimeMs / 1000).toFixed(3)}s`,
//           "color: #2196F3; font-weight: bold;"
//         );
//         console.table(
//           steps.map(
//             (step: { name: string; durationMs: number; details?: string }) => ({
//               Step: step.name,
//               "Duration (ms)": step.durationMs,
//               Details: step.details || "-",
//             })
//           )
//         );

//         if (data.pythonDebug) {
//           console.log('%c\n🐍 Python Hybrid Debug Info:', 'color: #6B4E71; font-weight: bold;');
//           console.log(data.pythonDebug);
//         }
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Email functionality
//   const handleSendEmail = async () => {
//     if (!emailInput.trim() || !result) return;

//     setSendingEmail(true);
//     setModalMessage({ type: "", text: "" });

//     try {
//       const response = await fetch("/api/send-report", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: emailInput.trim(), report: result }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to send email");
//       }

//       setModalMessage({ type: "success", text: "Report sent successfully!" });
//       setTimeout(() => {
//         setShowEmailModal(false);
//         setEmailInput("");
//         setModalMessage({ type: "", text: "" });
//       }, 2000);
//     } catch (err) {
//       setModalMessage({
//         type: "error",
//         text: err instanceof Error ? err.message : "Failed to send email",
//       });
//     } finally {
//       setSendingEmail(false);
//     }
//   };

//   // Book demo functionality
//   const handleBookDemo = async () => {
//     if (!demoForm.name.trim() || !demoForm.email.trim()) return;

//     setSubmittingDemo(true);
//     setModalMessage({ type: "", text: "" });

//     try {
//       const response = await fetch("/api/book-demo", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(demoForm),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to submit");
//       }

//       setModalMessage({
//         type: "success",
//         text: "Demo request submitted! Check your email.",
//       });
//       setTimeout(() => {
//         setShowBookDemoModal(false);
//         setDemoForm({ name: "", email: "", organization: "" });
//         setModalMessage({ type: "", text: "" });
//       }, 2500);
//     } catch (err) {
//       setModalMessage({
//         type: "error",
//         text: err instanceof Error ? err.message : "Failed to submit",
//       });
//     } finally {
//       setSubmittingDemo(false);
//     }
//   };

//   // Generate PDF
//   const handleGeneratePDF = async () => {
//     if (!result) return;

//     setGeneratingPDF(true);
//     try {
//       await generateSafetyReportPDF(result);
//     } catch (err) {
//       console.error("Failed to generate PDF:", err);
//     } finally {
//       setGeneratingPDF(false);
//     }
//   };

//   const getActionIcon = (action: string) => {
//     switch (action) {
//       case "BLOCK":
//         return <XCircle className="w-5 h-5" />;
//       case "GATE":
//         return <AlertTriangle className="w-5 h-5" />;
//       case "ALLOW":
//         return <CheckCircle className="w-5 h-5" />;
//       default:
//         return null;
//     }
//   };

//   const getActionColor = (action: string) => {
//     switch (action) {
//       case "BLOCK":
//         return "border-red-200 bg-red-50 text-red-600";
//       case "GATE":
//         return "border-amber-200 bg-amber-50 text-amber-600";
//       case "ALLOW":
//         return "border-green-200 bg-green-50 text-green-600";
//       default:
//         return "border-gray-200 bg-gray-50 text-gray-600";
//     }
//   };

//   const getScoreColor = (score: number) => {
//     if (score >= 75) return "text-green-600";
//     if (score >= 50) return "text-amber-600";
//     return "text-red-600";
//   };

//   const getScoreBackground = (score: number) => {
//     if (score >= 75) return "bg-green-100";
//     if (score >= 50) return "bg-amber-100";
//     return "bg-red-100";
//   };

//   const getRiskColor = (risk: string) => {
//     switch (risk.toLowerCase()) {
//       case "safe":
//         return "bg-green-100 text-green-700";
//       case "caution":
//         return "bg-amber-100 text-amber-700";
//       case "unsafe":
//         return "bg-orange-100 text-orange-700";
//       case "dangerous":
//         return "bg-red-100 text-red-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   const getSeverityColor = (severity: string) => {
//     switch (severity.toLowerCase()) {
//       case "critical":
//         return "bg-red-600 text-white";
//       case "high":
//         return "bg-red-500 text-white";
//       case "medium":
//         return "bg-amber-500 text-white";
//       case "low":
//         return "bg-yellow-400 text-gray-800";
//       default:
//         return "bg-gray-400 text-white";
//     }
//   };

//   const isUnder16Blocked =
//     result?.childSafetyAnalysis?.overallRisk === "dangerous" ||
//     result?.childSafetyAnalysis?.riskCategories?.some(
//       (r) => r.severity === "critical"
//     );
//   const displayOverallScore = result
//     ? isUnder16Blocked
//       ? 0
//       : result.overallScore
//     : 0;

//   const formatDate = (timestamp: string) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diff = now.getTime() - date.getTime();

//     if (diff < 60000) return "Just now";
//     if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
//     if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
//     if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;

//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     });
//   };

//   if (!isLoaded) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   return (
//     <>
//       <NoiseOverlay opacity={0.025} />

//       {/* Email Modal */}
//       {showEmailModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 relative animate-in fade-in zoom-in duration-200">
//             <button
//               onClick={() => {
//                 setShowEmailModal(false);
//                 setModalMessage({ type: "", text: "" });
//               }}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <X className="w-6 h-6" />
//             </button>

//             <div className="text-center mb-6">
//               <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                 <Mail className="w-7 h-7 text-primary" />
//               </div>
//               <h3 className="text-2xl font-bold text-primary">
//                 Send Report via Email
//               </h3>
//               <p className="text-sm text-text-dim mt-2">
//                 We&apos;ll send the full safety report to your email
//               </p>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   value={emailInput}
//                   onChange={(e) => setEmailInput(e.target.value)}
//                   placeholder="your@email.com"
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
//                 />
//               </div>

//               {modalMessage.text && (
//                 <div
//                   className={`p-3 rounded-xl text-sm ${modalMessage.type === "success"
//                       ? "bg-green-50 text-green-700 border border-green-200"
//                       : "bg-red-50 text-red-700 border border-red-200"
//                     }`}
//                 >
//                   {modalMessage.text}
//                 </div>
//               )}

//               <Button
//                 onClick={handleSendEmail}
//                 disabled={sendingEmail || !emailInput.trim()}
//                 className="w-full btn-primary-premium text-white py-3 h-auto rounded-xl border-0"
//               >
//                 {sendingEmail ? (
//                   <>
//                     <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                     Sending...
//                   </>
//                 ) : (
//                   <>
//                     <Mail className="w-5 h-5 mr-2" />
//                     Send Report
//                   </>
//                 )}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Book Demo Modal */}
//       {showBookDemoModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 relative animate-in fade-in zoom-in duration-200">
//             <button
//               onClick={() => {
//                 setShowBookDemoModal(false);
//                 setModalMessage({ type: "", text: "" });
//               }}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <X className="w-6 h-6" />
//             </button>

//             <div className="text-center mb-6">
//               <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                 <Calendar className="w-7 h-7 text-primary" />
//               </div>
//               <h3 className="text-2xl font-bold text-primary">Book a Demo</h3>
//               <p className="text-sm text-text-dim mt-2">
//                 See how KOMAL can protect your children online
//               </p>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={demoForm.name}
//                   onChange={(e) =>
//                     setDemoForm({ ...demoForm, name: e.target.value })
//                   }
//                   placeholder="Your name"
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   value={demoForm.email}
//                   onChange={(e) =>
//                     setDemoForm({ ...demoForm, email: e.target.value })
//                   }
//                   placeholder="your@email.com"
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Organization{" "}
//                   <span className="text-gray-400">(optional)</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={demoForm.organization}
//                   onChange={(e) =>
//                     setDemoForm({ ...demoForm, organization: e.target.value })
//                   }
//                   placeholder="Company or school name"
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
//                 />
//               </div>

//               {modalMessage.text && (
//                 <div
//                   className={`p-3 rounded-xl text-sm ${modalMessage.type === "success"
//                       ? "bg-green-50 text-green-700 border border-green-200"
//                       : "bg-red-50 text-red-700 border border-red-200"
//                     }`}
//                 >
//                   {modalMessage.text}
//                 </div>
//               )}

//               <Button
//                 onClick={handleBookDemo}
//                 disabled={
//                   submittingDemo ||
//                   !demoForm.name.trim() ||
//                   !demoForm.email.trim()
//                 }
//                 className="w-full btn-primary-premium text-white py-3 h-auto rounded-xl border-0"
//               >
//                 {submittingDemo ? (
//                   <>
//                     <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                     Submitting...
//                   </>
//                 ) : (
//                   <>
//                     <Calendar className="w-5 h-5 mr-2" />
//                     Request Demo
//                   </>
//                 )}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Mobile Reports Menu */}
//       {mobileMenuOpen && (
//         <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
//           <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//             <div className="p-4 border-b border-gray-100">
//               <div className="flex items-center justify-between">
//                 <h2 className="font-bold text-primary flex items-center gap-2">
//                   <History className="w-5 h-5" />
//                   Report History
//                 </h2>
//                 <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//             <div className="p-2">
//               <button
//                 onClick={() => {
//                   handleNewAnalysis();
//                   setMobileMenuOpen(false);
//                 }}
//                 className="w-full flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors mb-2"
//               >
//                 <Plus className="w-4 h-4" />
//                 New Analysis
//               </button>

//               {loadingReports ? (
//                 <div className="flex items-center justify-center py-8">
//                   <Loader2 className="w-6 h-6 animate-spin text-primary" />
//                 </div>
//               ) : savedReports.length === 0 ? (
//                 <p className="text-center text-sm text-text-dim py-8">
//                   No saved reports yet
//                 </p>
//               ) : (
//                 <div className="space-y-1">
//                   {savedReports.map((report) => (
//                     <div
//                       key={report.id}
//                       onClick={() => handleLoadReport(report)}
//                       className="p-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors group"
//                     >
//                       <div className="flex items-start gap-2">
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium text-primary truncate">
//                             {report.title || report.url}
//                           </p>
//                           <div className="flex items-center gap-2 mt-1">
//                             <span className={`text-xs px-2 py-0.5 rounded-full ${getRiskColor(report.overallRisk)}`}>
//                               {report.overallRisk}
//                             </span>
//                             <span className="text-xs text-text-dim flex items-center gap-1">
//                               <Clock className="w-3 h-3" />
//                               {formatDate(report.timestamp)}
//                             </span>
//                           </div>
//                         </div>
//                         <button
//                           onClick={(e) => handleDeleteReport(report.id, e)}
//                           className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="min-h-screen flex">
//         {/* Sidebar - Desktop */}
//         <aside
//           className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${sidebarOpen ? "w-80" : "w-0"
//             } overflow-hidden`}
//         >
//           <div className="flex-1 overflow-y-auto">
//             {/* User Info */}
//             <div className="p-4 border-b border-gray-100">
//               <div className="flex items-center gap-3">
//                 <UserButton afterSignOutUrl="/" />
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-primary truncate">
//                     {user?.firstName || user?.emailAddresses[0].emailAddress}
//                   </p>
//                   <p className="text-xs text-text-dim">Dashboard</p>
//                 </div>
//               </div>
//             </div>

//             {/* New Analysis Button */}
//             <div className="p-4">
//               <button
//                 onClick={handleNewAnalysis}
//                 className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
//               >
//                 <Plus className="w-4 h-4" />
//                 New Analysis
//               </button>
//             </div>

//             {/* Reports History */}
//             <div className="px-4 pb-4">
//               <h3 className="text-xs font-semibold text-text-dim uppercase tracking-wider mb-2 flex items-center gap-2">
//                 <History className="w-4 h-4" />
//                 Report History
//               </h3>

//               {loadingReports ? (
//                 <div className="flex items-center justify-center py-8">
//                   <Loader2 className="w-6 h-6 animate-spin text-primary" />
//                 </div>
//               ) : savedReports.length === 0 ? (
//                 <p className="text-center text-sm text-text-dim py-8">
//                   No saved reports yet
//                 </p>
//               ) : (
//                 <div className="space-y-1">
//                   {savedReports.map((report) => (
//                     <div
//                       key={report.id}
//                       onClick={() => handleLoadReport(report)}
//                       className="p-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors group"
//                     >
//                       <div className="flex items-start gap-2">
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium text-primary truncate">
//                             {report.title || report.url}
//                           </p>
//                           <div className="flex items-center gap-2 mt-1">
//                             <span
//                               className={`text-xs px-2 py-0.5 rounded-full ${getRiskColor(
//                                 report.overallRisk
//                               )}`}
//                             >
//                               {report.overallRisk}
//                             </span>
//                             <span className="text-xs text-text-dim flex items-center gap-1">
//                               <Clock className="w-3 h-3" />
//                               {formatDate(report.timestamp)}
//                             </span>
//                           </div>
//                         </div>
//                         <button
//                           onClick={(e) => handleDeleteReport(report.id, e)}
//                           className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 relative overflow-hidden">
//           <div className="absolute inset-0 opacity-20">
//             <FloatingOrbs count={3} />
//           </div>

//           <div className="relative z-10 min-h-screen pt-20 pb-8 md:pt-24 md:pb-16">
//             {/* Mobile Header */}
//             <div className="lg:hidden fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-30 px-4 py-2 flex items-center gap-3">
//               <button
//                 onClick={() => setMobileMenuOpen(true)}
//                 className="p-2 hover:bg-gray-100 rounded-lg"
//               >
//                 <Menu className="w-5 h-5 text-primary" />
//               </button>
//               <span className="text-sm font-medium text-primary">
//                 {savedReports.length} saved reports
//               </span>
//               <div className="ml-auto">
//                 <UserButton afterSignOutUrl="/" />
//               </div>
//             </div>

//             {/* Desktop Sidebar Toggle */}
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="hidden lg:flex fixed top-20 left-4 z-30 p-2 bg-white shadow-lg rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               {sidebarOpen ? (
//                 <PanelLeftClose className="w-5 h-5 text-primary" />
//               ) : (
//                 <PanelLeft className="w-5 h-5 text-primary" />
//               )}
//             </button>

//             <div className="container max-w-[1100px] px-4 sm:px-6 md:px-8 mx-auto pt-10 lg:pt-0">
//               {/* Header */}
//               <ScrollReveal>
//                 <div className="text-center mb-8 md:mb-12">
//                   <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 text-primary font-medium text-xs sm:text-sm mb-4 sm:mb-6">
//                     <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
//                     <span>Your Safety Dashboard</span>
//                   </div>
//                   <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-primary mb-3 md:mb-4 leading-tight px-2">
//                     Child Safety
//                     <br />
//                     <span className="relative inline-block">
//                       <span className="relative z-10">Analysis Dashboard</span>
//                       <span
//                         className="absolute left-0 right-0 bottom-[0.1em] h-[0.3em] rounded-full -z-0"
//                         style={{
//                           background:
//                             "linear-gradient(to right, rgba(107, 78, 113, 0.15), rgba(107, 78, 113, 0.25), rgba(107, 78, 113, 0.15))",
//                         }}
//                       />
//                     </span>
//                   </h1>
//                   <p className="text-sm sm:text-base md:text-lg text-text-dim max-w-[700px] mx-auto px-2">
//                     Analyze URLs and save your reports. Access your history
//                     anytime, like Claude saves your chats.
//                   </p>
//                 </div>
//               </ScrollReveal>

//               {/* Input Section */}
//               <ScrollReveal delay={0.1}>
//                 <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8 mb-6 md:mb-8">
//                   <div className="flex flex-col gap-3 sm:gap-4">
//                     <div className="flex-1">
//                       <input
//                         type="url"
//                         value={url}
//                         onChange={(e) => {
//                           setUrl(e.target.value);
//                           setError("");
//                         }}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter" && !loading) {
//                             handleScan();
//                           }
//                         }}
//                         placeholder="Enter URL or keyword (e.g., example.com or violence)"
//                         className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-primary transition-colors"
//                         disabled={loading}
//                       />
//                     </div>
//                     <Button
//                       onClick={handleScan}
//                       disabled={loading || !url.trim()}
//                       size="lg"
//                       className="btn-primary-premium text-white px-6 sm:px-8 py-3 sm:py-4 h-auto rounded-xl sm:rounded-2xl border-0 whitespace-nowrap w-full sm:w-auto"
//                     >
//                       {loading ? (
//                         <>
//                           <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                           Analyzing...
//                         </>
//                       ) : (
//                         <>
//                           <Search className="w-5 h-5 mr-2" />
//                           Analyze
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                   {error && (
//                     <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
//                       {error}
//                     </div>
//                   )}
//                   <div className="mt-3 sm:mt-4 text-xs text-text-dim text-center">
//                     Try: youtube.com, wikipedia.org, cnn.com
//                   </div>
//                 </div>
//               </ScrollReveal>

//               {/* Results Section */}
//               {result && (
//                 <div className="space-y-4 sm:space-y-6" ref={reportRef}>
//                   {/* Action Buttons */}
//                   <ScrollReveal delay={0.15}>
//                     <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-2 sm:gap-3">
//                       {!currentReportSaved && (
//                         <Button
//                           onClick={handleSaveReport}
//                           disabled={savingReport}
//                           variant="outline"
//                           className="border-2 border-primary/30 text-primary hover:bg-primary/5 rounded-xl px-4 sm:px-5 py-2.5 h-auto text-sm sm:text-base"
//                         >
//                           {savingReport ? (
//                             <>
//                               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                               Saving...
//                             </>
//                           ) : (
//                             <>
//                               <Save className="w-4 h-4 mr-2" />
//                               Save Report
//                             </>
//                           )}
//                         </Button>
//                       )}
//                       {currentReportSaved && (
//                         <span className="flex items-center gap-2 px-4 py-2.5 text-sm text-green-600 bg-green-50 rounded-xl">
//                           <CheckCircle className="w-4 h-4" />
//                           Saved to history
//                         </span>
//                       )}
//                       <Button
//                         onClick={handleGeneratePDF}
//                         disabled={generatingPDF}
//                         variant="outline"
//                         className="border-2 border-green-500/30 text-green-700 hover:bg-green-50 rounded-xl px-4 sm:px-5 py-2.5 h-auto text-sm sm:text-base"
//                       >
//                         {generatingPDF ? (
//                           <>
//                             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                             Generating...
//                           </>
//                         ) : (
//                           <>
//                             <FileDown className="w-4 h-4 mr-2" />
//                             Generate PDF
//                           </>
//                         )}
//                       </Button>
//                       <Button
//                         onClick={() => setShowEmailModal(true)}
//                         variant="outline"
//                         className="border-2 border-primary/20 text-primary hover:bg-primary/5 rounded-xl px-4 sm:px-5 py-2.5 h-auto text-sm sm:text-base"
//                       >
//                         <Mail className="w-4 h-4 mr-2" />
//                         Send via Email
//                       </Button>
//                     </div>
//                   </ScrollReveal>

//                   {/* Overall Score */}
//                   <ScrollReveal delay={0.2}>
//                     <div
//                       ref={resultsRef}
//                       className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8"
//                     >
//                       <div className="flex items-center justify-between mb-6">
//                         <h2 className="text-2xl font-bold text-primary">
//                           Overall Safety Score
//                         </h2>
//                         <div
//                           className={`${getScoreBackground(
//                             displayOverallScore
//                           )} px-6 py-3 rounded-2xl`}
//                         >
//                           <span
//                             className={`text-3xl font-bold ${getScoreColor(
//                               displayOverallScore
//                             )}`}
//                           >
//                             {displayOverallScore}
//                           </span>
//                           <span className="text-gray-600 text-base sm:text-lg">
//                             /100
//                           </span>
//                         </div>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
//                         <div
//                           className={`h-full transition-all duration-1000 ease-out ${displayOverallScore >= 75
//                               ? "bg-green-500"
//                               : displayOverallScore >= 50
//                                 ? "bg-amber-500"
//                                 : "bg-red-500"
//                             }`}
//                           style={{ width: `${displayOverallScore}%` }}
//                         />
//                       </div>
//                       <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
//                         <p className="text-xs sm:text-sm text-text-dim break-all">
//                           Scanned:{" "}
//                           <span className="font-mono text-primary">
//                             {result.url}
//                           </span>
//                         </p>
//                         {result.analysisMethod && (
//                           <span
//                             className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${result.analysisMethod === "live"
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-amber-100 text-amber-700"
//                               }`}
//                           >
//                             {result.analysisMethod === "live"
//                               ? "Live Analysis"
//                               : "Demo Mode"}
//                           </span>
//                         )}
//                         {isUnder16Blocked && (
//                           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
//                             🚫 Flagged: Blocked for under 16
//                           </span>
//                         )}
//                       </div>

//                       {/* Depth Analysis */}
//                       <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
//                         <div
//                           className={`p-2 rounded-lg text-center text-xs ${result.childSafetyAnalysis.depthAnalysis.titleSafe
//                               ? "bg-green-50 text-green-700"
//                               : "bg-red-50 text-red-700"
//                             }`}
//                         >
//                           <div className="font-medium">Title</div>
//                           <div>
//                             {result.childSafetyAnalysis.depthAnalysis.titleSafe
//                               ? "Safe"
//                               : "Unsafe"}
//                           </div>
//                         </div>
//                         <div
//                           className={`p-2 rounded-lg text-center text-xs ${result.childSafetyAnalysis.depthAnalysis.metadataSafe
//                               ? "bg-green-50 text-green-700"
//                               : "bg-red-50 text-red-700"
//                             }`}
//                         >
//                           <div className="font-medium">Metadata</div>
//                           <div>
//                             {result.childSafetyAnalysis.depthAnalysis
//                               .metadataSafe
//                               ? "Safe"
//                               : "Unsafe"}
//                           </div>
//                         </div>
//                         <div
//                           className={`p-2 rounded-lg text-center text-xs ${result.childSafetyAnalysis.depthAnalysis.contentSafe
//                               ? "bg-green-50 text-green-700"
//                               : "bg-red-50 text-red-700"
//                             }`}
//                         >
//                           <div className="font-medium">Content</div>
//                           <div>
//                             {result.childSafetyAnalysis.depthAnalysis.contentSafe
//                               ? "Safe"
//                               : "Unsafe"}
//                           </div>
//                         </div>
//                         <div
//                           className={`p-2 rounded-lg text-center text-xs ${result.childSafetyAnalysis.depthAnalysis.mediaSafe
//                               ? "bg-green-50 text-green-700"
//                               : "bg-red-50 text-red-700"
//                             }`}
//                         >
//                           <div className="font-medium">Media</div>
//                           <div>
//                             {result.childSafetyAnalysis.depthAnalysis.mediaSafe
//                               ? "Safe"
//                               : "Unsafe"}
//                           </div>
//                         </div>
//                       </div>

//                       {result.contentAnalysis.metadata && (
//                         <div className="mt-3 p-3 bg-gray-50 rounded-xl text-xs space-y-1">
//                           {result.contentAnalysis.metadata.title && (
//                             <p className="break-words">
//                               <span className="font-semibold">Title:</span>{" "}
//                               {result.contentAnalysis.metadata.title}
//                             </p>
//                           )}
//                           {result.contentAnalysis.metadata.description && (
//                             <p className="break-words">
//                               <span className="font-semibold">Description:</span>{" "}
//                               {result.contentAnalysis.metadata.description.substring(
//                                 0,
//                                 100
//                               )}
//                               ...
//                             </p>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </ScrollReveal>

//                   {/* Risk Categories */}
//                   {result.childSafetyAnalysis.riskCategories.length > 0 && (
//                     <ScrollReveal delay={0.25}>
//                       <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8">
//                         <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-4 sm:mb-6 flex items-center gap-2">
//                           <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
//                           Safety Risks Detected
//                         </h2>
//                         <div className="space-y-3">
//                           {result.childSafetyAnalysis.riskCategories.map(
//                             (risk, idx) => (
//                               <div
//                                 key={idx}
//                                 className="p-3 sm:p-4 bg-red-50/50 border border-red-100 rounded-xl"
//                               >
//                                 <div className="flex flex-wrap items-center gap-2 mb-2">
//                                   <span
//                                     className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(
//                                       risk.severity
//                                     )}`}
//                                   >
//                                     {risk.severity.toUpperCase()}
//                                   </span>
//                                   <span className="font-semibold text-gray-800">
//                                     {risk.category}
//                                   </span>
//                                   <span className="text-xs text-gray-500">
//                                     ({risk.matchCount} matches)
//                                   </span>
//                                 </div>
//                                 <div className="flex flex-wrap gap-1 mb-2">
//                                   {risk.matchedKeywords.map((kw, i) => (
//                                     <span
//                                       key={i}
//                                       className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs"
//                                     >
//                                       {kw}
//                                     </span>
//                                   ))}
//                                 </div>
//                               </div>
//                             )
//                           )}
//                         </div>
//                       </div>
//                     </ScrollReveal>
//                   )}

//                   {/* Safe Keywords */}
//                   {renderSafeKeywords()}

//                   {/* Age Group Actions */}
//                   <ScrollReveal delay={0.4}>
//                     <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
//                       <h2 className="text-2xl font-bold text-primary mb-6">
//                         Age-Appropriate Actions
//                       </h2>
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                         {Object.entries(result.ageGroupScores).map(
//                           ([ageGroup, data]) => {
//                             const displayAction = isUnder16Blocked
//                               ? "BLOCK"
//                               : data.action;
//                             const displayScore = isUnder16Blocked
//                               ? 0
//                               : data.score;
//                             const displayReason = isUnder16Blocked
//                               ? "Flagged: content is not age-appropriate for under 16."
//                               : data.reason;

//                             return (
//                               <div
//                                 key={ageGroup}
//                                 className={`border-2 rounded-2xl p-5 transition-all hover:scale-105 hover:shadow-lg ${getActionColor(
//                                   displayAction
//                                 )}`}
//                               >
//                                 <div className="flex items-center justify-between mb-3">
//                                   <h3 className="text-lg font-bold">
//                                     {ageGroup}
//                                   </h3>
//                                   {getActionIcon(displayAction)}
//                                 </div>
//                                 <div className="mb-3">
//                                   <div className="text-2xl font-bold mb-1">
//                                     {displayAction}
//                                   </div>
//                                   <div className="text-sm opacity-75">
//                                     Score: {displayScore}/100
//                                   </div>
//                                 </div>
//                                 <p className="text-xs leading-relaxed opacity-90">
//                                   {displayReason}
//                                 </p>
//                               </div>
//                             );
//                           }
//                         )}
//                       </div>
//                     </div>
//                   </ScrollReveal>

//                   {/* Info Footer */}
//                   <ScrollReveal delay={0.6}>
//                     <div className="bg-primary/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center">
//                       <p className="text-xs sm:text-sm text-text-dim">
//                         This analysis uses deep keyword context analysis, Vision
//                         AI, NLP, and multimedia scanning to evaluate child
//                         safety. Your reports are automatically saved and can be
//                         accessed from the sidebar.
//                       </p>
//                     </div>
//                   </ScrollReveal>
//                 </div>
//               )}

//               {/* Welcome State */}
//               {!result && !loading && (
//                 <ScrollReveal delay={0.3}>
//                   <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8">
//                     <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-4 sm:mb-6 text-center">
//                       Welcome, {user?.firstName || "there"}!
//                     </h2>
//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
//                       <div className="text-center flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0">
//                         <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 sm:mx-auto sm:mb-4">
//                           <Search className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
//                         </div>
//                         <div className="text-left sm:text-center">
//                           <h3 className="font-bold text-primary text-sm sm:text-base mb-1 sm:mb-2">
//                             1. Enter URL
//                           </h3>
//                           <p className="text-xs sm:text-sm text-text-dim">
//                             Analyze any website for child safety
//                           </p>
//                         </div>
//                       </div>
//                       <div className="text-center flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0">
//                         <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 sm:mx-auto sm:mb-4">
//                           <Save className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
//                         </div>
//                         <div className="text-left sm:text-center">
//                           <h3 className="font-bold text-primary text-sm sm:text-base mb-1 sm:mb-2">
//                             2. Save Reports
//                           </h3>
//                           <p className="text-xs sm:text-sm text-text-dim">
//                             Keep your analysis history organized
//                           </p>
//                         </div>
//                       </div>
//                       <div className="text-center flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0">
//                         <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 sm:mx-auto sm:mb-4">
//                           <History className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
//                         </div>
//                         <div className="text-left sm:text-center">
//                           <h3 className="font-bold text-primary text-sm sm:text-base mb-1 sm:mb-2">
//                             3. Access Anytime
//                           </h3>
//                           <p className="text-xs sm:text-sm text-text-dim">
//                             Review past reports from sidebar
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {savedReports.length > 0 && (
//                       <div className="mt-8 pt-6 border-t border-gray-100">
//                         <h3 className="text-sm font-semibold text-text-dim mb-4 text-center">
//                           Recent Reports
//                         </h3>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                           {savedReports.slice(0, 3).map((report) => (
//                             <div
//                               key={report.id}
//                               onClick={() => handleLoadReport(report)}
//                               className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
//                             >
//                               <p className="text-sm font-medium text-primary truncate">
//                                 {report.title || report.url}
//                               </p>
//                               <div className="flex items-center gap-2 mt-2">
//                                 <span
//                                   className={`text-xs px-2 py-0.5 rounded-full ${getRiskColor(
//                                     report.overallRisk
//                                   )}`}
//                                 >
//                                   {report.overallRisk}
//                                 </span>
//                                 <span className="text-xs text-text-dim">
//                                   {formatDate(report.timestamp)}
//                                 </span>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </ScrollReveal>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </>
//   );
// }
