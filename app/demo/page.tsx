"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, AlertTriangle, CheckCircle, XCircle, Search, Eye, MessageSquare, Mail, Calendar, X } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingOrbs from "@/components/FloatingOrbs";
import NoiseOverlay from "@/components/NoiseOverlay";

interface ScanResult {
  url: string;
  overallScore: number;
  contentAnalysis: {
    textAnalysis: {
      sentiment: string;
      keyTopics: string[];
      languageScore: number;
      entities?: string[];
    };
    visualAnalysis: {
      detectedObjects: string[];
      safetyScore: number;
      concerns: string[];
      labels?: string[];
    };
    metadata?: {
      title?: string;
      description?: string;
      keywords?: string[];
      imageCount: number;
      linkCount: number;
    };
  };
  categoryScores: {
    [category: string]: {
      detected: boolean;
      confidence: number;
    };
  };
  granularCategories?: {
    [category: string]: {
      detected: boolean;
      confidence: number;
      matchedRule?: {
        category: string;
        rules: {
          '<10': string;
          '10-13': string;
          '13-16': string;
          '16-18': string;
        };
      };
    };
  };
  ageGroupActions: {
    [ageGroup: string]: {
      action: 'BLOCK' | 'GATE' | 'ALLOW';
      reason: string;
      score: number;
    };
  };
  keywordSimilarityReport?: {
    topCategories: Array<{ category: string; matchCount: number; avgScore: number }>;
    topKeywords: Array<{
      keyword: string;
      category: string;
      similarity: number;
      distance: number;
      frequency: number;
      score: number;
      priority: number;
    }>;
    topWords: Array<{ word: string; frequency: number }>;
    summary: string;
    totalMatches: number;
  };
  searchSources?: Array<{ url: string; title: string; snippet: string }>;
  timestamp: string;
  analysisMethod?: 'live' | 'demo' | 'search-fallback';
}

