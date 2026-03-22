# Check-in Recommendation

## Purpose

This file documents what should be committed after the IELTS Core rebuild and cleanup work.

The goal is to keep the repository:

- reproducible
- reviewable
- maintainable

without committing unnecessary generated noise.

## Commit These

### Source code

- `src/App.vue`
- `src/components/BundleWordCard.vue`
- `src/utils/bundleLoader.js`
- `src/utils/openRouterClient.js`
- `src/utils/vocabularyManager.js`
- all updated AI utility files
- `src/utils/syncService.js`

### Active rebuild / maintenance scripts

- `scripts/audit-ielts-candidates.js`
- `scripts/audit-expansion-quality.js`
- `scripts/build-ielts-expansion-candidates.js`
- `scripts/review-expansion-candidates.js`
- `scripts/clean-expansion-candidates.js`
- `scripts/merge-approved-expansion-into-core.js`
- `scripts/generate-core-bundles.js`
- `scripts/generate-topic-pack-drafts.js`
- `scripts/enrich-high-value-bundles.js`
- `scripts/finalize-core-quality.js`
- `scripts/qa-validate-bundles.js`
- `scripts/real-audit.cjs`
- `scripts/ielts-rebuild-utils.js`
- `scripts/ielts-seeds.js`

### Active docs

- `docs/10-VocabMan-2.0-PRD.md`
- `docs/11-IELTS-Vocab-Audit.md`
- `docs/12-IELTS-Vocab-Rebuild-Plan.md`
- `docs/13-IELTS-Context-Bundle-Schema.json`
- `docs/14-IELTS-Context-Bundle-Sample.json`
- `docs/15-IELTS-Bundle-Migration.md`
- `docs/17-ielts-core-quality-status.md`
- `docs/18-Repository-Maintenance.md`
- `docs/19-Checkin-Recommendation.md`

### Data that acts as source of truth

- `data/ielts-core-500-reviewed.json`
- `data/ielts-core-expansion-candidates.json`
- `data/ielts-core-expansion-reviewed.json`
- `data/ielts-core-expansion-cleaned.json`
- `data/ielts-expansion-quality-audit.json`

### Published outputs worth preserving

- `public/data/ielts-core-500.json`
- `public/data/ielts-core-500-generated-draft.json`
- `public/data/ielts-topic-education-draft.json`
- `public/data/ielts-topic-environment-draft.json`
- `public/data/ielts-topic-technology-draft.json`

## Optional To Commit

### Long-form operational logs

- `docs/16-overnight-ielts-core-report.md`

Keep this if you want a full audit trail.
Skip it if you prefer a cleaner history and the final status docs are sufficient.

### Archived one-off scripts

- `scripts/archive/`

Keep if historical traceability matters.
Skip if you want a leaner repository and have already extracted reusable logic into active scripts.

## Do Not Commit

- `dist/`
- `node_modules/`
- environment files such as `.env`
- transient local artifacts
- generated candidate CSV exports such as `data/ielts-core-500-candidates.csv`

## Recommended Commit Strategy

### Commit 1: Product and platform changes

- OpenRouter integration
- local-only API key changes
- bundle loader / bundle card / app integration

### Commit 2: IELTS rebuild system

- scripts
- schemas
- rebuild docs
- source-of-truth review data

### Commit 3: published bundle outputs

- final production Core
- current draft bundle
- topic-pack drafts

### Commit 4: optional repository history

- overnight report
- archive scripts

## Rule Of Thumb

If a file is needed to:

- regenerate the current learner-facing outputs
- understand the rebuild decisions
- continue maintenance safely

it should be committed.
