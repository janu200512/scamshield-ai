import React, { useState } from 'react';
import { Navbar, type ActiveTab } from './components/Navbar.tsx';
import { AnalyzerView } from './components/AnalyzerView.tsx';
import { BenchmarkView } from './components/BenchmarkView.tsx';
import { GithubAuditView } from './components/GithubAuditView.tsx';
import { RealWorldGuideView } from './components/RealWorldGuideView.tsx';
import { ShieldCheck, Heart, Github, Terminal, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('analyzer');
  const [initialAnalyzerInput, setInitialAnalyzerInput] = useState<string>('');

  const handleLoadTestCase = (text: string) => {
    setInitialAnalyzerInput(text);
    setActiveTab('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen cyber-bg grid-pattern text-slate-100 flex flex-col selection:bg-blue-500/30 selection:text-blue-200">
      {/* Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content View */}
      <main className="flex-1">
        {activeTab === 'analyzer' && (
          <AnalyzerView initialInput={initialAnalyzerInput} key={initialAnalyzerInput} />
        )}
        {activeTab === 'benchmark' && (
          <BenchmarkView onLoadTestCase={handleLoadTestCase} />
        )}
        {activeTab === 'github' && (
          <GithubAuditView />
        )}
        {activeTab === 'realworld' && (
          <RealWorldGuideView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060911]/90 py-8 px-4 text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-heading font-bold text-white">ScamShield AI</span>
            <span className="text-slate-500">•</span>
            <span>Pause. Check. Protect.</span>
          </div>

          <div className="text-center md:text-right space-y-1">
            <p className="text-[11px] text-slate-400">
              Empowering digital citizens with transparent, explainable fraud detection.
            </p>
            <p className="text-[10px] text-slate-500">
              Heuristic scores are for awareness and verification guidance, not absolute legal guarantees.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
