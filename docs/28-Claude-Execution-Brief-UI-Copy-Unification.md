# Claude Code Execution Brief

## Mission

Clean up UI copy and encoding issues across the IELTS learning experience.

This round is **not** for:

- vocabulary expansion
- new features
- redesign
- major interaction changes

This round is only for:

- fixing remaining mojibake / encoding noise
- unifying product copy
- making the IELTS experience feel polished and deliberate

## Why This Is The Next Step

The IELTS system now has:

- Foundation
- Topic Packs
- Legacy Breadth
- Output Studio

Functionally, it is strong enough to keep moving forward.

But the current user-facing experience still has release-quality friction:

- scattered encoding corruption
- mixed Chinese / English labels with no clear rule
- prototype-style or uneven wording in some components

These issues reduce trust even when the underlying feature is working.

## Goal

Make the IELTS user-facing text feel:

- readable
- consistent
- intentional
- release-ready

## Hard Constraints

Do not do any of the following:

1. do not expand vocabulary
2. do not add features
3. do not redesign layouts
4. do not change product structure
5. do not alter working business logic unless absolutely necessary to fix text rendering

## Primary Workstreams

### Workstream 1: Fix Mojibake / Encoding Issues

Priority files likely affected:

- `src/components/context/ContextPractice.vue`
- `src/components/context/ContextPromptCard.vue`
- `src/components/context/MeaningChoice.vue`
- `src/components/context/ParaphraseMatch.vue`
- `src/components/context/MicroOutput.vue`
- `src/components/context/FeedbackCard.vue`
- `src/components/context/SessionSummary.vue`
- `src/components/context/OutputStudio.vue`
- `src/components/context/OutputStudioCard.vue`
- `src/layouts/PremiumLayout.vue`
- any closely related IELTS-facing Vue files with broken visible strings

Tasks:

1. replace visible mojibake text with proper UTF-8 strings
2. ensure all user-facing copy renders correctly in Chinese or intentional English
3. do not leave escaped or corrupted placeholders in release-facing surfaces

### Workstream 2: Copy System Unification

Establish and apply a simple rule:

- structural/product labels may remain in English if intentional:
  - `Foundation`
  - `Topic Packs`
  - `Legacy Breadth`
  - `Output Studio`
- instructional/action text for learners should be clean Chinese by default unless English is pedagogically necessary

Examples of what should feel consistent:

- buttons
- helper text
- summary cards
- section descriptions
- status chips

### Workstream 3: Output Studio Copy Polish

Refine wording only.

Tasks:

1. make Output Studio labels feel product-grade
2. remove awkward mixed-language helper lines
3. keep the existing structure intact

### Workstream 4: IELTS Path Copy Polish

Tasks:

1. make `Foundation / Topic Packs / Legacy Breadth / Output Studio` read as one coherent system
2. reduce any remaining prototype wording
3. keep the current concise tone

## Non-Goals

Do not:

- change routes
- move components around
- change progress logic
- change data filtering
- add AI feedback

## Acceptance Criteria

Claude code should not mark completion unless:

1. visible mojibake is removed from the main IELTS experience
2. user-facing IELTS copy is internally consistent
3. no regression is introduced
4. `npm run build` passes

## Required Verification

Must run:

- `npm run build`

Recommended:

- manually inspect:
  - `ContextPractice`
  - `ContextSession`
  - `OutputStudio`
  - `OutputStudioCard`
  - session summary / feedback surfaces

## Required Final Report

Claude code must report:

1. which files had user-facing copy fixes
2. which files had encoding/mojibake fixes
3. any copy system rule it applied
4. build result
5. residual polish issues

## One-Line Summary

Turn the IELTS UI text from “working prototype” into “clean release copy” without changing product scope.
