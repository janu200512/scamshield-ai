import type { AnalysisResult, RedFlag, RiskLevel, ScamType } from '@/types/analysis';

const patterns: Array<{ title: string; explanation: string; regex: RegExp; score: number }> = [
  { title: 'Urgency or pressure', explanation: 'The message pressures you to act immediately instead of giving you time to verify.', regex: /\b(immediately|urgent|within \d+ minutes?|right now|act now|last warning|final notice|today only|will be blocked|suspended in)\b/i, score: 17 },
  { title: 'Credential or OTP request', explanation: 'It mentions credentials or one-time passwords, which should never be shared with someone who contacts you unexpectedly.', regex: /\b(otp|one[- ]time password|password|pin number|share your pin|login details|verify your password)\b/i, score: 24 },
  { title: 'Unexpected prize or reward', explanation: 'Unexpected prizes are commonly used to make people click links or pay fees.', regex: /\b(you (have )?won|winner|claim your prize|lottery|reward of|free gift|congratulations.*won)\b/i, score: 18 },
  { title: 'Payment or fee demand', explanation: 'The message asks for money or a fee, which should be independently verified.', regex: /\b(pay now|processing fee|release fee|send money|transfer funds|pay ₹|pay rs\.?|deposit to unlock|refundable fee)\b/i, score: 18 },
  { title: 'Threat or fear tactic', explanation: 'Threats about account closure, legal action, or penalties can be used to bypass careful thinking.', regex: /\b(account will be blocked|account blocked|legal action|arrest warrant|fine will|police case|service will be suspended)\b/i, score: 16 },
  { title: 'Unusually attractive offer', explanation: 'Guaranteed earnings or unusually large returns are common warning signs.', regex: /\b(guaranteed returns|double your money|earn \d+%|risk[- ]free profit|work from home.*earn|easy money)\b/i, score: 16 },
  { title: 'Sensitive information request', explanation: 'Requests for bank details, Aadhaar, card data, or personal information need careful verification.', regex: /\b(aadhaar|cvv|card number|bank details|kyc update|social security|identity documents)\b/i, score: 16 },
  { title: 'Suspicious-looking URL', explanation: 'The link uses a raw IP, URL shortener, or a hostname pattern that deserves extra scrutiny. This alone does not prove a scam.', regex: /https?:\/\/(?:\d{1,3}\.){3}\d{1,3}|bit\.ly\/|tinyurl\.com\/|t\.co\//i, score: 15 },
  { title: 'Non-HTTPS link', explanation: 'The link does not use HTTPS. That is a caution signal, but HTTPS by itself does not prove a site is safe.', regex: /http:\/\//i, score: 8 },
  { title: 'Impersonation language', explanation: 'The sender appears to speak on behalf of a bank, government body, delivery service, or platform; verify through its official app/site.', regex: /\b(bank|sbi|rbi|income tax|customs|courier|parcel|amazon|google|microsoft|government|police)\b/i, score: 5 }
];

function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'HIGH';
  if (score >= 60) return 'SUSPICIOUS';
  if (score >= 30) return 'MEDIUM';
  return 'LOW';
}
function getScamType(text: string): ScamType {
  if (/\b(kyc|bank|sbi|account.*blocked|otp|cvv|credit card|debit card)\b/i.test(text)) return 'BANKING';
  if (/\b(job|hiring|recruit|work from home|salary|interview|registration fee)\b/i.test(text)) return 'JOB';
  if (/\b(invest|crypto|trading|guaranteed returns|double your money|stock tips)\b/i.test(text)) return 'INVESTMENT';
  if (/\b(parcel|delivery|courier|shipment|reschedule delivery)\b/i.test(text)) return 'DELIVERY';
  if (/\b(lottery|winner|prize|won|reward)\b/i.test(text)) return 'LOTTERY';
  if (/\b(otp|password|login|verify your account|phishing)\b/i.test(text)) return 'PHISHING';
  if (/\b(technical support|virus detected|call support|remote access)\b/i.test(text)) return 'TECH_SUPPORT';
  if (/\b(refund|payment|processing fee|pay now|transfer money)\b/i.test(text)) return 'PAYMENT';
  if (/\b(romance|love you|send money.*relationship)\b/i.test(text)) return 'ROMANCE';
  return 'OTHER';
}

export function analyzeWithRules(input: string): AnalysisResult {
  const text = input.trim();
  const found: RedFlag[] = [];
  let score = 4;
  for (const p of patterns) {
    const match = text.match(p.regex);
    if (match && !found.some(f => f.title === p.title)) {
      score += p.score;
      found.push({ title: p.title, explanation: p.explanation, evidence: match[0].slice(0, 100) });
    }
  }
  const urls = text.match(/https?:\/\/[^\s<>()]+/gi) ?? [];
  for (const raw of urls) {
    try {
      const u = new URL(raw);
      const host = u.hostname.toLowerCase();
      const brandLike = /sbi|hdfc|icici|axis|amazon|google|microsoft|paytm|uidai|india-post/.test(text.toLowerCase());
      const lookalike = /secure|verify|login|update|kyc|account|claim/.test(host) && brandLike;
      if (lookalike && !found.some(f => f.title === 'Possible brand/domain mismatch')) {
        score += 18;
        found.push({ title: 'Possible brand/domain mismatch', explanation: 'The message mentions a recognizable organization, but the link hostname should be checked carefully against its official domain.', evidence: host });
      }
      if (host.split('.').length > 4 && !found.some(f => f.title === 'Unusually complex hostname')) {
        score += 6;
        found.push({ title: 'Unusually complex hostname', explanation: 'Several hostname segments can make a link harder to inspect. This is a weak signal, not proof of maliciousness.', evidence: host });
      }
    } catch { /* Ignore malformed URL here; input validation still permits ordinary text. */ }
  }
  score = Math.max(0, Math.min(100, score));
  const riskLevel = getRiskLevel(score);
  const recommendedActions = riskLevel === 'HIGH' || riskLevel === 'SUSPICIOUS'
    ? ['Do not click links or open attachments until verified.', 'Never share OTPs, passwords, PINs, or card security codes.', 'Verify through the organization’s official app or a website typed manually.', 'If you already paid or shared details, contact your bank/service provider immediately.']
    : riskLevel === 'MEDIUM'
      ? ['Pause before replying, paying, or clicking.', 'Verify the sender using a separate, trusted channel.', 'Never share OTPs or passwords in response to an unexpected message.']
      : ['No strong scam indicators were detected by this basic check.', 'Still verify unexpected requests independently.', 'A low score does not guarantee the message or website is safe.'];
  return {
    riskScore: score,
    riskLevel,
    scamType: getScamType(text),
    summary: found.length
      ? `Detected ${found.length} warning signal${found.length === 1 ? '' : 's'}. Review the evidence below before taking action.`
      : 'This quick check found few common scam signals. That does not prove the content is legitimate; context and sender verification still matter.',
    redFlags: found,
    recommendedActions,
    signals: found.map(f => f.title),
    analysisMode: 'rules',
    disclaimer: 'This is an automated risk assessment, not a definitive verdict. Scams can evade detection, and legitimate messages can trigger warning signals.'
  };
}
