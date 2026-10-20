---
status: draft-for-skill-pack-review
---
# ScamShield AI — Product Requirements Document

## Product goal
Help users pause before acting on suspicious digital messages by explaining warning signs in accessible language.

## Primary screen
- Product identity and concise value proposition
- Text area for message/email/URL
- Sample inputs for banking, job, delivery, and ordinary messages
- Analyze button with loading state
- Input length counter, clear control, and friendly error state
- Privacy warning not to paste credentials or OTPs

## Results
- Score from 0–100 explicitly described as a heuristic risk score
- Risk label: Low, Medium, Suspicious, High
- Suspected category
- Signals with short explanations and matched evidence where available
- Plain-language summary
- Safe actions appropriate to the result
- Uncertainty disclaimer
- Copy assessment and new-check actions

## Functional requirements
1. Validate non-empty input and enforce a 5,000-character limit.
2. Analyze text with deterministic signals even if no AI credentials are configured.
3. Optionally call an LLM from the server, never directly from the browser.
4. Validate and constrain AI output before returning it.
5. Fall back to rules-only results if the optional AI service fails.
6. Never open or fetch user-submitted URLs automatically.
7. Do not store user submissions in a database.

## Accessibility and responsive behavior
- Semantic labels and buttons
- Visible loading and error states
- Mobile-friendly single-column layout
- High-contrast text and keyboard-operable controls

## Non-functional requirements
- API key remains server-side
- Avoid logging submitted content
- Results should be useful without optional external services
- Explain that a score is not a guarantee

## Future ideas, not MVP commitments
- Multi-language support
- Reputation API integration with privacy review
- User-controlled reporting flow
- Evaluation dashboard based on a labeled dataset
