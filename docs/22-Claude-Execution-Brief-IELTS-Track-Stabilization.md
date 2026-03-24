# Claude Code Execution Brief

## Mission

Stabilize the new IELTS learning system for release.

This round is **not** about adding more vocabulary.

This round is about:

1. naming cleanup
2. compatibility migration
3. release safety
4. documentation consistency

## Why This Task Exists

The IELTS system has already moved beyond the old `core-500` framing.

Current reality:

- Foundation contains `541` bundles
- Topic Packs exist as first-class learning layers
- the product now presents a multi-layer IELTS track

But several implementation details still look like an old prototype:

- file names still say `core-500`
- some IDs still look experimental
- localStorage keys still reflect older vocabulary names
- docs and scripts may still encode outdated naming assumptions

The next step is to make the IELTS track feel intentional and stable.

## Current Baseline

Production counts:

- Foundation: `541`
- Education: `124`
- Government: `108`
- Environment: `71`
- Technology: `52`
- Health: `53`
- Work: `32`
- Media: `32`
- Crime: `26`

Quality baseline:

- `genericDefinitions: 0`
- `blankIpa: 0`
- `chineseIssues: 0`
- `weakParaphrases: 0`
- `templateContexts: 0`
- `badCollocations: 0`

Build baseline:

- `npm run build` passes

## Hard Constraints

Do not break these:

1. No vocabulary count expansion in this round.
2. No quality regression.
3. No draft bundles in production.
4. Preserve the current visual style.
5. Do not redesign the app.
6. Maintain compatibility with existing local user data.

## Primary Goal

Make the IELTS system internally consistent.

That means:

- users should see `Foundation`, not `core-500`
- scripts should write to a canonical Foundation file
- old IDs and file paths should not silently break existing users

## Required Workstreams

### Workstream 1: Canonical Naming

Create a canonical production filename for Foundation.

Recommended target:

- `public/data/ielts-foundation.json`

Current misleading file:

- `public/data/ielts-core-500.json`

Tasks:

1. Make Foundation use a canonical filename.
2. Update all front-end references to the canonical filename.
3. Update relevant generation / rebuild scripts to use the canonical filename.
4. Preserve backward compatibility for one release cycle.

Recommended compatibility approach:

- continue writing the old filename as a mirrored compatibility artifact
- but treat the new filename as canonical

### Workstream 2: Vocabulary ID Cleanup

Current Foundation vocabulary id is still prototype-shaped:

- `ielts-core-bundle-sample`

Replace with a stable production id.

Recommended target:

- `ielts-foundation`

Tasks:

1. Update vocabulary config to a production-grade id.
2. Add migration logic for old localStorage keys:
   - current vocab
   - progress
   - review states
3. Ensure existing users do not lose progress.

### Workstream 3: Topic Pack Consistency

Tasks:

1. Verify all official topic packs use canonical production filenames.
2. Ensure `vocabularyManager.js` sizes match actual JSON counts.
3. Ensure `ContextPractice.vue` shows the correct track names and counts.

### Workstream 4: Script Hygiene

Tasks:

1. Update rebuild and topic generation scripts to use canonical names.
2. Remove obvious prototype naming in script outputs where safe.
3. Keep scripts deterministic and compatible with current data.

### Workstream 5: Documentation Sync

Tasks:

1. Add or update one doc that explains the current IELTS track:
   - Foundation
   - Topic Packs
   - Legacy Breadth
2. Update counts if any doc is clearly stale.

## Suggested File Targets

Likely files to change:

- `src/utils/vocabularyManager.js`
- `src/App.vue`
- `src/components/context/ContextPractice.vue`
- `scripts/rebuild-foundation-from-reviewed-batches.js`
- `scripts/generate-official-topic-packs.js`
- `public/data/ielts-foundation.json` (new canonical file)
- compatibility handling for `public/data/ielts-core-500.json`
- one or more IELTS docs under `docs/`

## Migration Requirements

LocalStorage migration must cover:

- current selected vocabulary id
- vocabulary progress keys
- review state keys

Important:

- if old keys exist, migrate them
- do not simply abandon them

## Acceptance Criteria

Claude code should not consider the task complete unless all are true.

### Naming

- Foundation has a canonical production id
- Foundation has a canonical production filename
- topic pack references are consistent

### Compatibility

- old localStorage users are migrated cleanly
- no obvious user progress loss path remains

### Verification

Required commands:

- `node scripts/qa-validate-bundles.js public/data/ielts-foundation.json`
- `npm run audit:real`
- `npm run build`

If compatibility mirror file remains:

- also verify the mirrored `public/data/ielts-core-500.json`

### Quality

Must remain:

- `genericDefinitions: 0`
- `blankIpa: 0`
- `chineseIssues: 0`
- `weakParaphrases: 0`
- `templateContexts: 0`
- `badCollocations: 0`

## Required Final Report

Claude code must report:

1. new canonical Foundation id
2. new canonical Foundation filename
3. which compatibility paths were preserved
4. which files were changed
5. whether localStorage migration was added
6. QA result
7. audit result
8. build result
9. residual risks

## Stop Conditions

Stop and report instead of forcing the change if:

- migration introduces risk of data loss
- multiple incompatible naming schemes are still required
- canonical file move creates toolchain instability

## One-Line Summary

Turn the current IELTS system from a successful prototype into a release-grade track with clean naming, safe migration, and consistent production references.
