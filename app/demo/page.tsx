"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, AlertTriangle, CheckCircle, XCircle, Search, Eye, MessageSquare, Mail, Calendar, X, Video, Music, ShieldAlert, ShieldCheck, FileDown } from "lucide-react";
import { generateSafetyReportPDF } from "@/lib/generatePDF";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingOrbs from "@/components/FloatingOrbs";
import NoiseOverlay from "@/components/NoiseOverlay";

interface ScanResult {
  url: string;
  overallScore: number;
  ageGroupScores: {
    [ageGroup: string]: {
      score: number;
      action: 'BLOCK' | 'GATE' | 'ALLOW';
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
    overallRisk: 'safe' | 'caution' | 'unsafe' | 'dangerous';
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
  analysisMethod?: 'live' | 'demo';
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
}

export default function DemoPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [analysisContext, setAnalysisContext] = useState<{
    inputType: 'url' | 'keyword';
    normalizedInput: string;
    warnings: string[];
  } | null>(null);
  const [longRunning, setLongRunning] = useState(false);

  // Modal states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showBookDemoModal, setShowBookDemoModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [demoForm, setDemoForm] = useState({ name: '', email: '', organization: '' });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [submittingDemo, setSubmittingDemo] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [modalMessage, setModalMessage] = useState({ type: '', text: '' });

  const reportRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const safeKeywords = result?.contentAnalysis.textAnalysis.safeKeywordsFound ?? [];
  const renderSafeKeywords = () => {
    if (safeKeywords.length === 0) {
      return null;
    }

    return (
      <ScrollReveal delay={0.28}>
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-primary mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            Safe Content Indicators
          </h3>
          <div className="flex flex-wrap gap-2">
            {safeKeywords.map((kw, idx) => (
              <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </ScrollReveal>
    );
  };

  const buildInputDiagnostics = (rawInput: string) => {
    const trimmed = rawInput.trim();
    const warnings: string[] = [];
    const looksLikeUrl = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+/.test(trimmed) ||
      trimmed.includes('.com') ||
      trimmed.includes('.org') ||
      trimmed.includes('.net') ||
      trimmed.includes('.edu') ||
      trimmed.includes('.gov') ||
      trimmed.includes('.io') ||
      trimmed.includes('.co') ||
      trimmed.includes('.in') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://');

    const normalizedInput = looksLikeUrl && !trimmed.startsWith('http://') && !trimmed.startsWith('https://')
      ? `https://${trimmed}`
      : trimmed;

    if (/^<\s*script|<\/\s*script>|on\w+=|javascript:/i.test(trimmed)) {
      warnings.push('Potentially malicious script input detected. Results are flagged as a security test.');
    }

    if (/\b(select|insert|update|delete|drop|union|alter)\b/i.test(trimmed) || /--|;{2,}|\bOR\b\s+1=1/i.test(trimmed)) {
      warnings.push('Possible injection pattern detected. Treat results as a security test.');
    }

    if (/^[\d\s]+$/.test(trimmed)) {
      warnings.push('Numeric-only input detected. Results may be less reliable for contextual safety.');
    }

    if (trimmed.length > 400) {
      warnings.push('Long input detected. Analysis may take longer than usual.');
    }

    return {
      inputType: looksLikeUrl ? 'url' : 'keyword',
      normalizedInput,
      warnings,
    };
  };

  const handleScan = async () => {
    if (!url.trim()) {
      setError('Please enter a URL or keyword');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setLongRunning(false);
    let timeoutId: number | undefined;
    let longRunningTimer: number | undefined;

    try {
      const diagnostics = buildInputDiagnostics(url);
      setAnalysisContext(diagnostics);
      const controller = new AbortController();
      timeoutId = window.setTimeout(() => controller.abort(), 20000);
      longRunningTimer = window.setTimeout(() => setLongRunning(true), 5000);

      const response = await fetch('/api/scan-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({ url: diagnostics.normalizedInput }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze');
      }

      setResult(data);

      // Scroll to results section after a brief delay for rendering
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

      // Log performance metrics to browser console
      if (data.performanceMetrics) {
        const { totalTimeMs, steps } = data.performanceMetrics;
        console.log('\n%c🔍 KOMAL URL SAFETY ANALYSIS - PERFORMANCE REPORT', 'color: #6B4E71; font-weight: bold; font-size: 14px;');
        console.log(`%c📍 Input: ${diagnostics.normalizedInput}`, 'color: #666;');
        console.log(`%c⏱️  Total Time: ${(totalTimeMs / 1000).toFixed(3)}s`, 'color: #2196F3; font-weight: bold;');
        console.log('%c\n📊 Step Breakdown:', 'color: #6B4E71; font-weight: bold;');
        console.table(steps.map((step: { name: string; durationMs: number; details?: string }) => ({
          Step: step.name,
          'Duration (ms)': step.durationMs,
          'Duration (s)': (step.durationMs / 1000).toFixed(3),
          Details: step.details || '-'
        })));
        console.log(`%c\n✅ Analysis Method: ${data.analysisMethod?.toUpperCase() || 'UNKNOWN'}`, 'color: #4CAF50; font-weight: bold;');
        console.log(`%c🎯 Safety Score: ${data.overallScore}/100 | Risk Level: ${data.childSafetyAnalysis?.overallRisk?.toUpperCase() || 'N/A'}`,
          data.overallScore >= 75 ? 'color: #4CAF50; font-weight: bold;' :
            data.overallScore >= 50 ? 'color: #FF9800; font-weight: bold;' :
              'color: #F44336; font-weight: bold;');

        if (data.pythonDebug) {
          console.log('%c\n🐍 Python Hybrid Debug Info:', 'color: #6B4E71; font-weight: bold;');
          console.log(data.pythonDebug);
        }
        console.log('\n');
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('The analysis timed out after 20 seconds. Please try again or use a shorter input.');
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
      console.error('%c❌ KOMAL Analysis Error:', 'color: #F44336; font-weight: bold;', err);
    } finally {
      setLoading(false);
      setLongRunning(false);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      if (longRunningTimer) {
        window.clearTimeout(longRunningTimer);
      }
    }
  };

  // Send email functionality
  const handleSendEmail = async () => {
    if (!emailInput.trim() || !result) return;

    setSendingEmail(true);
    setModalMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/send-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailInput.trim(),
          report: result,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setModalMessage({ type: 'success', text: 'Report sent successfully!' });
      setTimeout(() => {
        setShowEmailModal(false);
        setEmailInput('');
        setModalMessage({ type: '', text: '' });
      }, 2000);
    } catch (err) {
      setModalMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to send email' });
    } finally {
      setSendingEmail(false);
    }
  };

  // Book demo functionality
  const handleBookDemo = async () => {
    if (!demoForm.name.trim() || !demoForm.email.trim()) return;

    setSubmittingDemo(true);
    setModalMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/book-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demoForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      setModalMessage({ type: 'success', text: 'Demo request submitted! Check your email.' });
      setTimeout(() => {
        setShowBookDemoModal(false);
        setDemoForm({ name: '', email: '', organization: '' });
        setModalMessage({ type: '', text: '' });
      }, 2500);
    } catch (err) {
      setModalMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to submit' });
    } finally {
      setSubmittingDemo(false);
    }
  };

  // Generate PDF functionality
  const handleGeneratePDF = async () => {
    if (!result) return;

    setGeneratingPDF(true);
    try {
      await generateSafetyReportPDF(result);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setGeneratingPDF(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'BLOCK':
        return <XCircle className="w-5 h-5" />;
      case 'GATE':
        return <AlertTriangle className="w-5 h-5" />;
      case 'ALLOW':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BLOCK':
        return 'border-red-200 bg-red-50 text-red-600';
      case 'GATE':
        return 'border-amber-200 bg-amber-50 text-amber-600';
      case 'ALLOW':
        return 'border-green-200 bg-green-50 text-green-600';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 75) return 'bg-green-100';
    if (score >= 50) return 'bg-amber-100';
    return 'bg-red-100';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-amber-500 text-white';
      case 'low':
        return 'bg-yellow-400 text-gray-800';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  // Check if content should be blocked for under 16 based on child safety analysis
  const isUnder16Blocked = result?.childSafetyAnalysis?.overallRisk === 'dangerous' ||
    result?.childSafetyAnalysis?.riskCategories?.some(r => r.severity === 'critical');
  const displayOverallScore = result ? (isUnder16Blocked ? 0 : result.overallScore) : 0;

  return (
    <>
      <NoiseOverlay opacity={0.025} />

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => { setShowEmailModal(false); setModalMessage({ type: '', text: '' }); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary">Send Report via Email</h3>
              <p className="text-sm text-text-dim mt-2">We'll send the full safety report to your email</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {modalMessage.text && (
                <div className={`p-3 rounded-xl text-sm ${modalMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                  {modalMessage.text}
                </div>
              )}

              <Button
                onClick={handleSendEmail}
                disabled={sendingEmail || !emailInput.trim()}
                type="button"
                className="w-full btn-primary-premium text-white py-3 h-auto rounded-xl border-0"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => { setShowBookDemoModal(false); setModalMessage({ type: '', text: '' }); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary">Book a Demo</h3>
              <p className="text-sm text-text-dim mt-2">See how KOMAL can protect your children online</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={demoForm.name}
                  onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={demoForm.email}
                  onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={demoForm.organization}
                  onChange={(e) => setDemoForm({ ...demoForm, organization: e.target.value })}
                  placeholder="Company or school name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {modalMessage.text && (
                <div className={`p-3 rounded-xl text-sm ${modalMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                  {modalMessage.text}
                </div>
              )}

              <Button
                onClick={handleBookDemo}
                disabled={submittingDemo || !demoForm.name.trim() || !demoForm.email.trim()}
                type="button"
                className="w-full btn-primary-premium text-white py-3 h-auto rounded-xl border-0"
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

      <section className="min-h-screen pt-20 pb-8 md:pt-24 md:pb-12 bg-[#F9F9FB] relative overflow-hidden font-sans">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <FloatingOrbs count={2} />
        </div>

        <div className="container max-w-[1000px] px-4 mx-auto relative z-10">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm text-primary font-medium text-xs mb-4">
                <Shield className="w-3.5 h-3.5" />
                <span>Child Safety Analysis Engine</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-primary mb-3 tracking-tight">
                AI Content Safety Demo
              </h1>
              <p className="text-sm md:text-base text-gray-500 max-w-[600px] mx-auto">
                Real-time multi-modal analysis: NLP, Vision AI, and contextual risk assessment.
              </p>
            </div>
          </ScrollReveal>

          {/* Input Section - Sleek Compact Bar */}
          <ScrollReveal delay={0.1}>
            <div className="max-w-2xl mx-auto mb-8 relative z-20">
              <div className="bg-white rounded-2xl shadow-lg shadow-primary/5 border border-gray-200 p-2 flex flex-col sm:flex-row gap-2 transition-all focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary/30">
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !loading) {
                        handleScan();
                      }
                    }}
                    placeholder="Enter URL (e.g., wikipedia.org) or keyword..."
                    className="w-full pl-10 pr-4 py-3 bg-transparent border-none text-sm md:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none font-medium"
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={handleScan}
                  disabled={loading || !url.trim()}
                  className="btn-primary-premium text-white px-6 py-2.5 h-auto rounded-xl text-sm font-medium border-0 shadow-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    'Analyze'
                  )}
                </Button>
              </div>
              {error && (
                <div className="mt-2 text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs border border-red-100">
                    <AlertTriangle className="w-3 h-3" />
                    {error}
                  </span>
                </div>
              )}
            </div>
          </ScrollReveal>


          {/* Results Section - Compact Technical Dashboard */}
          {result && (
            <div className="space-y-4 max-w-[1000px] mx-auto px-4 pb-20 mt-8" ref={reportRef}>

              {/* Top Bar: Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                  <span>Target:</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-900">{result.url}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button onClick={handleGeneratePDF} disabled={generatingPDF} variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-gray-200">
                    {generatingPDF ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
                    PDF
                  </Button>
                  <Button onClick={() => setShowEmailModal(true)} variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-gray-200">
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </Button>
                  <Button onClick={() => setShowBookDemoModal(true)} size="sm" className="h-8 text-xs gap-1.5 btn-primary-premium text-white border-0">
                    <Calendar className="w-3.5 h-3.5" />
                    Book Demo
                  </Button>
                </div>
              </div>

              <ScrollReveal delay={0.1}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                  {/* Overall Score Card - Compact Vertical */}
                  <div className="md:col-span-4 bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-center items-center text-center">
                    <h3 className="text-gray-500 font-medium text-sm mb-2 uppercase tracking-wide">Analysis Score</h3>
                    <div className="relative mb-3">
                      <div className={`text-6xl font-bold tracking-tighter ${getScoreColor(displayOverallScore)}`}>
                        {displayOverallScore}
                      </div>
                      <span className="text-xs text-gray-400 absolute top-1 -right-4">/100</span>
                    </div>

                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full ${displayOverallScore >= 75 ? 'bg-green-500' : displayOverallScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${displayOverallScore}%` }}
                      />
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                      {isUnder16Blocked && (
                        <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 text-[10px] font-bold border border-red-100 uppercase tracking-tight">
                          Blocked &lt; 16
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-tight ${result.analysisMethod === 'live' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                        {result.analysisMethod === 'live' ? 'Live Scan' : 'Demo Mode'}
                      </span>
                    </div>
                  </div>

                  {/* Age & Risk Matrix - Denser Grid */}
                  <div className="md:col-span-8 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <h3 className="text-gray-500 font-medium text-xs mb-4 uppercase tracking-wide flex items-center justify-between">
                      <span>Age Recommendations</span>
                      <span className="opacity-50 font-mono text-[10px]">Policy: Default</span>
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.entries(result.ageGroupScores).map(([ageGroup, data]) => {
                        const action = isUnder16Blocked ? 'BLOCK' : data.action;
                        return (
                          <div key={ageGroup} className={`rounded-lg border p-3 flex flex-col items-center justify-center text-center transition-all ${action === 'BLOCK' ? 'bg-red-50/50 border-red-100' :
                            action === 'GATE' ? 'bg-amber-50/50 border-amber-100' :
                              'bg-green-50/50 border-green-100'
                            }`}>
                            <span className="text-xs font-semibold text-gray-700 mb-1.5">{ageGroup}</span>
                            {getActionIcon(action)}
                            <span className={`text-[10px] font-bold mt-1 ${action === 'BLOCK' ? 'text-red-700' :
                              action === 'GATE' ? 'text-amber-700' :
                                'text-green-700'
                              }`}>{action}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Horizontal Risk Bar if any */}
                    {result.childSafetyAnalysis.riskCategories.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-gray-400 mr-1">Risks:</span>
                          {result.childSafetyAnalysis.riskCategories.map((risk, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 rounded text-[10px] font-medium flex items-center gap-1">
                              <span className={`w-1.5 h-1.5 rounded-full ${risk.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'}`} />
                              {risk.category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>

              {/* Deep Analysis Grid */}
              <ScrollReveal delay={0.2}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* NLP Analysis */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50">
                      <MessageSquare className="w-4 h-4 text-primary opacity-60" />
                      <h4 className="text-sm font-bold text-gray-900">NLP Content Analysis</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Sentiment</div>
                        <div className="text-sm font-medium">{isUnder16Blocked ? 'Blocked' : result.contentAnalysis.textAnalysis.sentiment}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Lang Score</div>
                        <div className={`text-sm font-bold ${getScoreColor(isUnder16Blocked ? 0 : result.contentAnalysis.textAnalysis.languageScore)}`}>
                          {isUnder16Blocked ? 0 : result.contentAnalysis.textAnalysis.languageScore}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Topics</div>
                      <div className="flex flex-wrap gap-1.5">
                        {(isUnder16Blocked ? ['Restricted'] : result.contentAnalysis.textAnalysis.keyTopics).map((t, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-50 text-gray-600 border border-gray-100 rounded text-[10px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Vision Analysis */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50">
                      <Eye className="w-4 h-4 text-purple-600 opacity-60" />
                      <h4 className="text-sm font-bold text-gray-900">Vision AI Analysis</h4>
                    </div>

                    {!result.usedSearchFallback ? (
                      <>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Visual Safety</div>
                            <div className={`text-sm font-bold ${getScoreColor(isUnder16Blocked ? 0 : result.contentAnalysis.visualAnalysis.safetyScore)}`}>
                              {isUnder16Blocked ? 0 : result.contentAnalysis.visualAnalysis.safetyScore}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Objects</div>
                            <div className="text-sm font-medium text-gray-900">
                              {result.contentAnalysis.visualAnalysis.detectedObjects.length} Detected
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {(isUnder16Blocked ? ['Hidden'] : result.contentAnalysis.visualAnalysis.detectedObjects.slice(0, 6)).map((o, i) => (
                            <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded text-[10px]">
                              {o}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 text-xs italic">
                        Vision analysis unavailable for this result type
                      </div>
                    )}
                  </div>

                </div>
              </ScrollReveal>

              {/* Technical Footer */}
              <div className="text-center pt-8 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 font-mono">
                  ID: {result.timestamp} • Latency: {result.performanceMetrics ? (result.performanceMetrics.totalTimeMs / 1000).toFixed(2) + 's' : 'N/A'} • Engine: v2.4.1-hybrid
                </p>
              </div>
            </div>
          )}

          {/* How It Works - Compact */}
          {!result && !loading && (
            <ScrollReveal delay={0.3}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 max-w-4xl mx-auto">
                <h2 className="text-lg font-bold text-primary mb-6 text-center tracking-tight">How It Works</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center group">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3 border border-blue-100 group-hover:scale-105 transition-transform">
                      <Search className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">1. Enter URL</h3>
                    <p className="text-xs text-gray-500">
                      Provide any website URL or keyword to analyze
                    </p>
                  </div>
                  <div className="text-center group">
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3 border border-purple-100 group-hover:scale-105 transition-transform">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">2. AI Analysis</h3>
                    <p className="text-xs text-gray-500">
                      Deep context, Vision AI, NLP & multimedia scan
                    </p>
                  </div>
                  <div className="text-center group">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-3 border border-green-100 group-hover:scale-105 transition-transform">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">3. Get Insight</h3>
                    <p className="text-xs text-gray-500">
                      Receive age-specific safety scores & risks
                    </p>
                  </div>
                </div>

                {/* Book Demo CTA */}
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <p className="text-gray-500 text-xs mb-3">Enterprise-grade safety for your platform?</p>
                  <Button
                    onClick={() => setShowBookDemoModal(true)}
                    size="sm"
                    className="btn-primary-premium text-white rounded-lg px-5 py-2 h-auto border-0 text-xs font-medium"
                  >
                    <Calendar className="w-3.5 h-3.5 mr-2" />
                    Book a Demo
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div >
      </section >
    </>
  );
}
