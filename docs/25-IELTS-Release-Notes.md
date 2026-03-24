# IELTS Learning Track - Release Notes

- Version: `1.0.1`
- Updated: `2026-03-24`
- Status: `Release hardening in progress`

## Core Package

- Canonical Foundation file: `public/data/ielts-foundation.json`
- Compatibility mirror: `public/data/ielts-core-500.json`
- Vocabulary ID: `ielts-foundation`
- Foundation bundle count: `541`

## Topic Packs

| Topic | Count | File |
| --- | ---: | --- |
| Education | 124 | `public/data/ielts-topic-education.json` |
| Government | 108 | `public/data/ielts-topic-government.json` |
| Environment | 71 | `public/data/ielts-topic-environment.json` |
| Technology | 52 | `public/data/ielts-topic-technology.json` |
| Health | 53 | `public/data/ielts-topic-health.json` |
| Work | 32 | `public/data/ielts-topic-work.json` |
| Media | 32 | `public/data/ielts-topic-media.json` |
| Crime | 26 | `public/data/ielts-topic-crime.json` |

## AI Runtime

- Provider: `SiliconFlow`
- Model: `Qwen/Qwen2.5-72B-Instruct`
- Browser route: `/api/ai/chat`
- Server env key: `SILICONFLOW_API_KEY`
- Upstream base URL: `https://api.siliconflow.cn/v1`

Behavior:

- Local development uses a Vite proxy middleware for `/api/ai/chat`.
- Production deploys use a Netlify function behind the same route.
- API keys remain local-only and are not synced to the backend.
- Old StepFun / OpenRouter production wiring has been removed from the active client path.

## Validation Commands

```bash
npm run build
npm run audit:real
node scripts/qa-validate-bundles.js public/data/ielts-foundation.json
node scripts/qa-validate-bundles.js public/data/ielts-core-500.json
```

## Current Quality Gates

```text
genericDefinitions: 0
blankIpa: 0
chineseIssues: 0
weakParaphrases: 0
templateContexts: 0
badCollocations: 0
```

## Follow-ups

1. Finish the remaining visual spacing cleanup in the IELTS learning track UI.
2. Browser-smoke the SiliconFlow-backed AI actions through the new proxy route.
3. Continue expanding weak topic packs only through high-quality sources.
