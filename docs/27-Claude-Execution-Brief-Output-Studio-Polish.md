# Claude Code Execution Brief

## Mission

Polish the data quality of `IELTS Output Studio`.

This round is **not** for:

- adding new features
- expanding vocabulary
- redesigning UI

This round is only for:

- improving task naturalness
- improving prompt quality
- improving reference-context quality

## Current State

`Output Studio MVP` is already wired into the app and usable.

What works:

- users can enter Output Studio
- start a 5-word session
- submit or skip tasks
- reach the summary page
- build passes

Current problem:

- some generated prompt/context combinations feel artificial or awkward
- at least some cards produce sentences that sound stitched together rather than naturally written

Example of the problem:

- a task may show a reference context that does not sound like real IELTS-ready English
- a task prompt may be too generic or mismatched with the example context

## Goal

Make Output Studio feel trustworthy.

Users should feel:

- this is real practice
- the prompts are natural
- the example context is believable
- the output task is worth answering

## Hard Constraints

Do not do any of the following:

1. do not add new vocabulary
2. do not redesign the page
3. do not change the overall session flow
4. do not replace Output Studio with AI scoring
5. do not weaken current build stability

## Primary Workstreams

### Workstream 1: Prompt Normalization

Review:

- `src/utils/outputStudioEngine.js`

Tasks:

1. ensure prompt instructions are concise and natural
2. avoid repetitive generic templates
3. make prompt types clearly different:
   - sentence
   - speaking
   - rewrite
4. prevent weak fallback wording like generic stitched academic prompts

Acceptance criteria:

- prompt instruction reads like a teacher wrote it
- prompt type matches the task

### Workstream 2: Reference Context Quality

Review:

- `src/components/context/OutputStudio.vue`
- `src/components/context/OutputStudioCard.vue`
- `src/utils/outputStudioEngine.js`

Tasks:

1. ensure reference context is selected from a credible source field
2. do not show weak or awkward context when it is clearly low quality
3. prefer:
   - natural writing context
   - otherwise natural reading context
4. if no strong context exists, omit reference context instead of showing a bad one

Acceptance criteria:

- no obviously broken or stitched reference sentence is shown
- reference context supports the prompt rather than confusing it

### Workstream 3: Task Assembly Quality

Tasks:

1. make sure collocations, paraphrase hint, sense, and prompt point in the same direction
2. avoid cards where:
   - the sense is abstract
   - the context is mismatched
   - the prompt asks for a different usage
3. if a bundle is too weak for Output Studio, skip it instead of forcing it into the session

Acceptance criteria:

- Output Studio session quality is better even if candidate pool becomes slightly smaller

### Workstream 4: Small UX Polish Only

Allowed:

- small text cleanup
- wording cleanup
- spacing cleanup if necessary

Not allowed:

- layout redesign
- visual experimentation

## Verification Requirements

Claude code must verify all of the following:

1. `npm run build`
2. one real browser sanity flow:
   - enter Output Studio
   - complete at least one task
   - inspect at least 3 cards
   - confirm prompts/contexts feel natural

## Required Final Report

Claude code must report:

1. which files changed
2. how prompt generation changed
3. how weak reference contexts are now filtered or avoided
4. whether any bundles are skipped in Output Studio for quality reasons
5. build result
6. manual browser check result
7. residual quality risks

## Stop Conditions

Stop and report instead of forcing a bad solution if:

- improving prompt quality requires changing upstream bundle data in a large way
- the current data pool is too inconsistent for a clean local fix
- a larger data-layer cleanup is needed instead of a light Output Studio polish

## One-Line Summary

Make `Output Studio` feel natural and trustworthy without changing its scope.
