"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, AlertTriangle, CheckCircle, XCircle, Search, Eye, MessageSquare } from "lucide-react";
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
  ageGroupActions: {
    [ageGroup: string]: {
      action: 'BLOCK' | 'GATE' | 'ALLOW';
      reason: string;
      score: number;
    };
  };
  timestamp: string;
  analysisMethod?: 'live' | 'demo';
}

export default function DemoPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Normalize URL: add https:// if no protocol is specified
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

      <section className="min-h-screen pt-24 pb-12 md:pt-28 md:pb-16 bg-gradient-to-b from-white via-purple-50/30 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <FloatingOrbs count={3} />
        </div>

        <div className="container max-w-[1100px] px-6 md:px-8 mx-auto relative z-10">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
                <Shield className="w-4 h-4" />
                <span>Live URL Safety Demo</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 leading-tight">
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
              <p className="text-lg text-text-dim max-w-[700px] mx-auto">
                Enter any URL to see how our Vision AI and NLP algorithms analyze content safety
                and provide age-appropriate recommendations based on our comprehensive content rules.
              </p>
            </div>
          </ScrollReveal>

          {/* Input Section */}
          <ScrollReveal delay={0.1}>
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
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
                    placeholder="example.com or https://example.com"
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary transition-colors"
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={handleScan}
                  disabled={loading || !url.trim()}
                  size="lg"
                  className="btn-primary-premium text-white px-8 py-4 h-auto rounded-2xl border-0 whitespace-nowrap"
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
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}
              <div className="mt-4 text-xs text-text-dim text-center">
                Try examples: youtube.com, wikipedia.org, cnn.com, steam.com
              </div>
            </div>
          </ScrollReveal>

          {/* Results Section */}
          {result && (
            <div className="space-y-6">
              {/* Overall Score */}
              <ScrollReveal delay={0.2}>
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-primary">Overall Safety Score</h2>
                    <div className={`${getScoreBackground(result.overallScore)} px-6 py-3 rounded-2xl`}>
                      <span className={`text-3xl font-bold ${getScoreColor(result.overallScore)}`}>
                        {result.overallScore}
                      </span>
                      <span className="text-gray-600 text-lg">/100</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
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
                  <div className="mt-4 flex items-center gap-3 flex-wrap">
                    <p className="text-sm text-text-dim">
                      Scanned: <span className="font-mono text-primary">{result.url}</span>
                    </p>
                    {result.analysisMethod && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          result.analysisMethod === 'live'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {result.analysisMethod === 'live' ? '🔴 Live Analysis' : '⚡ Demo Mode'}
                      </span>
                    )}
                  </div>
                  {result.contentAnalysis.metadata && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-xl text-xs space-y-1">
                      {result.contentAnalysis.metadata.title && (
                        <p><span className="font-semibold">Title:</span> {result.contentAnalysis.metadata.title}</p>
                      )}
                      {result.contentAnalysis.metadata.description && (
                        <p><span className="font-semibold">Description:</span> {result.contentAnalysis.metadata.description.substring(0, 150)}...</p>
                      )}
                      <p><span className="font-semibold">Page Stats:</span> {result.contentAnalysis.metadata.imageCount} images, {result.contentAnalysis.metadata.linkCount} links</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>

              {/* AI Analysis */}
              <ScrollReveal delay={0.3}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* NLP Text Analysis */}
                  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-primary">NLP Text Analysis</h3>
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
                      <div>
                        <p className="text-sm text-text-dim mb-2">Key Topics Detected</p>
                        <div className="flex flex-wrap gap-2">
                          {result.contentAnalysis.textAnalysis.keyTopics.map((topic, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vision AI Analysis */}
                  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Eye className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold text-primary">Vision AI Analysis</h3>
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
                          {result.contentAnalysis.visualAnalysis.detectedObjects.map((obj, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm"
                            >
                              {obj}
                            </span>
                          ))}
                        </div>
                      </div>
                      {result.contentAnalysis.visualAnalysis.concerns.length > 0 && (
                        <div>
                          <p className="text-sm text-text-dim mb-2">Safety Concerns</p>
                          <div className="space-y-1">
                            {result.contentAnalysis.visualAnalysis.concerns.map((concern, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-red-600">
                                <AlertTriangle className="w-4 h-4" />
                                <span>{concern}</span>
                              </div>
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
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-primary mb-6">Age-Appropriate Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(result.ageGroupActions).map(([ageGroup, data]) => (
                      <div
                        key={ageGroup}
                        className={`border-2 rounded-2xl p-5 transition-all hover:scale-105 hover:shadow-lg ${getActionColor(data.action)}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-bold">{ageGroup}</h3>
                          {getActionIcon(data.action)}
                        </div>
                        <div className="mb-3">
                          <div className="text-2xl font-bold mb-1">{data.action}</div>
                          <div className="text-sm opacity-75">Score: {data.score}/100</div>
                        </div>
                        <p className="text-xs leading-relaxed opacity-90">
                          {data.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Detected Categories */}
              {Object.keys(result.categoryScores).length > 0 && (
                <ScrollReveal delay={0.5}>
                  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-primary mb-6">Content Categories Detected</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(result.categoryScores)
                        .filter(([_, data]) => data.detected)
                        .map(([category, data]) => (
                          <div
                            key={category}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                          >
                            <span className="font-medium text-primary">{category}</span>
                            <span className="text-sm text-text-dim">
                              {Math.round(data.confidence * 100)}% confidence
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Info Footer */}
              <ScrollReveal delay={0.6}>
                <div className="bg-primary/5 rounded-3xl p-6 text-center">
                  <p className="text-sm text-text-dim">
                    This analysis uses Vision AI and NLP to evaluate content safety based on{' '}
                    <a
                      href="https://komalkids.com/content-safety"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium hover:underline"
                    >
                      our comprehensive content safety rules
                    </a>
                    . Results are generated in real-time using AI models (demo mode with placeholder API key).
                  </p>
                </div>
              </ScrollReveal>
            </div>
          )}

          {/* How It Works */}
          {!result && !loading && (
            <ScrollReveal delay={0.3}>
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-primary mb-6 text-center">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-primary mb-2">1. Enter URL</h3>
                    <p className="text-sm text-text-dim">
                      Provide any website URL you want to analyze for content safety
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-primary mb-2">2. AI Analysis</h3>
                    <p className="text-sm text-text-dim">
                      Vision AI and NLP scan content across multiple signals
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-bold text-primary mb-2">3. Get Results</h3>
                    <p className="text-sm text-text-dim">
                      Receive age-appropriate actions and detailed safety scores
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>
    </>
  );
}
