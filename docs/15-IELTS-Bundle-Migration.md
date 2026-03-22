# IELTS Bundle Migration

## Purpose

This document explains how the repository moves from the legacy IELTS vocabulary slices to the new context-bundle architecture.

## Old vs New

### Old

- files: `vocab-ielts6-breakthrough.json`, `vocab-ielts7-sprint.json`, `vocab-ielts8-mastery.json`
- unit: bare word
- selection logic: heuristic difficulty + cumulative slicing
- learning model: word card with one primary example

### New

- files: `ielts-core-500.json` or `ielts-core-500-generated-draft.json`
- unit: context bundle
- selection logic: audited candidate pool + scored review + approval gate
- learning model: word sense + topic + task + collocations + paraphrases + contexts + production prompt

## Pipeline

Run the rebuild scripts in this order:

1. `node scripts/audit-ielts-candidates.js`
2. `node scripts/score-ielts-candidates.js`
3. Review `data/ielts-core-500-reviewed.json`
4. `node scripts/generate-core-bundles.js` for approved production bundles
5. `node scripts/generate-core-bundles.js --draft` for a draft experiment file
6. `node scripts/qa-validate-bundles.js public/data/ielts-core-500.json`

## Review Workflow

The key review file is:

- `data/ielts-core-500-reviewed.json`

Each record includes:

- `reviewStatus`
- `approved`
- `reviewerNotes`
- `editorSense`
- `editorEnglishDefinition`
- `editorChineseMeaning`
- `editorCollocations`
- `editorParaphrases`
- `editorContexts`
- `editorProductionPrompt`

### Required Rule

No item should be published into `ielts-core-500.json` unless:

- `reviewStatus` is `approved`
- `approved` is `true`

## Draft Mode

The repository includes:

- `public/data/ielts-core-500-generated-draft.json`

The generated draft file is produced by the rebuild pipeline and is used for UI experimentation.

It is not a validated final IELTS curriculum.

## Frontend Compatibility

Legacy word cards still work.

New bundle files are loaded through:

- `src/utils/bundleLoader.js`

The loader normalizes bundles into the shape expected by the current app while preserving extra bundle fields such as:

- `sense`
- `topic`
- `taskTypes`
- `collocations`
- `paraphrases`
- `contexts`
- `productionPrompt`
- `isBundle`

## Safe Rollout

The migration is non-destructive:

- legacy IELTS files remain available
- bundle vocabularies are marked experimental
- the app switches loader based on `isBundle`

## Contribution Rules

When adding new bundles:

- start from an approved reviewed candidate
- provide at least 2 contexts
- provide at least 2 collocations
- provide at least 1 paraphrase
- provide 1 production prompt
- keep contexts IELTS-relevant and natural

## Recommended Next Milestone

After editorial review of the first 500 candidates:

- publish `ielts-core-500.json`
- keep the draft experiment entry clearly marked as draft
- begin topic-pack construction
