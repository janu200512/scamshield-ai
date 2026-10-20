import { analyzeWithRules } from './analyzer.ts';
import { EVALUATION_CASES } from '../data/evaluation_cases.ts';
import type { EvaluationCase, AnalysisResult } from '../types/analysis.ts';

export interface BenchmarkCaseResult {
  id: string;
  label: 'scam' | 'legitimate';
  category: string;
  input: string;
  analysis: AnalysisResult;
  predictedAsScam: boolean;
  isCorrect: boolean;
  classification: 'TP' | 'FP' | 'TN' | 'FN';
}

export interface BenchmarkSummary {
  totalCases: number;
  scamCases: number;
  legitimateCases: number;
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  results: BenchmarkCaseResult[];
}

export function runBenchmark(cases: EvaluationCase[] = EVALUATION_CASES): BenchmarkSummary {
  const results: BenchmarkCaseResult[] = cases.map(testCase => {
    const analysis = analyzeWithRules(testCase.input);
    // Score threshold: >= 30 is considered suspicious or scam risk
    const predictedAsScam = analysis.riskScore >= 30 || analysis.riskLevel !== 'LOW';
    const actualIsScam = testCase.label === 'scam';

    let classification: 'TP' | 'FP' | 'TN' | 'FN';
    if (actualIsScam && predictedAsScam) classification = 'TP';
    else if (!actualIsScam && predictedAsScam) classification = 'FP';
    else if (!actualIsScam && !predictedAsScam) classification = 'TN';
    else classification = 'FN';

    const isCorrect = (actualIsScam && predictedAsScam) || (!actualIsScam && !predictedAsScam);

    return {
      id: testCase.id,
      label: testCase.label,
      category: testCase.category,
      input: testCase.input,
      analysis,
      predictedAsScam,
      isCorrect,
      classification
    };
  });

  const truePositives = results.filter(r => r.classification === 'TP').length;
  const falsePositives = results.filter(r => r.classification === 'FP').length;
  const trueNegatives = results.filter(r => r.classification === 'TN').length;
  const falseNegatives = results.filter(r => r.classification === 'FN').length;

  const totalCases = results.length;
  const scamCases = cases.filter(c => c.label === 'scam').length;
  const legitimateCases = cases.filter(c => c.label === 'legitimate').length;

  const accuracy = totalCases > 0 ? (truePositives + trueNegatives) / totalCases : 0;
  const precision = (truePositives + falsePositives) > 0 ? truePositives / (truePositives + falsePositives) : 0;
  const recall = (truePositives + falseNegatives) > 0 ? truePositives / (truePositives + falseNegatives) : 0;
  const f1Score = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return {
    totalCases,
    scamCases,
    legitimateCases,
    truePositives,
    falsePositives,
    trueNegatives,
    falseNegatives,
    accuracy: Math.round(accuracy * 100),
    precision: Math.round(precision * 100),
    recall: Math.round(recall * 100),
    f1Score: Math.round(f1Score * 100),
    results
  };
}
