import type { AnalysisResult, RedFlag, RiskLevel, ScamType } from '../types/analysis.ts';

interface PatternRule {
  title: string;
  explanation: string;
  regex: RegExp;
  score: number;
  severity: 'critical' | 'warning' | 'caution';
}

const PATTERNS: PatternRule[] = [
  {
    title: 'Urgency or pressure',
    explanation: 'The message pressures you to act immediately instead of giving you time to independently verify.',
    regex: /\b(immediately|urgent|urgently|within \d+ minutes?|right now|act now|last warning|final notice|today only|will be blocked|suspended in|disconnected today)\b/i,
    score: 18,
    severity: 'warning'
  },
  {
    title: 'Credential or OTP request',
    explanation: 'It mentions credentials, passwords, PINs, or one-time codes, which legitimate organizations never solicit unexpectedly.',
    regex: /\b(otp|one[- ]time password|password|pin number|share your pin|login details|verify your password|share your otp)\b/i,
    score: 26,
    severity: 'critical'
  },
  {
    title: 'Unexpected prize or reward',
    explanation: 'Unexpected prizes, lottery wins, or unprompted selection claims are classic lures to extract advance fees.',
    regex: /\b(you (have )?won|winner|claim your prize|lottery|reward of|free gift|congratulations.*(won|selected))\b/i,
    score: 18,
    severity: 'warning'
  },
  {
    title: 'Payment or fee demand',
    explanation: 'The message demands an upfront transfer, refundable fee, or registration payment before delivering a benefit.',
    regex: /\b(pay (now|a |the )?(refundable|registration|processing|release|application)?\s*fee|send money|transfer funds|pay ₹|pay rs\.?|deposit to unlock|deposit now|registration fee|processing fee|release fee|refundable fee|pay small|pay now)\b/i,
    score: 20,
    severity: 'warning'
  },
  {
    title: 'Threat or fear tactic',
    explanation: 'Threats of immediate account blocking, legal action, fines, or service cutoff are crafted to induce anxiety and panic.',
    regex: /\b(account will be blocked|account blocked|legal action|arrest warrant|fine will|police case|service will be suspended|disconnected today|will be cancelled|avoid suspension|avoid legal action)\b/i,
    score: 18,
    severity: 'critical'
  },
  {
    title: 'Unusually attractive offer or job lure',
    explanation: 'Guaranteed daily income, remote work paying unusually high sums, or risk-free profits are characteristic signs of employment fraud.',
    regex: /\b(guaranteed returns|double your money|earn \d+[%₹]|earning ₹\d+|risk[- ]free profit|work from home.*(earn|guaranteed)|easy money|guaranteed ₹\d+|daily.*pay a registration)\b/i,
    score: 18,
    severity: 'warning'
  },
  {
    title: 'Sensitive information request',
    explanation: 'Requests for bank cards, Aadhaar, CVV, or personal documents should only ever be entered on verified, self-accessed portals.',
    regex: /\b(aadhaar|cvv|card number|bank details|kyc update|social security|identity documents|send your card|complete kyc)\b/i,
    score: 20,
    severity: 'critical'
  },
  {
    title: 'Tech support or remote access trap',
    explanation: 'Unsolicited malware warnings directing you to phone a support number or install remote desktop software (e.g., AnyDesk, TeamViewer) to hijack devices.',
    regex: /\b(virus detected|infected|malware|call (our )?(technical )?support|install remote access|remote access software|remote desktop|anydesk|teamviewer)\b/i,
    score: 24,
    severity: 'critical'
  },
  {
    title: 'Suspicious-looking URL or raw IP',
    explanation: 'The link directs to a raw numerical IP address or shortened redirector (bit.ly, tinyurl), masking the true destination.',
    regex: /https?:\/\/(?:\d{1,3}\.){3}\d{1,3}|(?:\b|^)(?:bit\.ly|tinyurl\.com|t\.co|is\.gd|cutt\.ly)\/[a-zA-Z0-9_\-]+/i,
    score: 16,
    severity: 'warning'
  },
  {
    title: 'Non-HTTPS unencrypted link',
    explanation: 'The link uses insecure HTTP instead of encrypted HTTPS. While HTTPS alone does not guarantee security, HTTP is a clear danger sign.',
    regex: /http:\/\//i,
    score: 10,
    severity: 'caution'
  },
  {
    title: 'Impersonation language',
    explanation: 'The sender claims to represent a recognized financial institution, government body, utility, or tech platform.',
    regex: /\b(bank|sbi|hdfc|icici|axis|rbi|income tax|customs|courier|parcel|amazon|google|microsoft|government|police|electricity service)\b/i,
    score: 6,
    severity: 'caution'
  }
];

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 75) return 'HIGH';
  if (score >= 50) return 'SUSPICIOUS';
  if (score >= 25) return 'MEDIUM';
  return 'LOW';
}

