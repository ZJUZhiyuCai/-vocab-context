# Claude Code Execution Brief

## Mission

Prepare the IELTS learning system for a cleaner release.

This round is **release hardening**, not feature expansion.

Do not add more vocabulary in this task.

Focus on:

1. documentation cleanup
2. naming consistency
3. compatibility clarity
4. release-safe polish
5. commit-scope hygiene

## Current Stable Product State

Current verified baseline:

- Foundation: `541`
- Education: `124`
- Government: `108`
- Environment: `71`
- Technology: `52`
- Health: `53`
- Work: `32`
- Media: `32`
- Crime: `26`

Current production naming:

- canonical file: `public/data/ielts-foundation.json`
- compatibility mirror: `public/data/ielts-core-500.json`
- canonical id: `ielts-foundation`

Current quality status:

- `genericDefinitions: 0`
- `blankIpa: 0`
- `chineseIssues: 0`
- `weakParaphrases: 0`
- `templateContexts: 0`
- `badCollocations: 0`

Build status:

- `npm run build` passes

## Why This Task Exists

The product is now functionally much stronger.

But the repo still has release-friction:

- docs contain stale counts and stale naming
- some docs have encoding noise
- some scripts still carry prototype or compatibility references
- the repo contains a wide worktree and needs clearer release boundaries

This round should make the system easier to ship and easier to maintain.

## Hard Constraints

Do not violate these:

1. No vocabulary expansion in this round.
2. No visual redesign.
3. No destructive cleanup of historical user data.
4. No removal of compatibility mirror in this round.
5. No weakening of QA, audit, or build guarantees.

## Primary Goals

### Goal A: Docs Cleanup

Bring the key IELTS docs in line with the current system.

Must fix:

- stale bundle counts
- stale names such as `IELTS Core 411`
- obvious encoding/mojibake in release-relevant docs

Priority docs:

- `docs/23-IELTS-Learning-Track-Overview.md`
- any other docs that directly describe current IELTS Foundation / Topic Packs

Recommended output:

- one clean release-facing overview doc
- stale docs either updated or clearly marked historical

### Goal B: Naming Consistency

Ensure all release-facing surfaces use:

- `IELTS Foundation`
- `ielts-foundation.json`
- `ielts-foundation`

Check:

- front-end labels
- script defaults
- docs
- references in release-relevant files

Keep compatibility mirror:

- `public/data/ielts-core-500.json`

but avoid presenting it as canonical.

### Goal C: Script Intent Clarity

Review release-relevant scripts and make naming and comments clearer where needed.

Priority scripts:

- `scripts/rebuild-foundation-from-reviewed-batches.js`
- `scripts/generate-official-topic-packs.js`
- `scripts/real-audit.cjs`

Goal:

- release operators should be able to tell which file is canonical and which is compatibility output

### Goal D: Release Scope Hygiene

Create a concise release note / summary doc for the current IELTS system.

Recommended new doc:

- one release-oriented Markdown file that explains:
  - what Foundation is
  - what Topic Packs exist
  - what compatibility file remains
  - what still remains for future work

This should help the repo maintainers decide what to push now.

## Suggested File Targets

Likely files:

- `docs/23-IELTS-Learning-Track-Overview.md`
- possibly one new release-facing doc under `docs/`
- `src/utils/vocabularyManager.js`
- `scripts/rebuild-foundation-from-reviewed-batches.js`
- `scripts/generate-official-topic-packs.js`
- `scripts/real-audit.cjs`

## Non-Goals

Do not:

- grow Foundation further
- add new Topic Pack words
- redesign ContextPractice
- remove old compatibility mirror
- clean archive scripts unless clearly necessary for release communication

## Acceptance Criteria

Claude code should not declare completion unless all are true.

### Documentation

- release-relevant IELTS docs are accurate and readable
- counts match current production data
- canonical naming is consistent

### Naming

- canonical file remains `public/data/ielts-foundation.json`
- compatibility mirror remains `public/data/ielts-core-500.json`
- release-facing docs and config treat the former as canonical

### Verification

Required commands:

- `node scripts/qa-validate-bundles.js public/data/ielts-foundation.json`
- `node scripts/qa-validate-bundles.js public/data/ielts-core-500.json`
- `npm run audit:real`
- `npm run build`

### Quality

Must still report:

- `genericDefinitions: 0`
- `blankIpa: 0`
- `chineseIssues: 0`
- `weakParaphrases: 0`
- `templateContexts: 0`
- `badCollocations: 0`

## Required Final Report

Claude code must report:

1. which docs were updated
2. which release-facing names were normalized
3. whether any encoding issues were fixed
4. whether compatibility mirror behavior changed
5. QA result
6. audit result
7. build result
8. any remaining release risks

## Stop Conditions

Stop and report instead of over-editing if:

- doc cleanup starts touching too many historical files
- naming cleanup risks breaking compatibility
- there is uncertainty about whether a file is historical vs release-critical

## One-Line Summary

Do the final cleanup that makes the current IELTS Foundation + Topic Pack system feel release-ready, without changing its scope.
