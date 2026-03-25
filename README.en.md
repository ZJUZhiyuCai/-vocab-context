# VocabMan

VocabMan is a context-first vocabulary learning app designed for Chinese learners who want a more practical path from broad vocabulary review to IELTS-ready lexical control.

The project now ships a rebuilt IELTS learning track, curated context bundles, production-oriented practice flows, and a safer AI integration path for both development and deployment.

## Live Product

- Website: [https://vocabman.netlify.app](https://vocabman.netlify.app)
- Frontend: `Vue 3` + `Vite` + `Tailwind CSS`
- Sync/Auth: `Supabase`
- AI: `SiliconFlow` + `Qwen/Qwen2.5-72B-Instruct`

## Product Positioning

VocabMan is not just a flashcard app. The current direction is:

- Start with broad word exposure when needed
- Move users toward context-based understanding
- Build paraphrase awareness and collocation sensitivity
- Support short-form production before full writing/speaking output
- Organize IELTS vocabulary as a usable lexical system, not just score buckets

## Current Learning System

### 1. Foundation

- Canonical file: `public/data/ielts-foundation.json`
- Bundle count: `541`
- Vocabulary ID: `ielts-foundation`
- Role: high-transfer IELTS core vocabulary with context bundles

### 2. Topic Packs

- Education: `124`
- Government: `108`
- Environment: `71`
- Technology: `52`
- Health: `53`
- Work: `32`
- Media: `32`
- Crime: `26`

### 3. Practice Modes

- `Today`
  - card-based daily study and review
- `Quiz`
  - recognition and breadth checks
- `Context-first Session`
  - context preview, meaning choice, paraphrase match, micro output
- `Output Studio`
  - controlled sentence-level production
- `Exam Drills`
  - IELTS-style mixed practice surfaces for reading/listening/writing/speaking

## AI Runtime

The app currently uses:

- Provider: `SiliconFlow`
- Model: `Qwen/Qwen2.5-72B-Instruct`
- Browser route: `/api/ai/chat`
- Netlify fallback route: `/.netlify/functions/ai-chat`
- Upstream base URL: `https://api.siliconflow.cn/v1`

Design choices:

- Secrets do not need to live in the public browser bundle
- Local development can use a local `.env.local`
- Netlify can use server-side environment variables
- The client can fall back safely if one route is unavailable

## Local Development

Install and start:

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

- `.env.local` should stay local and ignored by Git
- production secrets should be configured in Netlify or your host
- API keys are not synced to Supabase

## Repository Structure

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
  - production bundle data and topic packs
- `scripts/`
  - curation, QA, rebuild, and maintenance scripts

## Contributors

- `ZJUZhiyuCai`
  - product direction, repository ownership, IELTS system rebuild
- `Codex`
  - release hardening, AI migration, documentation, launch support

## License

MIT
