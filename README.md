# VocabMan

Context-first IELTS vocabulary practice with spaced repetition, curated foundation bundles, and lightweight AI support.

Live site: [https://vocabman.netlify.app](https://vocabman.netlify.app)

## What Ships Today

- `IELTS Foundation` with 541 curated context bundles
- 8 official topic packs for high-frequency IELTS themes
- `Context-first Session` for meaning, paraphrase, and production practice
- `Output Studio` for sentence-level output drills
- `Exam Drills` for mixed reading, listening, writing, and speaking-style tasks
- Spaced repetition, review queue, wordbook, progress sync, and offline-first behavior

## AI Runtime

The app now uses:

- Provider: `SiliconFlow`
- Model: `Qwen/Qwen2.5-72B-Instruct`
- Browser route: `/api/ai/chat`
- Upstream base URL: `https://api.siliconflow.cn/v1`

The previous OpenRouter / StepFun route is no longer part of the active client path. Browser requests now go through a local/Netlify proxy so the provider key does not need to live in the public bundle.

## Local Setup

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Run the release checks:

```bash
npm run audit:real
node scripts/qa-validate-bundles.js public/data/ielts-foundation.json
node scripts/qa-validate-bundles.js public/data/ielts-core-500.json
```

## Environment

Use a local-only `.env.local` for secrets. This file is already ignored by Git.

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_REDIRECT_URL=http://localhost:5173
SILICONFLOW_API_KEY=your-local-siliconflow-api-key
SILICONFLOW_MODEL=Qwen/Qwen2.5-72B-Instruct
SILICONFLOW_API_BASE_URL=https://api.siliconflow.cn/v1
```

Notes:

- In local development, Vite serves `/api/ai/chat` through a dev middleware that reads `SILICONFLOW_API_KEY`.
- In deployed builds, Netlify routes `/api/ai/chat` to a serverless function that reads the same non-public env vars.
- API keys remain local-only and are not synced to Supabase.
- The settings modal can still accept a manual key for the current browser profile.

## Release Snapshot

- Foundation: `541`
- Education: `124`
- Government: `108`
- Environment: `71`
- Technology: `52`
- Health: `53`
- Work: `32`
- Media: `32`
- Crime: `26`

## Main Paths

- `Today` for card-based study
- `Quiz` for breadth checks
- `Context` for the IELTS learning track
- `Output Studio` for controlled output
- `Exam Drills` for exam-like mixed tasks

## Repo Notes

- Canonical Foundation file: `public/data/ielts-foundation.json`
- Compatibility mirror: `public/data/ielts-core-500.json`
- Current Foundation vocabulary ID: `ielts-foundation`
