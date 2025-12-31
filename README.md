# 🖼️ Screenshot Steps Helper (Cloudflare Agents + Workers AI)

**Live demo (no install needed):** https://agents-starter.adarshrajesh.workers.dev

A tiny **“screenshot → goal → click-by-click steps”** helper. Upload a screenshot + a one-sentence goal, then chat to get concrete navigation steps based on the stored screenshot analysis.
Usecases: Find where a setting/feature lives, Get click-by-click navigation for a goal, Identify key UI elements on the current screen, Compare what changed between screens, Complete common website tasks (update info, download, submit forms)

## Try it now
1. Open the live demo link above.
2. In Goal, type a one-sentence objective (at least 2 words), e.g. Check what Java problems I have solved.
3. Upload a screenshot (PNG/JPG) of the page you’re on.
4. Click **Send screenshot**, then ask in chat:
   - `What do you see on this screen?`
   - `What should I click next?`
   - `Give me step-by-step instructions to complete my goal`

## What it does
- **Capture:** Upload screenshot + goal
- **Analyze:** Workers AI vision summarizes screen + extracts UI elements
- **Guide:** Chat replies use the stored screenshot context (no re-upload needed)
- **Stateful:** Durable Objects store the latest analysis + history for consistent follow-ups

## Backend models used
- Vision: `@cf/meta/llama-3.2-11b-vision-instruct`
- Structure/Reasoning: `@cf/meta/llama-3.1-8b-instruct`

## How it works (high level)
- **/capture**: receives image+goal → runs vision → stores `last_result_json` in DO session memory  
- **Chat agent**: injects stored screenshot context as hidden text → returns click-by-click steps  
- **/session**: lets the UI verify what’s currently stored (useful for debugging)

## Tech
Cloudflare Agents SDK • Cloudflare Workers • Durable Objects • Workers AI • React/Vite • Tailwind

## Credit
Built from Cloudflare’s `agents-starter` template:
https://github.com/cloudflare/agents-starter
