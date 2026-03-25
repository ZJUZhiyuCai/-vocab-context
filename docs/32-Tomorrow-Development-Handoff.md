# Tomorrow Development Handoff

## Context

This handoff is for the next development session after the current product-path push.

The project is no longer blocked on basic feature coverage. The main challenge has shifted from “adding more modes” to “making the existing system teach real English better”.

## Current Product Position

The repository is now at:

- `MVP+ / Alpha Learning System`

What is already in place:

- IELTS Foundation and Topic Packs
- Context-first Session
- Output Studio
- Exam Drills
- Remediation loops and retry gates
- Path Coach
- Today / Quiz / Context entry handoff

What is still weak:

- feedback still feels too system-like
- users can be guided better inside the daily card flow itself
- the first-week learning experience still needs more structure

## Recommended Priority for Tomorrow

### P1. Teacher Layer Rewrite

Goal:

- make feedback sound like a teacher instead of a dashboard
- make users understand what to change in their next sentence

Scope:

- Output Studio feedback copy
- Exam Drills feedback copy
- Context-first retry gate language

Success criteria:

- fewer mechanical labels
- more concrete guidance
- stronger “why this is weak / how to improve” language

### P2. Today Card-Level Handoff

Goal:

- turn daily card study into a smarter entry point into the IELTS system

Scope:

- after key card interactions, show a lightweight “next best step”
- especially for bundle-based IELTS vocabularies

Success criteria:

- users do not need to guess where to go after daily review
- Today becomes a learning orchestrator, not only a card feed

### P3. First-Week Learning OS

Goal:

- give new IELTS users a structured first week

Scope:

- Day 1 to Day 7 scaffold
- default path order
- completion markers

Success criteria:

- a new learner can open the app and know exactly what to do next

## Suggested Execution Order

1. Rewrite teacher-style feedback copy
2. Add Today card-level handoff
3. Design first-week scaffold

## Technical Anchors

Likely files to touch next:

- `src/components/context/OutputStudio.vue`
- `src/components/context/ExamDrills.vue`
- `src/components/context/SessionSummary.vue`
- `src/components/PremiumWordCard.vue`
- `src/components/BundleWordCard.vue`
- `src/App.vue`
- `src/utils/ieltsPathEntry.js`

## Validation Checklist

Before ending the next session:

```bash
npm run build
npm run audit:real
node scripts/qa-validate-bundles.js public/data/ielts-foundation.json
```

## One-Sentence Summary

Tomorrow should focus on turning the current IELTS system from “well-structured practice” into “teacher-guided deliberate practice”.
