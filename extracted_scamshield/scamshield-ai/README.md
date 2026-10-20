# ScamShield AI — Pause. Check. Protect.

ScamShield AI is a responsive scam-awareness proof of concept. Paste a suspicious message, email, or URL to see a heuristic risk score, suspected category, explainable warning signals, and practical next steps.

> **Important:** This tool does not prove whether content is safe or malicious. Scores are heuristic, not calibrated probabilities. Never share OTPs, passwords, PINs, CVVs, or private information with anyone who contacts you unexpectedly.

## Features
- Responsive dark cybersecurity UI
- Message and URL signal analysis
- Risk score and risk level
- Suspected scam category
- Explainable red flags with matched evidence where available
- Practical safety recommendations
- Works without an AI key using deterministic rules
- Optional server-side LLM-assisted explanation
- No database or user account; the app does not persist submissions

## Requirements
- Node.js 18.17+ (Node.js 20 LTS recommended)
- npm

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The app works without setting an API key. To enable optional AI-assisted analysis, set `OPENAI_API_KEY` in `.env.local`. Optionally set `OPENAI_MODEL` (default `gpt-4o-mini`). Never put secrets in client-side code or commit `.env.local`.

## Production build

```bash
npm run build
npm start
```

## Deploy to Vercel
1. Push this project to a public GitHub repository.
2. Import the repository into Vercel.
3. Keep the detected Next.js settings.
4. Optional: add `OPENAI_API_KEY` and `OPENAI_MODEL` in Vercel Project Settings → Environment Variables.
5. Deploy, then test both the rules-only flow and AI-assisted flow if configured.

## API
`POST /api/analyze`

```json
{"input":"Your account will be blocked. Verify now at http://example.test"}
```

The endpoint rejects empty input and content over 5,000 characters. It never fetches submitted URLs. If the optional AI service is unavailable, it falls back to deterministic signals.

## Evaluation cases
`data/evaluation_cases.json` contains 10 synthetic scam-like and 10 synthetic ordinary examples. These are starter test cases, not a validated benchmark. Record false positives and false negatives before making any accuracy claim.

## Planning documents
- `scope.md` — scope and definition of done
- `prd.md` — user-facing requirements
- `spec.md` — technical behavior and API contract
- `checklist.md` — testing and submission checklist

These documents are drafts for review. If submitting to a hackathon that requires the Devpost Learn Skill Pack, run its official workflow and update these files to reflect the actual process; do not claim the workflow was run if it was not.

## Known limitations
- English-focused keyword rules are easy to evade.
- A URL pattern is not a reputation check.
- Legitimate messages may trigger warnings; scams may be missed.
- Optional AI output can be wrong or inconsistent.
- The app is an awareness aid, not a replacement for official verification.

## License
Add an open-source license before public release, after choosing terms appropriate for this project.
