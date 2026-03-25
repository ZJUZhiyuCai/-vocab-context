# VocabMan

Context-first vocabulary learning for IELTS-focused learners.

面向雅思学习者的语境优先词汇学习应用。

## Language

- [English](./README.en.md)
- [简体中文](./README.zh-CN.md)

## Snapshot

- Live site: [https://vocabman.netlify.app](https://vocabman.netlify.app)
- IELTS Foundation: `541` curated context bundles
- Official Topic Packs: `8`
- Main learning paths: `Today`, `Context-first Session`, `Output Studio`, `Exam Drills`
- AI runtime: `SiliconFlow` + `Qwen/Qwen2.5-72B-Instruct`

## What This Repo Contains

- A production vocabulary app built with `Vue 3`, `Vite`, and `Tailwind CSS`
- A rebuilt IELTS learning track with Foundation and Topic Packs
- Context-first practice flows for recognition, paraphrase, and production
- Safe AI proxy wiring for local development and Netlify deployment
- Scripts and datasets used to curate, validate, and ship the IELTS bundle system

## Quick Start

```bash
npm install
npm run dev
```

```bash
npm run build
npm run audit:real
node scripts/qa-validate-bundles.js public/data/ielts-foundation.json
```

## Environment

Use local-only secrets in `.env.local` and deployment secrets in your hosting platform:

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_REDIRECT_URL=http://localhost:5173
SILICONFLOW_API_KEY=your-local-siliconflow-api-key
SILICONFLOW_MODEL=Qwen/Qwen2.5-72B-Instruct
SILICONFLOW_API_BASE_URL=https://api.siliconflow.cn/v1
```

## Contributors

- `ZJUZhiyuCai` — product direction, repository ownership, IELTS rebuild
- `Codex` — release hardening, AI integration migration, documentation, launch support

## License

MIT