export function getScamType(text: string): ScamType {
  if (/\b(technical support|virus detected|call support|remote access|remote access software)\b/i.test(text)) return 'TECH_SUPPORT';
  if (/\b(invest|crypto|trading|guaranteed returns|double your money|stock tips|deposit now to unlock)\b/i.test(text)) return 'INVESTMENT';
  if (/\b(job|hiring|recruit|work from home|salary|interview|registration fee|earning ₹|earn.*daily)\b/i.test(text)) return 'JOB';
  if (/\b(parcel|delivery|courier|shipment|reschedule delivery|on hold)\b/i.test(text)) return 'DELIVERY';
  if (/\b(lottery|winner|prize|won ₹|reward of)\b/i.test(text)) return 'LOTTERY';
  if (/\b(electricity service|disconnected|refund|payment|processing fee|pay now|transfer money)\b/i.test(text)) return 'PAYMENT';
  if (/\b(kyc|bank|sbi|account.*blocked|card number|cvv)\b/i.test(text)) return 'BANKING';
  if (/\b(otp|password|login here|verify your account|phishing)\b/i.test(text)) return 'PHISHING';
  if (/\b(romance|love you|send money.*relationship)\b/i.test(text)) return 'ROMANCE';
  return 'OTHER';
}

export function extractAllUrls(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s<>()"']+|(?:\b)(?:bit\.ly|tinyurl\.com|t\.co)\/[^\s<>()"']+/gi);
  return matches ? Array.from(new Set(matches)) : [];
}

export function analyzeWithRules(input: string): AnalysisResult {
  const text = input.trim();
  if (!text) {
    return {
      riskScore: 0,
      riskLevel: 'LOW',
      scamType: 'OTHER',
      summary: 'No content provided for analysis.',
      redFlags: [],
      recommendedActions: ['Paste a message, email, or URL into the scanner.'],
      signals: [],
      analysisMode: 'rules',
      disclaimer: 'This is an automated risk assessment, not a definitive verdict.'
    };
  }

  const found: RedFlag[] = [];
  const heuristicBreakdown: { [category: string]: number } = {};
  let score = 0; // deterministic baseline

  for (const p of PATTERNS) {
    const match = text.match(p.regex);
    if (match && !found.some(f => f.title === p.title)) {
      score += p.score;
      heuristicBreakdown[p.title] = p.score;
      found.push({
        title: p.title,
        explanation: p.explanation,
        evidence: match[0].slice(0, 100),
        severity: p.severity
      });
    }
  }

  // URL inspection
  const urls = extractAllUrls(text);
  for (const raw of urls) {
    try {
      const normalized = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `http://${raw}`;
      const u = new URL(normalized);
      const host = u.hostname.toLowerCase();
      const textLower = text.toLowerCase();
      const brandLike = /sbi|hdfc|icici|axis|amazon|google|microsoft|paytm|uidai|india-post|netflix|apple|paypal/.test(textLower);
      const lookalike = /secure|verify|login|update|kyc|account|claim|service/.test(host) && brandLike;
      const suspiciousTlds = /\.(xyz|top|work|click|link|buzz|monster|fit|tk|ml|ga|cf|gq)$/i.test(host);

      if ((lookalike || suspiciousTlds) && !found.some(f => f.title === 'Possible brand/domain mismatch')) {
        score += 18;
        heuristicBreakdown['Domain Mismatch'] = 18;
        found.push({
          title: 'Possible brand/domain mismatch',
          explanation: `The hostname '${host}' looks like an imitation domain masquerading as an official service.`,
          evidence: host,
          severity: 'critical'
        });
      }

      if (host.split('.').length > 4 && !found.some(f => f.title === 'Unusually complex hostname')) {
        score += 6;
        heuristicBreakdown['Complex Hostname'] = 6;
        found.push({
          title: 'Unusually complex hostname',
          explanation: 'Multiple nested subdomains obscure the destination domain.',
          evidence: host,
          severity: 'caution'
        });
      }
    } catch {
      // Ignored malformed
    }
  }

  // Cap score 0-100
  score = Math.max(0, Math.min(100, score));
  const riskLevel = getRiskLevel(score);

  const recommendedActions: string[] = 
    riskLevel === 'HIGH' || riskLevel === 'SUSPICIOUS'
      ? [
          'DO NOT click links, download attachments, or call the phone number provided.',
          'Never disclose OTPs, banking PINs, CVV codes, or passwords under any circumstances.',
          'Verify the claim independently by opening the official company app or typing the known URL into a fresh browser tab.',
          'If you already shared financial credentials or paid money, freeze your card/account immediately via your official banking app and report to your local cybercrime portal.'
        ]
      : riskLevel === 'MEDIUM'
        ? [
            'Pause and do not act immediately. Scammers count on quick emotional reactions.',
            'Verify the sender by contacting them through an established, separate contact method.',
            'Confirm payment requests or account changes with the organization directly.'
          ]
        : [
            'No high-risk scam indicators were triggered by these common heuristic rules.',
            'Remember: a low risk score is not a 100% guarantee that a message or website is safe.',
            'Always inspect sender email addresses and avoid entering credentials unless you initiated the transaction.'
          ];

  return {
    riskScore: score,
    riskLevel,
    scamType: getScamType(text),
    summary: found.length
      ? `Detected ${found.length} suspicious signal${found.length === 1 ? '' : 's'}. Review the red flags and evidence below before taking any action.`
      : 'This quick check found few common scam patterns. However, sophisticated targeted attacks can mimic normal correspondence.',
    redFlags: found,
    recommendedActions,
    signals: found.map(f => f.title),
    analysisMode: 'rules',
    disclaimer: 'This heuristic assessment uses pattern matching and domain signals. It does not provide absolute legal or cybersecurity guarantees. Always exercise caution.',
    extractedUrls: urls,
    heuristicBreakdown
  };
}