export default function DemoPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');

  // Modal states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showBookDemoModal, setShowBookDemoModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [demoForm, setDemoForm] = useState({ name: '', email: '', organization: '' });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [submittingDemo, setSubmittingDemo] = useState(false);
  const [modalMessage, setModalMessage] = useState({ type: '', text: '' });

  const reportRef = useRef<HTMLDivElement>(null);

  const handleScan = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      let normalizedUrl = url.trim();
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }

      const response = await fetch('/api/scan-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: normalizedUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scan URL');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
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
          senderEmail: emailInput.trim(), // Use email input as SMTP_USER
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
                <div className={`p-3 rounded-xl text-sm ${
                  modalMessage.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {modalMessage.text}
                </div>
              )}

              <Button
                onClick={handleSendEmail}
                disabled={sendingEmail || !emailInput.trim()}
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
                <div className={`p-3 rounded-xl text-sm ${
                  modalMessage.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {modalMessage.text}
                </div>
              )}

              <Button
                onClick={handleBookDemo}
                disabled={submittingDemo || !demoForm.name.trim() || !demoForm.email.trim()}
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

      <section className="min-h-screen pt-20 pb-8 md:pt-28 md:pb-16 bg-gradient-to-b from-white via-purple-50/30 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <FloatingOrbs count={3} />
        </div>

        <div className="container max-w-[1100px] px-4 sm:px-6 md:px-8 mx-auto relative z-10">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 text-primary font-medium text-xs sm:text-sm mb-4 sm:mb-6">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Live URL Safety Demo</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-primary mb-3 md:mb-4 leading-tight px-2">
                Test Our AI-Powered
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10">URL Safety Scanner</span>
                  <span
                    className="absolute left-0 right-0 bottom-[0.1em] h-[0.3em] rounded-full -z-0"
                    style={{
                      background: 'linear-gradient(to right, rgba(107, 78, 113, 0.15), rgba(107, 78, 113, 0.25), rgba(107, 78, 113, 0.15))',
                    }}
                  />
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-text-dim max-w-[700px] mx-auto px-2">
                Enter any URL to see how our Vision AI and NLP algorithms analyze content safety
                and provide age-appropriate recommendations.
              </p>
            </div>
          </ScrollReveal>

          {/* Input Section */}
          <ScrollReveal delay={0.1}>
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8 mb-6 md:mb-8">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex-1">
                  <input
                    type="url"
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
                    placeholder="example.com"
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-primary transition-colors"
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={handleScan}
                  disabled={loading || !url.trim()}
                  size="lg"
                  className="btn-primary-premium text-white px-6 sm:px-8 py-3 sm:py-4 h-auto rounded-xl sm:rounded-2xl border-0 whitespace-nowrap w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Scan URL
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
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
                  <Button
                    onClick={() => setShowEmailModal(true)}
                    variant="outline"
                    className="border-2 border-primary/20 text-primary hover:bg-primary/5 rounded-xl px-4 sm:px-5 py-2.5 h-auto text-sm sm:text-base"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send via Email
                  </Button>
                  <Button
                    onClick={() => setShowBookDemoModal(true)}
                    className="btn-primary-premium text-white rounded-xl px-4 sm:px-5 py-2.5 h-auto border-0 text-sm sm:text-base"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book a Demo
                  </Button>
                </div>
              </ScrollReveal>

              {/* Overall Score */}
              <ScrollReveal delay={0.2}>
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">Overall Safety Score</h2>
                    <div className={`${getScoreBackground(result.overallScore)} px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl self-start sm:self-auto`}>
                      <span className={`text-2xl sm:text-3xl font-bold ${getScoreColor(result.overallScore)}`}>
                        {result.overallScore}
                      </span>
                      <span className="text-gray-600 text-base sm:text-lg">/100</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ease-out ${
                        result.overallScore >= 75
                          ? 'bg-green-500'
                          : result.overallScore >= 50
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${result.overallScore}%` }}
                    />
                  </div>
                  <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <p className="text-xs sm:text-sm text-text-dim break-all">
                      Scanned: <span className="font-mono text-primary">{result.url}</span>
                    </p>
                    {result.analysisMethod && (
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${
                          result.analysisMethod === 'live'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {result.analysisMethod === 'live' ? 'Live Analysis' : 'Demo Mode'}
                      </span>
                    )}
                  </div>
                  {result.contentAnalysis.metadata && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-xl text-xs space-y-1">
                      {result.contentAnalysis.metadata.title && (
                        <p className="break-words"><span className="font-semibold">Title:</span> {result.contentAnalysis.metadata.title}</p>
                      )}
                      {result.contentAnalysis.metadata.description && (
                        <p className="break-words"><span className="font-semibold">Description:</span> {result.contentAnalysis.metadata.description.substring(0, 100)}...</p>
                      )}
                      <p><span className="font-semibold">Stats:</span> {result.contentAnalysis.metadata.imageCount} images, {result.contentAnalysis.metadata.linkCount} links</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>

              {/* AI Analysis */}
              <ScrollReveal delay={0.3}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* NLP Text Analysis */}
                  <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary">NLP Text Analysis</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-text-dim mb-1">Sentiment</p>
                        <p className="text-lg font-semibold text-primary">
                          {result.contentAnalysis.textAnalysis.sentiment}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-text-dim mb-1">Language Safety Score</p>
                        <p className={`text-lg font-semibold ${getScoreColor(result.contentAnalysis.textAnalysis.languageScore)}`}>
                          {result.contentAnalysis.textAnalysis.languageScore}/100
                        </p>
                      </div>
                      {result.contentAnalysis.textAnalysis.entities && result.contentAnalysis.textAnalysis.entities.length > 0 && (
                        <div>
                          <p className="text-sm text-text-dim mb-2">Entities Detected</p>
                          <div className="flex flex-wrap gap-2">
                            {result.contentAnalysis.textAnalysis.entities.slice(0, 3).map((entity, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                              >
                                {entity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vision AI Analysis */}
                  <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary">Vision AI Analysis</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-text-dim mb-1">Visual Safety Score</p>
                        <p className={`text-lg font-semibold ${getScoreColor(result.contentAnalysis.visualAnalysis.safetyScore)}`}>
                          {result.contentAnalysis.visualAnalysis.safetyScore}/100
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-text-dim mb-2">Detected Objects</p>
                        <div className="flex flex-wrap gap-2">
                          {result.contentAnalysis.visualAnalysis.detectedObjects.length > 0 ? (
                            result.contentAnalysis.visualAnalysis.detectedObjects.slice(0, 7).map((obj, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm"
                              >
                                {obj}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-text-dim">No objects detected</span>
                          )}
                        </div>
                      </div>
                      {result.contentAnalysis.visualAnalysis.labels && result.contentAnalysis.visualAnalysis.labels.length > 0 && (
                        <div>
                          <p className="text-sm text-text-dim mb-2">Image Labels</p>
                          <div className="flex flex-wrap gap-2">
                            {result.contentAnalysis.visualAnalysis.labels.slice(0, 6).map((label, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Age Group Actions */}
              <ScrollReveal delay={0.4}>
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-4 sm:mb-6">Age-Appropriate Actions</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                    {Object.entries(result.ageGroupActions).map(([ageGroup, data]) => (
                      <div
                        key={ageGroup}
                        className={`border-2 rounded-xl sm:rounded-2xl p-3 sm:p-5 transition-all hover:scale-105 hover:shadow-lg ${getActionColor(data.action)}`}
                      >
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <h3 className="text-sm sm:text-lg font-bold">{ageGroup}</h3>
                          <div className="hidden sm:block">{getActionIcon(data.action)}</div>
                        </div>
                        <div className="mb-2 sm:mb-3">
                          <div className="text-lg sm:text-2xl font-bold mb-0.5 sm:mb-1">{data.action}</div>
                          <div className="text-xs sm:text-sm opacity-75">Score: {data.score}/100</div>
                        </div>
                        <p className="text-[10px] sm:text-xs leading-relaxed opacity-90 line-clamp-2 sm:line-clamp-none">
                          {data.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Info Footer */}
              <ScrollReveal delay={0.6}>
                <div className="bg-primary/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center">
                  <p className="text-xs sm:text-sm text-text-dim">
                    This analysis uses Vision AI and NLP based on{' '}
                    <a
                      href="https://komalkids.com/content-safety"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium hover:underline"
                    >
                      our content safety rules
                    </a>
                    .
                  </p>
                </div>
              </ScrollReveal>
            </div>
          )}

          {/* How It Works */}
          {!result && !loading && (
            <ScrollReveal delay={0.3}>
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-4 sm:mb-6 text-center">How It Works</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="text-center flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 sm:mx-auto sm:mb-4">
                      <Search className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    </div>
                    <div className="text-left sm:text-center">
                      <h3 className="font-bold text-primary text-sm sm:text-base mb-1 sm:mb-2">1. Enter URL</h3>
                      <p className="text-xs sm:text-sm text-text-dim">
                        Provide any website URL to analyze
                      </p>
                    </div>
                  </div>
                  <div className="text-center flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 sm:mx-auto sm:mb-4">
                      <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                    </div>
                    <div className="text-left sm:text-center">
                      <h3 className="font-bold text-primary text-sm sm:text-base mb-1 sm:mb-2">2. AI Analysis</h3>
                      <p className="text-xs sm:text-sm text-text-dim">
                        Vision AI and NLP scan content
                      </p>
                    </div>
                  </div>
                  <div className="text-center flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 sm:mx-auto sm:mb-4">
                      <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                    </div>
                    <div className="text-left sm:text-center">
                      <h3 className="font-bold text-primary text-sm sm:text-base mb-1 sm:mb-2">3. Get Results</h3>
                      <p className="text-xs sm:text-sm text-text-dim">
                        Receive age-appropriate actions
                      </p>
                    </div>
                  </div>
                </div>

                {/* Book Demo CTA */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100 text-center">
                  <p className="text-text-dim text-sm mb-3 sm:mb-4">Want to see more? Get a personalized demo.</p>
                  <Button
                    onClick={() => setShowBookDemoModal(true)}
                    className="btn-primary-premium text-white rounded-xl px-5 sm:px-6 py-2.5 sm:py-3 h-auto border-0 text-sm sm:text-base"
                  >
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Book a Demo
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>
    </>
  );
}
