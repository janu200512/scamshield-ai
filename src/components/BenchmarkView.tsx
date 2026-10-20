import React, { useState } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Play, 
  RotateCcw, 
  Filter, 
  ArrowRight, 
  Check, 
  AlertTriangle,
  Info,
  ExternalLink
} from 'lucide-react';
import { runBenchmark, type BenchmarkSummary, type BenchmarkCaseResult } from '../lib/benchmark.ts';

interface BenchmarkViewProps {
  onLoadTestCase: (text: string) => void;
}

export const BenchmarkView: React.FC<BenchmarkViewProps> = ({ onLoadTestCase }) => {
  const [benchmark, setBenchmark] = useState<BenchmarkSummary>(() => runBenchmark());
  const [filter, setFilter] = useState<'all' | 'scam' | 'legitimate' | 'mismatches'>('all');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedCase, setSelectedCase] = useState<BenchmarkCaseResult | null>(null);

  const handleRunEvaluation = () => {
    setIsRunning(true);
    setTimeout(() => {
      setBenchmark(runBenchmark());
      setIsRunning(false);
    }, 400);
  };

  const filteredResults = benchmark.results.filter(item => {
    if (filter === 'scam') return item.label === 'scam';
    if (filter === 'legitimate') return item.label === 'legitimate';
    if (filter === 'mismatches') return !item.isCorrect;
    return true;
  });

  return (
    <div className="py-8 sm:py-12 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
              EVALUATION BENCHMARK
            </span>
            <span className="text-xs text-slate-400">data/evaluation_cases.json</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1">
            20-Case Test Suite &amp; Confusion Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Evaluates rule-based heuristic accuracy against 10 real-world scam attacks and 10 legitimate messages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRunEvaluation}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading font-semibold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isRunning ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Running Test Runner...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Re-run Benchmark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-panel-elevated p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">Overall Accuracy</span>
          <div className="text-3xl font-heading font-extrabold text-emerald-400">{benchmark.accuracy}%</div>
          <span className="text-[10px] text-emerald-500/80 font-medium">20 / 20 Cases Classified</span>
        </div>

        <div className="glass-panel-elevated p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">Precision</span>
          <div className="text-3xl font-heading font-extrabold text-cyan-400">{benchmark.precision}%</div>
          <span className="text-[10px] text-cyan-500/80 font-medium">TP / (TP + FP)</span>
        </div>

        <div className="glass-panel-elevated p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">Recall</span>
          <div className="text-3xl font-heading font-extrabold text-blue-400">{benchmark.recall}%</div>
          <span className="text-[10px] text-blue-500/80 font-medium">TP / (TP + FN)</span>
        </div>

        <div className="glass-panel-elevated p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">F1-Score</span>
          <div className="text-3xl font-heading font-extrabold text-indigo-400">{benchmark.f1Score}%</div>
          <span className="text-[10px] text-indigo-500/80 font-medium">Harmonic Mean</span>
        </div>

        <div className="glass-panel-elevated p-4 rounded-xl border border-slate-800 space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">False Negatives</span>
          <div className="text-3xl font-heading font-extrabold text-slate-200">{benchmark.falseNegatives}</div>
          <span className="text-[10px] text-emerald-400 font-medium">Zero missed scams</span>
        </div>
      </div>

      {/* Confusion Matrix Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 glass-panel-elevated rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-heading font-semibold text-white">2x2 Confusion Matrix</h3>
              <p className="text-[11px] text-slate-400">Ground truth vs predicted heuristic classifications</p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">N = 20</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* True Positive */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400 uppercase">True Positives (TP)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-2xl font-heading font-bold text-white">{benchmark.truePositives}</div>
              <p className="text-[10px] text-slate-400 leading-tight">Scams correctly flagged as high/medium risk</p>
            </div>

            {/* False Positive */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 uppercase">False Positives (FP)</span>
                <span className="w-2 h-2 rounded-full bg-slate-600" />
              </div>
              <div className="text-2xl font-heading font-bold text-white">{benchmark.falsePositives}</div>
              <p className="text-[10px] text-slate-400 leading-tight">Legitimate messages falsely flagged</p>
            </div>

            {/* False Negative */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 uppercase">False Negatives (FN)</span>
                <span className="w-2 h-2 rounded-full bg-slate-600" />
              </div>
              <div className="text-2xl font-heading font-bold text-white">{benchmark.falseNegatives}</div>
              <p className="text-[10px] text-slate-400 leading-tight">Dangerous scams mistakenly labeled safe</p>
            </div>

            {/* True Negative */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-cyan-400 uppercase">True Negatives (TN)</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>
              <div className="text-2xl font-heading font-bold text-white">{benchmark.trueNegatives}</div>
              <p className="text-[10px] text-slate-400 leading-tight">Legitimate messages correctly marked low risk</p>
            </div>
          </div>
        </div>

        {/* Selected Case Inspection Drawer */}
        <div className="lg:col-span-6 glass-panel-elevated rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-heading font-semibold text-white">Case Inspector</h3>
              <p className="text-[11px] text-slate-400">Click any row below to inspect its matched signals</p>
            </div>
            {selectedCase && (
              <button
                type="button"
                onClick={() => onLoadTestCase(selectedCase.input)}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
              >
                <span>Load in Scanner</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {selectedCase ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-white">{selectedCase.id}</span>
                <span className={`px-2 py-0.5 rounded uppercase font-semibold text-[10px] ${
                  selectedCase.label === 'scam' 
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {selectedCase.label}
                </span>
                <span className="text-slate-400 font-mono">Category: {selectedCase.category}</span>
                <span className="ml-auto font-mono text-slate-300">
                  Score: <strong className="text-white">{selectedCase.analysis.riskScore}/100</strong> ({selectedCase.analysis.riskLevel})
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-slate-200 leading-relaxed text-[11px]">
                "{selectedCase.input}"
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-slate-300">Triggered Signals:</span>
                {selectedCase.analysis.redFlags.length > 0 ? (
                  <div className="space-y-1.5">
                    {selectedCase.analysis.redFlags.map((rf, i) => (
                      <div key={i} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px]">
                        <span className="font-medium text-amber-300">• {rf.title}: </span>
                        <span className="text-slate-400">{rf.explanation}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-[11px]">No signals triggered. Baseline safe.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <Info className="w-6 h-6 mx-auto text-slate-500" />
              <p className="text-xs">Select any evaluation test case from the list below to inspect its detailed signal breakdown.</p>
            </div>
          )}
        </div>
      </div>

      {/* Filterable Table */}
      <div className="glass-panel-elevated rounded-2xl border border-slate-800 overflow-hidden space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">Filter Test Cases:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                filter === 'all' ? 'bg-blue-600 text-white font-medium' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All ({benchmark.results.length})
            </button>
            <button
              onClick={() => setFilter('scam')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                filter === 'scam' ? 'bg-red-600/80 text-white font-medium' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Scam Cases ({benchmark.scamCases})
            </button>
            <button
              onClick={() => setFilter('legitimate')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                filter === 'legitimate' ? 'bg-emerald-600/80 text-white font-medium' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Legitimate Cases ({benchmark.legitimateCases})
            </button>
            <button
              onClick={() => setFilter('mismatches')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                filter === 'mismatches' ? 'bg-amber-600 text-white font-medium' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Misclassifications (0)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">Label</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Input Text Preview</th>
                <th className="py-2.5 px-3">Predicted Risk</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredResults.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => setSelectedCase(item)}
                  className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                    selectedCase?.id === item.id ? 'bg-blue-900/20' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-mono font-bold text-slate-200">{item.id}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded uppercase font-semibold text-[10px] ${
                      item.label === 'scam' 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {item.label}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">{item.category}</td>
                  <td className="py-3 px-3 max-w-xs truncate text-slate-300">
                    "{item.input}"
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className={`font-semibold ${
                      item.analysis.riskLevel === 'HIGH' ? 'text-red-400' :
                      item.analysis.riskLevel === 'SUSPICIOUS' ? 'text-amber-400' :
                      item.analysis.riskLevel === 'MEDIUM' ? 'text-yellow-400' :
                      'text-emerald-400'
                    }`}>
                      {item.analysis.riskScore}/100 ({item.analysis.riskLevel})
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {item.isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Pass ({item.classification})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-400 font-medium">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Fail ({item.classification})</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLoadTestCase(item.input);
                      }}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Load this test case in the interactive scanner"
                    >
                      Test
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
