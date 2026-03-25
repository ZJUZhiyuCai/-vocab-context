# Contributing to VocabMan

Thanks for contributing to VocabMan.

This repository mixes product work, frontend implementation, vocabulary data curation, and release hardening. A good contribution keeps those layers aligned.

## Before You Start

1. Read [README.md](./README.md) for the project overview.
2. Read [README.en.md](./README.en.md) or [README.zh-CN.md](./README.zh-CN.md) depending on your preferred language.
3. For IELTS-system changes, review [docs/23-IELTS-Learning-Track-Overview.md](./docs/23-IELTS-Learning-Track-Overview.md).

## Local Setup

```bash
npm install
npm run dev
```

Build before opening a PR:

```bash
npm run build
```

If your change touches IELTS production data, also run:

```bash
npm run audit:real
node scripts/qa-validate-bundles.js public/data/ielts-foundation.json
node scripts/qa-validate-bundles.js public/data/ielts-core-500.json
```

## Contribution Areas

### Frontend

- Preserve the existing visual direction unless the task is explicitly a design change.
- Favor whitespace, clarity, and calm hierarchy over dense UI.
- Keep mobile and desktop behavior both in mind.

### IELTS Data

- Do not lower vocabulary quality just to hit a count target.
- Prefer high-transfer vocabulary over niche or rare terms.
- Bundle quality matters: definitions, contexts, paraphrases, collocations, and prompts should all be usable.

### AI Integration

- Do not commit secrets.
- Keep runtime keys in `.env.local` locally and in deployment environment variables in production.
- Prefer proxy-based integration over exposing provider secrets to the browser.

## Pull Request Expectations

- Describe the user-visible outcome.
- Mention any data files or generated outputs touched.
- Mention verification commands you ran.
- Call out any known follow-ups or residual risks.

## Commit Style

Use concise commit messages in the style already present in the repo:

- `feat: add exam drill summary breakdown`
- `fix: harden ai routing and auth session recovery`
- `docs: polish bilingual README`

## What Not To Do

- Do not commit `.env.local`.
- Do not replace high-quality IELTS bundles with weaker generated content.
- Do not silently change canonical file names or vocabulary IDs without updating consumers.
- Do not ship UI density regressions in the IELTS learning track.

## Questions

If a change touches product behavior, vocabulary quality, and deployment behavior at the same time, treat it as a cross-cutting change and explain tradeoffs clearly in the PR.
