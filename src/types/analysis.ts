export type RiskLevel = 'LOW' | 'MEDIUM' | 'SUSPICIOUS' | 'HIGH';

export type ScamType = 
  | 'PHISHING' 
  | 'BANKING' 
  | 'JOB' 
  | 'INVESTMENT' 
  | 'DELIVERY' 
  | 'LOTTERY' 
  | 'TECH_SUPPORT' 
  | 'ROMANCE' 
  | 'PAYMENT' 
  | 'OTHER';

export interface RedFlag {
  title: string;
  explanation: string;
  evidence?: string;
  severity?: 'critical' | 'warning' | 'caution';
}

export interface AnalysisResult {
  riskScore: number;
  riskLevel: RiskLevel;
  scamType: ScamType;
  summary: string;
  redFlags: RedFlag[];
  recommendedActions: string[];
  signals: string[];
  analysisMode: 'rules' | 'ai-assisted';
  disclaimer: string;
  extractedUrls?: string[];
  heuristicBreakdown?: { [category: string]: number };
}

export interface EvaluationCase {
  id: string;
  label: 'scam' | 'legitimate';
  category: string;
  input: string;
}
