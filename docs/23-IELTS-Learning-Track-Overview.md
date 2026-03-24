# IELTS Learning Track Overview

This document describes the current production structure of the IELTS learning system.

## Canonical Production Files

### Foundation

- Canonical file: `public/data/ielts-foundation.json`
- Compatibility mirror: `public/data/ielts-core-500.json`
- Canonical vocabulary id: `ielts-foundation`

The mirror file is kept for backward compatibility in the current release cycle.

## Current Production Counts

### Foundation

- Total bundles: `541`

### Topic Packs

- Education: `124`
- Government: `108`
- Environment: `71`
- Technology: `52`
- Health: `53`
- Work: `32`
- Media: `32`
- Crime: `26`

### Additional Topic Coverage Inside Foundation

- Culture: `10`
- Transport: `3`
- General: `30`

## Learning Track Structure

The IELTS track currently has three layers.

### Layer 1: Foundation

Purpose:

- build high-transfer academic vocabulary
- support Context-first recognition and output
- give learners a stable lexical base before topic specialization

Current user-facing name:

- `IELTS Foundation`

### Layer 2: Topic Packs

Purpose:

- provide topic-specific lexical depth
- let learners focus on high-frequency IELTS themes
- support targeted Context-first practice

Current official packs:

- Education
- Government
- Environment
- Technology
- Health
- Work
- Media
- Crime

### Layer 3: Legacy Breadth

Purpose:

- preserve the older IELTS 6.0 / 7.0 / 8.0 vocabulary tracks
- offer breadth expansion beyond the curated Foundation + Topic Pack system

Current legacy sets:

- IELTS 6.0 Breakthrough
- IELTS 7.0 Sprint
- IELTS 8.0 Mastery

## Quality Baseline

The current production IELTS data passes all hard quality checks:

- `genericDefinitions: 0`
- `blankIpa: 0`
- `chineseIssues: 0`
- `weakParaphrases: 0`
- `templateContexts: 0`
- `badCollocations: 0`

## Key Scripts

- `scripts/rebuild-foundation-from-reviewed-batches.js`
  Rebuilds Foundation from approved reviewed-batch files and writes both the canonical file and compatibility mirror.

- `scripts/generate-official-topic-packs.js`
  Generates official topic pack JSON files from the current Foundation.

- `scripts/qa-validate-bundles.js`
  Validates bundle structure and required fields.

- `scripts/real-audit.cjs`
  Audits production quality and prefers the canonical Foundation file.

## Compatibility Notes

Current compatibility guarantees:

- old file consumers can still read `public/data/ielts-core-500.json`
- old localStorage users can migrate from `ielts-core-bundle-sample` to `ielts-foundation`

Migration currently covers:

- selected vocabulary id
- vocabulary progress
- review states

## Recommended Next Work

The current track is strong enough for release hardening.

Future work should prioritize:

1. strengthening weaker theme coverage further if needed
2. topic-pack polish and ordering
3. eventual removal of the compatibility mirror in a later release
