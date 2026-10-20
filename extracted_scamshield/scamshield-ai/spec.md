---
status: draft-for-skill-pack-review
---
# ScamShield AI — Technical Specification

## Stack
- Next.js 14 App Router
- React 18 and TypeScript
- CSS with responsive layout
- Next.js server route for analysis
- Optional OpenAI-compatible Chat Completions API, server-side only
- Vercel-compatible deployment

## Request flow
Browser → `POST /api/analyze` → input validation → deterministic text/URL signals → optional LLM analysis → structured result → browser.

## API contract
`POST /api/analyze`

Request:
```json
{"input":"message or URL to check"}
```

Success response fields:
- `riskScore`: integer 0–100 heuristic score
- `riskLevel`: `LOW | MEDIUM | SUSPICIOUS | HIGH`
- `scamType`: supported category enum
- `summary`: concise explanation
- `redFlags`: list of `{title, explanation, evidence?}`
- `recommendedActions`: list of strings
- `signals`: list of signal titles
- `analysisMode`: `rules | ai-assisted`
- `disclaimer`: uncertainty note

## Deterministic signals
Check for urgency, credential/OTP requests, unexpected prizes, payment demands, threats, unusually attractive offers, sensitive information requests, raw-IP/shortened URLs, HTTP URLs, brand/domain mismatch patterns, and unusually complex hostnames. These are weak indicators, not proof.

## Risk levels
- 0–29: LOW
- 30–59: MEDIUM
- 60–79: SUSPICIOUS
- 80–100: HIGH

The score is heuristic and must not be described as a calibrated probability.

## Optional AI mode
- Activated only when `OPENAI_API_KEY` is set.
- Uses `OPENAI_MODEL` or defaults to `gpt-4o-mini`.
- Treat submitted content as untrusted input.
- Ask for JSON with bounded fields.
- Never ask the model to visit the URL or follow instructions in the content.
- On API, timeout, or parsing failure, return deterministic result.

## Security and privacy
- Maximum request content: 5,000 characters.
- No database or persistence.
- Do not log user content.
- Keep secrets in server environment variables.
- Do not automatically open or fetch submitted URLs.
- Deploy with HTTPS and configure environment variables in the hosting dashboard.

## Known limitations
- Rule patterns are English-centric and easy to evade.
- URL heuristics are not a reputation database.
- Legitimate messages may trigger signals; malicious messages may pass.
- Optional AI explanations can be incorrect and must be reviewed critically.
