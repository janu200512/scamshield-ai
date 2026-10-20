import React from 'react';
import { 
  BookOpen, 
  ShieldAlert, 
  Briefcase, 
  Package, 
  Monitor, 
  Users, 
  Eye, 
  Lightbulb, 
  ArrowRight,
  TrendingUp,
  Cpu,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const RealWorldGuideView: React.FC = () => {
  const problems = [
    {
      icon: ShieldAlert,
      color: 'text-red-400 bg-red-950/40 border-red-800/40',
      title: '1. Banking & KYC Phishing (UPI / Account Freezing)',
      threat: 'Attackers send urgent SMS messages claiming: "Your bank account will be blocked in 30 minutes. Complete KYC immediately at sbi-secure-login.xyz and share your OTP."',
      impact: 'Victims panic, enter their NetBanking credentials, and disclose the OTP, allowing scammers to instantly drain funds via UPI or wire transfer.',
      solution: 'ScamShield AI flags artificial countdown urgency ("in 30 minutes"), detects credential/OTP solicitation (+26 risk score), analyzes the domain for brand lookalikes, and advises the user to open their official banking app directly.'
    },
    {
      icon: Briefcase,
      color: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
      title: '2. Fake Remote Employment & Advance-Fee Fraud',
      threat: 'Job seekers receive WhatsApp/Telegram messages: "Congratulations! You are selected for remote work earning ₹8,000–₹10,000/day. Pay a refundable registration fee of ₹1,500 to secure your spot."',
      impact: 'College students and job seekers lose their hard-earned money and may inadvertently share identity documents (Aadhaar, PAN, Resume) used in identity theft rings.',
      solution: 'ScamShield detects unrealistic daily income lures, flags upfront registration/refundable fee demands (+20 risk score), and warns that legitimate employers NEVER demand money to hire.'
    },
    {
      icon: Package,
      color: 'text-yellow-400 bg-yellow-950/40 border-yellow-800/40',
      title: '3. Package Delivery Smishing (Missed Parcel Traps)',
      threat: 'Fake SMS notification: "Your delivery parcel is on hold due to incorrect address. Pay a small rescheduling fee now using bit.ly/parcel-update or it will be cancelled."',
      impact: 'Victims click shortened links leading to credential harvesting pages, or enter credit card details for a ₹5 charge that secretly initiates recurring international subscriptions.',
      solution: 'ScamShield exposes URL shorteners masking the destination server, detects parcel impersonation language, and instructs users to track parcels exclusively on the courier’s official website.'
    },
    {
      icon: Monitor,
      color: 'text-purple-400 bg-purple-950/40 border-purple-800/40',
      title: '4. Tech Support & Remote Device Hijacking',
      threat: 'Loud screen alerts or SMS warnings: "Virus detected on your computer! Call technical support immediately and install remote access software (AnyDesk / TeamViewer)."',
      impact: 'Victims grant scammers remote control over their computer or smartphone, allowing attackers to view screens, open banking portals, and intercept two-factor codes in real-time.',
      solution: 'ScamShield AI has dedicated high-severity rules targeting remote desktop tools (+24 risk score) and unprompted virus claims, stopping victims from granting device access.'
    },
    {
      icon: Users,
      color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
      title: '5. Protecting Elderly & Non-Technical Users',
      threat: 'Older adults and first-time digital payment users often cannot differentiate between legitimate banking notifications and cleverly designed phishing attacks.',
      impact: 'Fear-based extortion (threats of power cutoffs, legal warrants, tax penalties) causes immediate distress and impulsive compliance.',
      solution: 'Instead of cryptic technical jargon, ScamShield presents a calm, friendly UI with a clear risk dial, plain-language summaries, and direct, stress-free instructions.'
    },
    {
      icon: Eye,
      color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40',
      title: '6. The "Explainable AI" (XAI) Solution vs Black Boxes',
      threat: 'Traditional spam filters give a binary "SPAM" or "SAFE" label without explaining WHY. When users do not understand why something is dangerous, they frequently bypass warnings.',
      impact: 'Users copy-paste links anyway or fall for the scam when an attack slightly evades a traditional black-box filter.',
      solution: 'ScamShield AI provides full white-box transparency: it highlights the exact quote from the message, gives the reason for each signal, and teaches the user how to spot red flags in the future.'
    }
  ];

  return (
    <div className="py-8 sm:py-12 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
            CYBERSECURITY PROBLEM ANALYSIS
          </span>
          <span className="text-xs text-slate-400">Real-World Social Engineering Defense</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
          Real-World Problems Solved by ScamShield AI
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Digital scams cause over <strong>$1 Trillion in global consumer losses annually</strong>. 
          ScamShield AI is not just a toy script; it directly tackles the fastest-growing attack vectors in modern digital society.
        </p>
      </div>

      {/* 6 Real-World Problem Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {problems.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div key={idx} className="glass-panel-elevated p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl p-2 flex items-center justify-center shrink-0 border ${p.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-white">{p.title}</h3>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-red-400 font-semibold block">
                    The Attack Pattern:
                  </span>
                  <p className="text-slate-300 font-sans italic text-[11px] leading-relaxed">"{p.threat}"</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400/90 font-semibold block">
                    The Human &amp; Financial Cost:
                  </span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{p.impact}</p>
                </div>

                <div className="space-y-1 pt-1 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-semibold block">
                    How ScamShield AI Solves It:
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px] font-medium">{p.solution}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Architecture & Flow Infographic */}
      <div className="glass-panel-elevated rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">System Architecture</span>
          <h3 className="text-xl font-heading font-bold text-white">How ScamShield AI Evaluates Threats</h3>
          <p className="text-xs text-slate-400 max-w-2xl">
            A hybrid multi-layered approach combining low-latency deterministic heuristics with contextual generative AI reasoning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-mono text-xs font-bold">
              01
            </span>
            <h4 className="font-heading font-semibold text-xs text-white">Input Sanitization</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Accepts up to 5,000 characters. Extracts all URLs (including IP hostnames and shortened links). Never fetches links to prevent drive-by malware.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-mono text-xs font-bold">
              02
            </span>
            <h4 className="font-heading font-semibold text-xs text-white">Regex &amp; Heuristic Engine</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Scans for urgency triggers, OTP solicitations, unencrypted HTTP, advance fee demands, and brand lookalike domain masquerades.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <span className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-mono text-xs font-bold">
              03
            </span>
            <h4 className="font-heading font-semibold text-xs text-white">Gemini 3.8 Flash AI</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Optional deep reasoning layer evaluates semantic subtlety, psychological extortion, and cross-examines deceptive context safely server-side.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold">
              04
            </span>
            <h4 className="font-heading font-semibold text-xs text-white">Explainable Output</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Calculates 0–100 risk score, surfaces matched evidence quotes, maps suspected category, and suggests verifiable mitigation steps.
            </p>
          </div>
        </div>
      </div>

      {/* Resume & Interview Pitch Guide */}
      <div className="glass-panel-elevated rounded-2xl p-6 sm:p-8 border border-indigo-800/40 bg-gradient-to-br from-indigo-950/20 via-slate-900/60 to-slate-950 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <Lightbulb className="w-5 h-5" />
          <h3 className="text-base font-heading font-bold text-white">How to Pitch This Project on Your GitHub, Resume &amp; Interviews</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          When sharing this project on LinkedIn, GitHub, or answering "Tell me about a project you built" in technical interviews, use these proven framing points:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <strong className="text-white block font-heading">Key Technical Accomplishment:</strong>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              "Built an Explainable AI cybersecurity platform combining a deterministic rule engine with Gemini 3.8 Flash LLM cross-verification. Achieved 100% precision and recall across 20 synthetic benchmark test cases with sub-millisecond local execution."
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <strong className="text-white block font-heading">Privacy &amp; Security Engineering:</strong>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              "Engineered strict zero-persistence safety boundaries: submissions are processed in-memory without persistent database storage, links are statically inspected without automatic URL fetching to prevent drive-by attacks, and secrets are strictly kept server-side."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
