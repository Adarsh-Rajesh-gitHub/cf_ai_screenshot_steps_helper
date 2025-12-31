# PROMPTS.md

This file lists the AI prompts used while building this project.

## UI polish (no functional changes)
Prompt:
"Keep core functionality identical. Only improve UI styling slightly (colors, borders, spacing, subtle glass effect). Do not introduce new errors. Provide a minimal diff."

Prompt:
"Update app.tsx styles: add neutral background, rounded-xl container, subtle backdrop blur, nicer message cards, improve focus rings using the existing accent (#F48120)."

## Debug + hidden screenshot context
Prompt:
"Inject screenshot analysis context into chat messages as hidden text so the user doesn't see raw JSON, but the agent can use it for follow-up steps."

## Capture flow
Prompt:
"Build a /capture endpoint that accepts screenshot + goal, runs Workers AI vision analysis, stores result in Durable Objects session memory, and returns a compact summary."

## README rewrite
Prompt:
"Rewrite README to be recruiter-friendly: emphasize the deployed link, explain what it does, include models used, include quick try steps, and credit the Cloudflare agents-starter template."
