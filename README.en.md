# VocabMan

<p align="center">
  <img src="./public/icon.svg" alt="VocabMan logo" width="96" />
</p>

<p align="center"><strong>Context-first vocabulary learning for IELTS-focused learners.</strong></p>

## Overview

VocabMan is a vocabulary-learning app for Chinese learners who want a more practical path from broad exposure to IELTS-ready lexical control.

The current repository goes beyond word lists. It now includes a rebuilt IELTS learning track, structured bundle data, output-oriented practice flows, and a safer production AI integration path.

## Repo Health

- Live product: [https://vocabman.netlify.app](https://vocabman.netlify.app)
- Frontend: `Vue 3` + `Vite` + `Tailwind CSS`
- Sync/Auth: `Supabase`
- AI: `SiliconFlow` + `Qwen/Qwen2.5-72B-Instruct`
- License: `MIT`

## Product Direction

VocabMan is being shaped around five product principles:

1. Breadth is useful, but context should become the primary learning surface.
2. IELTS vocabulary should be treated as a usable lexical system, not just difficulty buckets.
3. Learners should build paraphrase and collocation awareness before high-pressure output.
4. Output practice should be incremental, starting from short controlled responses.
5. AI should support the system without leaking secrets or becoming a deployment liability.

## Current IELTS Learning System

### Foundation

- Canonical file: `public/data/ielts-foundation.json`
- Compatibility mirror: `public/data/ielts-core-500.json`
- Bundle count: `541`
- Vocabulary ID: `ielts-foundation`
- Purpose: high-transfer IELTS core vocabulary with context bundles

### Topic Packs

| Topic | Count |
| --- | ---: |
| Education | 124 |
| Government | 108 |
| Environment | 71 |
| Technology | 52 |
| Health | 53 |
| Work | 32 |
| Media | 32 |
| Crime | 26 |

### Practice Modes

- `Today`
  - daily card-based study and review
- `Quiz`
  - recognition and breadth checks
- `Context-first Session`
  - context preview, meaning choice, paraphrase match, micro output
- `Output Studio`
  - controlled sentence-level production
- `Exam Drills`
  - IELTS-style mixed surfaces for reading, listening, writing, and speaking

## Learning Flow

```mermaid
flowchart LR
    A["Legacy Breadth"] --> B["IELTS Foundation"]
    B --> C["Topic Packs"]
    C --> D["Context-first Session"]
    D --> E["Output Studio"]
    E --> F["Exam Drills"]
```

## AI Runtime

The app currently uses:

- Provider: `SiliconFlow`
- Model: `Qwen/Qwen2.5-72B-Instruct`
- Browser route: `/api/ai/chat`
- Netlify fallback route: `/.netlify/functions/ai-chat`
- Upstream base URL: `https://api.siliconflow.cn/v1`

Why this matters:

- secrets do not have to live in the public browser bundle
- local development can use `.env.local`
- deployed environments can use server-side environment variables
- the client can fall back across routes when one path is unavailable

## Local Development

Install and run:

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Release checks:

```bash
npm run audit:real
node scripts/qa-validate-bundles.js public/data/ielts-foundation.json
node scripts/qa-validate-bundles.js public/data/ielts-core-500.json
```

## Environment Variables

Recommended local setup:

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_REDIRECT_URL=http://localhost:5173
SILICONFLOW_API_KEY=your-local-siliconflow-api-key
SILICONFLOW_MODEL=Qwen/Qwen2.5-72B-Instruct
SILICONFLOW_API_BASE_URL=https://api.siliconflow.cn/v1
```

Notes:

- `.env.local` should remain local and ignored by Git
- production secrets should be set in Netlify or your host
- API keys are not synced to Supabase

## Repository Layout

```text
src/
  components/
  layouts/
  utils/
public/
  data/
docs/
scripts/
netlify/
server/
```

Key areas:

- `src/components/context/`
  - IELTS learning-track UI
- `src/utils/`
  - vocabulary loading, SRS, AI, auth, storage
- `public/data/`
  - production Foundation and Topic Pack data
- `scripts/`
  - curation, QA, rebuild, and maintenance scripts

## Roadmap

- [x] Rebuild IELTS Foundation with bundle-based structure
- [x] Ship official Topic Packs
- [x] Add Context-first Session
- [x] Add Output Studio
- [x] Add Exam Drills
- [x] Move AI runtime away from the old OpenRouter/StepFun path
- [ ] Continue improving weak topic coverage with high-quality sources
- [ ] Add stronger deployment and product analytics visibility

## Contributors

- `ZJUZhiyuCai`
  - product direction, repository ownership, IELTS system rebuild
- `Codex`
  - release hardening, AI migration, documentation, launch support

## License

MIT
