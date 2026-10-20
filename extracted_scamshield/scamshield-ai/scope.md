---
status: draft-for-skill-pack-review
---
# ScamShield AI — Scope

## Problem
People receive suspicious messages, emails, job offers, and links but may not recognize urgency, impersonation, credential requests, or payment pressure. A bare “scam/not scam” label often fails to explain what to do next.

## Solution
ScamShield AI is a responsive web proof of concept that analyzes user-pasted content, surfaces warning signals, estimates a risk score, explains findings, and recommends safe next steps. It uses deterministic rules by default and can optionally add an LLM-generated explanation when a server-side API key is configured.

## Target users
- Everyday internet users and students
- Families helping less-technical relatives
- People checking unexpected payment, delivery, job, or account messages

## Core journey
1. Paste suspicious text or a URL.
2. Choose Analyze.
3. Review risk score and category.
4. Inspect evidence-backed warning signals.
5. Follow safe verification actions.

## In scope
- Responsive web interface
- Text and URL signal checks
- Risk score and risk level
- Scam category estimate
- Explainable red flags
- Practical safety actions
- Optional server-side LLM assistance
- Synthetic test cases and documentation

## Out of scope
- Guaranteed scam detection or calibrated probability
- Automatic link opening/crawling
- Browser extension or mobile app
- Automatic SMS/email monitoring
- Accounts, payments, or database storage
- Law-enforcement reporting or bank integrations

## Definition of done
- User can submit up to 5,000 characters and receive a structured result.
- Empty and oversized inputs are handled.
- The app works without an AI API key using local rules.
- The UI explains uncertainty and gives safety advice.
- Build and test checks pass in a configured Node environment.
- README explains setup, testing, limitations, and deployment.

## Success criteria
A first-time user can identify the assessment, understand the signals, and find a safe next step from one result screen. Evaluation must track false positives and false negatives; do not publish accuracy claims without evidence.
