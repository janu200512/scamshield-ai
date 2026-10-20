'use client';
import { useState } from 'react';
import { ShieldCheck, ScanSearch, Link2, MessageSquareText, ArrowUpRight, AlertTriangle, CheckCircle2, LockKeyhole, Sparkles, RotateCcw, Copy, Check } from 'lucide-react';
import type { AnalysisResult } from '@/types/analysis';

const examples = [
  { label: 'Bank / KYC', text: 'URGENT: Your bank account will be blocked in 30 minutes. Complete KYC immediately at http://sbi-secure-login.xyz and share your OTP to avoid suspension.' },
  { label: 'Job offer', text: 'Congratulations! You are selected for a remote job earning ₹8,000 per day. Pay a refundable registration fee today to secure your position.' },
  { label: 'Delivery message', text: 'Your parcel is on hold. Pay a small rescheduling fee now using this link: http://bit.ly/parcel-update or your delivery will be cancelled.' },
  { label: 'Normal message', text: 'Hi, our study group meeting is moved to 4 PM tomorrow. Please bring your notes. Thanks!' }
];
function riskColor(level: string) { return level === 'HIGH' ? 'red' : level === 'SUSPICIOUS' ? 'orange' : level === 'MEDIUM' ? 'yellow' : 'green'; }
export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  async function analyze() {
    if (!input.trim()) { setError('Paste a suspicious message, email, or URL first.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed. Try again.');
      setResult(data as AnalysisResult);
      setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (e) { setError(e instanceof Error ? e.message : 'Analysis failed. Try again.'); }
    finally { setLoading(false); }
  }
  async function copySummary() {
    if (!result) return;
    const text = `ScamShield AI assessment: ${result.riskLevel} (${result.riskScore}/100)\nType: ${result.scamType}\n${result.summary}\nRed flags: ${result.redFlags.map(f => f.title).join(', ') || 'None detected'}\nActions: ${result.recommendedActions.join('; ')}\n\n${result.disclaimer}`;
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { setError('Could not copy automatically.'); }
  }
  return <main>
    <nav className="nav wrap"><a href="#top" className="brand"><span className="brand-icon"><ShieldCheck size={23}/></span><span>ScamShield<span className="brand-ai"> AI</span></span></a><div className="nav-right"><span className="status-dot"/> Privacy-first analysis <a href="#how" className="nav-link">How it works <ArrowUpRight size={14}/></a></div></nav>
    <section className="hero wrap" id="top">
      <div className="eyebrow"><span className="eyebrow-icon"><Sparkles size={14}/></span> YOUR DIGITAL SAFETY SIDEKICK</div>
      <h1>Pause. Check.<br/><span className="gradient-text">Protect yourself.</span></h1>
      <p className="hero-copy">Not sure about that message or link? Get a clear risk assessment, understand the red flags, and learn what to do next.</p>
      <div className="trust-row"><span><ShieldCheck size={15}/> Explainable signals</span><span><LockKeyhole size={15}/> No account needed</span><span><ScanSearch size={15}/> Quick analysis</span></div>
    </section>
    <section className="analyzer wrap" aria-label="Scam analyzer">
      <div className="panel input-panel">
        <div className="panel-heading"><div className="heading-icon"><MessageSquareText size={19}/></div><div><h2>Check suspicious content</h2><p>Paste a message, email, or URL below.</p></div><span className="step-label">STEP 01</span></div>
        <textarea value={input} onChange={e => setInput(e.target.value)} maxLength={5000} placeholder={'Paste the message or link here…\n\nExample: “Your account will be blocked. Verify now…”'} aria-label="Suspicious message, email, or URL" />
        <div className="input-meta"><span>{input.length}/5,000 characters</span><button className="clear-btn" onClick={() => { setInput(''); setResult(null); setError(''); }}>Clear input</button></div>
        <div className="examples"><span className="examples-label">TRY AN EXAMPLE</span>{examples.map(ex => <button key={ex.label} className="example-chip" onClick={() => { setInput(ex.text); setResult(null); setError(''); }}>{ex.label}</button>)}</div>
        {error && <p className="error-message" role="alert"><AlertTriangle size={15}/>{error}</p>}
        <button className="analyze-btn" onClick={analyze} disabled={loading || !input.trim()}>{loading ? <><span className="spinner"/> Checking signals…</> : <><ScanSearch size={18}/> Analyze for scams <ArrowUpRight size={17}/></>}</button>
        <p className="privacy-note"><LockKeyhole size={13}/> Your text is not saved by this demo. Avoid pasting passwords, OTPs, or private personal details.</p>
      </div>
      <div className="side-note"><div className="side-shield"><ShieldCheck size={27}/></div><h3>Clarity over fear.</h3><p>ScamShield explains the warning signs it finds instead of giving you a mysterious “scam” label.</p><div className="side-divider"/><div className="side-feature"><span className="feature-icon blue"><ScanSearch size={16}/></span><div><strong>Spot the signals</strong><small>See the specific warning signs.</small></div></div><div className="side-feature"><span className="feature-icon purple"><Sparkles size={16}/></span><div><strong>Understand why</strong><small>Get a plain-language explanation.</small></div></div><div className="side-feature"><span className="feature-icon green"><ShieldCheck size={16}/></span><div><strong>Know what to do</strong><small>Get practical next steps.</small></div></div></div>
    </section>
    {result && <section id="results" className="results wrap">
      <div className="results-top"><div><div className="section-kicker">STEP 02 · YOUR ANALYSIS</div><h2>Here’s what we found</h2><p className="results-sub">Review the evidence before deciding what to do.</p></div><button className="secondary-btn" onClick={() => { setResult(null); setError(''); }}><RotateCcw size={15}/> New check</button></div>
      <div className={`result-summary risk-${riskColor(result.riskLevel)}`}>
        <div className="score-ring" style={{'--score': `${result.riskScore * 3.6}deg`} as React.CSSProperties}><div className="score-inner"><strong>{result.riskScore}</strong><span>of 100</span></div></div>
        <div className="summary-content"><span className={`risk-pill risk-pill-${riskColor(result.riskLevel)}`}><span/> {result.riskLevel} RISK</span><h3>{result.riskLevel === 'LOW' ? 'Few common warning signs found' : result.riskLevel === 'MEDIUM' ? 'Proceed with caution' : result.riskLevel === 'SUSPICIOUS' ? 'Several warning signs found' : 'Strong warning signs found'}</h3><p>{result.summary}</p><div className="result-meta"><span><strong>Suspected category</strong>{result.scamType.replace('_', ' ')}</span><span><strong>Analysis mode</strong>{result.analysisMode === 'ai-assisted' ? 'AI-assisted + signals' : 'Signal-based demo'}</span></div></div>
      </div>
      <div className="result-grid"><div className="panel result-card"><div className="card-title"><div className="heading-icon warning-icon"><AlertTriangle size={18}/></div><div><h3>Red flags detected</h3><p>Signals found in your content</p></div><span className="count-badge">{result.redFlags.length}</span></div>{result.redFlags.length ? <div className="flag-list">{result.redFlags.map((flag, i) => <div className="flag" key={`${flag.title}-${i}`}><span className="flag-bullet">!</span><div><strong>{flag.title}</strong><p>{flag.explanation}</p>{flag.evidence && <code>“{flag.evidence}”</code>}</div></div>)}</div> : <div className="empty-flags"><CheckCircle2 size={22}/><p>No common warning signals were detected. This does not guarantee the content is safe.</p></div>}</div>
        <div className="panel result-card actions-card"><div className="card-title"><div className="heading-icon safe-icon"><ShieldCheck size={18}/></div><div><h3>What you should do</h3><p>Simple, safer next steps</p></div></div><div className="action-list">{result.recommendedActions.map((action, i) => <div className="action-item" key={action}><span>{i + 1}</span><p>{action}</p></div>)}</div><button className="secondary-btn copy-btn" onClick={copySummary}>{copied ? <Check size={15}/> : <Copy size={15}/>} {copied ? 'Copied assessment' : 'Copy assessment'}</button></div></div>
      <p className="disclaimer"><AlertTriangle size={14}/>{result.disclaimer}</p>
    </section>}
    <section id="how" className="how-section"><div className="wrap"><div className="section-kicker">BUILT FOR REAL-LIFE MOMENTS</div><h2>Three steps to a safer decision.</h2><div className="how-grid"><div className="how-card"><span className="how-number">01</span><div className="how-icon"><MessageSquareText size={20}/></div><h3>Paste</h3><p>Share the suspicious text or link you want to check. Never include private credentials.</p></div><div className="how-card"><span className="how-number">02</span><div className="how-icon"><ScanSearch size={20}/></div><h3>Understand</h3><p>Review risk signals and see plain-language reasons behind the assessment.</p></div><div className="how-card"><span className="how-number">03</span><div className="how-icon"><ShieldCheck size={20}/></div><h3>Protect</h3><p>Follow practical steps to verify the sender and avoid risky actions.</p></div></div></div></section>
    <footer className="footer wrap"><a href="#top" className="brand"><span className="brand-icon"><ShieldCheck size={20}/></span><span>ScamShield<span className="brand-ai"> AI</span></span></a><p>Built to build awareness, not fear. Stay curious. Verify independently.</p><span className="footer-note">A risk signal is not proof. A clean result is not a guarantee.</span></footer>
  </main>;
}
