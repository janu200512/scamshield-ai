import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ScanSearch, 
  AlertTriangle, 
  CheckCircle2, 
  LockKeyhole, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  ExternalLink, 
  ArrowRight, 
  Zap, 
  Info, 
  AlertOctagon, 
  ShieldAlert,
  HelpCircle,
  FileText
} from 'lucide-react';
import type { AnalysisResult, RiskLevel } from '../types/analysis.ts';
import { analyzeWithRules, extractAllUrls } from '../lib/analyzer.ts';

interface AnalyzerViewProps {
  initialInput?: string;
}

const PRESETS = [
  {
    label: '🏦 Bank Account Suspension',
    category: 'Banking Phishing',
    text: 'URGENT: Your bank account will be blocked in 30 minutes. Complete KYC immediately at http://sbi-secure-login.xyz and share your OTP to avoid suspension.'
  },
  {
    label: '💼 ₹8,000/Day Remote Job',
    category: 'Employment Scam',
    text: 'Congratulations! You are selected for a remote job earning ₹8,000 per day. Pay a refundable registration fee today to secure your position.'
  },
  {
    label: '📦 Parcel On Hold (bit.ly)',
    category: 'Delivery Smishing',
    text: 'Your parcel is on hold. Pay a small rescheduling fee now using this link: http://bit.ly/parcel-update or your delivery will be cancelled.'
  },
  {
    label: '🎁 Won ₹50,000 Lottery',
    category: 'Prize Fraud',
    text: 'You have won ₹50,000! Click now to claim your prize before it expires. Processing fee required.'
  },
  {
    label: '📈 100% Guaranteed Crypto',
    category: 'Investment Trap',
    text: 'Double your money in 7 days with guaranteed risk-free returns. Deposit now to unlock your profit.'
  },
  {
    label: '💻 Tech Support Virus Alert',
    category: 'Device Hijacking',
    text: 'Virus detected on your computer. Call our technical support immediately and install remote access software.'
  },
  {
    label: '⚡ Electricity Cutoff Threat',
    category: 'Utility Phishing',
    text: 'Your electricity service will be disconnected today. Pay now using this shortened link to avoid legal action.'
  },
  {
    label: '🛡️ Legitimate Study Group',
    category: 'Safe Message',
    text: 'Hi, our study group meeting is moved to 4 PM tomorrow. Please bring your notes. Thanks!'
  }
];

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({ initialInput = '' }) => {
  const [input, setInput] = useState<string>(initialInput);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [analysisMode, setAnalysisMode] = useState<'rules' | 'ai-assisted'>('rules');

  const detectedUrls = extractAllUrls(input);

  const handleAnalyze = async () => {
    const text = input.trim();
    if (!text) {
      setError('Please paste a message, email body, or URL to analyze.');
      return;
    }
    if (text.length > 5000) {
      setError('Content exceeds 5,000 characters. Please shorten it.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (analysisMode === 'ai-assisted') {
        // Call server endpoint with Gemini
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: text, mode: 'ai-assisted' })
        });

        if (response.ok) {
          const data: AnalysisResult = await response.json();
          setResult(data);
        } else {
          // Client-side fallback if server fails
          const localResult = analyzeWithRules(text);
          setResult(localResult);
        }
      } else {
        // Fast deterministic client-side analysis
        const localResult = analyzeWithRules(text);
        setResult(localResult);
      }
    } catch {
      // Offline fallback
      const localResult = analyzeWithRules(text);
      setResult(localResult);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
    setError('');
  };

  const handleCopyReport = async () => {
    if (!result) return;
    const reportText = `🛡️ ScamShield AI Assessment Report
===================================
Risk Level: ${result.riskLevel} (${result.riskScore}/100)
Category: ${result.scamType.replace('_', ' ')}
Analysis Mode: ${result.analysisMode === 'ai-assisted' ? 'Gemini 3.8 Flash AI + Rules' : 'Deterministic Heuristics'}

Summary:
${result.summary}

Red Flags Detected (${result.redFlags.length}):
${result.redFlags.map(f => `• [${f.severity?.toUpperCase() || 'ALERT'}] ${f.title}: ${f.explanation} (Evidence: "${f.evidence || 'N/A'}")`).join('\n') || 'None detected'}

Actionable Next Steps:
${result.recommendedActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

Disclaimer:
${result.disclaimer}`;

    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Failed to copy report to clipboard.');
    }
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'HIGH':
        return {
          text: 'text-red-400',
          bg: 'bg-red-950/40',
          border: 'border-red-800/50',
          badge: 'bg-red-500/10 text-red-400 border-red-500/30',
          ring: '#ef4444'
        };
      case 'SUSPICIOUS':
        return {
          text: 'text-amber-400',
          bg: 'bg-amber-950/40',
          border: 'border-amber-800/50',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          ring: '#f97316'
        };
      case 'MEDIUM':
        return {
          text: 'text-yellow-400',
          bg: 'bg-yellow-950/40',
          border: 'border-yellow-800/50',
          badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
          ring: '#eab308'
        };
      case 'LOW':
      default:
        return {
          text: 'text-emerald-400',
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-800/50',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          ring: '#10b981'
        };
    }
  };

  return (
    <div className="py-8 sm:py-12 space-y-10">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explainable Fraud &amp; Phishing Detection</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight">
          Pause. Check. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">Protect Yourself.</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Not sure if that message, delivery alert, job offer, or URL is a scam? Paste it below to inspect red flags, examine evidence, and see clear, actionable safety advice.
        </p>
      </div>

      {/* Main Analyzer Grid */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel-elevated rounded-2xl p-5 sm:p-6 space-y-5">
            {/* Header with Mode Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <ScanSearch className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-heading font-semibold text-white">Message &amp; Link Scanner</h2>
                  <p className="text-[11px] text-slate-400">Paste raw text, SMS, WhatsApp forward, or URL</p>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setAnalysisMode('rules')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                    analysisMode === 'rules'
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Deterministic heuristic regex matching (instant, no API needed)"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Rules Engine</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAnalysisMode('ai-assisted')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                    analysisMode === 'ai-assisted'
                      ? 'bg-indigo-600 text-white font-medium shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Gemini 3.8 Flash AI reasoning for complex social engineering analysis"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Gemini AI</span>
                </button>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Try Real-World Examples:</span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInput(p.text);
                      setResult(null);
                      setError('');
                    }}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 transition-colors duration-150 text-left"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Textarea */}
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={5000}
                rows={6}
                placeholder="Paste the suspicious message, email, or URL here...&#10;&#10;e.g. 'URGENT: Your bank account will be blocked. Complete KYC immediately at http://sbi-secure.xyz with OTP...'"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-mono resize-none leading-relaxed"
                aria-label="Suspicious text or URL to analyze"
              />

              {/* Detected URLs chips */}
              {detectedUrls.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 text-cyan-400" /> Detected Links:
                  </span>
                  {detectedUrls.map((u, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono border border-slate-700 truncate max-w-[200px]">
                      {u}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">{input.length} / 5,000 chars</span>
              {input && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Clear text
                </button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || !input.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-heading font-semibold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Inspecting Red Flags &amp; Signals...</span>
                </>
              ) : (
                <>
                  <ScanSearch className="w-4 h-4" />
                  <span>Analyze for Scams &amp; Phishing</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Privacy Disclaimer */}
            <div className="flex items-start gap-2 pt-2 text-[11px] text-slate-500 leading-normal">
              <LockKeyhole className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
              <span>
                <strong>Privacy Guaranteed:</strong> Content is analyzed in-memory and never saved to a database. Avoid pasting real passwords, live OTPs, or confidential credentials.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Results */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Risk Summary Card */}
              {(() => {
                const color = getRiskColor(result.riskLevel);
                const circumference = 2 * Math.PI * 40;
                const strokeDashoffset = circumference - (result.riskScore / 100) * circumference;

                return (
                  <div className={`glass-panel-elevated rounded-2xl p-6 border ${color.border} relative overflow-hidden`}>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Risk Assessment</span>
                        <h3 className="text-lg font-heading font-bold text-white">Detection Result</h3>
                      </div>
                      <button
                        type="button"
                        onClick={handleClear}
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800/50 border border-slate-700/50"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    </div>

                    <div className="py-5 flex items-center gap-6">
                      {/* Radial Gauge */}
                      <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            className="stroke-slate-800"
                            strokeWidth="8"
                            fill="transparent"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke={color.ring}
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            fill="transparent"
                            className="transition-all duration-700 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="font-heading font-extrabold text-2xl text-white">{result.riskScore}</span>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider">/ 100</span>
                        </div>
                      </div>

                      {/* Level and Category Details */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${color.badge}`}>
                            {result.riskLevel} RISK
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                            {result.scamType.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                          {result.summary}
                        </p>
                        <div className="text-[10px] text-slate-400 pt-1 flex items-center gap-2">
                          <span className="font-medium text-slate-300">Mode:</span> 
                          <span>{result.analysisMode === 'ai-assisted' ? 'Gemini 3.8 Flash + Rules' : 'Deterministic Rules'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Red Flags List */}
                    <div className="pt-4 border-t border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-heading font-semibold text-white flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Detected Warning Signals ({result.redFlags.length})</span>
                        </span>
                      </div>

                      {result.redFlags.length > 0 ? (
                        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                          {result.redFlags.map((flag, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-medium text-slate-200">{flag.title}</span>
                                {flag.severity && (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                                    flag.severity === 'critical' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                    flag.severity === 'warning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                    'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                  }`}>
                                    {flag.severity}
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-400 text-[11px] leading-relaxed">{flag.explanation}</p>
                              {flag.evidence && (
                                <div className="mt-1 px-2 py-1 rounded bg-slate-950/80 border border-slate-800/80 font-mono text-[11px] text-amber-300/90 truncate">
                                  "{flag.evidence}"
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs">
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                          <span>No common scam indicators detected by the rule patterns.</span>
                        </div>
                      )}
                    </div>

                    {/* Actionable Next Steps */}
                    <div className="pt-4 border-t border-slate-800 space-y-2.5">
                      <span className="text-xs font-heading font-semibold text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Recommended Safety Actions</span>
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {result.recommendedActions.map((action, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800/60">
                            <span className="w-4 h-4 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-snug">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Copy Assessment Button */}
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={handleCopyReport}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Report Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Full Assessment Report</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-[10px] text-slate-500 pt-3 leading-relaxed border-t border-slate-800/60 mt-3 flex items-start gap-1">
                      <Info className="w-3 h-3 shrink-0 text-slate-400 mt-0.5" />
                      <span>{result.disclaimer}</span>
                    </p>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* Educational Side Card When No Result */
            <div className="glass-panel-elevated rounded-2xl p-6 space-y-6 border border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-heading font-bold text-white">Clarity Over Blind Panic</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cybercriminals rely on fear, greed, and artificial urgency. ScamShield AI demystifies suspicious messages by isolating the exact psychological tricks and indicators used.
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    01
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Spot Urgency Tactics</h4>
                    <p className="text-slate-400 text-[11px]">Countdown clocks ("within 30 mins", "final notice") force impulsive actions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    02
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Inspect Link Destinations</h4>
                    <p className="text-slate-400 text-[11px]">Lookalike domains, IP addresses, and URL shorteners hide true targets.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    03
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Independent Verification</h4>
                    <p className="text-slate-400 text-[11px]">Never use the contact numbers or links inside unexpected messages.</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <LockKeyhole className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Tip: Test the preset buttons above to see how ScamShield analyzes real-world banking, job, and lottery scams in real-time.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
