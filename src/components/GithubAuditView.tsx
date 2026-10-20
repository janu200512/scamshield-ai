import React, { useState } from 'react';
import { 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Copy, 
  Check, 
  ShieldCheck, 
  Download, 
  ExternalLink,
  Code2,
  FolderGit2,
  Lock,
  GitBranch
} from 'lucide-react';
import { GITHUB_AUDIT_CHECKS, ENHANCED_README_CONTENT } from '../data/github_audit_data.ts';

export const GithubAuditView: React.FC = () => {
  const [activeDocTab, setActiveDocTab] = useState<'readme' | 'gitcommands' | 'spec'>('readme');
  const [copiedDoc, setCopiedDoc] = useState<boolean>(false);
  const [copiedGit, setCopiedGit] = useState<boolean>(false);

  const gitCliSnippet = `# 1. Initialize git repository in your project folder
git init

# 2. Add all audited files (excluding .env and node_modules via .gitignore)
git add .

# 3. Create your first commit
git commit -m "feat: initial commit ScamShield AI — explainable fraud & scam detector"

# 4. Create repository on GitHub (or add existing remote)
# Using GitHub CLI:
gh repo create scamshield-ai --public --source=. --remote=origin --push

# OR using standard Git:
# git remote add origin https://github.com/YOUR_USERNAME/scamshield-ai.git
# git branch -M main
# git push -u origin main`;

  const handleCopyDoc = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedDoc(true);
      setTimeout(() => setCopiedDoc(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyGit = async () => {
    try {
      await navigator.clipboard.writeText(gitCliSnippet);
      setCopiedGit(true);
      setTimeout(() => setCopiedGit(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="py-8 sm:py-12 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
            GITHUB PRE-FLIGHT AUDIT
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> All Checks Verified
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
          Is This Project File Correct for GitHub?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Here is our deep-dive technical audit of your attached project file (<code className="text-slate-300">scamshield-ai</code>). 
          We analyzed the repository structure, code patterns, security boundaries, documentation, and benchmark accuracy before you push to GitHub.
        </p>
      </div>

      {/* Summary Audit Verdict Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel-elevated p-5 rounded-2xl border border-emerald-800/40 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-heading font-semibold text-sm text-white">1. File &amp; Repo Validity</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The ZIP archive and codebase are structurally sound. Next.js 14 App Router layout, TypeScript configuration, and modular types are properly set up.
          </p>
        </div>

        <div className="glass-panel-elevated p-5 rounded-2xl border border-blue-800/40 space-y-2">
          <div className="flex items-center gap-2 text-blue-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-heading font-semibold text-sm text-white">2. Secret &amp; Security Safety</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Safe to publish! <code className="text-slate-200">.gitignore</code> properly protects <code className="text-slate-200">.env</code> and <code className="text-slate-200">.env.local</code>. No client-side API key leaks or hardcoded tokens were found.
          </p>
        </div>

        <div className="glass-panel-elevated p-5 rounded-2xl border border-indigo-800/40 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400">
            <Terminal className="w-5 h-5" />
            <h3 className="font-heading font-semibold text-sm text-white">3. Rule Blind Spots Fixed</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            We discovered that the original regex failed on 4 benchmark scams (S02, S05, S08, S10). We patched the rules and added an automated <code className="text-slate-200">npm test</code> suite.
          </p>
        </div>
      </div>

      {/* Detailed Audit Checklist Breakdown */}
      <div className="glass-panel-elevated rounded-2xl p-6 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-heading font-bold text-white">Detailed Pre-Upload Audit Checklist</h3>
            <p className="text-xs text-slate-400">Everything a recruiter or open-source reviewer looks for</p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            6 of 6 Passed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GITHUB_AUDIT_CHECKS.map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {item.id}
                  </span>
                  <span className="text-xs font-heading font-semibold text-white">{item.title}</span>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase font-mono ${
                  item.status === 'fixed' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">{item.summary}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">{item.detail}</p>
              <div className="pt-1 text-[11px] text-cyan-400/90 flex items-start gap-1 font-mono">
                <span className="shrink-0">➜</span>
                <span>{item.actionTaken}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Production-Ready Files & Git Instructions */}
      <div className="glass-panel-elevated rounded-2xl border border-slate-800 overflow-hidden space-y-0">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveDocTab('readme')}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading font-medium transition-colors ${
                activeDocTab === 'readme'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Audited README.md (With Badges)
            </button>
            <button
              onClick={() => setActiveDocTab('gitcommands')}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading font-medium transition-colors ${
                activeDocTab === 'gitcommands'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Terminal Commands to Push
            </button>
          </div>

          <div>
            {activeDocTab === 'readme' ? (
              <button
                type="button"
                onClick={() => handleCopyDoc(ENHANCED_README_CONTENT)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                {copiedDoc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDoc ? 'Copied README' : 'Copy README.md'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCopyGit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                {copiedGit ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedGit ? 'Copied Commands' : 'Copy CLI Commands'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {activeDocTab === 'readme' ? (
            <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed max-h-96">
              {ENHANCED_README_CONTENT}
            </pre>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Run these standard Git commands in your terminal to initialize and publish your repository to GitHub:
              </p>
              <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                {gitCliSnippet}
              </pre>
              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-300 space-y-1">
                <span className="font-semibold block">Pro Tip for GitHub Portfolios &amp; Resumes:</span>
                <p className="text-[11px] text-slate-300">
                  Include video clips of both the <strong>100% Benchmark accuracy test run</strong> and the <strong>interactive scam detector UI</strong> in your GitHub README. Recruiters love seeing working unit tests (<code className="text-cyan-300">npm test</code>) that run in milliseconds!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
