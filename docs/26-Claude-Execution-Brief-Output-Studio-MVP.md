# Claude Code Execution Brief

## Mission

Build the first usable `IELTS Output Studio` MVP.

Do not expand vocabulary in this round.

The lexical base is now strong enough:

- Foundation: `541`
- Topic Packs: available and usable

The biggest remaining gap is productive transfer:

- learners can recognize more words
- but still need help turning them into Writing / Speaking output

This round should turn the current IELTS system from:

- recognition-heavy

into:

- recognition + controlled production

## Why This Is The Next Step

The product has already completed:

1. Foundation expansion
2. Topic Pack structure
3. release hardening and naming cleanup

The next highest-leverage layer is:

- `Output Studio`

This is the first product step that directly improves:

- Writing Task 2 expression
- Speaking Part 2/3 retrieval
- collocation-safe sentence production

## Hard Constraints

Do not break these:

1. No new vocabulary expansion in this task.
2. No redesign of the app.
3. Preserve the current visual language.
4. Reuse existing Context-first components and engines where possible.
5. Keep the feature small enough to ship as an MVP.

## Product Goal

Create a new IELTS production-focused mode where learners:

1. choose a source set
   - Foundation
   - Topic Pack
2. receive a short output session
3. complete controlled production
4. see a lightweight summary

The feature should feel like:

- a dedicated output practice lane

not:

- just another recognition quiz

## Recommended UX Scope

### Entry

Add a new section within the IELTS learning path:

- `Output Studio`

This can live inside the current `ContextPractice` page or as a tightly related sibling view, but it must preserve the current visual system.

### Session Scope

Each output session should use a small batch:

- `5` words by default

Recommended session sources:

- current Foundation
- current Topic Pack

### Exercise Format

For each word, show:

1. target word
2. one key sense
3. 2 to 3 collocations
4. 1 paraphrase hint
5. one controlled output prompt

Prompt style:

- one IELTS-style sentence
- one short speaking frame
- one rewrite instruction

### Summary

At the end, show:

- words practiced
- outputs completed
- topic distribution
- restart option

## Implementation Guidance

### Preferred Approach

Reuse the current context infrastructure instead of building from scratch.

Likely reusable assets:

- `src/components/context/MicroOutput.vue`
- `src/components/context/ContextSession.vue`
- `src/utils/contextSessionEngine.js`
- `src/components/context/ContextPractice.vue`

### Suggested New Files

Possible additions:

- `src/components/context/OutputStudio.vue`
- `src/components/context/OutputStudioCard.vue`
- `src/utils/outputStudioEngine.js`

Use only if needed.

If the feature can be implemented cleanly inside existing Context-first files, prefer that.

## Functional Requirements

### P0

1. User can enter Output Studio from the IELTS learning path.
2. User can start a `5-word` output session.
3. Session uses current vocabulary source.
4. User can submit or skip each output task.
5. User gets a summary at the end.

### P1

1. Track a simple completion count.
2. Show source scope:
   - Foundation
   - specific Topic Pack
3. Preserve current dark/light visuals.

## Non-Goals

Do not add:

- AI scoring
- free-form essay grading
- speaking audio capture
- grammar correction system
- advanced analytics

Those can come later.

This task is only about:

- a clean, useful production practice lane

## Acceptance Criteria

Claude code should not consider the task complete unless all are true.

### Feature

- Output Studio is reachable from the IELTS path
- a user can complete one full output session
- summary is shown after completion

### UX

- the feature matches the current app style
- text density stays controlled
- no cluttered instructional overload

### Verification

Required:

- `npm run build`

Recommended:

- one manual browser flow report:
  - enter Output Studio
  - complete one session
  - confirm summary

### Safety

- existing Foundation / Topic Pack flows still work
- no regression in Context-first Session

## Required Final Report

Claude code must report:

1. where Output Studio lives in the app
2. which files were added or modified
3. how the session flow works
4. what was reused vs newly built
5. build result
6. any residual UX or product risks

## One-Line Summary

Build the first MVP of `IELTS Output Studio` so the product starts training usable language production, not just recognition.
