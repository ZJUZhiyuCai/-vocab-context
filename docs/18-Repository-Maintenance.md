# Repository Maintenance

## Purpose

This document explains which rebuild artifacts are active and which maintenance files are archival.

Use it as the quick entry point for ongoing IELTS Core maintenance.

## Active Data Files

### Source-of-truth review files

- `data/ielts-core-500-reviewed.json`
- `data/ielts-core-expansion-cleaned.json`

### Generated outputs

- `public/data/ielts-core-500.json`
- `public/data/ielts-core-500-generated-draft.json`
- `public/data/ielts-topic-education-draft.json`
- `public/data/ielts-topic-environment-draft.json`
- `public/data/ielts-topic-technology-draft.json`

### Status docs

- `docs/16-overnight-ielts-core-report.md`
- `docs/17-ielts-core-quality-status.md`

## Active Scripts

### Intake and rebuild

- `scripts/audit-ielts-candidates.js`
- `scripts/score-ielts-candidates.js`
- `scripts/generate-core-bundles.js`
- `scripts/generate-topic-pack-drafts.js`
- `scripts/build-ielts-expansion-candidates.js`
- `scripts/review-expansion-candidates.js`
- `scripts/clean-expansion-candidates.js`
- `scripts/merge-approved-expansion-into-core.js`

### Quality maintenance

- `scripts/audit-expansion-quality.js`
- `scripts/enrich-high-value-bundles.js`
- `scripts/finalize-core-quality.js`
- `scripts/real-audit.cjs`
- `scripts/qa-validate-bundles.js`

### Shared helpers

- `scripts/ielts-rebuild-utils.js`
- `scripts/ielts-seeds.js`

## Archived Scripts

Historical one-off maintenance files belong in:

- `scripts/archive/`

These are preserved for traceability but should not be treated as the main operational workflow.

## Recommended Maintenance Workflow

### Audit current production quality

```powershell
node scripts/real-audit.cjs
```

### Apply approved editor changes

```powershell
node scripts/generate-core-bundles.js
node scripts/generate-core-bundles.js --draft
node scripts/generate-topic-pack-drafts.js
```

### Validate outputs

```powershell
node scripts/qa-validate-bundles.js public/data/ielts-core-500.json
npm run build
```

## Notes

- `ielts-core-500-generated-draft.json` is the only active draft file for the new bundle system.
- The old 3-item sample draft is obsolete and should not be referenced going forward.
- Repository growth should prefer explicit docs and reusable scripts over new one-off maintenance files in the script root.
